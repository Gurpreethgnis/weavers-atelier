# Weavers Website Implementation Knowledge Prompt for Cursor Coding Agent

## Purpose

This document is meant to be provided as **project knowledge/context** to the Cursor coding agent after the website design has been created in Stitch and connected through MCP.

The goal is to turn the approved visual design into a working product, not just a static landing page.

The site should become a premium custom menswear platform that supports:

- Custom shirts
- Tailored trousers
- Statement denim
- Weddingwear
- Statement pieces
- Instagram-inspired custom looks
- Fit guide and measurement collection
- Consultation booking
- Inquiry/order capture
- Admin-ready order data
- Future payment, delivery, and customer account support

---

# 1. Product Vision

Weavers is a premium custom menswear brand.

The brand is not positioned primarily as “Indian clothing,” “from India,” or “ethnicwear only.” It is a modern custom menswear studio focused on fit, personalization, detail, and occasion-ready style.

## Core Brand Message

**Custom Menswear, Made for You**

## Supporting Message

**Tailored shirts, trousers, denim, weddingwear, and statement pieces — made around your fit, your style, and your occasion.**

## Trust Line

**Guided measurements. Custom details. Delivered to your door.**

## Brand Pillars

1. **Tailored Essentials**  
   Custom shirts, trousers, overshirts, and everyday pieces with better fit.

2. **Statement Denim**  
   Custom jeans and denim pieces with embroidery, patches, contrast stitching, and personal details.

3. **Wedding & Occasionwear**  
   Sherwanis, bandhgalas, kurtas, waistcoats, blazers, groom/family looks, and event-ready statement pieces.

4. **Custom Looks**  
   Reference-based or Instagram-inspired pieces created around the customer’s preferred fit and style.

---

# 2. Build Philosophy

The Stitch design provides the visual direction. The implementation should preserve that design quality while making the product functional.

Do not flatten the experience into a generic template. The website must feel premium, editorial, and interactive.

The implementation should prioritize:

- Fast loading
- Strong mobile UX
- Clean component structure
- Reusable sections
- Real form handling
- Clear data capture
- Future commerce readiness
- Accessibility
- SEO foundations
- Analytics-ready events
- Admin-friendly data models

---

# 3. Technical Context

The website design has been generated in Stitch and connected to Cursor via MCP.

The coding agent should use MCP context to inspect the design, understand generated layout/components, and implement the real product logic behind it.

Cursor supports MCP as a way to connect external tools and data sources to the agent environment. Treat MCP-provided design artifacts as the source of design truth, but implement the production logic using the requirements in this document.

---

# 4. Required Website Pages

Implement these pages or route equivalents.

## 4.1 Home

Purpose: explain the brand, show product worlds, drive users to custom order or consultation.

Required sections:

1. Hero
2. Product category cards
3. Personalization/details section
4. How it works preview
5. Denim feature
6. Weddingwear feature
7. Instagram looks / recreate a look
8. Fit confidence section
9. Final CTA

Hero copy:

**Headline:**  
Custom Menswear, Made for You

**Subheadline:**  
Tailored shirts, trousers, denim, weddingwear, and statement pieces — made around your fit, your style, and your occasion.

**Primary CTA:**  
Start a Custom Order

**Secondary CTA:**  
Book a Styling Consultation

Trust chips:

- Guided Measurements
- Custom Details
- Tailored Fit
- Statement Pieces
- Delivered to Your Door

## 4.2 Custom Shirts

Purpose: explain shirt customization and collect order/inquiry intent.

Required content:

- Fabric choices
- Fit choices
- Collar choices
- Cuff choices
- Pocket choices
- Button/detail options
- Monogram/embroidery options
- Measurement CTA
- Reference upload CTA
- Order/inquiry form CTA

Required CTA:

**Customize a Shirt**

## 4.3 Trousers

Purpose: explain trouser customization and collect order/inquiry intent.

Required content:

- Fit options
- Pleat options
- Waistband options
- Length/break options
- Fabric options
- Measurement CTA
- Reference upload CTA

Required CTA:

**Customize Trousers**

## 4.4 Denim

Purpose: establish denim as a real product pillar, not an afterthought.

Required content:

