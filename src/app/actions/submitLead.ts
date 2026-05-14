"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { leadSchema, type LeadInput } from "@/lib/schemas/lead";
import { notifyOps, sendCustomerConfirmation, formatLeadEmailHtml } from "@/lib/email";

export interface ActionResult {
  ok: boolean;
  errors?: Record<string, string[]>;
  message?: string;
  id?: string;
}

export async function submitLead(data: LeadInput): Promise<ActionResult> {
  // Validate input
  const parsed = leadSchema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const supabase = await createServiceClient();
    
    // Insert lead
    const { data: lead, error } = await supabase
      .from("leads")
      .insert({
        source_page: parsed.data.source_page,
        lead_type: parsed.data.lead_type,
        name: parsed.data.full_name,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        whatsapp: parsed.data.whatsapp || null,
        country: parsed.data.country || null,
        city: parsed.data.city || null,
        preferred_contact_method: parsed.data.preferred_contact_method || null,
        garment_interest: parsed.data.garment_interest || null,
        need_by_date: parsed.data.need_by_date || null,
        budget_range: parsed.data.budget_range || null,
        notes: parsed.data.notes || null,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return {
        ok: false,
        message: "Failed to submit inquiry. Please try again.",
      };
    }

    // Send ops notification
    await notifyOps(
      `New ${parsed.data.lead_type} inquiry from ${parsed.data.full_name}`,
      formatLeadEmailHtml(parsed.data),
      parsed.data.email || undefined
    );

    // Send customer confirmation if email provided
    if (parsed.data.email) {
      await sendCustomerConfirmation(
        parsed.data.email,
        parsed.data.full_name,
        "inquiry"
      );
    }

    return {
      ok: true,
      message: "Thank you! We'll be in touch within 24-48 hours.",
      id: lead.id,
    };
  } catch (error) {
    console.error("Submit lead error:", error);
    return {
      ok: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
