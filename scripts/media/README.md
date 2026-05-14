# Weavers Media Pipeline

Scripts for ingesting images and videos into the Weavers Atelier platform.

## Why this exists

Instagram, designer hand-offs, and lookbook shoots produce files that aren't
ready for a premium site:

- Promotional text overlays ("SUMMER WEDDING FITS", "TRADITION", etc.)
- Mixed aspect ratios
- Inconsistent color and saturation
- Heavy file sizes with embedded EXIF metadata
- No web-optimized variants

This pipeline standardizes that ingestion into a single command per asset
and writes a manifest so we always know what's been processed and how.

## Setup

1. Dependencies are installed via `npm install` (added as devDependencies).
2. For inpainting (text/overlay removal) to work, add a Replicate token to
   `.env.local`:

   ```
   REPLICATE_API_TOKEN=r8_xxx...
   ```

   Get one at <https://replicate.com/account/api-tokens>. Cost is roughly
   $0.005 per image inpainted. If the token is missing, OCR still runs and
   text regions are detected, but the image is saved without inpainting and
   a QA flag is written into the manifest.

3. ffmpeg + ffprobe must be on PATH for video processing. Verify with
   `ffmpeg -version`.

## Image processing

```bash
# Basic: process an Instagram image into a lookbook cell.
npm run media:image -- "Images/gallery-dl/instagram/itsweavers/IMG_2023.jpg" --preset=lookbook --name=summer-wedding-group

# Process a hero image, skipping OCR (faster, when you know there's no text).
npm run media:image -- "Images/raw/hero-shot.jpg" --preset=hero --name=home-hero --no-ocr

# Process but skip inpaint (useful if you want to QA OCR results first).
npm run media:image -- "Images/foo.jpg" --preset=lookbook --no-inpaint

# Overwrite an existing output.
npm run media:image -- "Images/foo.jpg" --preset=lookbook --name=foo --force

# Record suggested alt text in the manifest.
npm run media:image -- "Images/foo.jpg" --preset=lookbook --alt="Model in indigo bandhgala against painted heritage backdrop"
```

### Presets

| Preset    | Width  | Aspect | Output dir            |
| --------- | ------ | ------ | --------------------- |
| `hero`    | 2000px | 4:3    | `public/images/hero/` |
| `lookbook`| 1200px | 3:4    | `public/images/lookbook/` |
| `detail`  | 1400px | 1:1    | `public/images/details/` |
| `raw`     | 2000px | source | `public/images/raw/` |

Each output is written as both `.jpg` (mozjpeg, q82) and `.webp` (q80).
EXIF metadata is always stripped.

### Debugging OCR

If an image has visible overlay text that the pipeline isn't detecting,
run the debug helper to see what Tesseract sees on each preprocessing
variant (raw, normalized grayscale, multiple binarization thresholds, etc.)
across page-segmentation modes 6/7/11/12:

```bash
npx tsx scripts/media/debug-ocr.ts <image-path>
```

It writes the preprocessed variants to `scripts/media/debug-out/` so you
can see exactly what Tesseract receives. The current pipeline uses PSM 6
with `threshold(200)` for white-on-light overlays, `threshold(80)+negate`
for dark overlays, and normalized grayscale for mid-tone overlays — but
new overlay styles may need new preprocessing variants in
`scripts/media/lib/ocr.ts`.

### What happens when text is detected

1. Tesseract OCR runs and identifies bounding boxes for any text with
   confidence ≥ 60%.
2. A binary mask PNG is built around those boxes with proportional padding.
3. The source image + mask are sent to Replicate's LaMa endpoint.
4. The inpainted result replaces the source for the rest of the pipeline.
5. **QA step:** OCR is re-run on the final output. If text is still detected,
   a warning is printed and `qa.textRemainsAfterProcessing: true` is written
   to the manifest — flag for manual review.

## Video processing

```bash
# Encode a video for ambient hero use.
npm run media:video -- "Images/gallery-dl/instagram/itsweavers/3854792829792958363.mp4" --label=home-hero-ambient

# Higher quality / different cap.
npm run media:video -- "Images/foo.mp4" --label=weddingwear-hero --height=1080 --bitrate=2500
```

Each video produces three files under `public/videos/<label>/`:

- `<label>.mp4` — H.264, faststart, no audio
- `<label>.webm` — VP9, no audio
- `<label>-poster.jpg` — frame captured at ~30% into the clip

Audio is stripped because every place we use video on the site today is
muted/decorative. If we add audio video later, we'll add a different preset.

## Manifest

Every processed asset appends an entry to `public/media-manifest.json`. This
file is committed and acts as our single source of truth:

```json
{
  "version": 1,
  "generatedAt": "...",
  "entries": {
    "image:lookbook/summer-wedding-group": {
      "type": "image",
      "preset": "lookbook",
      "inpainted": true,
      "detectedText": ["SUMMER", "WEDDING", "FITS"],
      "qa": { "textRemainsAfterProcessing": false, "confidence": 87 },
      "outputs": {
        "jpg": "/images/lookbook/summer-wedding-group.jpg",
        "webp": "/images/lookbook/summer-wedding-group.webp"
      },
      "altSuggestion": "...",
      "processedAt": "..."
    }
  }
}
```

Use this to:

- Find QA-flagged assets that need manual review (`textRemainsAfterProcessing: true`).
- Audit which images were AI-inpainted vs. shipped raw.
- Drive automated alt-text and image listings in the future.
