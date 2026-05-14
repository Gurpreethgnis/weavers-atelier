"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { consultationSchema, type ConsultationFormData } from "@/lib/schemas/consultation";
import { notifyOps, sendCustomerConfirmation, formatLeadEmailHtml } from "@/lib/email";
import type { ActionResult } from "./submitLead";

export async function submitConsultation(
  data: ConsultationFormData,
  sourcePage: string
): Promise<ActionResult> {
  // Validate input
  const parsed = consultationSchema.safeParse(data);
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
        lead_type: "consultation",
        name: d.full_name,
        email: d.email || null,
        phone: d.phone || null,
        whatsapp: d.whatsapp || null,
        country: d.country || null,
        city: d.city || null,
        preferred_contact_method: d.preferred_contact_method || null,
        garment_interest: d.garment_type || d.consultation_type,
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
        message: "Failed to submit consultation request. Please try again.",
      };
    }

    // Create consultation request
    const { data: consultation, error: consultationError } = await supabase
      .from("consultation_requests")
      .insert({
        lead_id: lead.id,
        consultation_type: d.consultation_type,
        preferred_date: d.preferred_date || null,
        preferred_time: d.preferred_time || null,
        timezone: d.timezone || null,
        event_date: d.event_date || null,
        need_by_date: d.need_by_date || null,
        garment_type: d.garment_type || null,
        budget_range: d.budget_range || null,
        status: "requested",
        notes: d.notes || null,
      })
      .select("id")
      .single();

    if (consultationError) {
      console.error("Consultation insert error:", consultationError);
      return {
        ok: false,
        message: "Failed to submit consultation request. Please try again.",
      };
    }

    // Send ops notification
    const consultationTypes: Record<string, string> = {
      shirt_fit: "Shirt Fit",
      trouser_fit: "Trouser Fit",
      denim_design: "Denim Design",
      weddingwear: "Weddingwear",
      statement_piece: "Statement Piece",
      instagram_look: "Instagram Look",
      video_measurement: "Video Measurement",
    };

    await notifyOps(
      `New ${consultationTypes[d.consultation_type]} consultation from ${d.full_name}`,
      formatLeadEmailHtml({
        ...d,
        consultation_id: consultation.id,
      }),
      d.email || undefined
    );

    // Send customer confirmation if email provided
    if (d.email) {
      await sendCustomerConfirmation(d.email, d.full_name, "consultation");
    }

    return {
      ok: true,
      message: "Your consultation request has been received! We'll confirm your time slot within 24 hours.",
      id: consultation.id,
    };
  } catch (error) {
    console.error("Submit consultation error:", error);
    return {
      ok: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
