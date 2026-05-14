import { z } from "zod";
import { baseLeadObjectSchema } from "./lead";
import { garmentCategorySchema, measurementMethodSchema } from "./custom-order";

export const instagramRecreateSchema = baseLeadObjectSchema
  .extend({
    instagram_url: z.string().url("Please enter a valid Instagram URL").optional().or(z.literal("")),
    lookbook_item_id: z.string().optional(),
    look_category: garmentCategorySchema.optional(),
    desired_changes: z.string().optional(),
    garment_type: z.string().optional(),
    need_by_date: z.string().optional(),
    budget_range: z.string().optional(),
    measurement_method: measurementMethodSchema.optional(),
  })
  .refine(
    (data) => data.email || data.phone || data.whatsapp,
    {
      message: "At least one contact method (email, phone, or WhatsApp) is required",
      path: ["email"],
    }
  );

export type InstagramRecreateFormData = z.infer<typeof instagramRecreateSchema>;
