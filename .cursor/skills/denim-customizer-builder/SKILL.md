---
name: denim-customizer-builder
description: Builds the Weavers statement-denim customizer experience—page structure, step flow, copy, imagery, and form wiring for custom jeans, embroidery, patchwork, and contrast-stitch denim. Use when implementing or redesigning the Denim route, denim inquiry/customizer UI, denim-specific content, or denim visual treatment (royal blue + indigo).
---

# Denim Customizer Builder Skill

Use this skill for statement denim.

Denim is a real Weavers product pillar, not a minor add-on.

Denim positioning:

Custom denim with personality — jeans and denim pieces shaped around fit and finished with embroidery, patches, contrast stitching, and personal details.

Denim options:

- Custom jeans
- Embroidered jeans
- Patchwork jeans
- Contrast-stitch denim
- Denim overshirts
- Denim jackets, if available
- Utility denim pieces

Fit options:

- Slim
- Straight
- Relaxed
- Tapered
- Bootcut
- Wide-leg, if offered

Detail options:

- Initials
- Motif embroidery
- Back pocket embroidery
- Side seam embroidery
- Front thigh embroidery
- Hem embroidery
- Patchwork
- Contrast stitching
- Distressing level, if offered

Flow:

1. Choose denim piece.
2. Choose fit.
3. Choose wash/fabric.
4. Choose embroidery/detail placement.
5. Upload reference.
6. Share measurements.
7. Submit design request.

Visual standards:

- Denim page can use more royal blue than other pages.
- Pair royal blue with washed indigo and charcoal.
- Use close-up imagery.
- Show placement options visually if possible.

## Implementation notes (Weavers repo)

- Primary CTA for the Denim product page: **Design Your Denim** (per page standards); route to a meaningful customizer or denim lead flow.
- Treat the flow as inquiry-first: progressive steps, mobile-first, no fake checkout.
- Align denim lead data with the **custom-form-builder** skill: `denimType`, `fit`, `wash`, `embroideryType`, `embroideryPlacement`, `patches`, `contrastStitching`, plus universal lead fields (`fullName`, contact methods, `country`, `city`, `garmentInterest`, `needByDate`, `notes`, `uploadedReferences`).
- Fit Studio: support jeans measurement path when measurements are collected; respect inches/cm toggle and confidence options per fit-studio standards.
- SEO: denim themes include custom denim, custom jeans, embroidered jeans for men, custom embroidered clothing (see repo SEO rules).
- Motion: subtle only; respect `prefers-reduced-motion`.

## Cross-skills

- **premium-page-builder** — full Denim page ingredients (hero, CTAs, trust, footer).
- **component-system-builder** — reusable selectors, placement diagrams, upload UI.
- **custom-form-builder** — validation, states, and structured JSON for denim submissions.
