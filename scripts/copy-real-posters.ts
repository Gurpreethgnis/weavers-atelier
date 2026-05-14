import * as fs from "fs";
import * as path from "path";

// Map real images to poster locations
const posterMappings = [
  {
    source: "662884684_18053792495709595_1884225011447521891_n.jpg",
    dest: "studio-walk/studio-walk-poster.jpg",
  },
  {
    source: "3820210573766998178.jpg",
    dest: "tailoring-detail-1/tailoring-detail-1-poster.jpg",
  },
  {
    source: "3826624856369080973.jpg",
    dest: "tailoring-detail-2/tailoring-detail-2-poster.jpg",
  },
  {
    source: "3753940563746362239.jpg",
    dest: "shirt-detail-1/shirt-detail-1-poster.jpg",
  },
  {
    source: "3753951485521536012.jpg",
    dest: "shirt-detail-2/shirt-detail-2-poster.jpg",
  },
  {
    source: "3756170961033854519.jpg",
    dest: "denim-detail-1/denim-detail-1-poster.jpg",
  },
  {
    source: "3870664129774697281_3870664080936230161.jpg",
    dest: "weddingwear-1/weddingwear-1-poster.jpg",
  },
  {
    source: "3875913652327352147_3875913534702301410.jpg",
    dest: "weddingwear-2/weddingwear-2-poster.jpg",
  },
  {
    source: "3880954842030655271_3880954393835682749.jpg",
    dest: "weddingwear-3/weddingwear-3-poster.jpg",
  },
];

const imagesDir = path.join(process.cwd(), "Images");
const videosDir = path.join(process.cwd(), "public", "videos");

function main() {
  console.log("Copying real images as video posters...\n");

  for (const mapping of posterMappings) {
    const sourcePath = path.join(imagesDir, mapping.source);
    const destPath = path.join(videosDir, mapping.dest);

    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠ Source not found: ${mapping.source}`);
      continue;
    }

    // Ensure directory exists
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    console.log(`🖼 Copying: ${mapping.source.substring(0, 30)}... → ${mapping.dest}`);
    fs.copyFileSync(sourcePath, destPath);
  }

  console.log("\n✓ Real posters in place!");
}

main();
