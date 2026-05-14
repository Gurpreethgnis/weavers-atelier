import Replicate from "replicate";
import * as fs from "fs";
import * as path from "path";
import * as https from "https";
import * as http from "http";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

console.log(
  "API Token loaded:",
  process.env.REPLICATE_API_TOKEN ? "Yes" : "No"
);

interface ImageSpec {
  filename: string;
  prompt: string;
  folder: string;
}

const imageSpecs: ImageSpec[] = [
  // Missing atelier images
  {
    folder: "atelier",
    filename: "alteration-process.jpg",
    prompt:
      "Tailor making alterations to a premium suit, close-up of hands adjusting fabric at sewing machine, warm workshop lighting, craftsmanship detail, editorial photography",
  },
  {
    folder: "atelier",
    filename: "bespoke-crafting.jpg",
    prompt:
      "Master tailor crafting bespoke garment by hand, focused work at cutting table, premium fabrics, warm natural lighting, artisanal menswear atelier, editorial photography",
  },
  {
    folder: "atelier",
    filename: "studio-interior.jpg",
    prompt:
      "Modern premium menswear atelier interior, clean minimalist design, fabric displays on shelves, fitting area with mirrors, warm ambient lighting, editorial interior photography",
  },

  // Missing logistics image
  {
    folder: "logistics",
    filename: "global-map.jpg",
    prompt:
      "Elegant minimalist world map with shipping routes indicated by subtle gold lines, premium packaging boxes in foreground, dark sophisticated background, editorial product photography",
  },

  // Missing trousers detail
  {
    folder: "trousers",
    filename: "trousers-detail.jpg",
    prompt:
      "Close-up detail shot of premium charcoal wool trousers showing fine stitching and fabric texture, perfect crease line, editorial menswear photography, shallow depth of field",
  },

  // Fit guide images
  {
    folder: "fit-guide",
    filename: "measurement-body.jpg",
    prompt:
      "Professional tailor taking body measurements of client, measuring tape around chest, clean modern atelier setting, natural lighting, editorial fashion photography",
  },
  {
    folder: "fit-guide",
    filename: "measurement-garment.jpg",
    prompt:
      "Tailor measuring garment on flat surface, measuring tape along sleeve, premium shirt laid flat, clean workshop surface, product photography",
  },
  {
    folder: "fit-guide",
    filename: "video-fitting.jpg",
    prompt:
      "Modern video consultation setup with ring light and phone stand, measuring tape and fabric swatches visible, clean professional home setting, lifestyle photography",
  },
];

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const file = fs.createWriteStream(filepath);

    protocol
      .get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          downloadImage(response.headers.location!, filepath)
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

async function generateImage(spec: ImageSpec): Promise<boolean> {
  const outputDir = path.join(process.cwd(), "public", "images", spec.folder);
  const outputPath = path.join(outputDir, spec.filename);

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    if (stats.size > 1000) {
      console.log(`✓ Already exists: ${spec.folder}/${spec.filename}`);
      return true;
    }
  }

  console.log(`⏳ Generating: ${spec.folder}/${spec.filename}`);

  try {
    const output = await replicate.run("black-forest-labs/flux-schnell", {
      input: {
        prompt: spec.prompt,
        num_outputs: 1,
        aspect_ratio: "3:4",
        output_format: "webp",
        output_quality: 90,
      },
    });

    // Handle FileOutput object
    let imageUrl: string | undefined;

    if (Array.isArray(output) && output.length > 0) {
      const firstOutput = output[0];
      if (typeof firstOutput === "string") {
        imageUrl = firstOutput;
      } else if (firstOutput && typeof firstOutput === "object") {
        // It's a FileOutput object, get the URL
        const fileOutput = firstOutput as { url?: () => { href: string } };
        if (fileOutput.url) {
          imageUrl = fileOutput.url().href;
        }
      }
    }

    if (imageUrl) {
      // Save both jpg and webp versions
      await downloadImage(imageUrl, outputPath);
      const webpPath = outputPath.replace(".jpg", ".webp");
      await downloadImage(imageUrl, webpPath);
      
      console.log(`✓ Generated: ${spec.folder}/${spec.filename}`);
      return true;
    } else {
      console.error(
        `✗ Could not extract URL for ${spec.filename}:`,
        typeof output,
        output
      );
      return false;
    }
  } catch (error: unknown) {
    const apiError = error as { status?: number; message?: string };
    if (apiError.status === 429) {
      console.log(`⏸ Rate limited, waiting 15 seconds...`);
      await sleep(15000);
      return generateImage(spec); // Retry
    }
    console.error(`✗ Failed: ${spec.folder}/${spec.filename}`, error);
    return false;
  }
}

async function main() {
  console.log("Starting batch 2 image generation...\n");
  console.log(`Total images to generate: ${imageSpecs.length}\n`);

  let generated = 0;
  let failed = 0;

  for (let i = 0; i < imageSpecs.length; i++) {
    const spec = imageSpecs[i];
    console.log(`[${i + 1}/${imageSpecs.length}]`);

    const result = await generateImage(spec);
    if (result) {
      generated++;
    } else {
      failed++;
    }

    // Rate limiting: wait 12 seconds between requests
    if (i < imageSpecs.length - 1) {
      console.log("⏳ Waiting 12s for rate limit...\n");
      await sleep(12000);
    }
  }

  console.log("\n========================================");
  console.log(`✓ Batch 2 generation complete!`);
  console.log(`  Generated: ${generated}`);
  console.log(`  Failed: ${failed}`);
  console.log("========================================");
}

main().catch(console.error);