- Custom jeans
- Embroidered jeans
- Patchwork
- Contrast stitching
- Fit selection
- Wash/fabric selection
- Embroidery placement
- Reference upload
- Denim measurement guide CTA

Required CTA:

**Design Your Denim**

## 4.5 Weddingwear

Purpose: premium consultation-first page for high-value, event-driven customers.

Required content:

- Groom looks
- Family and guest looks
- Reception/eveningwear
- Cultural/occasionwear
- Reference upload
- Need-by date
- Consultation form
- Timeline warning for wedding/event orders

Required CTA:

**Book Wedding Consultation**

## 4.6 Statement Pieces

Purpose: capture creative, reference-led, expressive custom work.

Required content:

- Embroidered shirts
- Utility shirts
- Four-pocket shirts
- Denim details
- Custom jackets
- Event looks
- Instagram/reference-based pieces

Required CTA:

**Create a Statement Piece**

## 4.7 Instagram Looks

Purpose: turn Instagram content into actionable custom orders.

Required content:

- Lookbook grid
- Filters
- “Recreate This Look” action
- “View on Instagram” action
- Reference upload
- Instagram link field

Look filters:

- Shirts
- Trousers
- Denim
- Weddingwear
- Kurtas
- Blazers
- Waistcoats
- Embroidery
- Statement Pieces

## 4.8 Fit Guide / Weavers Fit Studio

Purpose: reduce customer fear and capture usable measurements.

Required content:

- Body measurement flow
- Garment measurement flow
- Shirt measurement guide
- Trouser measurement guide
- Jeans measurement guide
- Jacket/weddingwear measurement guide
- Inches/cm toggle
- Fit preference selector
- Measurement confidence question
- Reference image upload
- Video fitting CTA

Required CTA:

**Start Fit Guide**

## 4.9 How It Works

Purpose: explain the custom order process.

Steps:

1. Choose your piece
2. Customize the details
3. Share your measurements
4. We review before production
5. Your piece is crafted and delivered

## 4.10 Book Consultation

Purpose: collect high-intent leads for styling, measurement, denim, statement pieces, and weddingwear.

Consultation types:

- Shirt fit consultation
- Trouser fit consultation
- Denim design consultation
- Weddingwear consultation
- Statement piece consultation
- Instagram look consultation
- Video measurement session

## 4.11 Delivery

Purpose: set expectations for production, delivery, timelines, and event deadlines.

Required content:

- Production time estimate
- Delivery time estimate
- Need-by date warning
- Tracking expectation
- International/customs note if relevant
- Manual quote note for high-value or complex orders

## 4.12 Returns & Alterations

Purpose: explain custom product limitations and support path.

Required content:

- Custom pieces are made to selected details and measurements
- Returns are limited for custom items
- Fit concerns reviewed case-by-case
- Local alteration guidance may be provided
- Measurement accuracy matters
- Contact window after delivery

## 4.13 Contact

Purpose: easy contact and WhatsApp entry.

Required content:

- Contact form
- WhatsApp CTA
- Email
- Business hours if available
- Instagram link

## 4.14 Track Order

Purpose: future-ready order status lookup.

Initial implementation can be static/manual or placeholder, but design should support:

- Order number
- Email/phone lookup
- Status display
- Tracking number
- Production stage

---

# 5. Global Components to Implement

Create reusable components rather than one-off page code.

## 5.1 Layout Components

- SiteHeader
- MobileNav
- SiteFooter
- PageHero
- SectionHeader
- EditorialSplit
- CTASection
- TrustChips
- Breadcrumbs

## 5.2 Product/Category Components

- CategoryCard
- ProductWorldCard
- CustomizationOptionCard
- DetailOptionGrid
- LookbookCard
- FeatureProductSection
- StatementFeatureBlock

## 5.3 Form Components

- ContactForm
- ConsultationForm
- CustomOrderForm
- MeasurementForm
- ReferenceUpload
- CountryField
- PhoneField
- NeedByDateField
- BudgetRangeField
- MeasurementUnitToggle
- FitPreferenceSelector
- MeasurementConfidenceSelector

## 5.4 UX Components

