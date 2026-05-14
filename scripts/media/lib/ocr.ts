/**
 * OCR + mask construction for overlay detection.
 *
 * We use tesseract.js to detect text regions on an image, then build a
 * binary mask (white = inpaint this region, black = keep) with a small
 * padding so the inpainter has room to blend edges naturally.
 *
 * Important constraints:
 *   - We only treat detections with confidence >= MIN_CONFIDENCE as real
 *     text. Tesseract hallucinates on textured fabric otherwise.
 *   - We ignore very small bounding boxes (< MIN_AREA_RATIO of image area)
 *     because they're almost always noise.
 *   - The padding is proportional to image width — large hero images
 *     need more padding than thumbnails to look natural after inpainting.
 */

import sharp from "sharp";
import { createWorker, type Worker } from "tesseract.js";

export interface TextRegion {
  text: string;
  confidence: number;
  bbox: { x0: number; y0: number; x1: number; y1: number };
}

export interface OcrResult {
  regions: TextRegion[];
  imageWidth: number;
  imageHeight: number;
}

const MIN_CONFIDENCE = 45;
const MIN_AREA_RATIO = 0.0008;

let cachedWorker: Worker | null = null;

async function getWorker(): Promise<Worker> {
  if (cachedWorker) return cachedWorker;
  cachedWorker = await createWorker("eng", 1, {
    logger: () => {},
  });
  // PSM 6 = single uniform block of text. In practice this picks up our
  // decorative caption-style overlays far more reliably than the default
  // AUTO mode, which assumes paragraph structure.
  await cachedWorker.setParameters({
    tessedit_pageseg_mode: "6" as unknown as never,
  });
  return cachedWorker;
}

interface TesseractWord {
  text: string;
  confidence: number;
  bbox: { x0: number; y0: number; x1: number; y1: number };
}

interface TesseractLine {
  text: string;
  confidence: number;
  bbox: { x0: number; y0: number; x1: number; y1: number };
  words?: TesseractWord[];
}

interface TesseractParagraph {
  lines?: TesseractLine[];
}

interface TesseractBlock {
  paragraphs?: TesseractParagraph[];
}

function collectWords(blocks: TesseractBlock[]): TesseractWord[] {
  const out: TesseractWord[] = [];
  for (const b of blocks) {
    for (const p of b.paragraphs ?? []) {
      for (const l of p.lines ?? []) {
        for (const w of l.words ?? []) {
          out.push(w);
        }
      }
    }
  }
  return out;
}

export async function disposeWorker(): Promise<void> {
  if (cachedWorker) {
    await cachedWorker.terminate();
    cachedWorker = null;
  }
}

/**
 * Detect text by running Tesseract on several preprocessed variants of
 * the same image and unioning the results.
 *
 * Why this matters: editorial Instagram overlays on Weavers content are
 * almost always WHITE SERIF text on a light/textured background. Tesseract's
 * stock model on the raw image fails to find them — it's optimized for
 * scanned documents, not stylized image overlays.
 *
 * The combo that works empirically for our content:
 *   - `threshold(200)` binarization — collapses the bright overlay to
 *     pure white and the rest to pure black. Tesseract LOVES this.
 *   - `threshold(80)` inverted binarization — catches dark overlays
 *     (rare for us, but cheap insurance).
 *   - PSM=6 (single uniform block) — picks up caption text far more
 *     reliably than AUTO mode.
 *
 * We dedupe by approximate bbox so the same word found by multiple variants
 * doesn't expand the mask unnecessarily.
 */
export async function detectTextRegions(imagePath: string): Promise<OcrResult> {
  const meta = await sharp(imagePath).metadata();
  const imageWidth = meta.width ?? 0;
  const imageHeight = meta.height ?? 0;
  const imageArea = imageWidth * imageHeight;

  const worker = await getWorker();

  const variants = [
    // Bright overlay (white-on-light): bright pixels -> white, rest -> black.
    await sharp(imagePath).grayscale().threshold(200).toBuffer(),
    // Dark overlay (black-on-light): dark pixels -> white via threshold+invert.
    await sharp(imagePath).grayscale().threshold(80).negate().toBuffer(),
    // Normalized grayscale, no thresholding — catches mid-tone overlays
    // (e.g. the burgundy "Must-have Styles" pill) that the thresholded
    // variants would erase.
    await sharp(imagePath).grayscale().normalize().toBuffer(),
  ];

  const collected = new Map<string, TextRegion>();

  for (const buf of variants) {
    const { data } = await worker.recognize(buf, {}, {
      blocks: true,
      text: false,
    } as unknown as never);
    const blocks = (data as unknown as { blocks?: TesseractBlock[] }).blocks ?? [];
    const words = collectWords(blocks);

    for (const w of words) {
      if (!w.text || !w.text.trim()) continue;
      if (w.confidence < MIN_CONFIDENCE) continue;
      const bbox = w.bbox;
      const w_ = bbox.x1 - bbox.x0;
      const h_ = bbox.y1 - bbox.y0;
      if (w_ <= 0 || h_ <= 0) continue;
      const area = w_ * h_;
      if (area / imageArea < MIN_AREA_RATIO) continue;
      const key = `${Math.round(bbox.x0 / 10)},${Math.round(bbox.y0 / 10)},${Math.round(bbox.x1 / 10)},${Math.round(bbox.y1 / 10)}`;
      const existing = collected.get(key);
      if (!existing || existing.confidence < w.confidence) {
        collected.set(key, {
          text: w.text.trim(),
          confidence: w.confidence,
          bbox,
        });
      }
    }
  }

  return {
    regions: Array.from(collected.values()),
    imageWidth,
    imageHeight,
  };
}

/**
 * Build a binary mask PNG (white = inpaint) from detected text regions.
 * Pads each region proportionally so the inpainter has natural edges.
 * Returns the PNG buffer.
 */
export async function buildMask(
  ocr: OcrResult,
  options: { paddingRatio?: number; merge?: boolean } = {}
): Promise<Buffer> {
  const paddingRatio = options.paddingRatio ?? 0.015;
  const padding = Math.round(ocr.imageWidth * paddingRatio);

  // Build SVG with white rectangles per region on a black background.
  const rects = ocr.regions
    .map((r) => {
      const x = Math.max(0, r.bbox.x0 - padding);
      const y = Math.max(0, r.bbox.y0 - padding);
      const w = Math.min(ocr.imageWidth - x, r.bbox.x1 - r.bbox.x0 + 2 * padding);
      const h = Math.min(
        ocr.imageHeight - y,
        r.bbox.y1 - r.bbox.y0 + 2 * padding
      );
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="white" />`;
    })
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ocr.imageWidth}" height="${ocr.imageHeight}"><rect width="100%" height="100%" fill="black" />${rects}</svg>`;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

/** Returns true if the OCR result has any region worth inpainting. */
export function hasOverlay(ocr: OcrResult): boolean {
  return ocr.regions.length > 0;
}
