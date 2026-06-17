import http from 'node:http';
import { URL } from 'node:url';
import { MatrixPaymentProvider, extractMatrixPaymentEvent } from './payment-provider.js';
import { ReportGenerationProvider } from './report-generation-provider.js';
import { ReportOrderStatus, createOrder, getOrder, markPaidFromPayment, orderStoreInfo, publicOrder, updateOrder } from './order-store.js';

const paymentProvider = new MatrixPaymentProvider();
const generationProvider = new ReportGenerationProvider();
const port = Number(process.env.PORT || 8787);

async function handler(req, res) {
  try {
    await route(req, res);
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message });
  }
}

const server = http.createServer(handler);

if (process.argv[1] === new URL(import.meta.url).pathname) {
  server.listen(port, () => {
    console.log(`ChiveShield API listening on http://localhost:${port}`);
  });
}

export { handler, server };

async function route(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    return sendJson(res, 200, { ok: true, service: 'chiveshield-api', paymentMode: paymentProvider.mode, generationMode: generationProvider.mode, store: orderStoreInfo() });
  }

  if (req.method === 'POST' && url.pathname === '/api/report-orders') {
    const body = await readJson(req);
    if (!body.demandText || typeof body.demandText !== 'string') {
      return sendJson(res, 400, { ok: false, error: 'demandText is required.' });
    }
    const order = createOrder({ demandText: body.demandText, customerEmail: body.customerEmail || null });
    return sendJson(res, 201, { ok: true, order: publicOrder(order) });
  }

  const paymentLinkMatch = url.pathname.match(/^\/api\/report-orders\/([^/]+)\/payment-link$/);
  if (req.method === 'POST' && paymentLinkMatch) {
    const order = getOrder(decodeURIComponent(paymentLinkMatch[1]));
    if (!order) return sendJson(res, 404, { ok: false, error: 'ReportOrder not found.' });
    const body = await readJson(req);
    const paymentLink = await paymentProvider.createPaymentLink(order, body || {});
    if (paymentLink.confirmationRequired) {
      const prepared = updateOrder(order.id, {
        paymentCreateRequest: paymentLink.request,
        paymentMode: paymentLink.mode
      }, 'Live Matrix payment link request prepared; waiting for CEO Office confirmation before creating a real charge link.');
      return sendJson(res, 200, { ok: true, order: publicOrder(prepared), paymentLink });
    }
    const updated = updateOrder(order.id, {
      status: ReportOrderStatus.pendingPayment,
      matrixPaymentLinkId: paymentLink.link.id,
      matrixPaymentUrl: paymentLink.link.url,
      paymentCreateRequest: paymentLink.request,
      paymentMode: paymentLink.mode
    }, paymentLink.mode === 'dry-run' ? 'Dry-run Matrix payment link created; no real charge link was created.' : 'Matrix payment link created.');
    return sendJson(res, 200, { ok: true, order: publicOrder(updated), paymentLink });
  }

  const statusMatch = url.pathname.match(/^\/api\/report-orders\/([^/]+)\/status$/);
  if (req.method === 'GET' && statusMatch) {
    const order = getOrder(decodeURIComponent(statusMatch[1]));
    if (!order) return sendJson(res, 404, { ok: false, error: 'ReportOrder not found.' });
    return sendJson(res, 200, { ok: true, order: publicOrder(order) });
  }

  if (req.method === 'POST' && url.pathname === '/api/matrix-payment-webhook') {
    const rawBody = await readRaw(req);
    const signatureMode = process.env.MATRIX_WEBHOOK_SECRET ? 'strict' : 'dry-run-skip';
    if (process.env.MATRIX_WEBHOOK_SECRET) {
      const verification = paymentProvider.verifyWebhookSignature({
        rawBody,
        signatureHeader: req.headers['matrix-signature'],
        secret: process.env.MATRIX_WEBHOOK_SECRET
      });
      if (!verification.ok) return sendJson(res, 401, { ok: false, error: verification.reason });
    }

    const body = parseJson(rawBody);
    const parsed = extractMatrixPaymentEvent(body);
    if (parsed.event !== 'payment.succeeded') {
      return sendJson(res, 202, { ok: true, ignored: true, reason: `Unhandled Matrix event ${parsed.event || 'unknown'}.`, signatureMode });
    }
    if (!parsed.orderId) return sendJson(res, 400, { ok: false, error: 'metadata.order_id is required.' });
    const order = getOrder(parsed.orderId);
    if (!order) return sendJson(res, 404, { ok: false, error: 'ReportOrder not found for metadata.order_id.' });

    const paidOrder = markPaidFromPayment(order, parsed.payment);
    const finalOrder = await triggerGenerationIfPaid(paidOrder);
    return sendJson(res, 200, { ok: true, signatureMode, order: publicOrder(finalOrder) });
  }

  const pollMatch = url.pathname.match(/^\/api\/report-orders\/([^/]+)\/poll-payment$/);
  if (req.method === 'POST' && pollMatch) {
    const order = getOrder(decodeURIComponent(pollMatch[1]));
    if (!order) return sendJson(res, 404, { ok: false, error: 'ReportOrder not found.' });
    const body = await readJson(req);
    if (!body.dryRunPaymentSucceeded) {
      return sendJson(res, 200, { ok: true, order: publicOrder(order), paymentMatched: false, mode: 'dry-run' });
    }
    const paidOrder = markPaidFromPayment(order, {
      payment_id: body.paymentId || `dry_payment_${order.id}`,
      link_id: order.matrixPaymentLinkId,
      metadata: { order_id: order.id }
    });
    const finalOrder = await triggerGenerationIfPaid(paidOrder);
    return sendJson(res, 200, { ok: true, order: publicOrder(finalOrder), paymentMatched: true, mode: 'dry-run' });
  }

  const agentRevenueConfirmMatch = url.pathname.match(/^\/api\/report-orders\/([^/]+)\/confirm-agent-revenue-payment$/);
  if (req.method === 'POST' && agentRevenueConfirmMatch) {
    const order = getOrder(decodeURIComponent(agentRevenueConfirmMatch[1]));
    if (!order) return sendJson(res, 404, { ok: false, error: 'ReportOrder not found.' });
    const body = await readJson(req);
    const payment = normalizeAgentRevenuePayment(body);
    if (!payment.payment_id) return sendJson(res, 400, { ok: false, error: 'payment_id is required.' });
    if (!payment.link_id) return sendJson(res, 400, { ok: false, error: 'link_id is required.' });
    if (payment.status !== 'succeeded') return sendJson(res, 409, { ok: false, error: 'Only succeeded Agent Revenue payments can confirm an order.' });
    if (order.matrixPaymentLinkId && order.matrixPaymentLinkId !== payment.link_id) {
      return sendJson(res, 409, { ok: false, error: 'Payment link_id does not match this order.' });
    }
    const linkedOrder = order.matrixPaymentLinkId ? order : updateOrder(order.id, {
      matrixPaymentLinkId: payment.link_id,
      matrixPaymentUrl: body.payment_url || order.matrixPaymentUrl,
      paymentMode: 'agent-revenue-standalone-confirmed'
    }, 'Standalone Agent Revenue payment link associated with this order by operator proof.');
    const paidOrder = markPaidFromPayment(linkedOrder, {
      payment_id: payment.payment_id,
      link_id: payment.link_id,
      amount_minor: payment.amount_minor,
      currency: payment.currency,
      product_name: payment.product_name,
      customer_email: payment.customer_email,
      paid_at: payment.paid_at,
      metadata: { order_id: linkedOrder.id, confirmation_source: 'agent_revenue_operator_proof' }
    });
    const finalOrder = await triggerGenerationIfPaid(paidOrder);
    return sendJson(res, 200, { ok: true, order: publicOrder(finalOrder), paymentMatched: true, mode: 'agent-revenue-operator-proof' });
  }

  sendJson(res, 404, { ok: false, error: 'Route not found.' });
}