- StickyMobileCTA
- WhatsAppButton
- FormStepIndicator
- Accordion
- Tabs
- FilterPills
- ImageGallery
- VideoEmbed
- Toast/SuccessMessage
- ErrorMessage
- LoadingState

## 5.5 Admin/Data Components for Future

Even if no admin UI is built immediately, structure submitted data cleanly for future use.

- OrderStatusBadge
- LeadStatusBadge
- MeasurementSummary
- UploadedReferencePreview
- InternalNotes field, if admin exists

---

# 6. Core User Flows

## 6.1 Custom Shirt Flow

User path:

1. Lands on Custom Shirts page.
2. Reviews options.
3. Clicks Customize a Shirt.
4. Selects fabric preference.
5. Selects fit.
6. Selects collar/cuff/pocket/detail options.
7. Chooses measurement method.
8. Uploads reference images if desired.
9. Submits inquiry/order request.
10. Sees success confirmation and WhatsApp CTA.

Required data captured:

- Garment type: shirt
- Fabric preference
- Fit preference
- Collar
- Cuff
- Pocket
- Sleeve
- Monogram/embroidery
- Measurement method
- Need-by date
- Contact details
- Notes
- Reference uploads

## 6.2 Trouser Flow

User path:

1. Lands on Trousers page.
2. Reviews fit and style options.
3. Clicks Customize Trousers.
4. Selects fit, pleat, waistband, length/break.
5. Chooses measurement method.
6. Uploads reference garment/photo if desired.
7. Submits request.

Required data captured:

- Garment type: trouser
- Fit
- Pleat
- Waistband
- Length/break
- Fabric preference
- Measurement method
- Need-by date
- Contact details
- Notes
- Reference uploads

## 6.3 Denim Flow

User path:

1. Lands on Denim page.
2. Selects denim product type.
3. Selects fit.
4. Selects wash/fabric preference.
5. Selects embroidery/detail placement.
6. Uploads reference or sketch if needed.
7. Shares measurements or requests consultation.
8. Submits request.

Required data captured:

- Garment type: denim
- Denim product type
- Fit
- Wash/fabric preference
- Embroidery type
- Embroidery placement
- Patch/contrast stitching preference
- Reference uploads
- Measurement method
- Contact details
- Need-by date

## 6.4 Weddingwear Flow

User path:

1. Lands on Weddingwear page.
2. Reviews product worlds.
3. Clicks Book Wedding Consultation.
4. Provides event details.
5. Uploads references.
6. Provides budget and need-by date.
7. Submits consultation request.
8. Sees confirmation and WhatsApp CTA.

Required data captured:

- Consultation type: weddingwear
- Role: groom / family / guest / groomsman
- Event date
- Need-by date
- Number of outfits
- Garment type
- Budget range
- Preferred colors
- Reference uploads
- Contact details
- Country/city if needed
- Notes

## 6.5 Instagram Recreate Flow

User path:

1. User visits Instagram Looks.
2. Selects look card or clicks Recreate This Look.
3. Form opens with look prefilled if possible.
4. User provides Instagram link/screenshot.
5. User explains desired changes.
6. User selects garment type and need-by date.
7. User submits request.

Required data captured:

- Instagram link
- Uploaded screenshot/reference
- Look category
- Desired changes
- Garment type
- Need-by date
- Budget range
- Contact details
- Measurement method preference

## 6.6 Fit Studio Flow

User path:

1. User opens Fit Guide.
2. Chooses measurement type:
   - Body measurements
   - Garment measurements
   - Upload references
   - Book video fitting
3. Selects units: inches/cm.
4. Completes garment-specific fields.
5. Answers measurement confidence.
6. Submits measurements or attaches to order.

Required data captured:

- Measurement unit
- Measurement method
- Garment category
- Measurement values
- Height/weight, if requested
- Fit preference
- Confidence level
- Reference uploads
- Linked inquiry/order ID, if available

---

# 7. Forms and Validation

## 7.1 Universal Lead Fields

Use across forms:

- Full name
- Email
- WhatsApp/phone
- Country
- City
- Preferred contact method
- Garment/category interest
- Need-by date
- Notes
- Reference upload

## 7.2 Required Validation

