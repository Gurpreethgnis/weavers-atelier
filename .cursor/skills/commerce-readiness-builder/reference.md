# Commerce Readiness Builder — reference

## Data and APIs

- Prefer one JSON-friendly lead/order document that already includes the operational fields from `SKILL.md`, so CRM, admin, and future checkout can attach without wide renames.
- Weddingwear: capture `eventDate` and `needByDate`; avoid UI copy that auto-promises delivery for urgent or event-driven orders.
- Checkout: non-functional placeholders are acceptable only if clearly labeled; prefer real inquiry/quote endpoints and explicit pay-via-link flows when payment is in scope.

## Policies and trust

- Link footer, forms, and any payment-adjacent screens to real policy routes (Terms, Privacy, Delivery, Returns and Alterations, Contact).
- Avoid dead policy links on flows that collect PII or payment intent.

## Workspace alignment

- `.cursor/rules/commerce-readiness-standards.mdc`
- `.cursor/rules/forms-data-standards.mdc`
- `.cursor/rules/fit-studio-standards.mdc` (when measurements attach to leads or orders)
