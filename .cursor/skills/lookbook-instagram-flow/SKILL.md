---
name: lookbook-instagram-flow
description: Build and review the Weavers Instagram Looks / Lookbook experience and "Recreate This Look" custom flow. Use when creating or editing the Instagram Looks page, scaffolding lookbook cards and filters, wiring website-hosted thumbnails over live Instagram embeds, adding the Recreate This Look CTA and form, or reviewing a lookbook page for performance, structure, and inquiry conversion.
---

# Lookbook and Instagram Flow Skill

Use this skill for Instagram-inspired custom look flows.

Purpose:
Convert inspiration into structured custom requests.

Lookbook item fields:
- title
- category
- tags
- imageUrl
- videoUrl
- instagramUrl
- description
- featured
- sortOrder

Look card must include:
- Image/video thumbnail
- Category tag
- Look name
- Best-for label
- Recreate This Look CTA
- View on Instagram CTA

Filters:
- Shirts
- Trousers
- Denim
- Weddingwear
- Kurtas
- Blazers
- Waistcoats
- Embroidery
- Statement Pieces

Recreate form fields:
- name
- email
- phone/whatsapp
- country
- city
- instagramUrl
- screenshotUpload
- desiredChanges
- garmentType
- needByDate
- budgetRange
- measurementMethodPreference

Standards:
- Do not rely only on live Instagram embeds.
- Use website-hosted thumbnails for speed.
- Keep Instagram proof but avoid blocking performance.
- Make the Recreate flow very visible.

## Suggested data shape

```ts
type LookbookItem = {
  title: string;
  category:
    | "shirts"
    | "trousers"
    | "denim"
    | "weddingwear"
    | "kurtas"
    | "blazers"
    | "waistcoats"
    | "embroidery"
    | "statement_pieces";
  tags: string[];
  imageUrl: string;
  videoUrl?: string;
  instagramUrl?: string;
  description?: string;
  bestFor?: string;
  featured?: boolean;
  sortOrder?: number;
};

type RecreateLookSubmission = {
  fullName: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  country: string;
  city?: string;
  instagramUrl?: string;
  screenshotUpload?: File[];
  desiredChanges?: string;
  garmentType:
    | "shirt"
    | "trouser"
    | "denim"
    | "weddingwear"
    | "kurta"
    | "blazer"
    | "waistcoat"
    | "embroidery"
    | "statement_piece";
  needByDate?: string;
  budgetRange?: string;
  measurementMethodPreference?: "body" | "garment" | "reference" | "video";
  lookId?: string;
};
```

## Acceptance checklist

- Lookbook page is mobile-first, fast, and editorial in feel.
- Cards use website-hosted thumbnails, not live Instagram embeds, for above-the-fold content.
- Each card shows category tag, look name, best-for label, Recreate CTA, and View on Instagram CTA.
- Filters work for all listed categories and do not break empty states.
- Recreate flow is reachable from every card and from a primary page-level CTA.
- Recreate form captures all listed fields with validation, loading, success, and error states.
- Screenshot upload supports JPG/PNG/WebP with size limits.
- Submission is structured JSON ready for CRM/backend.
- Page meets SEO, accessibility, and performance standards.

## Related skills

- `custom-form-builder` — for the Recreate form's UX, validation, and submission patterns.
- `component-system-builder` — for reusable `LookbookCard`, filter chips, and CTA components.
- `premium-page-builder` — for the Instagram Looks page shell, hero, and CTAs.
- `fit-studio-builder` — when `measurementMethodPreference` routes a customer into the Fit Studio.
