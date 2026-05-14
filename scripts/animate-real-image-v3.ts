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
  const ext = path.extname(imagePath).toLowerCase();
  const mimeType = ext === ".png" ? "image/png" : "image/jpeg";
  return `data:${mimeType};base64,${base64}`;
}

async function downloadFile(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const request = https.get(url, (response) => {
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
    });
    request.on("error", (err) => {
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

  // Try Kling v1.6 - known for high quality image-to-video
  console.log("\n⏳ Using Kling v1.6 for realistic image animation...");
  console.log("   This model excels at natural, subtle motion from still images.");
  
  try {
    const output = await replicate.run(
      "kwaivgi/kling-v1.6-pro",
      {
        input: {
          prompt: "Subtle elegant movement. Gentle fabric sway. Soft hair motion in light breeze. The model breathes naturally. Fashion photography cinemagraph. Minimal, sophisticated motion. Premium editorial style. Keep the pose mostly static with only environmental movement.",
          start_image: imageDataUri,
          duration: 5,
          aspect_ratio: "9:16", // Portrait for the fashion image
          negative_prompt: "fast motion, jumping, running, dramatic movement, blur, distortion, morphing, unnatural",
        },
      }
    );

    console.log("API Response type:", typeof output);
    
    let videoUrl: string | null = null;
    if (typeof output === "string") {
      videoUrl = output;
    } else if (Array.isArray(output) && output.length > 0) {
      videoUrl = String(output[0]);
    } else if (output && typeof output === "object") {
      const outputObj = output as Record<string, unknown>;
      if ("video" in outputObj && typeof outputObj.video === "string") {
        videoUrl = outputObj.video;
      } else if ("url" in outputObj && typeof outputObj.url === "string") {
        videoUrl = outputObj.url;
      } else if ("output" in outputObj && typeof outputObj.output === "string") {
        videoUrl = outputObj.output;
      }
    }

    if (!videoUrl || videoUrl === "[object Object]") {
      console.log("Full output:", JSON.stringify(output, null, 2));
      throw new Error("Could not extract video URL");
    }

    console.log("✓ Video generated successfully");
    console.log("URL:", videoUrl.substring(0, 100) + "...");
    
    const videoPath = path.join(outputDir, "studio-walk.mp4");
    console.log(`\n📥 Downloading to ${videoPath}...`);
    await downloadFile(videoUrl, videoPath);
    console.log("✓ Video saved");

    const posterPath = path.join(outputDir, "studio-walk-poster.jpg");
    fs.copyFileSync(sourceImage, posterPath);
    console.log("✓ Poster set from source image");

    console.log("\n✅ Done! Your photo is now an animated fashion video.\n");

  } catch (error: unknown) {
    console.error("Kling error:", (error as Error).message);
    
    // Fallback: Try Wan 2.1 Image-to-Video
    console.log("\n🔄 Trying Wan 2.1 Image-to-Video...");
    
    try {
      await sleep(5000); // Brief pause
      
      const output = await replicate.run(
        "wan-video/wan-2.1-i2v-480p",
        {
          input: {
            image: imageDataUri,
            prompt: "Subtle fashion photography motion. Gentle fabric movement in soft breeze. Model breathes naturally with minimal movement. High fashion cinemagraph. Elegant, sophisticated, minimal motion. Premium editorial style.",
            negative_prompt: "fast motion, jumping, blur, distortion",
            num_frames: 81,
            guidance_scale: 5,
          },
        }
      );

      console.log("Wan Response type:", typeof output);
      
      let videoUrl: string | null = null;
      if (typeof output === "string") {
        videoUrl = output;
      } else if (Array.isArray(output) && output.length > 0) {
        videoUrl = String(output[0]);
      }

      if (videoUrl && videoUrl !== "[object Object]") {
        const videoPath = path.join(outputDir, "studio-walk.mp4");
        await downloadFile(videoUrl, videoPath);
        console.log("✓ Video saved with Wan 2.1");
        
        const posterPath = path.join(outputDir, "studio-walk-poster.jpg");
        fs.copyFileSync(sourceImage, posterPath);
        console.log("✅ Done!");
      } else {
        console.log("Wan output:", JSON.stringify(output, null, 2));
      }
    } catch (wanError) {
      console.error("Wan error:", (wanError as Error).message);
    }
  }
}

main().catch(console.error);
