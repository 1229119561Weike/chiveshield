import { once } from 'node:events';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const storePath = join(root, 'tmp', `api-smoke-orders-${process.pid}.json`);
process.env.CHIVESHIELD_ORDER_STORE = storePath;
rmSync(storePath, { force: true });

const { server } = await import('../server/index.js');
const port = 8799;
const base = `http://127.0.0.1:${port}`;

server.listen(port);
await once(server, 'listening');

try {
  const health = await request('GET', '/health');
  assert(health.ok && health.paymentMode === 'dry-run', 'health should expose dry-run payment mode');
  assert(health.store.path === storePath, 'health should expose isolated order store path');

  const created = await request('POST', '/api/report-orders', {
    demandText: '我想给公司做一个 AI 客服，能接入官网和企业微信，自动回答客户问题。'
  });
  assert(created.ok, 'order creation should succeed');
  const orderId = created.order.id;
  assert(created.order.status === 'draft', 'created order should be draft');
  assert(existsSync(storePath), 'order store file should be created after order creation');

  const payment = await request('POST', `/api/report-orders/${encodeURIComponent(orderId)}/payment-link`, {
    continueUrl: 'http://localhost:5173/orders',
    webhookUrl: 'https://example.invalid/api/matrix-payment-webhook'
  });
  assert(payment.ok, 'payment link creation should succeed');
  assert(payment.paymentLink.mode === 'dry-run', 'payment link should be dry-run');
  assert(payment.paymentLink.createdRealPaymentLink === false, 'must not create real payment link');
  assert(payment.paymentLink.request.metadata.order_id === orderId, 'metadata.order_id should match order');
  assert(payment.order.status === 'pending_payment', 'order should wait for payment');

  const status = await request('GET', `/api/report-orders/${encodeURIComponent(orderId)}/status`);
  assert(status.order.status === 'pending_payment', 'status endpoint should return pending_payment');

  const webhook = await request('POST', '/api/matrix-payment-webhook', {
    event: 'payment.succeeded',
    data: {
      payment_id: 'pay_test_001',
      link_id: payment.order.matrixPaymentLinkId,
      amount_minor: 990,
      currency: 'cny',
      product_name: 'ChiveShield AI 服务采购防坑报告',
      metadata: { order_id: orderId }
    }
  });
  assert(webhook.ok, 'webhook should succeed in dry-run signature mode');
  assert(webhook.order.status === 'completed', 'paid webhook should trigger generation and completion');
  assert(webhook.order.reportMarkdown.includes('避韭针 ChiveShield 付费报告'), 'completed order should include markdown report');

  const duplicate = await request('POST', '/api/matrix-payment-webhook', {
    event: 'payment.succeeded',
    data: {
      payment_id: 'pay_test_001',
      link_id: payment.order.matrixPaymentLinkId,
      metadata: { order_id: orderId }
    }
  });
  assert(duplicate.ok, 'duplicate payment webhook should be accepted');
  assert(['duplicate_paid', 'completed'].includes(duplicate.order.status), 'duplicate payment should not return to pending_payment');

  const pollOrder = await request('POST', '/api/report-orders', { demandText: '我想做 AI 数据分析报表助手。' });
  await request('POST', `/api/report-orders/${encodeURIComponent(pollOrder.order.id)}/payment-link`, {});
  const poll = await request('POST', `/api/report-orders/${encodeURIComponent(pollOrder.order.id)}/poll-payment`, { dryRunPaymentSucceeded: true });
  assert(poll.ok && poll.paymentMatched === true, 'dry-run polling should match payment');
  assert(poll.order.status === 'completed', 'dry-run polling should trigger generation');

  const agentRevenueOrder = await request('POST', '/api/report-orders', { demandText: '我想做 AI 客服采购防坑报告。', customerEmail: 'buyer@example.com' });
  const confirmed = await request('POST', `/api/report-orders/${encodeURIComponent(agentRevenueOrder.order.id)}/confirm-agent-revenue-payment`, {
    payment_id: 'pay_demo_agent_revenue_001',
    link_id: 'link_demo_agent_revenue_001',
    amount: 1.4,
    currency: 'usd',
    customer_email: 'buyer@example.com',
    status: 'succeeded',
    paid_at: '2026-01-01T00:00:00+00:00'
  });
  assert(confirmed.ok && confirmed.paymentMatched === true, 'Agent Revenue proof should confirm payment');
  assert(confirmed.order.status === 'completed', 'Agent Revenue proof should trigger report generation');
  assert(confirmed.order.matrixPaymentLinkId === 'link_demo_agent_revenue_001', 'standalone link_id should attach to order');
  assert(confirmed.order.matrixPaymentId === 'pay_demo_agent_revenue_001', 'payment_id should attach to order');
  assert(confirmed.order.reportMarkdown.includes('避韭针 ChiveShield 付费报告'), 'Agent Revenue confirmed order should include markdown report');

  const repeatedConfirm = await request('POST', `/api/report-orders/${encodeURIComponent(agentRevenueOrder.order.id)}/confirm-agent-revenue-payment`, {
    payment_id: 'pay_demo_agent_revenue_001',
    link_id: 'link_demo_agent_revenue_001',
    status: 'succeeded'
  });
  assert(repeatedConfirm.ok, 'repeated Agent Revenue proof should be accepted idempotently');
  assert(['duplicate_paid', 'completed'].includes(repeatedConfirm.order.status), 'repeated Agent Revenue proof should not return to pending_payment');

  await expectHttpError('POST', `/api/report-orders/${encodeURIComponent(agentRevenueOrder.order.id)}/confirm-agent-revenue-payment`, {
    payment_id: 'other_payment',
    link_id: 'wrong_link',
    status: 'succeeded'
  }, 409, 'mismatched link_id should be rejected');

  const stored = JSON.parse(readFileSync(storePath, 'utf8'));
  assert(stored.orders[orderId].status === 'duplicate_paid', 'store should persist duplicate_paid terminal state');
  assert(Object.keys(stored.orders).length === 3, 'store should persist all test orders');
  assert(stored.paymentsById.pay_test_001 === orderId, 'store should persist payment idempotency index');
  assert(stored.paymentsById.pay_demo_agent_revenue_001 === agentRevenueOrder.order.id, 'store should persist Agent Revenue payment idempotency index');

  console.log('API smoke test passed: persistent store, order, dry-run payment link, webhook, duplicate payment, polling, Agent Revenue proof confirmation, and generation flow work.');
} finally {
  server.close();
  rmSync(storePath, { force: true });
}

async function request(method, path, body = undefined) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(`${method} ${path} failed: ${response.status} ${JSON.stringify(payload)}`);
  }
  return payload;
}

async function expectHttpError(method, path, body, expectedStatus, message) {
  const response = await fetch(`${base}${path}`, {
    method,
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  await response.json();
  assert(response.status === expectedStatus, message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
