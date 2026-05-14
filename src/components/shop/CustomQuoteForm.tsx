"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitCustomQuote } from "@/lib/actions/custom-quote";
import {
  customQuoteSchema,
  type CustomQuoteInput,
} from "@/lib/schemas/custom-quote";
import type { ProductCategory, SizeOption } from "@/lib/supabase/types";

interface CustomQuoteFormProps {
  product?: {
    id: string;
    name: string;
    category: ProductCategory;
    base_price_cents: number;
  };
  category?: ProductCategory;
  onSuccess?: () => void;
}

const CATEGORY_OPTIONS: Record<ProductCategory, { label: string; fields: string[] }> = {
  shirt: {
    label: "Custom Shirt",
    fields: ["fabric_preference", "fit", "collar", "cuff", "pocket", "monogram"],
  },
  trouser: {
    label: "Custom Trousers",
    fields: ["fabric_preference", "fit", "pleat", "waistband", "cuff"],
  },
  denim: {
    label: "Custom Denim",
    fields: ["product_type", "fit", "wash", "embroidery_type", "distressing", "patchwork"],
  },
  weddingwear: {
    label: "Weddingwear",
    fields: ["garment_type", "role", "event_date", "number_of_outfits", "style_references"],
  },
  statement: {
    label: "Statement Piece",
    fields: ["garment_type", "inspiration", "special_details"],
  },
};

const FIT_OPTIONS: SizeOption[] = ["XS", "S", "M", "L", "XL", "XXL", "custom"];

