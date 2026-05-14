/**
 * Inpainting backend.
 *
 * Default: Replicate's LaMa endpoint (`cjwbw/lama`). It's the right tradeoff
 * for our use case — high quality on textured / fabric backgrounds, ~$0.005
 * per image, no local GPU needed.
 *
 * Falls back gracefully:
 *   - If REPLICATE_API_TOKEN is missing, we skip inpainting and return the
 *     original image. The caller logs a clear QA flag so the user knows.
 *   - If the Replicate call fails (network, rate limit, bad model version),
 *     we surface the error and return the original.
 *
 * The function intentionally accepts buffers (not paths) so it composes
 * with the sharp pipeline without round-tripping through disk.
 */

import Replicate from "replicate";
import fs from "node:fs";
import path from "node:path";

// Default model: zylim0702/remove-object (LaMa-based, well-maintained, ~$0.005/run).
// Pinned to a specific version hash for reproducibility. Override with
// the REPLICATE_INPAINT_MODEL env var if you want to swap it out.
const DEFAULT_MODEL =
  "zylim0702/remove-object:0e3a841c913f597c1e4c321560aa69e2bc1f15c65f8c366caafc379240efd8ba";

function getModel(): string {
  return process.env.REPLICATE_INPAINT_MODEL || DEFAULT_MODEL;
}

export interface InpaintResult {
  inpainted: boolean;
  imageBuffer: Buffer;
  reason?: string;
}

let cachedClient: Replicate | null = null;

function getClient(): Replicate | null {
  if (cachedClient) return cachedClient;
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return null;
  cachedClient = new Replicate({ auth: token });
  return cachedClient;
}

export async function inpaintWithLama(
  imageBuffer: Buffer,
  maskBuffer: Buffer,
  options: { dryRun?: boolean } = {}
): Promise<InpaintResult> {
  if (options.dryRun) {
    return {
      inpainted: false,
      imageBuffer,
      reason: "dry-run mode (--no-inpaint flag)",
    };
  }

  const client = getClient();
  if (!client) {
    return {
      inpainted: false,
      imageBuffer,
      reason:
        "REPLICATE_API_TOKEN not set in environment — skipping inpaint. Add token to .env.local to enable.",
    };
  }

  try {
    // Replicate accepts data URLs for the inputs.
    const imageDataUrl = `data:image/png;base64,${imageBuffer.toString("base64")}`;
    const maskDataUrl = `data:image/png;base64,${maskBuffer.toString("base64")}`;

    const output = (await client.run(
      getModel() as `${string}/${string}:${string}`,
      {
        input: { image: imageDataUrl, mask: maskDataUrl },
      }
    )) as unknown;

    // Replicate's output shape varies by model and SDK version:
    //   - newer SDKs return a FileOutput object with .url() / readable stream
    //   - some models return a string URL directly
    //   - some return an array (first element is the URL)
    const buffer = await coerceOutputToBuffer(output);
    if (!buffer) {
      return {
        inpainted: false,
        imageBuffer,
        reason: `unexpected Replicate output shape: ${typeof output} ${JSON.stringify(output).slice(0, 200)}`,
      };
    }
    return { inpainted: true, imageBuffer: buffer };
  } catch (err) {
    return {
      inpainted: false,
      imageBuffer,
      reason: `Replicate inpaint failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

async function coerceOutputToBuffer(output: unknown): Promise<Buffer | null> {
  // Unwrap array output.
  if (Array.isArray(output)) {
    return coerceOutputToBuffer(output[0]);
  }
  // FileOutput-style object (newer Replicate SDK).
  if (output && typeof output === "object" && "url" in output) {
    const o = output as { url: () => string | URL };
    try {
      const u = typeof o.url === "function" ? o.url() : (o.url as unknown);
      const urlStr = u instanceof URL ? u.toString() : (u as string);
      const res = await fetch(urlStr);
      if (!res.ok) return null;
      const ab = await res.arrayBuffer();
      return Buffer.from(ab);
    } catch {
      return null;
    }
  }
  // ReadableStream output.
  if (output && typeof output === "object" && Symbol.asyncIterator in output) {
    const chunks: Uint8Array[] = [];
    for await (const chunk of output as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }
  // Plain string URL.
  if (typeof output === "string") {
    const res = await fetch(output);
    if (!res.ok) return null;
    const ab = await res.arrayBuffer();
    return Buffer.from(ab);
  }
  return null;
}

/** Loads REPLICATE_API_TOKEN from .env.local if present (lightweight, no extra dep). */
export function loadEnvLocal(): void {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf-8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}
