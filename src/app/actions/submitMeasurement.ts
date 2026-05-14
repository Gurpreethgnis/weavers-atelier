"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { measurementProfileSchema, type MeasurementProfileFormData } from "@/lib/schemas/measurement";
import { notifyOps, sendCustomerConfirmation, formatLeadEmailHtml } from "@/lib/email";
import type { ActionResult } from "./submitLead";

export async function submitMeasurement(
  data: MeasurementProfileFormData,
  leadId?: string
): Promise<ActionResult> {
  // Validate input
  const parsed = measurementProfileSchema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const supabase = await createServiceClient();
    const d = parsed.data;

    // If no leadId provided and contact info exists, create a lead first
    let resolvedLeadId = leadId;
    
    if (!resolvedLeadId && (d.name || d.email)) {
      const { data: lead, error: leadError } = await supabase
        .from("leads")
        .insert({
          source_page: "/fit-guide",
          lead_type: "measurement_help",
          name: d.name || "Anonymous",
          email: d.email || null,
          phone: d.phone || null,
          garment_interest: d.garment_category,
          status: "new",
        })
        .select("id")
        .single();

      if (!leadError && lead) {
        resolvedLeadId = lead.id;
      }
    }

    // Create measurement profile
    const { data: measurement, error: measurementError } = await supabase
      .from("measurement_profiles")
      .insert({
        lead_id: resolvedLeadId || null,
        unit: d.unit,
        method: d.method,
        garment_category: d.garment_category,
        body_measurements: d.body_measurements || null,
        garment_measurements: d.garment_measurements || null,
        height: d.height || null,
        weight: d.weight || null,
        usual_size: d.usual_size || null,
        fit_preference: d.fit_preference || null,
        confidence_level: d.confidence_level,
        notes: d.notes || null,
      })
      .select("id")
      .single();

    if (measurementError) {
      console.error("Measurement insert error:", measurementError);
      return {
        ok: false,
        message: "Failed to save measurements. Please try again.",
      };
    }

    // Send ops notification
    await notifyOps(
      `New ${d.garment_category} measurements from ${d.name || "Customer"}`,
      formatLeadEmailHtml({
        ...d,
        measurement_id: measurement.id,
        linked_lead_id: resolvedLeadId,
      }),
      d.email || undefined
    );

    // Send customer confirmation if email provided
    if (d.email) {
      await sendCustomerConfirmation(d.email, d.name || "Customer", "measurement");
    }

    return {
      ok: true,
      message: d.confidence_level === "video_fitting_requested"
        ? "Your measurements and video fitting request have been received! We'll schedule your session soon."
        : "Your measurements have been saved! We'll review them before production.",
      id: measurement.id,
    };
  } catch (error) {
    console.error("Submit measurement error:", error);
    return {
      ok: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
