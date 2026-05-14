import { z } from "zod";
import { baseLeadObjectSchema } from "./lead";

export const garmentCategorySchema = z.enum([
  "shirt",
  "trouser",
  "jeans",
  "jacket",
  "weddingwear",
  "kurta",
  "waistcoat",
  "blazer",
]);

export const measurementMethodSchema = z.enum([
  "body",
  "garment",
  "reference_upload",
  "video_fitting",
]);

export const fitPreferenceSchema = z.enum([
  "slim",
  "regular",
  "relaxed",
  "oversized",
]);

// Shirt-specific options
export const shirtOptionsSchema = z.object({
  fabric_preference: z.string().optional(),
  fit: fitPreferenceSchema.optional(),
  collar: z.string().optional(),
  cuff: z.string().optional(),
  pocket: z.string().optional(),
  sleeve_length: z.string().optional(),
  monogram: z.string().optional(),
  embroidery_notes: z.string().optional(),
});

// Trouser-specific options
export const trouserOptionsSchema = z.object({
  fabric_preference: z.string().optional(),
  fit: fitPreferenceSchema.optional(),
  pleat: z.enum(["flat_front", "single_pleat", "double_pleat"]).optional(),
  waistband: z.enum(["belt_loops", "side_adjusters", "extended_waistband"]).optional(),
  length_break: z.enum(["no_break", "slight_break", "full_break"]).optional(),
  cuff: z.boolean().optional(),
});

// Denim-specific options
export const denimOptionsSchema = z.object({
  product_type: z.enum(["jeans", "jacket", "shorts", "skirt"]).optional(),
  fit: fitPreferenceSchema.optional(),
  wash: z.string().optional(),
  fabric_weight: z.enum(["lightweight", "midweight", "heavyweight"]).optional(),
  embroidery_type: z.enum(["none", "floral", "geometric", "custom"]).optional(),
  embroidery_placement: z.string().optional(),
  contrast_stitching: z.boolean().optional(),
  contrast_stitch_color: z.string().optional(),
  patchwork: z.boolean().optional(),
  distressing: z.enum(["none", "light", "medium", "heavy"]).optional(),
});

// Weddingwear-specific options
export const weddingwearOptionsSchema = z.object({
  garment_type: z.string().optional(),
  role: z.enum(["groom", "family", "guest", "groomsman"]).optional(),
  event_date: z.string().optional(),
  number_of_outfits: z.number().optional(),
  preferred_colors: z.array(z.string()).optional(),
  style_references: z.string().optional(),
});

// Statement piece options
export const statementPieceOptionsSchema = z.object({
  garment_type: z.string().optional(),
  inspiration: z.string().optional(),
  special_details: z.string().optional(),
});

// Combined custom order schema
export const customOrderSchema = baseLeadObjectSchema
  .extend({
    garment_type: z.string(),
    category: garmentCategorySchema,
    measurement_method: measurementMethodSchema.optional(),
    need_by_date: z.string().optional(),
    budget_range: z.string().optional(),
    
    // Type-specific options stored as JSON
    shirt_options: shirtOptionsSchema.optional(),
    trouser_options: trouserOptionsSchema.optional(),
    denim_options: denimOptionsSchema.optional(),
    weddingwear_options: weddingwearOptionsSchema.optional(),
    statement_options: statementPieceOptionsSchema.optional(),
  })
  .refine(
    (data) => data.email || data.phone || data.whatsapp,
    {
      message: "At least one contact method (email, phone, or WhatsApp) is required",
      path: ["email"],
    }
  );

export type CustomOrderFormData = z.infer<typeof customOrderSchema>;
export type ShirtOptions = z.infer<typeof shirtOptionsSchema>;
export type TrouserOptions = z.infer<typeof trouserOptionsSchema>;
export type DenimOptions = z.infer<typeof denimOptionsSchema>;
export type WeddingwearOptions = z.infer<typeof weddingwearOptionsSchema>;
export type StatementPieceOptions = z.infer<typeof statementPieceOptionsSchema>;
