import { handler } from '../server/index.js';

export default async function vercelHandler(req, res) {
  return handler(req, res);
}