- Name required
- At least one contact method required
- Email format validation if email used
- Phone should support country codes
- Need-by date cannot be in the past
- File upload limits should be clear
- Measurement values should be numeric
- Measurement unit required if measurements are submitted

## 7.3 File Upload Requirements

Support image uploads for:

- Reference garments
- Instagram screenshots
- Embroidery inspiration
- Weddingwear inspiration
- Existing well-fitting shirt/trouser/jeans photos

Accepted file types:

- JPG
- PNG
- WebP
- HEIC if feasible
- PDF optional for measurement sheets

Add size limits and user-friendly error messages.

---

# 8. Data Model Recommendation

Use these conceptual entities even if implementation is simple at first.

## 8.1 Lead

Fields:

- id
- createdAt
- sourcePage
- leadType
- name
- email
- phone
- whatsapp
- country
- city
- preferredContactMethod
- garmentInterest
- needByDate
- budgetRange
- notes
- status
- assignedTo
- uploadedReferences

Lead types:

- general
- shirt
- trouser
- denim
- weddingwear
- statement_piece
- instagram_recreate
- measurement_help
- consultation

## 8.2 CustomOrderRequest

Fields:

- id
- leadId
- garmentType
- category
- selectedOptions
- measurementMethod
- measurementId
- referenceUploads
- needByDate
- budgetRange
- status
- internalNotes
- createdAt
- updatedAt

## 8.3 MeasurementProfile

Fields:

- id
- customerId or leadId
- unit
- method
- garmentCategory
- bodyMeasurements
- garmentMeasurements
- height
- weight
- usualSize
- fitPreference
- confidenceLevel
- notes
- createdAt
- updatedAt

## 8.4 ConsultationRequest

Fields:

- id
- leadId
- consultationType
- preferredDate
- preferredTime
- timezone
- eventDate
- needByDate
- garmentType
- budgetRange
- referenceUploads
- status
- notes
- createdAt

## 8.5 LookbookItem

Fields:

- id
- title
- category
- tags
- imageUrl
- videoUrl
- instagramUrl
- description
- ctaLabel
- featured
- sortOrder

## 8.6 UploadedReference

Fields:

- id
- relatedEntityType
- relatedEntityId
- fileUrl
- fileType
- originalFileName
- uploadedAt
- notes

---

# 9. Order and Lead Statuses

Use status values consistently.

## 9.1 Lead Status

- new
- contacted
- awaiting_customer
- consultation_booked
- quoted
- converted
- closed_lost
- spam

## 9.2 Order Request Status

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

## 9.3 Consultation Status

- requested
- scheduled
- completed
- no_show
- converted
- cancelled

---

# 10. Messaging and Copy Rules

## 10.1 Use This Language

- Custom menswear
- Made for you
- Tailored around your fit
- Personal details
- Statement denim
- Weddingwear
- Crafted and delivered
- Guided measurements
- Reviewed before production
- Recreate this look
- Design your denim
- Book a styling consultation

## 10.2 Avoid This Language in Main Marketing

- Indian clothing
- Made in India
- Shipped from India
- Export
- Cheap custom
- Ethnicwear only
- Tailor shop
- Marketplace
- Discount
- Sale-heavy language

## 10.3 Approved Core Copy

Homepage headline:

**Custom Menswear, Made for You**

Homepage subheadline:

**Tailored shirts, trousers, denim, weddingwear, and statement pieces — made around your fit, your style, and your occasion.**

Fit trust copy:

**Share measurements, upload a well-fitting garment, or book a video fitting. If something looks unclear, our team checks before production.**

Instagram copy:

**Seen something you like on @itsweavers? Send the look, choose your details, and we’ll help create your version.**

Denim copy:

**Jeans do not have to be ordinary. Build denim around your preferred fit, wash, embroidery, patches, thread color, and placement details.**

Weddingwear copy:

**For groom looks, family outfits, reception jackets, and statement pieces made for major moments.**

---

# 11. Visual Implementation Rules

Use the approved Stitch design as visual source of truth.

Also preserve this design system:

## 11.1 Palette

Core neutrals:

- Warm Ivory: `#F6F1E8`
- Soft Bone: `#E8DFD2`
- Sand Taupe: `#C8B8A2`
- Stone Grey: `#8D8A84`
- Deep Charcoal: `#171717`
- Coffee Brown: `#4A3628`
- Ink Navy: `#0D1726`

