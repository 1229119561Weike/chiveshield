import crypto from 'node:crypto';

export class MatrixPaymentProvider {
  constructor({ mode = process.env.CHIVESHIELD_PAYMENT_MODE || 'dry-run' } = {}) {
    this.mode = mode;
  }

  async createPaymentLink(order, { continueUrl, webhookUrl, confirmedLiveCreation = false } = {}) {
    const request = buildCreateLinkRequest(order, { continueUrl, webhookUrl });
    if (this.mode !== 'live') {
      return {
        mode: 'dry-run',
        provider: 'MatrixPaymentProvider',
        request,
        link: {
          id: `dry_link_${order.id}`,
          url: `https://matrix.local/dry-run-pay?order_id=${encodeURIComponent(order.id)}`
        },
        createdRealPaymentLink: false
      };
    }
    if (!confirmedLiveCreation || process.env.CHIVESHIELD_ALLOW_REAL_PAYMENT_LINK !== 'true') {
      return {
        mode: 'live-confirmation-required',
        provider: 'MatrixPaymentProvider',
        request,
        link: null,
        createdRealPaymentLink: false,
        confirmationRequired: true,
        message: 'Live payment link request prepared but not created. CEO Office must confirm final checkout/link creation before CHIVESHIELD_ALLOW_REAL_PAYMENT_LINK=true.'
      };
    }
    return createLiveMatrixPaymentLink(request);
  }

  verifyWebhookSignature({ rawBody, signatureHeader, secret }) {
    if (!secret) {
      return { ok: false, reason: 'MATRIX_WEBHOOK_SECRET is not configured.' };
    }
    if (!signatureHeader) {
      return { ok: false, reason: 'Missing Matrix-Signature header.' };
    }
    const parts = Object.fromEntries(signatureHeader.split(',').map((part) => part.split('=').map((value) => value.trim())));
    const timestamp = parts.t;
    const expected = parts.v1;
    if (!timestamp || !expected) {
      return { ok: false, reason: 'Matrix-Signature must include t and v1.' };
    }
    const actual = crypto.createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
    if (!crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) {
      return { ok: false, reason: 'Invalid Matrix webhook signature.' };
    }
    return { ok: true };
  }
}

export function buildCreateLinkRequest(order, { continueUrl, webhookUrl } = {}) {
  const baseUrl = continueUrl || process.env.CHIVESHIELD_CONTINUE_URL || 'http://localhost:5173/orders';
  const hookUrl = webhookUrl || process.env.CHIVESHIELD_WEBHOOK_URL || 'https://example.invalid/api/matrix-payment-webhook';
  return {
    amount_minor: order.amountMinor,
    currency: order.currency,
    product_name: order.productName,
    description: '一份甲方决策版 AI 服务采购防坑报告，包含开源候选、风险点、报价梯度、验收清单和议价话术。',
    idempotency_key: `chiveshield-report-${order.id}`,
    continue_url: `${baseUrl}?order_id=${encodeURIComponent(order.id)}`,
    webhook_url: hookUrl,
    metadata: {
      order_id: order.id,
      service: 'one_report',
      workspace: 'chiveshield',
      version: order.metadata.version
    }
  };
}

async function createLiveMatrixPaymentLink(request) {
  const endpoint = process.env.MATRIX_RECEIVABLE_CREATE_LINK_URL;
  const token = process.env.MATRIX_RECEIVABLE_API_TOKEN;
  if (!endpoint) {
    throw new Error('MATRIX_RECEIVABLE_CREATE_LINK_URL is required for live payment link creation.');
  }
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(request)
  });
  const payload = await response.json();
  if (!response.ok || payload.ok === false) {
    throw new Error(`Matrix receivable create_link failed: ${JSON.stringify(payload)}`);
  }
  return {
    mode: 'live',
    provider: 'MatrixPaymentProvider',
    request,
    link: {
      id: payload.link?.id || payload.link_id || payload.id,
      url: payload.link?.url || payload.url
    },
    raw: payload,
    createdRealPaymentLink: true
  };
}

export function extractMatrixPaymentEvent(body) {
  const event = body.event || body.type;
  const data = body.data || {};
  return {
    event,
    orderId: data.metadata?.order_id || body.metadata?.order_id,
    payment: {
      payment_id: data.payment_id || body.payment_id,
      link_id: data.link_id || body.link_id,
      amount_minor: data.amount_minor,
      currency: data.currency,
      product_name: data.product_name,
      customer_email: data.customer_email,
      metadata: data.metadata || body.metadata || {}
    }
  };
}
