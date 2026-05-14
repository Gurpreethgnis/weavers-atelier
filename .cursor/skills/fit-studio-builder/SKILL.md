---
name: fit-studio-builder
description: Build and review the Weavers Fit Studio and customer measurement flows. Use when creating or editing the Fit Studio experience, scaffolding a step-based measurement flow, adding garment category measurement guides (shirt, trouser, jeans, jacket, weddingwear), wiring inches/cm toggle, fit preference and confidence selectors, reference upload, video fitting request, or reviewing a measurement flow for UX, validation, data shape, and lead/order linkage.
---

# Fit Studio Builder Skill

Use this skill for Weavers Fit Studio and measurements.

## Fit Studio goal

Help customers submit useful measurements without feeling overwhelmed.

## Measurement paths

1. Body measurements
2. Garment measurements
3. Reference upload
4. Video fitting request

## Required UI

- Step-based flow (progressive disclosure)
- Inches/cm toggle
- Garment category selection
- Measurement method selection (body vs garment vs reference vs video)
- Fit preference selector
- Confidence selector
- Reference upload
- Review step before submit

## Garment categories

- Shirt
- Trouser
- Jeans
- Jacket
- Weddingwear

## Fit preference options

- Slim
- Tailored
- Regular
- Relaxed
- Oversized (if relevant)
- Tapered (for trousers/jeans)
- Straight (for trousers/jeans)

Filter options by garment category. Do not show trouser-only fits on shirts.

## Measurement confidence

- Very confident
- Somewhat confident
- Please review carefully
- I want a video fitting before production

If the customer selects "I want a video fitting before production", flag the submission for manual review before production.

## Recommended step order

1. Choose garment category.
2. Choose measurement method (body / garment / reference upload / video fitting).
3. Inches/cm toggle.
4. Enter measurements (grouped by garment type, only relevant fields).
5. Fit preference.
6. Confidence level.
7. Optional reference image upload.
8. Optional notes (height, weight, usual ready-made size).
9. Review step.
10. Submit.

## Standards

- Do not show all fields upfront. Use progressive disclosure.
- Explain the difference between body and garment measurements clearly, with short examples.
- Use diagram placeholders or short helper text for each measurement field.
- Validate numeric fields (positive numbers, sane ranges).
- Store the measurement unit (`in` or `cm`) on the submission.
- Store measurement method, garment category, fit preference, and confidence.
- Include a clear review step before submit.
- Link the measurement profile to the lead/order when available (`leadId` / `orderId`).
- Warn customers that custom fit depends on measurement accuracy.
- Encourage reference upload for jeans, shirts, trousers, jackets, and weddingwear.
- Respect mobile-first layout, large touch targets, and reduced-motion preferences.
- Follow Weavers design tokens, premium spacing, and accessibility standards.

## Data shape (suggested)

```ts
type MeasurementSubmission = {
  garmentCategory: "shirt" | "trouser" | "jeans" | "jacket" | "weddingwear";
  measurementMethod: "body" | "garment" | "reference" | "video";
  unit: "in" | "cm";
  measurements: Record<string, number>;
  fitPreference:
    | "slim"
    | "tailored"
    | "regular"
    | "relaxed"
    | "oversized"
    | "tapered"
    | "straight";
  confidence:
    | "very_confident"
    | "somewhat_confident"
    | "please_review"
    | "video_fitting_requested";
  height?: number;
  weight?: number;
  usualReadyMadeSize?: string;
  notes?: string;
  referenceImages?: File[];
  leadId?: string;
  orderId?: string;
};
```

## Acceptance checklist

- Step-based flow, no overwhelming single page.
- Garment category drives which measurement fields and fit options show.
- Inches/cm toggle works and unit is persisted on submit.
- Body vs garment measurement explained.
- Validation, loading, success, and error states implemented.
- Reference upload supports JPG/PNG/WebP with size limits.
- Confidence "video fitting" path flags submission for review.
- Review step shows all entered data before submit.
- Submission is structured JSON ready for CRM/backend.
- Mobile-friendly, accessible, and consistent with Weavers design system.

## Related skills

- `custom-form-builder` — for general form UX, validation, and submission patterns.
- `component-system-builder` — for reusable inputs, toggles, and step UI.
- `premium-page-builder` — for the Fit Studio page shell, hero, and CTAs.
