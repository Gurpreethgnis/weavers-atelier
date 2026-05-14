import Replicate from "replicate";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import https from "https";
import sharp from "sharp";

dotenv.config({ path: ".env.local" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location!, (r2) => {
          r2.pipe(file);
          file.on("finish", () => { file.close(); resolve(); });
        });
      } else {
        response.pipe(file);
        file.on("finish", () => { file.close(); resolve(); });
      }
    }).on("error", (err) => { fs.unlink(destPath, () => {}); reject(err); });
  });
}

async function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function poll(id: string) {
  let r = await replicate.predictions.get(id);
  let n = 0;
  while (r.status !== "succeeded" && r.status !== "failed" && n < 60) {
    await sleep(4000);
    r = await replicate.predictions.get(id);
    console.log(`  ${r.status}... (${++n})`);
  }
  return r;
}

function extractUrl(output: unknown): string | null {
  if (typeof output === "string") return output;
  if (Array.isArray(output) && output.length > 0) return String(output[0]);
  if (output && typeof output === "object") {
    const o = output as Record<string, unknown>;
    for (const k of ["video", "url", "output", "image"]) {
      if (typeof o[k] === "string") return o[k] as string;
    }
  }
  return null;
}

async function main() {
  const croppedPath = "Images/_temp-hero-cropped.jpg";
  const sourceImage = "Images/662884684_18053792495709595_1884225011447521891_n.jpg";
  const outputDir = path.join(process.cwd(), "public", "images", "hero");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  // Re-crop (idempotent)
  console.log("✂  Cropping text out of source...");
  const meta = await sharp(sourceImage).metadata();
  const w = meta.width!;
  const h = meta.height!;
  const cropTop = Math.round(h * 0.14);
  await sharp(sourceImage)
    .extract({ left: 0, top: cropTop, width: w, height: h - cropTop })
    .jpeg({ quality: 95 })
    .toFile(croppedPath);
  console.log(`  ✓ Cropped: ${w}x${h - cropTop}`);

  const buf = fs.readFileSync(croppedPath);
  const dataUri = `data:image/jpeg;base64,${buf.toString("base64")}`;
  console.log(`  Size: ${Math.round(buf.length / 1024)} KB`);

  // Approach: Real-ESRGAN for clean 2x upscale + detail enhancement.
  // This is true enhancement — it doesn't reimagine the subject.
  console.log("\n🎨 Enhancing with Real-ESRGAN (faithful detail enhancement, no subject change)...");

  try {
    const prediction = await replicate.predictions.create({
      version: "f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
      input: {
        image: dataUri,
        scale: 2,
        face_enhance: true,
      },
    });
    console.log("Prediction:", prediction.id);

    const result = await poll(prediction.id);

    if (result.status === "succeeded") {
      const url = extractUrl(result.output);
      if (url && url.startsWith("http")) {
        const finalPath = path.join(outputDir, "home-hero.jpg");
        console.log(`\n📥 Downloading → ${finalPath}`);
        await downloadFile(url, finalPath);
        const stat = fs.statSync(finalPath);
        console.log(`✓ Enhanced hero saved (${Math.round(stat.size / 1024)} KB)`);
        fs.copyFileSync(croppedPath, path.join(outputDir, "home-hero-original.jpg"));
        fs.unlinkSync(croppedPath);
        console.log("\n✅ Done.\n");
        return;
      }
    }
    console.log("Real-ESRGAN failed:", result.error);
  } catch (e) {
    console.error("Real-ESRGAN error:", (e as Error).message);
  }

  // Fallback: cropped original
  console.log("\n⚠ Enhancement failed — using cropped original.");
  fs.copyFileSync(croppedPath, path.join(outputDir, "home-hero.jpg"));
  fs.unlinkSync(croppedPath);
}

main().catch(console.error);
