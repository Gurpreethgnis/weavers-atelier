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
    const protocol = url.startsWith("https") ? https : require("http");
    
    protocol.get(url, (response: { statusCode?: number; headers: { location?: string }; pipe: (arg0: fs.WriteStream) => void }) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        protocol.get(response.headers.location!, (redirectResponse: { pipe: (arg0: fs.WriteStream) => void }) => {
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
    }).on("error", (err: Error) => {
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

  console.log("\n🎬 Animating real image into fashion video...\n");
  console.log(`Source: ${sourceImage}`);
  
  const imageDataUri = imageToDataUri(sourceImage);
  console.log("Image converted to data URI (size:", Math.round(imageDataUri.length / 1024), "KB)");

  // Use the prediction API directly with async waiting
  console.log("\n⏳ Using Kling v1.6 Standard with async polling...");
  
  try {
    // Create prediction
    const prediction = await replicate.predictions.create({
      model: "kwaivgi/kling-v1.6-standard",
      input: {
        prompt: "A fashion model in elegant black embroidered bandhgala standing still. Subtle movement: gentle fabric sway in light breeze, soft hair movement. Elegant minimal motion. Premium high fashion photography style. Cinematic lighting. The subject stays mostly still with only environmental micro-movements.",
        start_image: imageDataUri,
        duration: 5,
        aspect_ratio: "9:16",
        negative_prompt: "fast motion, running, jumping, blur, distortion, morphing face",
      },
    });

    console.log("Prediction created:", prediction.id);
    console.log("Status:", prediction.status);

    // Poll for completion
    let result = prediction;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max

    while (result.status !== "succeeded" && result.status !== "failed" && attempts < maxAttempts) {
      await sleep(5000);
      result = await replicate.predictions.get(prediction.id);
      console.log(`  Polling... Status: ${result.status} (attempt ${++attempts})`);
    }

    if (result.status === "succeeded") {
      console.log("\n✓ Video generated successfully");
      console.log("Output:", JSON.stringify(result.output, null, 2));
      
      let videoUrl: string | null = null;
      const output = result.output;
      
      if (typeof output === "string") {
        videoUrl = output;
      } else if (Array.isArray(output) && output.length > 0) {
        videoUrl = String(output[0]);
      } else if (output && typeof output === "object") {
        const outputObj = output as Record<string, unknown>;
        videoUrl = (outputObj.video || outputObj.url || outputObj.output) as string;
      }

      if (videoUrl && videoUrl.startsWith("http")) {
        const videoPath = path.join(outputDir, "studio-walk.mp4");
        console.log(`\n📥 Downloading to ${videoPath}...`);
        await downloadFile(videoUrl, videoPath);
        console.log("✓ Video saved");

        const posterPath = path.join(outputDir, "studio-walk-poster.jpg");
        fs.copyFileSync(sourceImage, posterPath);
        console.log("✓ Poster set from source image");

        console.log("\n✅ Done! Your photo is now an animated fashion video.\n");
      } else {
        console.log("Could not extract video URL from output");
      }
    } else {
      console.log("Generation failed:", result.error || result.status);
    }

  } catch (error: unknown) {
    console.error("Error:", (error as Error).message);
  }
}

main().catch(console.error);
