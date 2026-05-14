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
  // Atelier images
  {
    folder: "atelier",
    filename: "void-fragment.jpg",
    prompt:
      "Abstract close-up of luxurious dark fabric with subtle gold thread details, dramatic shadows, editorial fashion photography, premium menswear atelier aesthetic, moody lighting, 4K quality",
  },
  {
    folder: "atelier",
    filename: "craftsmanship-detail.jpg",
    prompt:
      "Close-up of tailor's hands doing precise hand-stitching on premium navy wool fabric, shallow depth of field, warm workshop lighting, artisanal craftsmanship, editorial photography",
  },

  // Process steps (1-5)
  {
    folder: "process",
    filename: "step-1.jpg",
    prompt:
      "Elegant consultation scene in premium menswear atelier, well-dressed man discussing fabric swatches with tailor, natural light, minimalist modern interior, editorial fashion photography",
  },
  {
    folder: "process",
    filename: "step-2.jpg",
    prompt:
      "Professional tailor taking body measurements of client in premium suit, measuring tape around chest, clean modern atelier backdrop, warm lighting, editorial style",
  },
  {
    folder: "process",
    filename: "step-3.jpg",
    prompt:
      "Fabric selection scene showing hands choosing between premium wool swatches in various colors, organized fabric library background, soft natural light, editorial product photography",
  },
  {
    folder: "process",
    filename: "step-4.jpg",
    prompt:
      "Master tailor hand-cutting premium fabric with sharp scissors on large cutting table, precise craftsmanship, workshop setting, dramatic lighting, editorial photography",
  },
  {
    folder: "process",
    filename: "step-5.jpg",
    prompt:
      "Beautifully wrapped bespoke suit package in premium box with tissue paper, black and gold branding, final delivery presentation, clean white background, product photography",
  },

  // Statement pieces
  {
    folder: "statement",
    filename: "embroidery-detail.jpg",
    prompt:
      "Extreme close-up of intricate gold embroidery on dark navy velvet fabric, luxurious threadwork, editorial fashion detail shot, premium menswear, shallow depth of field",
  },

  // Weddingwear
  {
    folder: "weddingwear",
    filename: "sherwani-detail.jpg",
    prompt:
      "Close-up detail of premium ivory sherwani with delicate gold embroidery, intricate collar work, wedding menswear, soft natural lighting, editorial fashion photography",
  },
  {
    folder: "weddingwear",
    filename: "wedding-suits.jpg",
    prompt:
      "Elegant three-piece navy wedding suit on mannequin, premium wool fabric, boutonniere, clean white backdrop, professional product photography, premium menswear",
  },
  {
    folder: "weddingwear",
    filename: "groomsmen.jpg",
    prompt:
      "Group of well-dressed groomsmen in matching charcoal suits walking confidently, modern architecture backdrop, natural daylight, editorial wedding photography",
  },
  {
    folder: "weddingwear",
    filename: "sherwanis.jpg",
    prompt:
      "Premium ivory and gold sherwani on mannequin, intricate embroidery details, Indian wedding menswear, clean studio backdrop, editorial fashion photography",
  },
  {
    folder: "weddingwear",
    filename: "tuxedos.jpg",
    prompt:
      "Classic black tuxedo with satin lapels on mannequin, white dress shirt, black bow tie, formal wedding attire, clean studio lighting, premium menswear photography",
  },
  {
    folder: "weddingwear",
    filename: "bandhgalas.jpg",
    prompt:
      "Elegant navy bandhgala jacket on mannequin, mandarin collar, gold buttons, premium wool fabric, minimalist backdrop, editorial fashion photography",
  },
  {
    folder: "weddingwear",
    filename: "indo-western.jpg",
    prompt:
      "Modern Indo-Western fusion suit combining Western cut with Indian embroidery details, asymmetric design, premium fabric, clean studio backdrop, editorial menswear",
  },

  // Denim
  {
    folder: "denim",
    filename: "classic-straight.jpg",
    prompt:
      "Classic straight-cut premium raw selvedge denim jeans, laid flat on wood surface, showing quality stitching and fabric texture, product photography, menswear",
  },
  {
    folder: "denim",
    filename: "slim-tapered.jpg",
    prompt:
      "Slim tapered fit dark indigo jeans with subtle fading, showing fit on mannequin, premium denim quality, clean backdrop, product photography",
  },
  {
    folder: "denim",
    filename: "denim-detail.jpg",
    prompt:
      "Extreme close-up of premium selvedge denim showing red-line selvedge edge, quality Japanese denim weave texture, artistic detail shot, product photography",
  },

  // Trousers
  {
    folder: "trousers",
    filename: "dress-trousers.jpg",
    prompt:
      "Premium charcoal wool dress trousers on mannequin, perfect crease, classic fit, professional menswear, clean studio backdrop, product photography",
  },
  {
    folder: "trousers",
    filename: "chinos.jpg",
    prompt:
      "Premium khaki chino trousers laid flat, soft cotton twill texture visible, casual menswear, clean white background, product photography",
  },
  {
    folder: "trousers",
    filename: "linen.jpg",
    prompt:
      "Natural beige linen trousers on mannequin, relaxed fit, summer menswear, breathable fabric texture, clean studio lighting, product photography",
  },
  {
    folder: "trousers",
    filename: "wool-flannel.jpg",
    prompt:
      "Premium grey wool flannel trousers with subtle texture, pleated front, classic menswear, warm tones, clean backdrop, product photography",
  },
  {
    folder: "trousers",
    filename: "fit-classic.jpg",
    prompt:
      "Classic fit trousers showing proper drape and straight leg silhouette, charcoal wool, professional menswear, side profile view, product photography",
  },
  {
    folder: "trousers",
    filename: "fit-slim.jpg",
    prompt:
      "Slim fit trousers showing tapered leg silhouette, navy wool, modern menswear, side profile view, clean backdrop, product photography",
  },
  {
    folder: "trousers",
    filename: "fit-relaxed.jpg",
    prompt:
      "Relaxed fit trousers with comfortable wider leg, olive chino fabric, casual menswear, side profile view, product photography",
  },
  {
    folder: "trousers",
    filename: "fabric-selection.jpg",
    prompt:
      "Elegant display of premium trouser fabric swatches in various colors and textures, wool flannel, cotton twill, linen, organized fabric library, soft lighting",
  },

  // Contact/Delivery
  {
    folder: "contact",
    filename: "atelier-interior.jpg",
    prompt:
      "Modern premium menswear atelier interior, clean minimalist design, fabric displays, fitting area, warm lighting, editorial interior photography",
  },
  {
    folder: "delivery",
    filename: "global-reach.jpg",
    prompt:
      "Elegant world map with premium packaging boxes, representing global shipping, clean minimalist design, dark sophisticated background, editorial photography",
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
      // Change extension to .jpg since we're saving as webp but the page expects .jpg
      const jpgPath = outputPath.replace(".jpg", ".webp");
      await downloadImage(imageUrl, outputPath.endsWith('.webp') ? outputPath : jpgPath);
      
      // Also save as jpg for compatibility
      if (!outputPath.endsWith('.webp')) {
        await downloadImage(imageUrl, outputPath);
      }
      
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
  console.log("Starting image generation...\n");
  console.log(`Total images to generate: ${imageSpecs.length}\n`);

  let generated = 0;
  let skipped = 0;
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

    // Rate limiting: wait 12 seconds between requests (6 per minute limit)
    if (i < imageSpecs.length - 1) {
      console.log("⏳ Waiting 12s for rate limit...\n");
      await sleep(12000);
    }
  }

  console.log("\n========================================");
  console.log(`✓ Generation complete!`);
  console.log(`  Generated: ${generated}`);
  console.log(`  Failed: ${failed}`);
  console.log("========================================");
}

main().catch(console.error);
