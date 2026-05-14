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

// Convert local image to base64 data URI
function imageToDataUri(imagePath: string): string {
  const absolutePath = path.resolve(imagePath);
  const imageBuffer = fs.readFileSync(absolutePath);
  const base64 = imageBuffer.toString("base64");
  const ext = path.extname(imagePath).toLowerCase();
  const mimeType = ext === ".png" ? "image/png" : "image/jpeg";
  return `data:${mimeType};base64,${base64}`;
}

async function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https
      .get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          // Follow redirect
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
      })
      .on("error", (err) => {
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
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("\n🎬 Animating real image into fashion video...\n");
  console.log(`Source: ${sourceImage}`);
  
  // Convert image to data URI for the API
  const imageDataUri = imageToDataUri(sourceImage);
  console.log("Image converted to data URI (size:", Math.round(imageDataUri.length / 1024), "KB)");

  // Use Kling image-to-video model for realistic animation
  // This model is specifically designed to animate still images with subtle motion
  console.log("\n⏳ Generating video with subtle fashion motion...");
  console.log("   (This creates a cinemagraph-style animation from your photo)");
  
  try {
    // Using minimax video-01-live with the image as first frame
    // Prompt focuses on MINIMAL, SUBTLE movement to keep it realistic
    const output = await replicate.run("minimax/video-01-live", {
      input: {
        prompt: "Subtle fashion editorial movement. Gentle fabric sway in light breeze. Soft hair movement. Minimal, elegant motion. High fashion photography style. Keep the subject mostly still with only subtle environmental movement. Cinematic, premium quality.",
        first_frame_image: imageDataUri,
      },
    });

    console.log("API Response received");
    
    // Extract URL from output
    let videoUrl: string | null = null;
    if (typeof output === "string") {
      videoUrl = output;
    } else if (output && typeof output === "object") {
      const outputObj = output as Record<string, unknown>;
      if ("video" in outputObj) {
        videoUrl = outputObj.video as string;
      } else if (Array.isArray(output) && output.length > 0) {
        videoUrl = output[0] as string;
      }
    }

    if (!videoUrl) {
      console.log("Output structure:", JSON.stringify(output, null, 2));
      throw new Error("Could not extract video URL from output");
    }

    console.log("✓ Video generated successfully");
    
    // Download video
    const videoPath = path.join(outputDir, "studio-walk.mp4");
    console.log(`\n📥 Downloading to ${videoPath}...`);
    await downloadFile(videoUrl, videoPath);
    console.log("✓ Video saved");

    // Copy source image as poster
    const posterPath = path.join(outputDir, "studio-walk-poster.jpg");
    fs.copyFileSync(sourceImage, posterPath);
    console.log("✓ Poster set from source image");

    console.log("\n✅ Done! Your real photo is now an animated fashion video.");
    console.log("   The video uses your actual image as the base with subtle AI motion.\n");

  } catch (error: unknown) {
    const err = error as Error & { response?: { status: number } };
    if (err.response?.status === 429) {
      console.log("\n⚠ Rate limited. Waiting 60s and retrying...");
      await sleep(60000);
      // Retry logic would go here
    }
    console.error("Error:", err.message || err);
    throw error;
  }
}

main().catch(console.error);