async function triggerGenerationIfPaid(order) {
  if (order.status === ReportOrderStatus.duplicatePaid) return order;
  if (order.status !== ReportOrderStatus.paid) return order;
  const generating = updateOrder(order.id, { status: ReportOrderStatus.generating }, 'ReportGenerationProvider started after paid confirmation.');
  try {
    const generated = await generationProvider.generate(generating);
    return updateOrder(order.id, {
      status: ReportOrderStatus.completed,
      reportId: generated.reportId,
      reportMarkdown: generated.markdown,
      generatedAt: generated.generatedAt,
      generationMode: generated.mode
    }, 'Report generated successfully.');
  } catch (error) {
    return updateOrder(order.id, {
      status: ReportOrderStatus.generationFailed,
      failureReason: error.message
    }, 'Report generation failed after paid; order remains paid and must not return to pending_payment.');
  }
}

function normalizeAgentRevenuePayment(body) {
  const amount = body.amount_minor ?? (typeof body.amount === 'number' ? Math.round(body.amount * 100) : undefined);
  return {
    payment_id: body.payment_id || body.id,
    link_id: body.link_id,
    amount_minor: amount,
    currency: body.currency,
    product_name: body.product_name || 'ChiveShield AI 服务采购防坑报告',
    customer_email: body.customer_email,
    status: body.status,
    paid_at: body.paid_at
  };
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' });
  res.end(JSON.stringify(payload, null, 2));
}

function readRaw(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

async function readJson(req) {
  const raw = await readRaw(req);
  if (!raw) return {};
  return parseJson(raw);
}

function parseJson(raw) {
  try {
    return JSON.parse(raw || '{}');
  } catch {
    const error = new Error('Invalid JSON body.');
    error.statusCode = 400;
    throw error;
  }
}
