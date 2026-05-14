"use server";

import { createServiceClient } from "@/lib/supabase/server";
import type { ActionResult } from "./submitLead";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
  "application/pdf",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 5;

interface UploadResult extends ActionResult {
  urls?: string[];
  referenceIds?: string[];
}

export async function uploadReferences(
  formData: FormData,
  entityType: "lead" | "order" | "measurement" | "consultation",
  entityId: string
): Promise<UploadResult> {
  try {
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return {
        ok: false,
        message: "No files provided",
      };
    }

    if (files.length > MAX_FILES) {
      return {
        ok: false,
        message: `Maximum ${MAX_FILES} files allowed`,
      };
    }

    // Validate files
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return {
          ok: false,
          message: `Invalid file type: ${file.name}. Allowed: JPG, PNG, WebP, HEIC, PDF`,
        };
      }

      if (file.size > MAX_FILE_SIZE) {
        return {
          ok: false,
          message: `File too large: ${file.name}. Maximum size is 10 MB`,
        };
      }
    }

    const supabase = await createServiceClient();
    const uploadedUrls: string[] = [];
    const referenceIds: string[] = [];

    for (const file of files) {
      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 8);
      const extension = file.name.split(".").pop() || "bin";
      const filename = `${entityType}/${entityId}/${timestamp}-${randomId}.${extension}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("references")
        .upload(filename, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        continue;
      }

      // Get public URL (or signed URL for private bucket)
      const { data: urlData } = supabase.storage
        .from("references")
        .getPublicUrl(filename);

      const fileUrl = urlData.publicUrl;
      uploadedUrls.push(fileUrl);

      // Create reference record
      const { data: reference, error: refError } = await supabase
        .from("uploaded_references")
        .insert({
          related_entity_type: entityType,
          related_entity_id: entityId,
          file_url: fileUrl,
          file_type: file.type,
          original_file_name: file.name,
        })
        .select("id")
        .single();

      if (!refError && reference) {
        referenceIds.push(reference.id);
      }
    }

    if (uploadedUrls.length === 0) {
      return {
        ok: false,
        message: "Failed to upload files. Please try again.",
      };
    }

    return {
      ok: true,
      message: `Successfully uploaded ${uploadedUrls.length} file(s)`,
      urls: uploadedUrls,
      referenceIds,
    };
  } catch (error) {
    console.error("Upload reference error:", error);
    return {
      ok: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