export function CustomQuoteForm({ product, category, onSuccess }: CustomQuoteFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const effectiveCategory = product?.category || category || "shirt";
  const categoryConfig = CATEGORY_OPTIONS[effectiveCategory];

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CustomQuoteInput>({
    resolver: zodResolver(customQuoteSchema),
    defaultValues: {
      product_id: product?.id,
      product_name: product?.name,
      category: effectiveCategory,
      size_preference: "custom",
    },
  });

  const selectedSize = watch("size_preference");

  const onSubmit = async (data: CustomQuoteInput) => {
    setIsSubmitting(true);
    try {
      const result = await submitCustomQuote({
        ...data,
        reference_image_urls: uploadedImages,
      });

      if (result.success) {
        toast.success("Quote request submitted! We'll be in touch within 24 hours.");
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to submit. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Contact Information</h3>

        <div>
          <Label htmlFor="customer_name">Full Name *</Label>
          <Input
            id="customer_name"
            {...register("customer_name")}
            placeholder="Your full name"
            className="mt-1"
          />
          {errors.customer_name && (
            <p className="text-sm text-red-600 mt-1">{errors.customer_name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="customer_email">Email *</Label>
          <Input
            id="customer_email"
            type="email"
            {...register("customer_email")}
            placeholder="you@example.com"
            className="mt-1"
          />
          {errors.customer_email && (
            <p className="text-sm text-red-600 mt-1">{errors.customer_email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="customer_phone">Phone (optional)</Label>
          <Input
            id="customer_phone"
            type="tel"
            {...register("customer_phone")}
            placeholder="+1 (555) 123-4567"
            className="mt-1"
          />
        </div>
      </div>

      {/* Size & Fit */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Size & Fit</h3>

        <div>
          <Label>Starting Size Preference</Label>
          <p className="text-sm text-on-surface-variant mb-2">
            Select a standard size as reference, or choose &quot;Custom&quot; for made-to-measure
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {FIT_OPTIONS.map((size) => (
              <label
                key={size}
                className={`px-4 py-2 border cursor-pointer transition-all ${
                  selectedSize === size
                    ? "border-secondary bg-secondary text-surface"
                    : "border-outline-variant hover:border-outline"
                }`}
              >
                <input
                  type="radio"
                  value={size}
                  {...register("size_preference")}
                  className="sr-only"
                />
                {size}
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="measurement_method">How would you like us to get your measurements?</Label>
          <select
            id="measurement_method"
            {...register("measurement_method")}
            className="mt-1 w-full px-3 py-2 border border-outline-variant bg-surface focus:border-secondary outline-none"
          >
            <option value="">Select an option</option>
            <option value="body">I&apos;ll provide body measurements</option>
            <option value="garment">I&apos;ll measure a well-fitting garment</option>
            <option value="reference_upload">I&apos;ll upload photos of a reference garment</option>
            <option value="video_fitting">I&apos;d like a video fitting consultation</option>
          </select>
        </div>
      </div>

      {/* Category-Specific Options */}
      {effectiveCategory === "shirt" && (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Shirt Details</h3>

          <div>
            <Label htmlFor="fabric_preference">Fabric Preference</Label>
            <Input
              id="fabric_preference"
              {...register("requested_options.fabric_preference")}
              placeholder="e.g., Oxford cotton, linen, chambray"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="collar">Collar Style</Label>
              <Input
                id="collar"
                {...register("requested_options.collar")}
                placeholder="e.g., Spread, button-down"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cuff">Cuff Style</Label>
              <Input
                id="cuff"
                {...register("requested_options.cuff")}
                placeholder="e.g., Barrel, French"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="monogram">Monogram (optional)</Label>
            <Input
              id="monogram"
              {...register("requested_options.monogram")}
              placeholder="e.g., JDS"
              className="mt-1"
            />
          </div>
        </div>
      )}

      {effectiveCategory === "denim" && (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Denim Details</h3>

          <div>
            <Label htmlFor="product_type">Product Type</Label>
            <select
              id="product_type"
              {...register("requested_options.product_type")}
              className="mt-1 w-full px-3 py-2 border border-outline-variant bg-surface focus:border-secondary outline-none"
            >
              <option value="">Select type</option>
              <option value="jeans">Jeans</option>
              <option value="jacket">Jacket</option>
              <option value="shorts">Shorts</option>
            </select>
          </div>

          <div>
            <Label htmlFor="wash">Wash Preference</Label>
            <Input
              id="wash"
              {...register("requested_options.wash")}
              placeholder="e.g., Raw/dry, light wash, dark indigo"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="embroidery_type">Embroidery</Label>
            <select
              id="embroidery_type"
              {...register("requested_options.embroidery_type")}
              className="mt-1 w-full px-3 py-2 border border-outline-variant bg-surface focus:border-secondary outline-none"
            >
              <option value="none">No embroidery</option>
              <option value="floral">Floral</option>
              <option value="geometric">Geometric</option>
              <option value="custom">Custom design</option>
            </select>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("requested_options.contrast_stitching")}
                className="w-4 h-4"
              />
              <span>Contrast stitching</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("requested_options.patchwork")}
                className="w-4 h-4"
              />
              <span>Patchwork</span>
            </label>
          </div>
        </div>
      )}

      {effectiveCategory === "trouser" && (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Trouser Details</h3>

          <div>
            <Label htmlFor="fabric_preference">Fabric Preference</Label>
            <Input
              id="fabric_preference"
              {...register("requested_options.fabric_preference")}
              placeholder="e.g., Wool, cotton twill, linen"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pleat">Pleat Style</Label>
              <select
                id="pleat"
                {...register("requested_options.pleat")}
                className="mt-1 w-full px-3 py-2 border border-outline-variant bg-surface focus:border-secondary outline-none"
              >
                <option value="">Select style</option>
                <option value="flat_front">Flat front</option>
                <option value="single_pleat">Single pleat</option>
                <option value="double_pleat">Double pleat</option>
              </select>
            </div>
            <div>
              <Label htmlFor="waistband">Waistband</Label>
              <select
                id="waistband"
                {...register("requested_options.waistband")}
                className="mt-1 w-full px-3 py-2 border border-outline-variant bg-surface focus:border-secondary outline-none"
              >
                <option value="">Select style</option>
                <option value="belt_loops">Belt loops</option>
                <option value="side_adjusters">Side adjusters</option>
                <option value="extended_waistband">Extended waistband</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Need By Date */}
      <div>
        <Label htmlFor="need_by_date">When do you need this? (optional)</Label>
        <Input
          id="need_by_date"
          type="date"
          {...register("need_by_date")}
          min={new Date().toISOString().split("T")[0]}
          className="mt-1"
        />
        <p className="text-xs text-on-surface-variant mt-1">
          Let us know if you have a deadline — we&apos;ll factor it into your quote.
        </p>
      </div>

      {/* Reference Images */}
      <div>
        <Label>Reference Images (optional)</Label>
        <p className="text-sm text-on-surface-variant mb-2">
          Upload inspiration photos or images of garments you&apos;d like us to reference.
        </p>
        <div className="border-2 border-dashed border-outline-variant p-4 text-center">
          <Upload className="w-8 h-8 mx-auto text-on-surface-variant mb-2" />
          <p className="text-sm text-on-surface-variant">
            Drag & drop or click to upload
          </p>
          <p className="text-xs text-on-surface-variant mt-1">
            PNG, JPG up to 10MB each
          </p>
        </div>
        {uploadedImages.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {uploadedImages.map((url, i) => (
              <div key={i} className="relative w-16 h-16">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setUploadedImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <textarea
          id="notes"
          {...register("notes")}
          rows={4}
          placeholder="Any other details, preferences, or questions..."
          className="mt-1 w-full px-3 py-2 border border-outline-variant bg-surface focus:border-secondary outline-none resize-none"
        />
      </div>

      {/* Hidden fields */}
      <input type="hidden" {...register("product_id")} />
      <input type="hidden" {...register("product_name")} />
      <input type="hidden" {...register("category")} />

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint hover:text-on-surface"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Request Free Quote"
        )}
      </Button>

      <p className="text-xs text-center text-on-surface-variant">
        No commitment required • We&apos;ll respond within 24 hours
      </p>
    </form>
  );
}
