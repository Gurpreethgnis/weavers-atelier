import Replicate from "replicate";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import https from "https";

dotenv.config({ path: ".env.local" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

console.log("API Token loaded:", process.env.REPLICATE_API_TOKEN ? "Yes" : "No");

function imageToDataUri(imagePath: string): string {
  const absolutePath = path.resolve(imagePath);
  const imageBuffer = fs.readFileSync(absolutePath);
  const base64 = imageBuffer.toString("base64");
  return `data:image/jpeg;base64,${base64}`;
}

async function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location!, (redirectResponse) => {
          redirectResponse.pipe(file);
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
    }).on("error", (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const sourceImage = "Images/662884684_18053792495709595_1884225011447521891_n.jpg";
  const outputDir = path.join(process.cwd(), "public", "videos", "studio-walk");
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("\n🎬 Creating cinemagraph from your real image...\n");
  console.log(`Source: ${sourceImage}`);
  
  const imageDataUri = imageToDataUri(sourceImage);
  console.log("Image loaded (size:", Math.round(imageDataUri.length / 1024), "KB)");

  // Use Kling with very specific prompt to preserve the image
  console.log("\n⏳ Using Kling with strict image preservation...");
  console.log("   Prompt designed to keep your exact image with minimal motion.");
  
  try {
    const prediction = await replicate.predictions.create({
      model: "kwaivgi/kling-v1.6-standard",
      input: {
        // Very specific prompt to preserve the original image
        prompt: "Static fashion portrait. A man in black embroidered bandhgala jacket standing completely still against a painted landscape backdrop. Only subtle ambient motion: very slight fabric shimmer from embroidery details, almost imperceptible breathing. The pose, face, clothing, and background must remain exactly as shown. Ultra-high fidelity to source image. No camera movement.",
        start_image: imageDataUri,
        duration: 5,
        aspect_ratio: "9:16", // Portrait orientation
        negative_prompt: "different person, different outfit, different background, camera motion, panning, zooming, walking, moving, changing pose, different angle, morphing, transformation",
      },
    });

    console.log("Prediction created:", prediction.id);

    let result = prediction;
    let attempts = 0;
    const maxAttempts = 60;

    while (result.status !== "succeeded" && result.status !== "failed" && attempts < maxAttempts) {
      await sleep(5000);
      result = await replicate.predictions.get(prediction.id);
      console.log(`  Polling... Status: ${result.status} (attempt ${++attempts})`);
    }

    if (result.status === "succeeded") {
      console.log("\n✓ Video generated");
      
      let videoUrl: string | null = null;
      const output = result.output;
      
      if (typeof output === "string") {
        videoUrl = output;
      } else if (Array.isArray(output) && output.length > 0) {
        videoUrl = String(output[0]);
      }

      if (videoUrl && videoUrl.startsWith("http")) {
        const videoPath = path.join(outputDir, "studio-walk.mp4");
        console.log(`\n📥 Downloading...`);
        await downloadFile(videoUrl, videoPath);
        console.log("✓ Video saved");

        const posterPath = path.join(outputDir, "studio-walk-poster.jpg");
        fs.copyFileSync(sourceImage, posterPath);
        console.log("✓ Poster set");

        console.log("\n✅ Done! Check the homepage.\n");
      }
    } else {
      console.log("Generation failed:", result.error);
    }

  } catch (error: unknown) {
    console.error("Error:", (error as Error).message);
  }
}

main().catch(console.error);