Accent:

- Royal Blue: `#1F4FFF`
- Deep Royal Blue: `#1638B8`
- Muted Blue Grey: `#64748B`

Supporting:

- Washed Indigo: `#2F4F6F`
- Burgundy Ink: `#4A1F2B`
- Antique Gold: `#BFA46A`

## 11.2 Royal Blue Usage

Royal blue should be used sparingly:

- Hover states
- Selected customization options
- Denim accents
- Filter active states
- Form focus state
- Small labels
- Stitching-inspired line detail

Do not make the whole site blue.

## 11.3 Premium UI Rules

- Generous spacing
- Large images
- Minimal text per section
- Strong typography
- No cluttered catalog grids
- No cheap sale banners
- No generic template look
- Sticky mobile CTA
- Clean form steps
- Smooth subtle transitions

---

# 12. Integrations

## 12.1 WhatsApp

Implement WhatsApp click-to-chat CTAs.

Recommended default messages:

### General

Hi Weavers, I’m interested in a custom menswear piece and would like some help.

### Custom Shirt

Hi Weavers, I’m interested in a custom shirt. Can you help me with fabric, fit, and measurements?

### Denim

Hi Weavers, I’m interested in custom denim with embroidery/details. Can you help me design it?

### Weddingwear

Hi Weavers, I’m looking for weddingwear/occasionwear. My event date is ____.

### Instagram Look

Hi Weavers, I saw a look on your Instagram and want to create something similar.

## 12.2 Instagram

The Instagram Looks page should support:

- Manually managed lookbook items
- Instagram URL field
- Image/video thumbnail
- “View on Instagram”
- “Recreate This Look”

Do not rely only on live Instagram embeds. Use website-hosted images for performance and selected Instagram links/embeds for social proof.

## 12.3 Payments

If payments are implemented now, keep them simple and future-safe.

Possible initial approach:

- Inquiry/quote-first for complex products
- Payment link after quote
- Full payment for simpler custom shirts/trousers later
- Deposit flow for weddingwear later

Important: if using Razorpay international cards later, the website needs clearly defined Terms and Conditions, Privacy Policy, Refund/Cancellation Policy, and Shipping/Delivery Policy.

## 12.4 Delivery / Duties

Do not overpromise delivery timelines.

For now, use:

- Estimated production timeline
- Estimated delivery timeline
- Need-by date captured
- Manual confirmation for urgent/event orders

For international commerce later, products will need country-of-origin and HS code handling for duties/import tax calculations, even if public marketing does not emphasize origin.

## 12.5 Analytics

Instrument these events:

- hero_cta_click
- category_card_click
- start_custom_order
- start_denim_design
- book_consultation_click
- whatsapp_click
- lookbook_filter_click
- recreate_look_click
- reference_upload_started
- reference_upload_completed
- measurement_flow_started
- measurement_submitted
- consultation_form_submitted
- custom_order_form_submitted
- delivery_page_view
- returns_page_view

---

# 13. SEO Implementation

## 13.1 Page Metadata

Each page needs:

- Title
- Meta description
- Open Graph title
- Open Graph description
- Open Graph image
- Canonical URL

## 13.2 SEO Themes

Target broad custom menswear, not only weddingwear.

Themes:

- Custom menswear
- Custom shirts for men
- Tailored trousers
- Custom jeans
- Embroidered jeans for men
- Custom denim
- Weddingwear for men
- Groom outfits
- Custom sherwani
- Custom kurta
- Statement menswear
- Personalized clothing for men
- Made-to-measure shirts
- Custom embroidered clothing

## 13.3 Suggested Metadata Examples

### Home

Title: Custom Menswear, Made for You | Weavers  
Description: Tailored shirts, trousers, denim, weddingwear, and statement pieces made around your fit, your style, and your occasion.

### Denim

Title: Custom Denim and Embroidered Jeans | Weavers  
Description: Design custom jeans and denim pieces with your preferred fit, embroidery, patches, contrast stitching, and personal details.

### Weddingwear

