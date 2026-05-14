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

console.log("API Token loaded:", process.env.REPLICATE_API_TOKEN ? "Yes" : "No");

async function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https
      .get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          https.get(response.headers.location!, (r2) => {
            r2.pipe(file);
            file.on("finish", () => {
              file.close();
              resolve();
            });
          });
        } else {
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            resolve();
          });
        }
      })
      .on("error", (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
  });
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const sourceImage = "Images/662884684_18053792495709595_1884225011447521891_n.jpg";
  const croppedPath = "Images/_temp-hero-cropped.jpg";
  const outputDir = path.join(process.cwd(), "public", "images", "hero");

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  // Step 1: Crop out the "THE NEW HERITAGE" text at the top.
  // The text occupies roughly the top ~12% of the image. Crop conservatively to ~14%.
  console.log("\n✂  Cropping out 'THE NEW HERITAGE' text from the top...");
  const meta = await sharp(sourceImage).metadata();
  const w = meta.width!;
  const h = meta.height!;
  const cropTop = Math.round(h * 0.14);
  console.log(`  Source: ${w}x${h}  →  Crop top ${cropTop}px`);

  await sharp(sourceImage)
    .extract({ left: 0, top: cropTop, width: w, height: h - cropTop })
    .jpeg({ quality: 95 })
    .toFile(croppedPath);
  console.log("  ✓ Cropped image saved");

  // Step 2: Upload cropped image as data URI and run enhancement via Real-ESRGAN
  const buf = fs.readFileSync(croppedPath);
  const dataUri = `data:image/jpeg;base64,${buf.toString("base64")}`;
  console.log(`\n  Cropped size: ${Math.round(buf.length / 1024)} KB`);

  // Try Flux Kontext Pro — image-to-image with prompt, preserves subject identity well
  console.log("\n🎨 Enhancing with Flux Kontext Pro (image-to-image, preserves subject)...");

  try {
    const prediction = await replicate.predictions.create({
      model: "black-forest-labs/flux-kontext-pro",
      input: {
        input_image: dataUri,
        prompt:
          "High fashion editorial photograph of the same man in the same black embroidered bandhgala jacket and trousers, standing in the same pose against the same painted Renaissance landscape backdrop. Enhanced clarity, professional studio lighting, crisp embroidery detail, magazine-quality, Vogue editorial, photorealistic, sharp focus, fine art photography.",
        output_format: "jpg",
        output_quality: 95,
        safety_tolerance: 2,
        aspect_ratio: "match_input_image",
      },
    });

    console.log("Prediction:", prediction.id);
    let result = prediction;
    let attempts = 0;
    while (
      result.status !== "succeeded" &&
      result.status !== "failed" &&
      attempts < 60
    ) {
      await sleep(4000);
      result = await replicate.predictions.get(prediction.id);
      console.log(`  ${result.status}... (${++attempts})`);
    }

    if (result.status === "succeeded") {
      const output = result.output;
      let url: string | null = null;
      if (typeof output === "string") url = output;
      else if (Array.isArray(output) && output.length > 0) url = String(output[0]);

      if (url && url.startsWith("http")) {
        const finalPath = path.join(outputDir, "home-hero.jpg");
        console.log(`\n📥 Downloading enhanced image → ${finalPath}`);
        await downloadFile(url, finalPath);
        console.log("✓ Enhanced hero saved");

        // Also keep cropped original as a safety fallback
        const fallbackPath = path.join(outputDir, "home-hero-original.jpg");
        fs.copyFileSync(croppedPath, fallbackPath);
        console.log("✓ Original cropped saved as fallback");

        // Cleanup
        fs.unlinkSync(croppedPath);
        console.log("\n✅ Done.\n");
        return;
      }
    }
    console.log("Flux Kontext failed:", result.error || result.status);
  } catch (e) {
    console.error("Flux Kontext error:", (e as Error).message);
  }

  // Fallback: just use the cropped real image
  console.log("\n⚠ Enhancement failed — falling back to cropped real image.");
  const finalPath = path.join(outputDir, "home-hero.jpg");
  fs.copyFileSync(croppedPath, finalPath);
  fs.unlinkSync(croppedPath);
  console.log("✓ Cropped real image saved as hero.");
}

main().catch(console.error);
