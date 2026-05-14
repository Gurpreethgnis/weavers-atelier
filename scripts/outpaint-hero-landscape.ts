/**
 * Outpaint the portrait hero into a true wide landscape using FLUX Fill Pro,
 * then upscale 2x with Real-ESRGAN. This produces a real landscape composition
 * with the model centered, painted heritage backdrop extending naturally to
 * both sides — no pixel stretching, no smearing.
 */
import Replicate from "replicate";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import https from "https";
import sharp from "sharp";

dotenv.config({ path: ".env.local" });

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

async function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const handle = (res: import("http").IncomingMessage) => {
      if ((res.statusCode === 301 || res.statusCode === 302) && res.headers.location) {
        https.get(res.headers.location, handle).on("error", reject);
        return;
      }
      res.pipe(file);
      file.on("finish", () => file.close(() => resolve()));
    };
    https.get(url, handle).on("error", (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function poll(id: string) {
  let r = await replicate.predictions.get(id);
  let n = 0;
  while (r.status !== "succeeded" && r.status !== "failed" && r.status !== "canceled" && n < 90) {
    await sleep(3000);
    r = await replicate.predictions.get(id);
    n++;
    if (n % 4 === 0) console.log(`    ${r.status}... (${n * 3}s)`);
  }
  return r;
}

function extractUrl(output: unknown): string | null {
  if (typeof output === "string") return output;
  if (Array.isArray(output) && output.length > 0) return String(output[0]);
  if (output && typeof output === "object") {
    const o = output as Record<string, unknown>;
    for (const k of ["url", "image", "output"]) {
      if (typeof o[k] === "string") return o[k] as string;
    }
  }
  return null;
}

async function main() {
  const src = "public/images/hero/home-hero-heritage-v1-cropped.jpg";
  const outDir = path.join(process.cwd(), "public", "images", "hero");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  console.log("📐 Building 16:9 canvas with portrait centered + headroom...");

  // Target landscape canvas — FLUX prefers multiples of 16. 1792x1024 = 7:4 (close to 16:9).
  const CANVAS_W = 1792;
  const CANVAS_H = 1024;

  // Portrait should occupy ~78% of canvas height so we have real headroom
  // above (sky/landscape to be painted) and a small floor band below.
  // Bias the figure slightly downward in the frame so the head clears the nav
  // and reads with sky around it.
  const portrait = await sharp(src).metadata();
  const srcW = portrait.width!;
  const srcH = portrait.height!;
  const FIGURE_HEIGHT_RATIO = 0.78;
  const placedH = Math.round(CANVAS_H * FIGURE_HEIGHT_RATIO);
  const scale = placedH / srcH;
  const placedW = Math.round(srcW * scale);
  const offsetX = Math.round((CANVAS_W - placedW) / 2);
  // Top padding: 18% of canvas → ~184px of sky above the figure's head.
  // Bottom padding: 4% → just a small floor strip (figure already includes shoes).
  const offsetY = Math.round(CANVAS_H * 0.18);

  console.log(`  Canvas: ${CANVAS_W}x${CANVAS_H}`);
  console.log(`  Portrait placed: ${placedW}x${placedH} at x=${offsetX}, y=${offsetY}`);
  console.log(`  Headroom above: ${offsetY}px | Floor below: ${CANVAS_H - offsetY - placedH}px`);

  // Resize portrait to placement size
  const resizedPortraitBuf = await sharp(src)
    .resize({ width: placedW, height: placedH, kernel: "lanczos3" })
    .toBuffer();

  // Sample average color of portrait's leftmost & rightmost columns to use as
  // canvas background (so seams blend better even before FLUX paints).
  const { data: pData, info: pInfo } = await sharp(resizedPortraitBuf)
    .raw()
    .toBuffer({ resolveWithObject: true });
  let lr = 0, lg = 0, lb = 0, rr = 0, rg = 0, rb = 0;
  for (let y = 0; y < pInfo.height; y++) {
    const li = y * pInfo.width * 3;
    lr += pData[li]; lg += pData[li + 1]; lb += pData[li + 2];
    const ri = (y * pInfo.width + pInfo.width - 1) * 3;
    rr += pData[ri]; rg += pData[ri + 1]; rb += pData[ri + 2];
  }
  const n = pInfo.height;
  const avgL = { r: Math.round(lr / n), g: Math.round(lg / n), b: Math.round(lb / n) };
  const avgR = { r: Math.round(rr / n), g: Math.round(rg / n), b: Math.round(rb / n) };
  const avg = {
    r: Math.round((avgL.r + avgR.r) / 2),
    g: Math.round((avgL.g + avgR.g) / 2),
    b: Math.round((avgL.b + avgR.b) / 2),
  };
  console.log(`  Edge avg color used as fill seed:`, avg);

  // Compose canvas: avg-color background + centered portrait at vertical offset
  const canvasPath = "Images/_outpaint-canvas.jpg";
  await sharp({
    create: { width: CANVAS_W, height: CANVAS_H, channels: 3, background: avg },
  })
    .composite([{ input: resizedPortraitBuf, top: offsetY, left: offsetX }])
    .jpeg({ quality: 95 })
    .toFile(canvasPath);

  // Build mask: black where portrait sits (preserve), white everywhere else
  // (top sky, bottom floor, and both sides — all to be outpainted by FLUX).
  // Feathered overlap of ~12px around the figure so FLUX blends the seams.
  const FEATHER = 12;
  const maskPath = "Images/_outpaint-mask.png";
  const maskSvg = `
    <svg width="${CANVAS_W}" height="${CANVAS_H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${CANVAS_W}" height="${CANVAS_H}" fill="white"/>
      <rect x="${offsetX + FEATHER}" y="${offsetY + FEATHER}"
            width="${placedW - FEATHER * 2}" height="${placedH - FEATHER * 2}"
            fill="black"/>
    </svg>`;
  await sharp(Buffer.from(maskSvg)).png().toFile(maskPath);
  console.log(`  Mask written: ${maskPath}`);

  const canvasBuf = fs.readFileSync(canvasPath);
  const maskBuf = fs.readFileSync(maskPath);
  const canvasDataUri = `data:image/jpeg;base64,${canvasBuf.toString("base64")}`;
  const maskDataUri = `data:image/png;base64,${maskBuf.toString("base64")}`;
  console.log(`  Canvas size: ${Math.round(canvasBuf.length / 1024)} KB`);
  console.log(`  Mask size: ${Math.round(maskBuf.length / 1024)} KB`);

  const prompt =
    "A painterly oil-on-canvas heritage landscape backdrop in deep moody " +
    "evening tones, surrounding a centered figure on all sides. Above: warm " +
    "sienna and umber painted sky with soft cloud forms, the upper portion " +
    "of distant trees, atmospheric haze. Sides: continuing rolling painted " +
    "landscape with distant trees, terrain, and horizon line at mid-frame. " +
    "Below: dark stained wooden plank floor in the foreground. Same painterly " +
    "brushwork, lighting direction, and color palette as the existing center " +
    "of the image. Editorial fashion photography backdrop, cinematic, " +
    "Renaissance painting style. Absolutely no text, no figures, no people " +
    "anywhere — only landscape backdrop, sky, and wooden floor.";

  console.log("\n🎨 Calling FLUX Fill Pro for horizontal outpainting...");
  const prediction = await replicate.predictions.create({
    model: "black-forest-labs/flux-fill-pro",
    input: {
      image: canvasDataUri,
      mask: maskDataUri,
      prompt,
      steps: 50,
      guidance: 60,
      output_format: "jpg",
      safety_tolerance: 2,
      prompt_upsampling: false,
    },
  });
  console.log(`  Prediction: ${prediction.id}`);
  const result = await poll(prediction.id);

  if (result.status !== "succeeded") {
    console.error("❌ FLUX Fill failed:", result.error);
    process.exit(1);
  }

  const outpaintUrl = extractUrl(result.output);
  if (!outpaintUrl) {
    console.error("❌ No URL in output:", result.output);
    process.exit(1);
  }

  const outpaintedPath = "Images/_outpainted.jpg";
  console.log(`\n📥 Downloading outpainted result...`);
  await downloadFile(outpaintUrl, outpaintedPath);
  const opStat = fs.statSync(outpaintedPath);
  console.log(`  ✓ Outpainted (${Math.round(opStat.size / 1024)} KB)`);

  // Upscale 2x with Real-ESRGAN for final crispness
  console.log("\n🔍 Upscaling 2x with Real-ESRGAN...");
  const upBuf = fs.readFileSync(outpaintedPath);
  const upDataUri = `data:image/jpeg;base64,${upBuf.toString("base64")}`;
  const upPrediction = await replicate.predictions.create({
    version: "f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
    input: { image: upDataUri, scale: 2, face_enhance: true },
  });
  console.log(`  Prediction: ${upPrediction.id}`);
  const upResult = await poll(upPrediction.id);

  let finalSourcePath = outpaintedPath;
  if (upResult.status === "succeeded") {
    const upUrl = extractUrl(upResult.output);
    if (upUrl) {
      const upscaledPath = "Images/_outpainted-2x.jpg";
      await downloadFile(upUrl, upscaledPath);
      const upStat = fs.statSync(upscaledPath);
      console.log(`  ✓ Upscaled (${Math.round(upStat.size / 1024)} KB)`);
      finalSourcePath = upscaledPath;
    }
  } else {
    console.warn(`  ⚠ Upscale failed (${upResult.status}) — using non-upscaled output.`);
  }

  // Re-encode at high quality with 4:4:4 chroma for final delivery
  const finalPath = path.join(outDir, "home-hero-landscape.jpg");
  await sharp(finalSourcePath)
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(finalPath);
  const finalMeta = await sharp(finalPath).metadata();
  const finalStat = fs.statSync(finalPath);
  console.log(
    `\n✅ Final landscape hero saved: ${finalPath}\n   ${finalMeta.width}x${finalMeta.height}, ${Math.round(finalStat.size / 1024)} KB`,
  );

  // Cleanup temp files
  for (const p of [canvasPath, maskPath, outpaintedPath, "Images/_outpainted-2x.jpg"]) {
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
