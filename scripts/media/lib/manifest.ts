/**
 * Shared manifest helpers for media processing.
 *
 * The manifest is a single JSON file (`public/media-manifest.json`) that
 * tracks every processed asset so we have a single source of truth for:
 *   - what's been ingested
 *   - which preset it was processed with
 *   - whether inpainting was applied
 *   - QA flags (text still detected after processing, low confidence, etc.)
 *
 * This is intentionally append-only-by-key: re-processing an image with
 * the same output path overwrites its entry but keeps history off (we
 * rely on git for that).
 */

import fs from "node:fs";
import path from "node:path";

export interface ImageManifestEntry {
  type: "image";
  source: string;
  outputs: {
    jpg: string;
    webp?: string;
  };
  preset: "hero" | "lookbook" | "detail" | "raw";
  width: number;
  height: number;
  aspect: string;
  inpainted: boolean;
  detectedText: string[];
  qa: {
    textRemainsAfterProcessing: boolean;
    confidence: number;
    notes?: string;
  };
  altSuggestion?: string;
  processedAt: string;
}

export interface VideoManifestEntry {
  type: "video";
  source: string;
  outputs: {
    mp4: string;
    webm: string;
    poster: string;
  };
  width: number;
  height: number;
  durationSec: number;
  bitrateKbps: number;
  hasAudio: boolean;
  processedAt: string;
  label: string;
}

export type ManifestEntry = ImageManifestEntry | VideoManifestEntry;

export interface Manifest {
  version: 1;
  generatedAt: string;
  entries: Record<string, ManifestEntry>;
}

const MANIFEST_PATH = path.join(process.cwd(), "public", "media-manifest.json");

export function loadManifest(): Manifest {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return { version: 1, generatedAt: new Date().toISOString(), entries: {} };
  }
  try {
    const raw = fs.readFileSync(MANIFEST_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Manifest;
    return parsed;
  } catch (err) {
    console.warn(
      `[manifest] failed to parse existing manifest, starting fresh:`,
      err
    );
    return { version: 1, generatedAt: new Date().toISOString(), entries: {} };
  }
}

export function saveManifest(manifest: Manifest): void {
  manifest.generatedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
}

export function upsertEntry(key: string, entry: ManifestEntry): void {
  const manifest = loadManifest();
  manifest.entries[key] = entry;
  saveManifest(manifest);
}
