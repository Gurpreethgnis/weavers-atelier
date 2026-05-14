import { z } from "zod";
import { baseLeadObjectSchema } from "./lead";

export const consultationTypeSchema = z.enum([
  "shirt_fit",
  "trouser_fit",
  "denim_design",
  "weddingwear",
  "statement_piece",
  "instagram_look",
  "video_measurement",
]);

export const consultationSchema = baseLeadObjectSchema
  .extend({
    consultation_type: consultationTypeSchema,
    preferred_date: z.string().optional(),
    preferred_time: z.string().optional(),
    timezone: z.string().optional(),
    event_date: z.string().optional(),
    garment_type: z.string().optional(),
    budget_range: z.string().optional(),
    
    // Weddingwear specific
    role: z.enum(["groom", "family", "guest", "groomsman"]).optional(),
    number_of_outfits: z.number().optional(),
  })
  .refine(
    (data) => data.email || data.phone || data.whatsapp,
    {
      message: "At least one contact method (email, phone, or WhatsApp) is required",
      path: ["email"],
    }
  );

export type ConsultationFormData = z.infer<typeof consultationSchema>;
