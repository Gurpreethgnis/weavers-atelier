/**
 * One-time migration script: custom_order_requests → custom_quotes
 *
 * This script migrates existing custom_order_requests data into the new
 * custom_quotes table format. Run once after deploying the new schema.
 *
 * Usage:
 *   npx tsx scripts/migrate-custom-order-requests.ts
 *
 * Prerequisites:
 *   - NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set
 *   - The custom_quotes table must exist (run migrations first)
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface LegacyCustomOrderRequest {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  country: string | null;
  city: string | null;
  garment_type: string;
  style_preferences: Record<string, unknown> | null;
  measurement_data: Record<string, unknown> | null;
  reference_images: string[] | null;
  need_by_date: string | null;
  notes: string | null;
  budget_range: string | null;
  preferred_contact_method: string | null;
  status: string;
  internal_notes: string | null;
}

async function migrateCustomOrderRequests() {
  console.log("Starting migration: custom_order_requests → custom_quotes\n");

  // Fetch existing custom_order_requests
  const { data: legacyRequests, error: fetchError } = await supabase
    .from("custom_order_requests")
    .select("*")
    .order("created_at", { ascending: true });

  if (fetchError) {
    console.error("Error fetching custom_order_requests:", fetchError);
    process.exit(1);
  }

  if (!legacyRequests || legacyRequests.length === 0) {
    console.log("No custom_order_requests found. Nothing to migrate.");
    return;
  }

  console.log(`Found ${legacyRequests.length} custom_order_requests to migrate.\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const legacy of legacyRequests as LegacyCustomOrderRequest[]) {
    // Map legacy status to new status
    const statusMap: Record<string, string> = {
      pending: "received",
      reviewed: "reviewing",
      quoted: "quoted",
      accepted: "accepted",
      in_production: "paid",
      completed: "paid",
      cancelled: "declined",
    };
    const newStatus = statusMap[legacy.status] || "received";

    // Build the new quote record
    const newQuote = {
      customer_email: legacy.email,
      customer_name: legacy.full_name,
      customer_phone: legacy.phone || legacy.whatsapp,
      requested_options: {
        garment_type: legacy.garment_type,
        style_preferences: legacy.style_preferences,
        measurement_data: legacy.measurement_data,
        budget_range: legacy.budget_range,
        need_by_date: legacy.need_by_date,
        country: legacy.country,
        city: legacy.city,
        preferred_contact_method: legacy.preferred_contact_method,
        // Migration metadata
        _migrated_from: "custom_order_requests",
        _legacy_id: legacy.id,
        _legacy_created_at: legacy.created_at,
      },
      reference_image_urls: legacy.reference_images || [],
      notes: legacy.notes,
      status: newStatus,
      internal_notes: legacy.internal_notes
        ? `[Migrated] ${legacy.internal_notes}`
        : `[Migrated from custom_order_requests on ${new Date().toISOString()}]`,
      created_at: legacy.created_at,
      updated_at: legacy.updated_at,
    };

    // Insert into custom_quotes
    const { error: insertError } = await supabase
      .from("custom_quotes")
      .insert(newQuote);

    if (insertError) {
      console.error(`Failed to migrate request ${legacy.id}:`, insertError.message);
      errorCount++;
    } else {
      console.log(`✓ Migrated: ${legacy.full_name} (${legacy.email}) - ${legacy.garment_type}`);
      successCount++;
    }
  }

  console.log(`\n--- Migration Complete ---`);
  console.log(`Successfully migrated: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`\nThe original custom_order_requests table has been left intact.`);
  console.log(`You can archive or drop it after verifying the migration.`);
}

migrateCustomOrderRequests().catch(console.error);
