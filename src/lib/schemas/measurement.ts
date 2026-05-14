import { z } from "zod";

export const measurementUnitSchema = z.enum(["inches", "cm"]);

export const measurementMethodSchema = z.enum([
  "body",
  "garment",
  "reference_upload",
  "video_fitting",
]);

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

export const fitPreferenceSchema = z.enum([
  "slim",
  "regular",
  "relaxed",
  "oversized",
]);

export const measurementConfidenceSchema = z.enum([
  "very_confident",
  "somewhat_confident",
  "please_review",
  "video_fitting_requested",
]);

// Body measurements for shirts
export const shirtBodyMeasurementsSchema = z.object({
  neck: z.string().optional(),
  chest: z.string().optional(),
  waist: z.string().optional(),
  hips: z.string().optional(),
  shoulder_width: z.string().optional(),
  sleeve_length: z.string().optional(),
  bicep: z.string().optional(),
  wrist: z.string().optional(),
  shirt_length: z.string().optional(),
});

// Garment measurements for shirts
export const shirtGarmentMeasurementsSchema = z.object({
  collar: z.string().optional(),
  chest: z.string().optional(),
  waist: z.string().optional(),
  hem: z.string().optional(),
  shoulder: z.string().optional(),
  sleeve: z.string().optional(),
  cuff: z.string().optional(),
  length: z.string().optional(),
});

// Trouser/Jeans measurements
export const trouserMeasurementsSchema = z.object({
  waist: z.string().optional(),
  hips: z.string().optional(),
  rise: z.string().optional(),
  thigh: z.string().optional(),
  knee: z.string().optional(),
  leg_opening: z.string().optional(),
  inseam: z.string().optional(),
  outseam: z.string().optional(),
});

// Jacket/Weddingwear measurements
export const jacketMeasurementsSchema = z.object({
  chest: z.string().optional(),
  waist: z.string().optional(),
  hips: z.string().optional(),
  shoulder: z.string().optional(),
  sleeve: z.string().optional(),
  jacket_length: z.string().optional(),
  neck: z.string().optional(),
});

export const measurementProfileSchema = z.object({
  unit: measurementUnitSchema,
  method: measurementMethodSchema,
  garment_category: garmentCategorySchema,
  
  // Physical stats
  height: z.string().optional(),
  weight: z.string().optional(),
  usual_size: z.string().optional(),
  
  // Preferences
  fit_preference: fitPreferenceSchema.optional(),
  confidence_level: measurementConfidenceSchema,
  
  // Category-specific measurements (only one will be used)
  body_measurements: z.union([
    shirtBodyMeasurementsSchema,
    trouserMeasurementsSchema,
    jacketMeasurementsSchema,
  ]).optional(),
  garment_measurements: z.union([
    shirtGarmentMeasurementsSchema,
    trouserMeasurementsSchema,
    jacketMeasurementsSchema,
  ]).optional(),
  
  notes: z.string().optional(),
  
  // Contact info for standalone submission
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
});

export type MeasurementProfileFormData = z.infer<typeof measurementProfileSchema>;
export type ShirtBodyMeasurements = z.infer<typeof shirtBodyMeasurementsSchema>;
export type ShirtGarmentMeasurements = z.infer<typeof shirtGarmentMeasurementsSchema>;
export type TrouserMeasurements = z.infer<typeof trouserMeasurementsSchema>;
export type JacketMeasurements = z.infer<typeof jacketMeasurementsSchema>;
