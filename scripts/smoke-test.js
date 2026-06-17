import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const requiredFiles = ['src/index.html', 'src/styles.css', 'src/app.js', 'src/commercial-contracts.js', 'server/index.js', 'server/payment-provider.js', 'server/order-store.js', 'server/report-generation-provider.js', 'scripts/serverless-store-smoke-test.js'];
const requiredSnippets = [
  ['src/index.html', '生成免费预览'],
  ['src/index.html', '解锁完整报告 $1.40'],
  ['src/index.html', '前往 Stripe 安全支付'],
  ['src/index.html', '$1.40 USD'],
  ['src/index.html', 'Stripe 托管收银台'],
  ['src/index.html', '后端确认后交付'],
  ['src/index.html', '本地 demo：模拟支付成功'],
  ['src/index.html', '下载 Markdown'],
  ['src/index.html', 'PaymentProvider'],
  ['src/index.html', 'ReportGenerationProvider'],
  ['src/index.html', 'SearchProvider'],
  ['src/app.js', 'ReportOrderStatus'],
  ['src/app.js', '9B628s2J6bok1nH26h9AA0q'],
  ['src/app.js', 'live-test-link-approved'],
  ['src/app.js', 'Demo/mock 支付'],
  ['src/app.js', 'toMarkdown'],
  ['src/app.js', 'openSourceCandidates'],
  ['src/commercial-contracts.js', 'MatrixPaymentProvider'],
  ['src/commercial-contracts.js', 'metadata'],
  ['src/commercial-contracts.js', 'order_id'],
  ['src/commercial-contracts.js', 'MatrixReportGenerationProvider'],
  ['server/index.js', '/api/report-orders'],
  ['server/index.js', '/api/matrix-payment-webhook'],
  ['server/index.js', 'confirm-agent-revenue-payment'],
  ['server/index.js', 'agent-revenue-operator-proof'],
  ['server/index.js', 'pending_payment'],
  ['server/index.js', 'generationFailed'],
  ['server/payment-provider.js', 'createdRealPaymentLink: false'],
  ['server/payment-provider.js', 'metadata'],
  ['server/payment-provider.js', 'order_id'],
  ['server/order-store.js', 'duplicate_paid'],
  ['server/order-store.js', 'CHIVESHIELD_ORDER_STORE'],
  ['server/order-store.js', 'serverless-tmp'],
  ['server/order-store.js', 'chiveshield-report-orders.json'],
  ['server/order-store.js', 'saveState'],
  ['scripts/api-smoke-test.js', 'persistent store'],
  ['scripts/serverless-store-smoke-test.js', 'serverless runtime should default order store to os tmpdir']
];

for (const file of requiredFiles) {
  readFileSync(join(root, file), 'utf8');
}

for (const [file, snippet] of requiredSnippets) {
  const content = readFileSync(join(root, file), 'utf8');
  if (!content.includes(snippet)) {
    throw new Error(`Missing snippet "${snippet}" in ${file}`);
  }
}

console.log('Smoke test passed: core files and report/export hooks exist.');
