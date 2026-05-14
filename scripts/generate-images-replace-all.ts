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

interface ImageSpec {
  filename: string;
  prompt: string;
  folder: string;
  aspect?: string;
}

const imageSpecs: ImageSpec[] = [
  // HERO IMAGES
  {
    folder: "hero",
    filename: "home-heritage-bandhgala.jpg",
    prompt: "Elegant man wearing premium navy blue bandhgala jacket with subtle embroidery, standing in modern atelier setting, dramatic side lighting, editorial fashion photography, premium menswear, shallow depth of field, 4K quality",
    aspect: "3:4",
  },
  {
    folder: "hero",
    filename: "denim-bandhgala-outdoor.jpg",
    prompt: "Stylish man wearing custom dark indigo denim jacket with brass buttons, outdoor urban setting, golden hour lighting, editorial menswear photography, confident pose, premium streetwear aesthetic",
    aspect: "3:4",
  },
  {
    folder: "hero",
    filename: "shirts-linen-guayabera.jpg",
    prompt: "Man wearing premium white linen guayabera shirt with delicate embroidery details, relaxed pose, soft natural lighting, resort menswear editorial, clean minimalist background, summer luxury aesthetic",
    aspect: "3:4",
  },
  {
    folder: "hero",
    filename: "statement-navy-gold.jpg",
    prompt: "Close-up of premium navy velvet jacket with intricate gold embroidery details and threadwork, dramatic moody lighting, luxury menswear detail shot, editorial fashion photography, rich textures",
    aspect: "3:4",
  },
  {
    folder: "hero",
    filename: "trousers-black-set.jpg",
    prompt: "Elegant display of premium black wool trousers on mannequin with matching accessories, clean studio lighting, professional menswear product photography, sophisticated styling",
    aspect: "3:4",
  },
  {
    folder: "hero",
    filename: "weddingwear-rose-bandhgala.jpg",
    prompt: "Groom wearing luxurious rose gold sherwani with intricate embroidery, elegant wedding setting, soft romantic lighting, Indian wedding menswear editorial, premium bridal photography aesthetic",
    aspect: "3:4",
  },

  // LOOKBOOK IMAGES
  {
    folder: "lookbook",
    filename: "black-kurta-relaxed.jpg",
    prompt: "Man wearing relaxed fit black cotton kurta, casual confident pose, minimalist modern interior, soft natural lighting, contemporary Indian menswear editorial, premium lifestyle photography",
    aspect: "3:4",
  },
  {
    folder: "lookbook",
    filename: "blue-nehru-detail.jpg",
    prompt: "Close-up detail of royal blue Nehru jacket showing mandarin collar, premium wool fabric texture, subtle stitching, editorial fashion detail shot, shallow depth of field",
    aspect: "3:4",
  },
  {
    folder: "lookbook",
    filename: "blue-nehru-tradition.jpg",
    prompt: "Man wearing classic blue Nehru jacket with gold buttons, traditional yet modern styling, clean architectural background, editorial menswear photography, confident stance",
    aspect: "3:4",
  },
  {
    folder: "lookbook",
    filename: "ivory-floral-nehru.jpg",
    prompt: "Man wearing ivory Nehru jacket with subtle floral embroidery, elegant event styling, soft diffused lighting, premium Indian menswear editorial, sophisticated modern aesthetic",
    aspect: "3:4",
  },
  {
    folder: "lookbook",
    filename: "off-white-kurta.jpg",
    prompt: "Man wearing premium off-white cotton kurta with minimalist design, relaxed contemporary pose, clean modern interior, soft natural light, luxury casual Indian menswear",
    aspect: "3:4",
  },
  {
    folder: "lookbook",
    filename: "pink-floral-nehru.jpg",
    prompt: "Man wearing dusty pink Nehru jacket with delicate floral threadwork, wedding guest styling, warm elegant lighting, contemporary Indian menswear editorial, refined aesthetic",
    aspect: "3:4",
  },
  {
    folder: "lookbook",
    filename: "purple-kurta-set.jpg",
    prompt: "Man wearing deep purple kurta with matching churidar, festive celebration styling, rich jewel tones, dramatic lighting, premium Indian menswear editorial photography",
    aspect: "3:4",
  },
  {
    folder: "lookbook",
    filename: "sky-blue-nehru.jpg",
    prompt: "Man wearing sky blue linen Nehru jacket, summer event styling, bright airy setting, natural daylight, contemporary Indian menswear, relaxed elegant aesthetic",
    aspect: "3:4",
  },
  {
    folder: "lookbook",
    filename: "summer-wedding-group.jpg",
    prompt: "Group of well-dressed men in coordinated summer wedding attire, linen suits and Nehru jackets in soft pastels, outdoor garden setting, natural sunlight, editorial wedding photography",
    aspect: "4:3",
  },
  {
    folder: "lookbook",
    filename: "teal-kurta.jpg",
    prompt: "Man wearing rich teal silk kurta with subtle texture, evening celebration styling, warm ambient lighting, premium Indian menswear editorial, sophisticated festive look",
    aspect: "3:4",
  },

  // DETAILS IMAGES
  {
    folder: "details",
    filename: "embroidery-sketch.jpg",
    prompt: "Technical embroidery pattern sketch on cream paper, delicate hand-drawn design for menswear, pencil and ink details, artisan workshop aesthetic, design process documentation",
    aspect: "4:3",
  },
  {
    folder: "details",
    filename: "heritage-bandhgala-closeup.jpg",
    prompt: "Extreme close-up of premium bandhgala jacket showing hand-stitched buttonholes, fabric weave texture, collar construction detail, editorial fashion macro photography, craftsmanship focus",
    aspect: "3:4",
  },
  {
    folder: "details",
    filename: "shirts-linen-flat.jpg",
    prompt: "Premium white linen dress shirt laid flat on dark surface, showing collar and button details, professional garment photography, clean product shot, textile texture visible",
    aspect: "4:3",
  },

  // CUSTOM SHIRTS IMAGES
  {
    folder: "custom-shirts",
    filename: "hero-shirt.jpg",
    prompt: "Premium white cotton dress shirt on mannequin torso, perfect collar shape, clean studio lighting, professional menswear product photography, emphasis on fabric quality and construction",
    aspect: "3:4",
  },
  {
    folder: "custom-shirts",
    filename: "structural-detail.jpg",
    prompt: "Close-up of shirt construction showing collar stitching, button attachment, and seam details, macro fashion photography, craftsmanship focus, premium menswear quality",
    aspect: "4:3",
  },
  {
    folder: "custom-shirts",
    filename: "fabric-oxford.jpg",
    prompt: "Close-up texture shot of premium oxford cotton shirting fabric in light blue, showing weave pattern and quality, product photography, fabric swatch aesthetic",
    aspect: "1:1",
  },
  {
    folder: "custom-shirts",
    filename: "fabric-poplin.jpg",
    prompt: "Close-up texture shot of crisp white poplin cotton shirting fabric, smooth weave visible, premium quality textile, product photography, fabric detail",
    aspect: "1:1",
  },
  {
    folder: "custom-shirts",
    filename: "fabric-shadow-weave.jpg",
    prompt: "Close-up texture shot of shadow weave cotton shirting fabric with subtle pattern, premium textile photography, fabric swatch showing depth and texture",
    aspect: "1:1",
  },

  // DENIM PAGE - Additional hero
  {
    folder: "denim",
    filename: "hero-denim.jpg",
    prompt: "Man wearing custom dark indigo selvedge denim jeans and jacket, urban industrial setting, dramatic lighting, premium denim editorial, raw authentic aesthetic",
    aspect: "3:4",
  },

  // FIT GUIDE - Hero images
  {
    folder: "fit-guide",
    filename: "hero-fit-guide.jpg",
    prompt: "Professional tailor measuring client for bespoke suit, warm atelier lighting, tape measure and fabric swatches visible, editorial craftsmanship photography, premium menswear fitting",
    aspect: "16:9",
  },

  // STATEMENT PIECES - Additional
  {
    folder: "statement",
    filename: "hero-statement.jpg",
    prompt: "Dramatic display of embroidered velvet jacket with gold threadwork, dark moody lighting, editorial luxury menswear, maximalist details, museum-quality presentation",
    aspect: "3:4",
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
  const webpPath = outputPath.replace(/\.(jpg|png)$/, ".webp");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`⏳ Generating: ${spec.folder}/${spec.filename}`);

  try {
    const output = await replicate.run("black-forest-labs/flux-schnell", {
      input: {
        prompt: spec.prompt,
        num_outputs: 1,
        aspect_ratio: spec.aspect || "3:4",
        output_format: "webp",
        output_quality: 90,
      },
    });

    let imageUrl: string | undefined;

    if (Array.isArray(output) && output.length > 0) {
      const firstOutput = output[0];
      if (typeof firstOutput === "string") {
        imageUrl = firstOutput;
      } else if (firstOutput && typeof firstOutput === "object") {
        const fileOutput = firstOutput as { url?: () => { href: string } };
        if (fileOutput.url) {
          imageUrl = fileOutput.url().href;
        }
      }
    }

    if (imageUrl) {
      // Save as both jpg and webp
      await downloadImage(imageUrl, outputPath);
      await downloadImage(imageUrl, webpPath);
      console.log(`✓ Generated: ${spec.folder}/${spec.filename}`);
      return true;
    } else {
      console.error(`✗ Could not extract URL for ${spec.filename}`);
      return false;
    }
  } catch (error: unknown) {
    const apiError = error as { status?: number };
    if (apiError.status === 429) {
      console.log(`⏸ Rate limited, waiting 15 seconds...`);
      await sleep(15000);
      return generateImage(spec);
    }
    console.error(`✗ Failed: ${spec.folder}/${spec.filename}`, error);
    return false;
  }
}

async function main() {
  console.log("Replacing all images with AI-generated versions...\n");
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
  console.log(`✓ Image replacement complete!`);
  console.log(`  Generated: ${generated}`);
  console.log(`  Failed: ${failed}`);
  console.log("========================================");
}

main().catch(console.error);