Title: Weddingwear for Men | Custom Groom and Occasion Looks | Weavers  
Description: Custom weddingwear, groom looks, family outfits, reception jackets, kurtas, waistcoats, and statement occasion pieces.

---

# 14. Accessibility Requirements

Implement:

- Semantic HTML
- Proper heading order
- Alt text for all meaningful images
- Keyboard navigable menus and forms
- Visible focus states
- Form labels connected to inputs
- Error messages tied to fields
- Sufficient color contrast
- Reduced motion support if animations are used
- Button text that describes action clearly

---

# 15. Performance Requirements

The site must feel premium and fast.

Implement:

- Optimized images
- Responsive image sizes
- Lazy loading below-the-fold images
- Avoid heavy video on mobile unless optimized
- Preload key hero image/font if needed
- Minimize third-party scripts
- Use skeleton/loading states where appropriate
- Avoid blocking rendering with Instagram embeds

---

# 16. Security and Privacy Requirements

Implement:

- Server-side validation for forms
- File upload restrictions
- Spam prevention
- Rate limiting if available
- No public exposure of uploaded files unless intended
- Clear privacy policy
- Secure handling of contact details and measurements
- Environment variables for secrets
- No hardcoded API keys

---

# 17. MCP / Cursor Implementation Instructions

The coding agent should:

1. Inspect the Stitch-generated design through MCP.
2. Identify reusable components in the design.
3. Map design sections to the required pages and flows above.
4. Preserve the visual system and spacing.
5. Replace placeholder content with approved copy from this document.
6. Implement real form state, validation, and submission handling.
7. Add placeholder/mock backend if real backend is not ready.
8. Structure data models so the backend can be connected later.
9. Keep all product worlds extensible.
10. Avoid making the site only a static brochure.

MCP should be used as context, not as a reason to blindly paste design output. The final implementation must be maintainable.

---

# 18. Suggested Build Phases

## Phase 1: Functional Marketing Site

Build:

- Home
- Custom Shirts
- Trousers
- Denim
- Weddingwear
- Statement Pieces
- Instagram Looks
- Fit Guide
- How It Works
- Book Consultation
- Contact
- Delivery
- Returns & Alterations

Include:

- Responsive layout
- Form submissions
- WhatsApp CTAs
- Reference uploads, if backend/storage is ready
- Lookbook structure
- SEO metadata
- Analytics events

## Phase 2: Structured Order Capture

Add:

- Multi-step custom order form
- Measurement profile
- Saved form progress
- Better file upload handling
- Lead/order dashboard or admin export
- Email notifications
- CRM or database integration

## Phase 3: Commerce Readiness

Add:

- Quote system
- Payment links or checkout
- Deposit flow
- Customer account
- Saved measurements
- Order status tracking
- Delivery tracking
- Policy enforcement

## Phase 4: Advanced Customizer

Add:

- Visual shirt customizer
- Visual denim detail placement
- Saved looks
- Reorder flow
- Wedding group order management
- Admin production workflow

---

# 19. Acceptance Criteria

The build is acceptable only if:

- The site matches the premium Stitch design closely.
- The messaging is custom menswear-first, not Indian-clothing-first.
- Home page clearly shows shirts, trousers, denim, weddingwear, and statement pieces.
- Denim is implemented as a real product pillar.
- Weddingwear is consultation-first.
- Instagram Looks page supports “Recreate This Look.”
- Fit Guide supports measurement method selection and inches/cm.
- Forms are functional, validated, and user-friendly.
- Mobile experience is strong.
- WhatsApp CTAs work.
- SEO metadata exists.
- Pages load quickly.
- Code is componentized and maintainable.
- Future payments, orders, and admin flows can be added without rebuilding the whole site.

---

# 20. Final Instruction to Coding Agent

Build Weavers as a premium custom menswear platform, not just a static fashion homepage.

The approved design gives the visual direction. This document defines the product logic.

The implementation should make the brand feel alive by supporting real customer actions:

- Start a custom order
- Design denim
- Customize a shirt
- Customize trousers
- Book weddingwear consultation
- Recreate Instagram looks
- Submit measurements
- Upload references
- Contact through WhatsApp

The most important product idea is:

> **Custom Menswear, Made for You**

Everything in the build should support that idea.
