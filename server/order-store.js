import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

export const ReportOrderStatus = Object.freeze({
  draft: 'draft',
  paymentCreated: 'payment_created',
  pendingPayment: 'pending_payment',
  paid: 'paid',
  generating: 'generating',
  completed: 'completed',
  paymentFailed: 'payment_failed',
  generationFailed: 'generation_failed',
  expired: 'expired',
  duplicatePaid: 'duplicate_paid'
});

const storePath = resolveStorePath();
let state = loadState();

export function createOrder({ demandText, customerEmail = null }) {
  const id = createOrderId();
  const now = new Date().toISOString();
  const order = {
    id,
    demandText,
    customerEmail,
    amountMinor: 990,
    currency: 'cny',
    productName: 'ChiveShield AI 服务采购防坑报告',
    status: ReportOrderStatus.draft,
    matrixPaymentLinkId: null,
    matrixPaymentUrl: null,
    matrixPaymentId: null,
    reportId: null,
    reportMarkdown: null,
    createdAt: now,
    paidAt: null,
    generatedAt: null,
    failureReason: null,
    statusHistory: [{ status: ReportOrderStatus.draft, at: now, note: 'ReportOrder created.' }],
    metadata: {
      order_id: id,
      workspace: 'chiveshield',
      service: 'one_report',
      version: '0.1.0'
    }
  };
  state.orders[id] = order;
  saveState();
  return order;
}

export function getOrder(id) {
  return state.orders[id] || null;
}

export function updateOrder(id, patch, statusNote = null) {
  const current = getOrder(id);
  if (!current) return null;
  const next = { ...current, ...patch };
  if (patch.status && patch.status !== current.status) {
    next.statusHistory = [
      ...current.statusHistory,
      { status: patch.status, at: new Date().toISOString(), note: statusNote || `status -> ${patch.status}` }
    ];
  }
  state.orders[id] = next;
  saveState();
  return next;
}

export function markPaidFromPayment(order, payment) {
  const paymentId = payment.payment_id || payment.id || payment.matrixPaymentId;
  if (paymentId && state.paymentsById[paymentId]) {
    return updateOrder(order.id, {
      status: ReportOrderStatus.duplicatePaid,
      matrixPaymentId: paymentId,
      paidAt: order.paidAt || new Date().toISOString()
    }, 'Duplicate payment event received; keeping paid entitlement and avoiding second generation charge.');
  }
  if (paymentId) {
    state.paymentsById[paymentId] = order.id;
    saveState();
  }
  if ([ReportOrderStatus.completed, ReportOrderStatus.generating, ReportOrderStatus.paid].includes(order.status)) {
    return updateOrder(order.id, {
      matrixPaymentId: paymentId || order.matrixPaymentId,
      paidAt: order.paidAt || new Date().toISOString()
    }, 'Payment confirmation repeated; order already paid or beyond.');
  }
  return updateOrder(order.id, {
    status: ReportOrderStatus.paid,
    matrixPaymentId: paymentId || order.matrixPaymentId,
    paidAt: new Date().toISOString()
  }, 'Matrix payment confirmed.');
}

export function publicOrder(order) {
  if (!order) return null;
  return {
    id: order.id,
    status: order.status,
    amountMinor: order.amountMinor,
    currency: order.currency,
    productName: order.productName,
    matrixPaymentLinkId: order.matrixPaymentLinkId,
    matrixPaymentUrl: order.matrixPaymentUrl,
    matrixPaymentId: order.matrixPaymentId,
    reportId: order.reportId,
    reportMarkdown: order.reportMarkdown,
    createdAt: order.createdAt,
    paidAt: order.paidAt,
    generatedAt: order.generatedAt,
    failureReason: order.failureReason,
    statusHistory: order.statusHistory,
    metadata: order.metadata
  };
}

export function orderStoreInfo() {
  return {
    path: storePath,
    writableRuntime: isServerlessRuntime() ? 'serverless-tmp' : 'project-data',
    orderCount: Object.keys(state.orders).length,
    paymentCount: Object.keys(state.paymentsById).length
  };
}

function resolveStorePath() {
  if (process.env.CHIVESHIELD_ORDER_STORE) return process.env.CHIVESHIELD_ORDER_STORE;
  if (isServerlessRuntime()) return join(tmpdir(), 'chiveshield-report-orders.json');
  return join(new URL('..', import.meta.url).pathname, 'data', 'report-orders.json');
}

function isServerlessRuntime() {
  return process.env.VERCEL === '1' || Boolean(process.env.LAMBDA_TASK_ROOT);
}

function loadState() {
  try {
    const loaded = JSON.parse(readFileSync(storePath, 'utf8'));
    return {
      version: 1,
      orders: loaded.orders || {},
      paymentsById: loaded.paymentsById || {}
    };
  } catch {
    return { version: 1, orders: {}, paymentsById: {} };
  }
}

function saveState() {
  mkdirSync(dirname(storePath), { recursive: true });
  writeFileSync(storePath, `${JSON.stringify(state, null, 2)}\n`);
}

function createOrderId() {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CS-${stamp}-${suffix}`;
}
