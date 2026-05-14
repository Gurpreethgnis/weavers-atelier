/**
 * Process a single video for the Weavers platform.
 *
 * Pipeline:
 *   1. Probe source with ffprobe.
 *   2. Encode H.264 MP4 (max 720p, ~1.5 Mbps, no audio for ambient bg use).
 *   3. Encode VP9 WebM (same target).
 *   4. Extract a poster frame at the 30% mark (more representative than t=0).
 *   5. Write all three under public/videos/<label>/ and append to manifest.
 *
 * No audio: we intentionally strip audio because every place we use video on
 * this site is ambient/decorative (autoplay requires muted anyway). If/when
 * we add a real video player UI, we'll keep the source intact and re-encode
 * with audio under a different preset.
 *
 * Usage:
 *   npm run media:video -- <source-path> --label=home-hero
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { upsertEntry, type VideoManifestEntry } from "./lib/manifest";

interface CliArgs {
  source: string;
  label: string;
  force: boolean;
  targetHeight: number;
  bitrateKbps: number;
  /** Trim output to this many seconds (starting from --start). 0 = no trim. */
  durationSec: number;
  /** Trim start offset in seconds. */
  startSec: number;
}

function parseArgs(argv: string[]): CliArgs {
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (const arg of argv) {
    if (arg.startsWith("--")) {
      const eq = arg.indexOf("=");
      if (eq === -1) flags[arg.slice(2)] = true;
      else flags[arg.slice(2, eq)] = arg.slice(eq + 1);
    } else {
      positional.push(arg);
    }
  }
  const source = positional[0];
  if (!source) {
    throw new Error(
      "Usage: process-video <source-path> --label=<slug> [--force] [--height=720] [--bitrate=1500] [--duration=8] [--start=0]"
    );
  }
  const label =
    (typeof flags.label === "string" && flags.label) ||
    path.basename(source).replace(/\.[^.]+$/, "");
  return {
    source,
    label: slugify(label),
    force: flags.force === true,
    targetHeight:
      typeof flags.height === "string" ? parseInt(flags.height, 10) : 720,
    bitrateKbps:
      typeof flags.bitrate === "string" ? parseInt(flags.bitrate, 10) : 1500,
    durationSec:
      typeof flags.duration === "string" ? parseFloat(flags.duration) : 0,
    startSec: typeof flags.start === "string" ? parseFloat(flags.start) : 0,
  };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface Probe {
  width: number;
  height: number;
  duration: number;
  hasAudio: boolean;
}

function probe(source: string): Probe {
  const out = execFileSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-print_format",
      "json",
      "-show_format",
      "-show_streams",
      source,
    ],
    { encoding: "utf-8" }
  );
  const json = JSON.parse(out);
  const video = json.streams.find(
    (s: { codec_type: string }) => s.codec_type === "video"
  );
  const audio = json.streams.find(
    (s: { codec_type: string }) => s.codec_type === "audio"
  );
  return {
    width: video?.width ?? 0,
    height: video?.height ?? 0,
    duration: parseFloat(json.format?.duration ?? "0"),
    hasAudio: !!audio,
  };
}

