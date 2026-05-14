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

  console.log("\n⏳ Using Stable Video Diffusion for realistic image animation...");
  
  try {
    // Try stability-ai/stable-video-diffusion - specifically designed for image-to-video
    const output = await replicate.run(
      "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb472816fd4af51f3149fa7a9e0b5ffcf1b8172438",
      {
        input: {
          input_image: imageDataUri,
          video_length: "25_frames_with_svd_xt",
          sizing_strategy: "maintain_aspect_ratio",
          motion_bucket_id: 40, // Lower = more subtle motion (range 1-255)
          fps: 12,
          cond_aug: 0.02, // Lower = more faithful to original image
        },
      }
    );

    console.log("API Response type:", typeof output);
    console.log("API Response:", JSON.stringify(output, null, 2).substring(0, 500));
    
    let videoUrl: string | null = null;
    if (typeof output === "string") {
      videoUrl = output;
    } else if (Array.isArray(output) && output.length > 0) {
      videoUrl = output[0] as string;
    } else if (output && typeof output === "object" && "url" in (output as object)) {
      videoUrl = (output as { url: string }).url;
    }

    if (!videoUrl) {
      throw new Error("Could not extract video URL");
    }

    console.log("✓ Video generated successfully");
    console.log("URL:", videoUrl.substring(0, 80) + "...");
    
    const videoPath = path.join(outputDir, "studio-walk.mp4");
    console.log(`\n📥 Downloading to ${videoPath}...`);
    await downloadFile(videoUrl, videoPath);
    console.log("✓ Video saved");

    const posterPath = path.join(outputDir, "studio-walk-poster.jpg");
    fs.copyFileSync(sourceImage, posterPath);
    console.log("✓ Poster set from source image");

    console.log("\n✅ Done! Your photo is now an animated fashion video with subtle motion.\n");

  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error:", err.message || err);
    
    // If SVD fails, try Luma Dream Machine as fallback
    console.log("\n🔄 Trying alternative model (Luma Dream Machine)...");
    
    try {
      const output = await replicate.run(
        "luma/dream-machine",
        {
          input: {
            image: imageDataUri,
            prompt: "Subtle fashion editorial cinemagraph. Gentle fabric movement in soft breeze. Elegant minimal motion. The model stands mostly still. Premium high fashion photography. Cinematic lighting.",
          },
        }
      );
      
      console.log("Luma Response:", JSON.stringify(output, null, 2).substring(0, 500));
      
      let videoUrl: string | null = null;
      if (typeof output === "string") {
        videoUrl = output;
      } else if (Array.isArray(output) && output.length > 0) {
        videoUrl = output[0] as string;
      }
      
      if (videoUrl) {
        const videoPath = path.join(outputDir, "studio-walk.mp4");
        await downloadFile(videoUrl, videoPath);
        console.log("✓ Video saved with Luma");
        
        const posterPath = path.join(outputDir, "studio-walk-poster.jpg");
        fs.copyFileSync(sourceImage, posterPath);
        console.log("✓ Done!");
      }
    } catch (lumaError) {
      console.error("Luma also failed:", lumaError);
    }
  }
}

main().catch(console.error);
