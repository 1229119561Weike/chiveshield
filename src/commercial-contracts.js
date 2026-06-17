export const ReportOrderStatus = Object.freeze({
  draft: 'draft',
  paymentCreated: 'payment_created',
  pendingPayment: 'pending_payment',
  paid: 'paid',
  generating: 'generating',
  completed: 'completed',
  paymentFailed: 'payment_failed',
  generationFailed: 'generation_failed',
  expired: 'expired'
});

export const reportProduct = Object.freeze({
  amountMinor: 990,
  currency: 'cny',
  productName: 'ChiveShield AI 服务采购防坑报告',
  description: '一份甲方决策版 AI 服务采购防坑报告，包含开源候选、风险点、报价梯度、验收清单和议价话术。'
});

export function createReportOrder({ demandText, version = '0.1.0' }) {
  return {
    id: crypto.randomUUID(),
    demandText,
    amountMinor: reportProduct.amountMinor,
    currency: reportProduct.currency,
    productName: reportProduct.productName,
    status: ReportOrderStatus.draft,
    createdAt: new Date().toISOString(),
    metadata: {
      order_id: undefined,
      workspace: 'chiveshield',
      service: 'one_report',
      version
    }
  };
}

export class DemoPaymentProvider {
  mode = 'demo';

  async createPaymentLink(order) {
    return {
      mode: 'demo',
      provider: 'DemoPaymentProvider',
      paymentLinkId: `demo_link_${order.id}`,
      paymentUrl: `https://matrix.local/demo-pay?order_id=${encodeURIComponent(order.id)}`,
      metadata: { ...order.metadata, order_id: order.id }
    };
  }

  async pollPaymentStatus(order) {
    return {
      orderId: order.id,
      status: order.status,
      mode: 'demo',
      verifiedBy: 'local-demo-state'
    };
  }
}

export class MatrixPaymentProvider {
  mode = 'live';

  constructor({ continueUrl, webhookUrl, createLink, listPayments }) {
    this.continueUrl = continueUrl;
    this.webhookUrl = webhookUrl;
    this.createLink = createLink;
    this.listPayments = listPayments;
  }

  async createPaymentLink(order) {
    return this.createLink({
      amount_minor: order.amountMinor,
      currency: order.currency,
      product_name: order.productName,
      description: reportProduct.description,
      idempotency_key: `chiveshield-report-${order.id}`,
      continue_url: `${this.continueUrl}?order_id=${encodeURIComponent(order.id)}`,
      webhook_url: this.webhookUrl,
      metadata: {
        order_id: order.id,
        service: 'one_report',
        workspace: 'chiveshield',
        version: order.metadata.version
      }
    });
  }

  async pollPaymentStatus(order) {
    const payments = await this.listPayments({ status: 'succeeded', limit: 100 });
    return payments.find((payment) => payment.link_id === order.matrixPaymentLinkId || payment.metadata?.order_id === order.id) || null;
  }
}

export class DemoReportGenerationProvider {
  mode = 'demo';

  async generate({ order, generateReport, toMarkdown }) {
    const report = generateReport(order.demandText);
    return {
      reportId: `report_${order.id}`,
      report,
      markdown: toMarkdown(report, order),
      mode: 'demo'
    };
  }
}

export class MatrixReportGenerationProvider {
  mode = 'live';

  constructor({ searchProvider, modelProvider }) {
    this.searchProvider = searchProvider;
    this.modelProvider = modelProvider;
  }

  async generate({ order }) {
    const searchResults = await this.searchProvider.search({ demandText: order.demandText, orderId: order.id });
    return this.modelProvider.generateChiveShieldReport({ order, searchResults });
  }
}
