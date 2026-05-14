/**
 * Image presets define the "shape" each image takes once it lands on the
 * platform. These are tied to actual usage:
 *
 *   - hero    : large editorial heros on category/landing pages
 *   - lookbook: 3:4 portrait cells in Instagram Looks and similar grids
 *   - detail  : square or close-to-square close-up shots
 *   - raw     : preserve aspect, just optimize + strip metadata
 *
 * Keeping these centralized means a designer can tweak the entire site's
 * image system from one file rather than chasing magic numbers across pages.
 */

export interface Preset {
  /** Target output width in pixels (height derives from aspect). */
  width: number;
  /** Target aspect ratio as width/height, or null to preserve source. */
  aspect: number | null;
  /** sharp `fit` strategy. 'cover' crops; 'contain' letterboxes; 'inside' shrinks. */
  fit: "cover" | "contain" | "inside";
  /** Output subdirectory under public/images/ */
  outDir: string;
  /** Quality for the JPEG fallback. */
  jpegQuality: number;
  /** Quality for the WebP output. */
  webpQuality: number;
  /** Optional gentle color normalization to match the atelier palette. */
  normalize: {
    saturation: number;
    brightness: number;
    contrast?: number;
  };
}

export const PRESETS: Record<string, Preset> = {
  hero: {
    width: 2000,
    aspect: 4 / 3,
    fit: "cover",
    outDir: "hero",
    jpegQuality: 82,
    webpQuality: 80,
    normalize: { saturation: 0.95, brightness: 1.0 },
  },
  lookbook: {
    width: 1200,
    aspect: 3 / 4,
    fit: "cover",
    outDir: "lookbook",
    jpegQuality: 82,
    webpQuality: 80,
    normalize: { saturation: 0.95, brightness: 1.0 },
  },
  detail: {
    width: 1400,
    aspect: 1,
    fit: "cover",
    outDir: "details",
    jpegQuality: 84,
    webpQuality: 82,
    normalize: { saturation: 0.95, brightness: 1.0 },
  },
  raw: {
    width: 2000,
    aspect: null,
    fit: "inside",
    outDir: "raw",
    jpegQuality: 85,
    webpQuality: 82,
    normalize: { saturation: 1.0, brightness: 1.0 },
  },
};

export function getPreset(name: string): Preset {
  const preset = PRESETS[name];
  if (!preset) {
    throw new Error(
      `Unknown preset: '${name}'. Available: ${Object.keys(PRESETS).join(", ")}`
    );
  }
  return preset;
}
