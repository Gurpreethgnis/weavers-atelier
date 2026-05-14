"use server";

import { consultationSchema, type ConsultationFormData } from "@/lib/schemas";
import { createServiceClient } from "@/lib/supabase/server";
import { notifyOps, sendCustomerConfirmation, formatLeadEmailHtml } from "@/lib/email";

export async function submitConsultation(data: ConsultationFormData) {
  // Validate input
  const parsed = consultationSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid form data. Please check your inputs.",
    };
  }

  const formData = parsed.data;

  try {
    const supabase = await createServiceClient();

    // Insert into consultation_requests table
    const { error: dbError } = await supabase.from("consultation_requests").insert({
      full_name: formData.full_name,
      email: formData.email,
      whatsapp: formData.whatsapp || null,
      country: formData.country,
      city: formData.city || null,
      preferred_contact_method: formData.preferred_contact_method,
      notes: formData.notes || null,
      consultation_type: formData.consultation_type,
      preferred_date: formData.preferred_date || null,
      preferred_time: formData.preferred_time || null,
      timezone: formData.timezone || null,
      event_date: formData.event_date || null,
      garment_type: formData.garment_type || null,
      budget_range: formData.budget_range || null,
      role: formData.role || null,
      number_of_outfits: formData.number_of_outfits || null,
      source_page: "/book-consultation",
    });

    if (dbError) {
      console.error("Database error:", dbError);
      return {
        success: false,
        error: "Failed to save your request. Please try again.",
      };
    }

    // Send ops notification
    await notifyOps(
      `New Consultation Request: ${formData.consultation_type}`,
      `
        <h2>New Consultation Request</h2>
        <p><strong>Type:</strong> ${formData.consultation_type}</p>
        ${formatLeadEmailHtml(formData)}
      `,
      formData.email
    );

    // Send customer confirmation
    if (formData.email) {
      await sendCustomerConfirmation(formData.email, formData.full_name, "consultation");
    }

    return { success: true };
  } catch (error) {
    console.error("Consultation submission error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