function run(cmd: string, args: string[]): void {
  execFileSync(cmd, args, { stdio: "inherit" });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(args.source)) {
    throw new Error(`Source not found: ${args.source}`);
  }

  const info = probe(args.source);
  console.log(
    `[process-video] ${args.source} (${info.width}x${info.height}, ${info.duration.toFixed(1)}s) -> ${args.label}`
  );

  const outDir = path.join(process.cwd(), "public", "videos", args.label);
  fs.mkdirSync(outDir, { recursive: true });
  const mp4Path = path.join(outDir, `${args.label}.mp4`);
  const webmPath = path.join(outDir, `${args.label}.webm`);
  const posterPath = path.join(outDir, `${args.label}-poster.jpg`);

  if (
    !args.force &&
    fs.existsSync(mp4Path) &&
    fs.existsSync(webmPath) &&
    fs.existsSync(posterPath)
  ) {
    console.log(`[skip] outputs already exist. Use --force to overwrite.`);
    return;
  }

  // Scale filter: cap height at targetHeight, preserve aspect, ensure even dims.
  const scale = `scale=-2:'min(${args.targetHeight},ih)':flags=lanczos`;

  // Trim args: -ss before -i is fast (keyframe-aligned seek); -t after.
  const trimIn = args.startSec > 0 ? ["-ss", args.startSec.toString()] : [];
  const trimOut = args.durationSec > 0 ? ["-t", args.durationSec.toString()] : [];

  // 1. MP4 (H.264) — ABR with hard cap. CRF mode ignores -maxrate unless we
  //    bump -bufsize and accept that crf 23 may overshoot. Using straight ABR
  //    gives us predictable output sizes for ambient loops.
  console.log(`  - encoding MP4...`);
  run("ffmpeg", [
    "-y",
    ...trimIn,
    "-i",
    args.source,
    ...trimOut,
    "-vf",
    scale,
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-b:v",
    `${args.bitrateKbps}k`,
    "-maxrate",
    `${Math.round(args.bitrateKbps * 1.3)}k`,
    "-bufsize",
    `${args.bitrateKbps * 2}k`,
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-an",
    mp4Path,
  ]);

  // 2. WebM (VP9). `-deadline good -cpu-used 2` balances encode time vs
  //    quality. We also cap with -maxrate so WebM doesn't blow up.
  console.log(`  - encoding WebM (VP9)...`);
  run("ffmpeg", [
    "-y",
    ...trimIn,
    "-i",
    args.source,
    ...trimOut,
    "-vf",
    scale,
    "-c:v",
    "libvpx-vp9",
    "-b:v",
    `${args.bitrateKbps}k`,
    "-maxrate",
    `${Math.round(args.bitrateKbps * 1.3)}k`,
    "-minrate",
    `${Math.round(args.bitrateKbps * 0.5)}k`,
    "-deadline",
    "good",
    "-cpu-used",
    "2",
    "-row-mt",
    "1",
    "-an",
    webmPath,
  ]);

  // 3. Poster frame at ~30% into the OUTPUT clip. `-update 1` tells ffmpeg
  //    this is a single image, not a sequence, avoiding the pattern warning.
  console.log(`  - extracting poster...`);
  const outDuration =
    args.durationSec > 0 ? args.durationSec : info.duration - args.startSec;
  const seekSec = Math.max(0.5, args.startSec + outDuration * 0.3);
  run("ffmpeg", [
    "-y",
    "-ss",
    seekSec.toFixed(2),
    "-i",
    args.source,
    "-frames:v",
    "1",
    "-update",
    "1",
    "-vf",
    scale,
    "-q:v",
    "3",
    posterPath,
  ]);

  // 4. Final probe for output dims.
  const outInfo = probe(mp4Path);

  // 5. Manifest.
  const entry: VideoManifestEntry = {
    type: "video",
    source: path.relative(process.cwd(), args.source),
    outputs: {
      mp4: `/videos/${args.label}/${args.label}.mp4`,
      webm: `/videos/${args.label}/${args.label}.webm`,
      poster: `/videos/${args.label}/${args.label}-poster.jpg`,
    },
    width: outInfo.width,
    height: outInfo.height,
    durationSec: outInfo.duration,
    bitrateKbps: args.bitrateKbps,
    hasAudio: false,
    processedAt: new Date().toISOString(),
    label: args.label,
  };
  upsertEntry(`video:${args.label}`, entry);

  console.log(`[done] mp4=${fmtSize(mp4Path)}  webm=${fmtSize(webmPath)}  poster=${fmtSize(posterPath)}`);
}

function fmtSize(p: string): string {
  const bytes = fs.statSync(p).size;
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
