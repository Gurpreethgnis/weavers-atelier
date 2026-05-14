---
name: seo-a11y-performance-review
description: >-
  Runs a structured SEO, accessibility, and performance review before a page is
  marked complete. Use when finishing a page or route, before merge or ship,
  when the user asks for an SEO/a11y/perf audit, or when validating layout,
  metadata, forms, images, and client JS for a public page.
---

# SEO Accessibility Performance Review

Use this skill **before marking a page complete**.

## How to apply

1. Identify the page entry: layout or `page.tsx` / route component, plus any page-specific components and metadata exports.
2. Inspect metadata (title, description, Open Graph, canonical), headings in DOM order, images, forms, interactive components, and above-the-fold content.
3. Cross-check framework patterns (e.g. Next.js `metadata`, `next/image`, dynamic imports) against the checklists below.
4. Produce the **Output** sections in order; cite concrete evidence (file paths, selectors, or props).

## SEO check

- title
- description
- OG title
- OG description
- OG image
- canonical if applicable
- semantic headings

## Accessibility check

- heading order
- alt text
- form labels
- keyboard navigation
- visible focus
- error states
- color contrast
- reduced motion

## Performance check

- optimized images
- lazy loading
- no heavy embeds above fold
- minimal client JS
- no unnecessary dependencies
- responsive images
- mobile speed

## Severity guidance

- **Critical blockers**: breaks SEO indexation/social preview, WCAG failure that blocks task completion, or severe perf (e.g. huge LCP, blocking main thread) for primary user flow.
- **Important fixes**: incorrect or missing metadata patterns, a11y gaps that hurt many users, meaningful perf cost without strong justification.
- **Nice-to-have improvements**: polish, minor contrast, micro-optimizations, future-proofing.

## Output

Use this structure for every review:

### 1. Critical blockers

(List with file references; empty section if none.)

### 2. Important fixes

### 3. Nice-to-have improvements

### 4. Files to modify

(Bulleted paths only; the agent should list every file that would need a change to resolve Critical + Important items.)

## Quick verification hints (non-normative)

- **Metadata**: read `metadata` / `generateMetadata`, layout `<head>`, or equivalent; confirm OG/twitter fields where the stack supports them.
- **Headings**: one logical `h1` per view; levels do not skip (`h1` → `h3` without `h2` is a flag unless structure is intentional and valid).
- **Images**: prefer responsive formats and `sizes`; lazy-load below the fold; LCP image should not be lazy-loaded in a way that delays discovery.
- **Client JS**: note `"use client"` boundaries and large imports; suggest server components or dynamic import when appropriate.
- **Motion**: respect `prefers-reduced-motion` for non-essential animation.
- **Contrast / focus**: flag obvious issues; deep contrast audit may need tooling in browser.

After addressing Critical and Important items, re-run this skill once before marking the page complete.
