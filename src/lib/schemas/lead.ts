import { z } from "zod";

export const contactMethodSchema = z.enum(["email", "phone", "whatsapp"]);

export const leadTypeSchema = z.enum([
  "general",
  "shirt",
  "trouser",
  "denim",
  "weddingwear",
  "statement_piece",
  "instagram_recreate",
  "measurement_help",
  "consultation",
]);

// Base object schema without refinements - this can be extended
export const baseLeadObjectSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  whatsapp: z.string().optional().or(z.literal("")),
  country: z.string().min(1, "Country is required"),
  city: z.string().optional(),
  preferred_contact_method: contactMethodSchema.optional(),
  garment_interest: z.string().optional(),
  need_by_date: z.string().optional(),
  budget_range: z.string().optional(),
  notes: z.string().optional(),
});

// Base lead schema with refinement - use for standalone forms
export const baseLeadSchema = baseLeadObjectSchema.refine(
  (data) => data.email || data.phone || data.whatsapp,
  {
    message: "At least one contact method (email, phone, or WhatsApp) is required",
    path: ["email"],
  }
);

// Extended lead schema with source info
export const leadSchema = baseLeadObjectSchema
  .extend({
    source_page: z.string(),
    lead_type: leadTypeSchema,
  })
  .refine(
    (data) => data.email || data.phone || data.whatsapp,
    {
      message: "At least one contact method (email, phone, or WhatsApp) is required",
      path: ["email"],
    }
  );

export type LeadFormData = z.infer<typeof baseLeadSchema>;
export type LeadInput = z.infer<typeof leadSchema>;
