import { cp, copyFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const output = join(root, 'dist');

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const file of ['index.html', 'src.js', 'styles.css']) {
  await copyFile(join(root, file), join(output, file));
}

await copyFile(join(root, 'public', 'favicon.png'), join(output, 'favicon.png'));
await cp(join(root, 'public', 'images'), join(output, 'images'), { recursive: true });
