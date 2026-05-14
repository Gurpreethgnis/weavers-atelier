import Replicate from "replicate";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

console.log("API Token loaded:", process.env.REPLICATE_API_TOKEN ? "Yes" : "No");

interface VideoSpec {
  folder: string;
  prompt: string;
}

const videoSpecs: VideoSpec[] = [
  {
    folder: "studio-walk",
    prompt: "Cinematic slow walk through a premium menswear atelier studio, warm ambient lighting, fabric rolls and tailoring equipment visible, luxury fashion editorial style, smooth camera movement, 4K quality",
  },
  {
    folder: "tailoring-detail-1",
    prompt: "Close-up of tailor's hands carefully stitching fabric on premium menswear garment, warm workshop lighting, detail of needle and thread, craftsmanship focus, slow deliberate movements, editorial fashion video",
  },
  {
    folder: "tailoring-detail-2",
    prompt: "Close-up of tailor measuring and marking premium wool fabric with chalk, precise hand movements, atelier setting, warm lighting, craftsmanship documentary style",
  },
  {
    folder: "shirt-detail-1",
    prompt: "Close-up of premium white dress shirt collar being adjusted and smoothed by hand, crisp fabric texture visible, soft studio lighting, fashion detail video, elegant slow motion",
  },
  {
    folder: "shirt-detail-2",
    prompt: "Detail shot of shirt buttons being fastened on white cotton dress shirt, hands adjusting cuff links, premium menswear styling, warm editorial lighting",
  },
  {
    folder: "denim-detail-1",
    prompt: "Close-up of hands examining raw selvedge denim texture, showing fabric weave and indigo color depth, premium denim craftsmanship, warm studio lighting, slow panning motion",
  },
  {
    folder: "weddingwear-1",
    prompt: "Elegant groom adjusting embroidered sherwani collar in mirror, warm romantic lighting, Indian wedding preparation scene, premium menswear, cinematic slow motion",
  },
  {
    folder: "weddingwear-2",
    prompt: "Close-up of intricate gold embroidery and threadwork on wedding sherwani fabric, shimmering details, luxurious wedding attire, warm ambient lighting, slow reveal",
  },
  {
    folder: "weddingwear-3",
    prompt: "Man putting on premium Nehru jacket for wedding, adjusting lapels, elegant preparation scene, soft natural lighting, refined menswear styling video",
  },
];

async function downloadFile(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(filepath);

    protocol
      .get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          downloadFile(response.headers.location!, filepath)
            .then(resolve)
            .catch(reject);
          return;
        }

        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
  });
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateVideo(spec: VideoSpec): Promise<boolean> {
  const outputDir = path.join(process.cwd(), "public", "videos", spec.folder);
  const mp4Path = path.join(outputDir, `${spec.folder}.mp4`);
  const posterPath = path.join(outputDir, `${spec.folder}-poster.jpg`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`⏳ Generating video: ${spec.folder}`);

  try {
    // Use Luma AI for video generation (image-to-video with prompt)
    // First generate a poster image, then animate it
    console.log(`  → Generating poster image...`);
    
    const imageOutput = await replicate.run("black-forest-labs/flux-schnell", {
      input: {
        prompt: spec.prompt.replace("video", "photograph").replace("motion", "still"),
        num_outputs: 1,
        aspect_ratio: "16:9",
        output_format: "jpg",
        output_quality: 90,
      },
    });

    let posterUrl: string | undefined;
    if (Array.isArray(imageOutput) && imageOutput.length > 0) {
      const firstOutput = imageOutput[0];
      if (typeof firstOutput === "string") {
        posterUrl = firstOutput;
      } else if (firstOutput && typeof firstOutput === "object") {
        const fileOutput = firstOutput as { url?: () => { href: string } };
        if (fileOutput.url) {
          posterUrl = fileOutput.url().href;
        }
      }
    }

    if (!posterUrl) {
      console.error(`✗ Could not generate poster for ${spec.folder}`);
      return false;
    }

    await downloadFile(posterUrl, posterPath);
    console.log(`  ✓ Poster saved`);

    // Now generate video using minimax/video-01-live (fast video generation)
    console.log(`  → Generating video from poster...`);
    
    const videoOutput = await replicate.run("minimax/video-01-live", {
      input: {
        prompt: spec.prompt,
        first_frame_image: posterUrl,
      },
    });

    let videoUrl: string | undefined;
    if (typeof videoOutput === "string") {
      videoUrl = videoOutput;
    } else if (videoOutput && typeof videoOutput === "object") {
      const fileOutput = videoOutput as { url?: () => { href: string } };
      if (fileOutput.url) {
        videoUrl = fileOutput.url().href;
      }
    }

    if (videoUrl) {
      await downloadFile(videoUrl, mp4Path);
      console.log(`✓ Generated: ${spec.folder}`);
      return true;
    } else {
      console.error(`✗ Could not extract video URL for ${spec.folder}`);
      return false;
    }
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string };
    if (apiError.status === 429) {
      console.log(`⏸ Rate limited, waiting 60 seconds...`);
      await sleep(60000);
      return generateVideo(spec);
    }
    console.error(`✗ Failed: ${spec.folder}`, apiError.message || error);
    return false;
  }
}

async function main() {
  console.log("Generating AI videos...\n");
  console.log(`Total videos to generate: ${videoSpecs.length}\n`);

  let generated = 0;
  let failed = 0;

  for (let i = 0; i < videoSpecs.length; i++) {
    const spec = videoSpecs[i];
    console.log(`[${i + 1}/${videoSpecs.length}]`);

    const result = await generateVideo(spec);
    if (result) {
      generated++;
    } else {
      failed++;
    }

    // Wait between requests to avoid rate limiting (video models need more time)
    if (i < videoSpecs.length - 1) {
      console.log("⏳ Waiting 30s for rate limit...\n");
      await sleep(30000);
    }
  }

  console.log("\n========================================");
  console.log(`✓ Video generation complete!`);
  console.log(`  Generated: ${generated}`);
  console.log(`  Failed: ${failed}`);
  console.log("========================================");
}

main().catch(console.error);
