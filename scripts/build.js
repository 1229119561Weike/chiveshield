import { copyFileSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const src = join(root, 'src');
const dist = join(root, 'dist');

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const file of readdirSync(src)) {
  const sourcePath = join(src, file);
  if (statSync(sourcePath).isFile()) {
    copyFileSync(sourcePath, join(dist, file));
  }
}

console.log(`Built static app to ${dist}`);
