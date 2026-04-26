/**
 * Rasterizes brand SVGs into the PNG variants Next.js expects under app/.
 *
 * Run with: npm run build-brand
 *
 * Sources live in brand/ so they don't get served as static routes.
 * Outputs:
 *   brand/icon.svg          → app/icon.png            (512×512)
 *   brand/icon.svg          → app/apple-icon.png      (180×180)
 *   brand/og-image.svg      → app/opengraph-image.png (1200×630)
 *
 * sharp ships with the Next install, so no extra dependency is needed.
 * Font rendering inside the SVGs uses widely-available system stacks
 * (Arial Black / Helvetica) so the rasterized output is consistent
 * across machines.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..');

async function rasterize(svgPath: string, outPath: string, width: number, height: number) {
  const svg = readFileSync(svgPath);
  const png = await sharp(svg, { density: 384 })
    .resize(width, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  writeFileSync(outPath, png);
  console.log(`  ${outPath} (${width}×${height})`);
}

async function main() {
  const iconSvg = join(repo, 'brand', 'icon.svg');
  const ogSvg = join(repo, 'brand', 'og-image.svg');
  console.log('Rasterizing brand assets:');
  await rasterize(iconSvg, join(repo, 'app', 'icon.png'), 512, 512);
  await rasterize(iconSvg, join(repo, 'app', 'apple-icon.png'), 180, 180);
  await rasterize(ogSvg, join(repo, 'app', 'opengraph-image.png'), 1200, 630);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
