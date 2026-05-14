---
name: component-system-builder
description: Build reusable, typed, accessible UI components for the Weavers Atelier site. Use when creating a new shared component, refactoring page-specific markup into a reusable component, scaffolding the component library (SiteHeader, PageHero, CategoryCard, LookbookCard, WhatsAppButton, etc.), or reviewing components for reusability, accessibility, responsiveness, and clean API.
---

# Component System Builder Skill

Use this skill when creating reusable UI components.

## Preferred component categories

- Layout
- Typography
- Cards
- Forms
- CTAs
- Lookbook
- Product customization
- Measurement
- Trust elements
- Navigation

## Component standards

- Single responsibility.
- Typed props.
- Reusable across pages.
- Accessible by default.
- Mobile responsive.
- Accepts className or styling extension if project pattern allows.
- Does not contain page-specific copy unless intentionally scoped.
- Does not fetch data unless designed as a data component.

## Recommended components

- SiteHeader
- MobileNav
- SiteFooter
- PageHero
- SectionHeader
- EditorialSplit
- CTASection
- TrustChips
- CategoryCard
- ProductWorldCard
- LookbookCard
- CustomizationOptionCard
- FitPreferenceSelector
- MeasurementUnitToggle
- ReferenceUpload
- WhatsAppButton
- StickyMobileCTA
- Accordion
- FilterPills
- FormStepIndicator

## Quality checklist

- Can be reused?
- Does it match design?
- Is it accessible?
- Is it responsive?
- Is it typed?
- Is the API clean?

## Workflow

1. Inspect the existing project structure to identify the framework, styling system, and component conventions before creating anything new.
2. Check whether a similar component already exists; extend it instead of duplicating.
3. Place shared components in the project's shared component directory; page-specific components may live near the page only if not reused.
4. Name components clearly using the recommended names above (e.g. `CategoryCard`, `LookbookCard`, `ConsultationForm`, `MeasurementStep`).
5. Define typed props with clear, minimal API surface. Avoid unrelated business logic inside the component.
6. Use semantic HTML, proper heading order, visible focus states, and labels connected to inputs.
7. Build mobile-first and verify responsive behavior on desktop and mobile.
8. Honor the Weavers visual system: warm ivory base, deep charcoal text, royal blue used sparingly for selected/hover/focus and signature accents only.
9. Keep copy out of the component unless the component is intentionally scoped (e.g. `WhatsAppButton` label).
10. Run the quality checklist before considering the component done.
