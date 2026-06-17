import { once } from 'node:events';
import { existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const expectedStorePath = join(tmpdir(), 'chiveshield-report-orders.json');
process.env.VERCEL = '1';
delete process.env.CHIVESHIELD_ORDER_STORE;
rmSync(expectedStorePath, { force: true });

const { server } = await import('../server/index.js');
const port = 8800;
const base = `http://127.0.0.1:${port}`;

server.listen(port);
await once(server, 'listening');

try {
  const health = await request('GET', '/health');
  assert(health.store.path === expectedStorePath, 'serverless runtime should default order store to os tmpdir');
  assert(health.store.writableRuntime === 'serverless-tmp', 'health should expose serverless tmp storage mode');

  const created = await request('POST', '/api/report-orders', {
    demandText: '线上确认接口 smoke：测试 Agent Revenue proof confirmation endpoint presence'
  });
  assert(created.ok, 'serverless order creation should succeed');
  assert(created.order.status === 'draft', 'serverless order should be draft');
  assert(existsSync(expectedStorePath), 'serverless order store should be written under tmpdir');

  console.log(`Serverless store smoke test passed: order store uses writable tmp path ${expectedStorePath}.`);
} finally {
  server.close();
  rmSync(expectedStorePath, { force: true });
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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}
