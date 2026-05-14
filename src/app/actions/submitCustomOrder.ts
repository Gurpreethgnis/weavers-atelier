"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { customOrderSchema, type CustomOrderFormData } from "@/lib/schemas/custom-order";
import { notifyOps, sendCustomerConfirmation, formatLeadEmailHtml } from "@/lib/email";
import type { ActionResult } from "./submitLead";

export async function submitCustomOrder(
  data: CustomOrderFormData,
  sourcePage: string
): Promise<ActionResult> {
  // Validate input
  const parsed = customOrderSchema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const supabase = await createServiceClient();
    const d = parsed.data;

    // First create a lead
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert({
        source_page: sourcePage,
        lead_type: d.category as "shirt" | "trouser" | "denim" | "weddingwear" | "statement_piece",
        name: d.full_name,
        email: d.email || null,
        phone: d.phone || null,
        whatsapp: d.whatsapp || null,
        country: d.country || null,
        city: d.city || null,
        preferred_contact_method: d.preferred_contact_method || null,
        garment_interest: d.garment_type,
        need_by_date: d.need_by_date || null,
        budget_range: d.budget_range || null,
        notes: d.notes || null,
        status: "new",
      })
      .select("id")
      .single();

    if (leadError) {
      console.error("Lead insert error:", leadError);
      return {
        ok: false,
        message: "Failed to submit order request. Please try again.",
      };
    }

    // Compile selected options based on category
    const selectedOptions = {
      ...(d.shirt_options || {}),
      ...(d.trouser_options || {}),
      ...(d.denim_options || {}),
      ...(d.weddingwear_options || {}),
      ...(d.statement_options || {}),
    };

    // Create custom order request
    const { data: order, error: orderError } = await supabase
      .from("custom_order_requests")
      .insert({
        lead_id: lead.id,
        garment_type: d.garment_type,
        category: d.category,
        selected_options: selectedOptions,
        measurement_method: d.measurement_method || null,
        need_by_date: d.need_by_date || null,
        budget_range: d.budget_range || null,
        status: "submitted",
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Order insert error:", orderError);
      return {
        ok: false,
        message: "Failed to submit order request. Please try again.",
      };
    }

    // Send ops notification
    await notifyOps(
      `New ${d.category} order from ${d.full_name}`,
      formatLeadEmailHtml({
        ...d,
        selected_options: selectedOptions,
        order_id: order.id,
      }),
      d.email || undefined
    );

    // Send customer confirmation if email provided
    if (d.email) {
      await sendCustomerConfirmation(d.email, d.full_name, "order");
    }

    return {
      ok: true,
      message: "Your custom order request has been received! We'll review and be in touch within 24-48 hours.",
      id: order.id,
    };
  } catch (error) {
    console.error("Submit custom order error:", error);
    return {
      ok: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
