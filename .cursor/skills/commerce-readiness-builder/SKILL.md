---
name: commerce-readiness-builder
description: Guides inquiry-first and quote-ready commerce implementation for Weavers Atelier—orders, quote flow, delivery, payment hooks, lead/order status models, operational fields, and policy pages. Use when implementing or reviewing anything related to orders, quotes, checkout, payment links, delivery, returns, alterations, CRM-ready payloads, or commerce policy content.
---

# Commerce Readiness Builder Skill

Use this skill when implementing anything related to orders, quote flow, delivery, payment, or policies.

Current preferred model:

- Inquiry-first for complex products.
- Consultation-first for weddingwear.
- Payment links or manual quote flow later.
- Full checkout later for simpler products.

Do not overbuild checkout prematurely.

Required operational fields:

- leadType
- garmentType
- selectedOptions
- needByDate
- eventDate, if relevant
- measurementMethod
- uploadedReferences
- budgetRange
- status
- internalNotes

Useful statuses:

Lead:

- new
- contacted
- awaiting_customer
- consultation_booked
- quoted
- converted
- closed_lost
- spam

Order request:

- draft
- submitted
- under_review
- measurement_review
- quote_needed
- quote_sent
- payment_pending
- confirmed
- in_production
- ready_to_dispatch
- dispatched
- delivered
- alteration_support
- completed
- cancelled

Policy readiness:

- Terms
- Privacy
- Delivery
- Returns and Alterations
- Contact

Acceptance:

- The build can grow into real commerce.
- No fake promises.
- No fake checkout unless requested.
- Quote/payment flow can be added without rebuilding.

## Additional guidance

For implementation patterns (JSON shape, weddingwear dates, checkout stubs, policy links), see [reference.md](reference.md).
