"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { instagramRecreateSchema, type InstagramRecreateFormData } from "@/lib/schemas/instagram-recreate";
import { notifyOps, sendCustomerConfirmation, formatLeadEmailHtml } from "@/lib/email";
import type { ActionResult } from "./submitLead";

export async function submitInstagramRecreate(
  data: InstagramRecreateFormData
): Promise<ActionResult> {
  // Validate input
  const parsed = instagramRecreateSchema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const supabase = await createServiceClient();
    const d = parsed.data;

    // Create lead
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert({
        source_page: "/instagram-looks",
        lead_type: "instagram_recreate",
        name: d.full_name,
        email: d.email || null,
        phone: d.phone || null,
        whatsapp: d.whatsapp || null,
        country: d.country || null,
        city: d.city || null,
        preferred_contact_method: d.preferred_contact_method || null,
        garment_interest: d.garment_type || (d.look_category ? String(d.look_category) : null),
        need_by_date: d.need_by_date || null,
        budget_range: d.budget_range || null,
        notes: [
          d.instagram_url ? `Instagram: ${d.instagram_url}` : null,
          d.desired_changes ? `Desired changes: ${d.desired_changes}` : null,
          d.notes,
        ].filter(Boolean).join("\n\n") || null,
        status: "new",
      })
      .select("id")
      .single();

    if (leadError) {
      console.error("Lead insert error:", leadError);
      return {
        ok: false,
        message: "Failed to submit request. Please try again.",
      };
    }

    // Create custom order request for the recreate
    const { data: order, error: orderError } = await supabase
      .from("custom_order_requests")
      .insert({
        lead_id: lead.id,
        garment_type: d.garment_type || "instagram_recreate",
        category: d.look_category || "shirt",
        selected_options: {
          instagram_url: d.instagram_url || null,
          lookbook_item_id: d.lookbook_item_id || null,
          desired_changes: d.desired_changes || null,
        },
        measurement_method: d.measurement_method || null,
        need_by_date: d.need_by_date || null,
        budget_range: d.budget_range || null,
        status: "submitted",
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Order insert error:", orderError);
      // Continue anyway - lead was created
    }

    // Send ops notification
    await notifyOps(
      `New Instagram Recreate request from ${d.full_name}`,
      formatLeadEmailHtml({
        ...d,
        lead_id: lead.id,
        order_id: order?.id,
      }),
      d.email || undefined
    );

    // Send customer confirmation if email provided
    if (d.email) {
      await sendCustomerConfirmation(d.email, d.full_name, "order");
    }

    return {
      ok: true,
      message: "Your recreation request has been received! We'll review the look and be in touch within 24-48 hours.",
      id: lead.id,
    };
  } catch (error) {
    console.error("Submit instagram recreate error:", error);
    return {
      ok: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
