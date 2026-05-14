---
name: forms-data-reviewer
description: >-
  Review Weavers forms, validation, submission flow, and data schemas for lead
  capture, custom orders, measurements, consultations, and uploads. Use when
  auditing or finishing any form, API payload, Fit Studio step, or before merge
  or launch when forms, validation, or CRM-ready JSON must be verified.
---

# Forms and Data Reviewer

Act as a **forms and data quality reviewer** for Weavers Atelier. Do not treat forms as visual-only: every field must support real submission, validation, and structured storage.

## When to use

- New or changed customer forms (contact, consultation, product-specific, measurement).
- Fit Studio or measurement flows.
- File upload UX and constraints.
- Before merge, launch, or when wiring submission handlers and payloads.

## How to apply

1. Locate the form component(s), schema/types (Zod, TS types, etc.), submit handler, and API route or action (if any).
2. Map fields to **universal lead fields** and **lead type** from project rules (see `.cursor/rules/forms-data-standards.mdc`).
3. Check validation rules, error/success/loading states, and preserved input on failure.
4. For domain-specific flows, apply the **special checks** below.
5. Produce the **Output** sections in order; cite files, field names, and behaviors.

## Universal checks (all lead forms)

Confirm presence and wiring (not just UI labels):

- `fullName`, `email`, phone or WhatsApp, `country`, `city`, `preferredContactMethod`, `garmentInterest`, `needByDate`, `notes`, and `uploadedReferences` where relevant.
- **Lead type** discriminant: `general` | `shirt` | `trouser` | `denim` | `weddingwear` | `statement_piece` | `instagram_recreate` | `measurement_help` | `consultation`.
- **Contact**: at least one contact method required; email valid if provided; phone/WhatsApp supports country codes.
- **Dates**: `needByDate` not in the past where captured.
- **Submission**: structured JSON (or equivalent), no silent failure, clear “what happens next” after success.
- **Uploads**: type allowlist (JPG, PNG, WebP; HEIC if feasible; PDF optional for measurement sheets), max size enforced and shown, loading/preview where appropriate.

## Special checks

### Weddingwear

- `eventDate` and `needByDate` (and that timelines are realistic—no auto-promise for urgent/event).
- Event-specific context: e.g. role, outfit count, palette, coordination notes—match what `.cursor/skills/custom-form-builder/SKILL.md` lists for weddingwear where applicable.

### Denim

- Customization capture: e.g. denim type, fit, wash, embroidery (type/placement), patches, contrast stitching—aligned with product copy and custom-form-builder.

### Fit Studio / measurements

Per `.cursor/rules/fit-studio-standards.mdc`:

- Measurement **method** (body vs garment paths; reference upload; video fitting request where offered).
- **Unit** (inches/cm) stored with values.
- **Garment category** and progressive disclosure (not all fields at once).
- **Fit preference** and **confidence** (Very confident / Somewhat confident / Please review carefully / Video fitting before production).
- Reference upload encouraged for jeans, shirts, trousers, jackets, weddingwear.
- Numeric validation for measurement values; link to lead/order when the app supports it.

### Consultation

- Captures scheduling intent, garment focus, and universal lead fields; `needByDate` or event timing as relevant.

### Instagram / recreate-a-look

- Reference links or uploads, garment intent, universal fields, lead type `instagram_recreate`.

## Severity (use inside section 5)

- **Launch blockers**: decorative submit, missing required fields for the lead type, no validation, silent failures, uploads unconstrained, past `needByDate` allowed, weddingwear without event dates, Fit Studio without method/unit/confidence storage.
- **Pre-launch important**: weak error copy, missing loading state, inputs cleared on error, unclear success messaging, schema missing fields the UI collects (or vice versa).
- **Post-launch / polish**: microcopy, optional analytics, minor progressive-disclosure tweaks.

## Output

Use this structure for every review. Cite evidence (paths, prop names, schema keys).

### 1. Missing fields

(List fields or lead-type data missing from UI, schema, or payload.)

### 2. Validation gaps

(Rules not enforced, wrong types, dates, phone/email, measurements, uploads.)

### 3. UX friction

(Labels, steps, mobile, step-based vs wall of fields, error discoverability, loading/success clarity.)

### 4. Data model gaps

(Mismatches between UI and JSON shape, missing lead type, missing CRM-ready keys, Fit Studio fields not persisted, no unit/method/confidence.)

### 5. Required fixes before launch

(Numbered, actionable list prioritizing launch blockers; reference files to change.)

---

After fixes, re-run this skill once on the same form flow before marking it complete.

## Related project context

- `.cursor/rules/forms-data-standards.mdc` — normative form and validation rules.
- `.cursor/rules/fit-studio-standards.mdc` — Fit Studio behavior and data.
- `.cursor/skills/custom-form-builder/SKILL.md` — field lists by form type and build process.
