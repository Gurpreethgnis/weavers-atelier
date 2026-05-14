/**
 * Debug helper: runs Tesseract on raw + several preprocessed variants
 * and prints everything it sees with confidence, so we can tune detection
 * for our specific overlay style (white serif on textured backdrops).
 */

import { createWorker } from "tesseract.js";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const src = process.argv[2];
  if (!src) {
    console.error("Usage: tsx scripts/media/debug-ocr.ts <image-path>");
    process.exit(1);
  }
  if (!fs.existsSync(src)) {
    console.error(`Not found: ${src}`);
    process.exit(1);
  }

  console.log(`[debug-ocr] ${src}`);

  const variants: Record<string, Buffer> = {
    raw: await sharp(src).toBuffer(),
    gray_norm: await sharp(src).grayscale().normalize().toBuffer(),
    gray_stretch: await sharp(src).grayscale().normalize().linear(1.4, -30).toBuffer(),
    gray_invert: await sharp(src).grayscale().negate().normalize().toBuffer(),
    threshold_high: await sharp(src).grayscale().threshold(200).toBuffer(),
    threshold_low: await sharp(src).grayscale().threshold(80).toBuffer(),
  };

  const debugDir = path.join("scripts", "media", "debug-out");
  fs.mkdirSync(debugDir, { recursive: true });
  for (const [k, b] of Object.entries(variants)) {
    fs.writeFileSync(path.join(debugDir, `${path.basename(src, path.extname(src))}-${k}.png`), b);
  }

  const worker = await createWorker("eng", 1, { logger: () => {} });
  await worker.setParameters({
    tessedit_pageseg_mode: "11" as unknown as never,
    tessedit_ocr_engine_mode: "1" as unknown as never,
  });

  for (const psm of ["6", "7", "11", "12"]) {
    await worker.setParameters({
      tessedit_pageseg_mode: psm as unknown as never,
    });
    for (const [name, buf] of Object.entries(variants)) {
      const { data } = await worker.recognize(buf);
      const txt = (data as { text?: string }).text?.trim() ?? "";
      const words =
        (data as unknown as {
          words?: Array<{ text: string; confidence: number; bbox: { x0: number; y0: number; x1: number; y1: number } }>;
        }).words ?? [];
      const interesting = words.filter((w) => w.text.trim().length > 0);
      console.log(`\n--- psm=${psm}  variant=${name}  text="${txt.slice(0, 80)}"  (${interesting.length} words) ---`);
      for (const w of interesting.slice(0, 8)) {
        console.log(`  ${Math.round(w.confidence)}%  "${w.text}"  bbox=${w.bbox.x0},${w.bbox.y0}->${w.bbox.x1},${w.bbox.y1}`);
      }
    }
  }

  await worker.terminate();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
