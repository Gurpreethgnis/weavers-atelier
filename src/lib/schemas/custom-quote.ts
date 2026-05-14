import { z } from "zod";
import {
  shirtOptionsSchema,
  trouserOptionsSchema,
  denimOptionsSchema,
  weddingwearOptionsSchema,
  statementPieceOptionsSchema,
} from "./custom-order";

export const customQuoteSchema = z.object({
  product_id: z.string().uuid().optional(),
  product_name: z.string().optional(),
  category: z.enum(["shirt", "trouser", "denim", "weddingwear", "statement"]),

  customer_email: z.string().email("Valid email is required"),
  customer_name: z.string().min(2, "Name is required"),
  customer_phone: z.string().optional(),

  size_preference: z.enum(["XS", "S", "M", "L", "XL", "XXL", "custom"]).optional(),
  measurement_method: z.enum(["body", "garment", "reference_upload", "video_fitting"]).optional(),
  measurement_profile_id: z.string().uuid().optional(),

  requested_options: z.record(z.string(), z.unknown()).optional(),
  notes: z.string().optional(),
  reference_image_urls: z.array(z.string().url()).optional(),

  need_by_date: z.string().optional(),
});

export const shirtQuoteSchema = customQuoteSchema.extend({
  category: z.literal("shirt"),
  requested_options: shirtOptionsSchema.optional(),
});

export const trouserQuoteSchema = customQuoteSchema.extend({
  category: z.literal("trouser"),
  requested_options: trouserOptionsSchema.optional(),
});

export const denimQuoteSchema = customQuoteSchema.extend({
  category: z.literal("denim"),
  requested_options: denimOptionsSchema.optional(),
});

export const weddingwearQuoteSchema = customQuoteSchema.extend({
  category: z.literal("weddingwear"),
  requested_options: weddingwearOptionsSchema.optional(),
  event_date: z.string().optional(),
});

export const statementQuoteSchema = customQuoteSchema.extend({
  category: z.literal("statement"),
  requested_options: statementPieceOptionsSchema.optional(),
});

export type CustomQuoteInput = z.infer<typeof customQuoteSchema>;
export type ShirtQuoteInput = z.infer<typeof shirtQuoteSchema>;
export type TrouserQuoteInput = z.infer<typeof trouserQuoteSchema>;
export type DenimQuoteInput = z.infer<typeof denimQuoteSchema>;
export type WeddingwearQuoteInput = z.infer<typeof weddingwearQuoteSchema>;
export type StatementQuoteInput = z.infer<typeof statementQuoteSchema>;
