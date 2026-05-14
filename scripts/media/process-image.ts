/**
 * Process a single image for the Weavers platform.
 *
 * Pipeline:
 *   1. Load source image.
 *   2. (Optional) Run OCR to detect promotional/text overlays.
 *   3. (Optional) Build a mask + call inpainting backend to remove text.
 *   4. Apply preset transform: resize/crop to target aspect, normalize color.
 *   5. Strip EXIF and write JPEG + WebP to public/images/<preset>/<name>.{jpg,webp}.
 *   6. Append entry to the media manifest with QA flags.
 *
 * Usage:
 *   npm run media:image -- <source-path> --preset=hero --name=home-hero
 *   npm run media:image -- <source-path> --preset=lookbook --no-inpaint
 *
 * Flags:
 *   --preset=<hero|lookbook|detail|raw>   Required. Output shape.
 *   --name=<slug>                          Output filename (without ext).
 *                                         Defaults to source filename slug.
 *   --no-inpaint                           Skip OCR + inpaint entirely.
 *   --no-ocr                               Skip OCR (and therefore inpaint).
 *   --force                                Overwrite even if output exists.
 *   --alt="..."                            Suggested alt text to record in manifest.
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { getPreset } from "./lib/presets";
import {
  detectTextRegions,
  buildMask,
  hasOverlay,
  disposeWorker,
  type OcrResult,
} from "./lib/ocr";
import { inpaintWithLama, loadEnvLocal } from "./lib/inpaint";
import { upsertEntry, type ImageManifestEntry } from "./lib/manifest";

interface CliArgs {
  source: string;
  preset: string;
  name?: string;
  noInpaint: boolean;
  noOcr: boolean;
  force: boolean;
  alt?: string;
}

function parseArgs(argv: string[]): CliArgs {
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (const arg of argv) {
    if (arg.startsWith("--")) {
      const eq = arg.indexOf("=");
      if (eq === -1) {
        flags[arg.slice(2)] = true;
      } else {
        flags[arg.slice(2, eq)] = arg.slice(eq + 1);
      }
    } else {
      positional.push(arg);
    }
  }

  const source = positional[0];
  if (!source) {
    throw new Error(
      "Usage: process-image <source-path> --preset=<hero|lookbook|detail|raw> [--name=...] [--no-inpaint] [--no-ocr] [--force] [--alt='...']"
    );
  }
  const preset = typeof flags.preset === "string" ? flags.preset : "raw";

  return {
    source,
    preset,
    name: typeof flags.name === "string" ? flags.name : undefined,
    noInpaint: flags["no-inpaint"] === true,
    noOcr: flags["no-ocr"] === true,
    force: flags.force === true,
    alt: typeof flags.alt === "string" ? flags.alt : undefined,
  };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {
  loadEnvLocal();
  const args = parseArgs(process.argv.slice(2));
  const preset = getPreset(args.preset);

  if (!fs.existsSync(args.source)) {
    throw new Error(`Source not found: ${args.source}`);
  }

  const baseName = args.name ?? slugify(path.basename(args.source));
  const outDir = path.join(process.cwd(), "public", "images", preset.outDir);
  fs.mkdirSync(outDir, { recursive: true });
  const jpgPath = path.join(outDir, `${baseName}.jpg`);
  const webpPath = path.join(outDir, `${baseName}.webp`);

  if (!args.force && fs.existsSync(jpgPath)) {
    console.log(
      `[skip] ${jpgPath} already exists. Use --force to overwrite.`
    );
    return;
  }

  console.log(`[process-image] ${args.source} -> ${baseName} (preset=${args.preset})`);

  // 1. Load source as a buffer (we may need it both for OCR and the pipeline).
  // Typed as Uint8Array (a supertype of all Buffer flavors) so we can reassign
  // it to whatever the inpaint backend returns without TS variance issues.
  let workingBuffer: Uint8Array = fs.readFileSync(args.source);

  // 2. OCR + inpaint.
  let ocr: OcrResult = { regions: [], imageWidth: 0, imageHeight: 0 };
  let inpainted = false;
  let inpaintNote: string | undefined;
  let textRemainsAfterProcessing = false;

  if (!args.noOcr) {
    console.log(`  - running OCR (multi-variant)...`);
    ocr = await detectTextRegions(args.source);
    if (hasOverlay(ocr)) {
      console.log(
        `  - detected ${ocr.regions.length} text region(s): ${ocr.regions
          .map((r) => `"${r.text}"(${Math.round(r.confidence)}%)`)
          .slice(0, 6)
          .join(", ")}`
      );
      if (args.noInpaint) {
        inpaintNote = "OCR detected text but --no-inpaint was specified";
        console.log(`  - inpaint skipped: ${inpaintNote}`);
      } else {
        console.log(`  - building mask + calling inpaint backend...`);
        const mask = await buildMask(ocr, { paddingRatio: 0.02 });
        // We feed the inpainter the PNG of the source so masks align pixel-perfect.
        const sourcePng = await sharp(workingBuffer).png().toBuffer();
        const result = await inpaintWithLama(sourcePng, mask, {
          dryRun: false,
        });
        if (result.inpainted) {
          workingBuffer = result.imageBuffer;
          inpainted = true;
          console.log(`  - inpaint applied`);
        } else {
          inpaintNote = result.reason;
          console.log(`  - inpaint skipped: ${result.reason}`);
        }
      }
    } else {
      console.log(`  - no text overlay detected`);
    }
  }

  // 3. Preset transform.
  let pipeline = sharp(workingBuffer).rotate(); // respect EXIF orientation
  const meta = await pipeline.metadata();
  const srcW = meta.width ?? 0;
  const srcH = meta.height ?? 0;

  let targetW = Math.min(preset.width, srcW);
  let targetH: number | undefined;
  if (preset.aspect != null) {
    targetH = Math.round(targetW / preset.aspect);
  }

  pipeline = pipeline.resize({
    width: targetW,
    height: targetH,
    fit: preset.fit,
    position: "attention",
    withoutEnlargement: true,
  });

  if (
    preset.normalize.saturation !== 1.0 ||
    preset.normalize.brightness !== 1.0
  ) {
    pipeline = pipeline.modulate({
      saturation: preset.normalize.saturation,
      brightness: preset.normalize.brightness,
    });
  }

  // Strip all EXIF/metadata.
  pipeline = pipeline.withMetadata({});

  const finalBuffer = await pipeline.toBuffer({ resolveWithObject: true });
  const finalW = finalBuffer.info.width;
  const finalH = finalBuffer.info.height;

  // 4. Write JPEG + WebP.
  await sharp(finalBuffer.data)
    .jpeg({ quality: preset.jpegQuality, mozjpeg: true })
    .toFile(jpgPath);
  await sharp(finalBuffer.data)
    .webp({ quality: preset.webpQuality })
    .toFile(webpPath);

  console.log(`  - wrote ${jpgPath}`);
  console.log(`  - wrote ${webpPath}`);

  // 5. QA: re-OCR the final image to confirm text was actually removed.
  if (inpainted && !args.noOcr) {
    const verify = await detectTextRegions(jpgPath);
    textRemainsAfterProcessing = hasOverlay(verify);
    if (textRemainsAfterProcessing) {
      console.warn(
        `  - QA WARNING: text still detected in output (${verify.regions.length} region(s)). Manual review recommended.`
      );
    }
  }

  // 6. Manifest.
  const entry: ImageManifestEntry = {
    type: "image",
    source: path.relative(process.cwd(), args.source),
    outputs: {
      jpg: `/images/${preset.outDir}/${baseName}.jpg`,
      webp: `/images/${preset.outDir}/${baseName}.webp`,
    },
    preset: args.preset as ImageManifestEntry["preset"],
    width: finalW,
    height: finalH,
    aspect:
      preset.aspect != null ? preset.aspect.toFixed(4) : `${finalW}/${finalH}`,
    inpainted,
    detectedText: ocr.regions.map((r) => r.text),
    qa: {
      textRemainsAfterProcessing,
      confidence:
        ocr.regions.length === 0
          ? 100
          : Math.round(
              ocr.regions.reduce((a, r) => a + r.confidence, 0) /
                ocr.regions.length
            ),
      notes: inpaintNote,
    },
    altSuggestion: args.alt,
    processedAt: new Date().toISOString(),
  };
  upsertEntry(`image:${preset.outDir}/${baseName}`, entry);

  await disposeWorker();
  console.log(`[done]`);
}

main().catch(async (err) => {
  await disposeWorker();
  console.error(err);
  process.exit(1);
});
