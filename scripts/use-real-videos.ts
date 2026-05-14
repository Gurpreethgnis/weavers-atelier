import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

// Map real videos to their destinations
// Using your authentic Instagram videos
const videoMappings = [
  {
    source: "3745276989910645275.mp4", // Use your real videos
    dest: "studio-walk",
    description: "Atelier walkthrough",
  },
  {
    source: "3865808224079806003.mp4",
    dest: "tailoring-detail-1",
    description: "Tailoring detail",
  },
  {
    source: "3869935027224675468.mp4",
    dest: "tailoring-detail-2",
    description: "Craftsmanship",
  },
  {
    source: "3757631944667409247.mp4",
    dest: "shirt-detail-1",
    description: "Shirt detail",
  },
  {
    source: "3777341569033534922.mp4",
    dest: "shirt-detail-2",
    description: "Shirt styling",
  },
  {
    source: "3872864391250876725.mp4",
    dest: "denim-detail-1",
    description: "Denim detail",
  },
  {
    source: "3854792829792958363.mp4",
    dest: "weddingwear-1",
    description: "Wedding attire 1",
  },
  {
    source: "3874370462360075441.mp4",
    dest: "weddingwear-2",
    description: "Wedding attire 2",
  },
  {
    source: "3880208047573773147.mp4",
    dest: "weddingwear-3",
    description: "Wedding attire 3",
  },
];

const imagesDir = path.join(process.cwd(), "Images");
const videosDir = path.join(process.cwd(), "public", "videos");

async function main() {
  console.log("Copying real videos to public directory...\n");

  for (const mapping of videoMappings) {
    const sourcePath = path.join(imagesDir, mapping.source);
    const destDir = path.join(videosDir, mapping.dest);
    const destPath = path.join(destDir, `${mapping.dest}.mp4`);
    const posterPath = path.join(destDir, `${mapping.dest}-poster.jpg`);

    // Ensure destination directory exists
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠ Source not found: ${mapping.source}`);
      continue;
    }

    // Copy video
    console.log(`📹 Copying: ${mapping.source} → ${mapping.dest}/`);
    fs.copyFileSync(sourcePath, destPath);

    // Try to extract first frame as poster using ffmpeg if available
    try {
      execSync(
        `ffmpeg -y -i "${destPath}" -vframes 1 -q:v 2 "${posterPath}" 2>/dev/null`,
        { stdio: "ignore" }
      );
      console.log(`  ✓ Poster extracted`);
    } catch {
      // If ffmpeg not available, just note it
      console.log(`  ⚠ Could not extract poster (ffmpeg not available)`);
    }
  }

  console.log("\n✓ Done! Real videos are now in place.");
}

main().catch(console.error);
