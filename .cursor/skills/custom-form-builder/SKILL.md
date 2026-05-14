---
name: custom-form-builder
description: Build, scaffold, and review all Weavers Atelier customer forms (contact, consultation, custom shirt, trouser, denim, weddingwear, statement piece, instagram recreate, measurement). Use when creating a new Weavers form, adding fields to an existing form, wiring up form validation/submission, defining a form data shape, or reviewing a form for mobile UX, validation, states, and backend-readiness.
---

# Custom Form Builder Skill

Use this skill for all Weavers forms.

Form types:
- contact
- consultation
- custom shirt
- trouser
- denim
- weddingwear
- statement piece
- instagram recreate
- measurement

Process:
1. Identify form goal.
2. Select required fields.
3. Define data shape.
4. Build UI with premium spacing.
5. Add validation.
6. Add loading, success, and error states.
7. Add mobile behavior.
8. Wire submit handler.
9. Add analytics event if analytics exists.
10. Test empty, invalid, and valid submissions.

Universal fields:
- fullName
- email
- phone/whatsapp
- country
- city
- preferredContactMethod
- garmentInterest
- needByDate
- notes
- uploadedReferences

Special fields:

Weddingwear:
- eventDate
- role
- numberOfOutfits
- budgetRange
- preferredColors
- matchingFamilyOutfits

Denim:
- denimType
- fit
- wash
- embroideryType
- embroideryPlacement
- patches
- contrastStitching

Shirts:
- fabric
- fit
- collar
- cuff
- pocket
- sleeve
- monogram
- embroidery

Trousers:
- fit
- pleat
- waistband
- lengthBreak
- fabric

Instagram:
- instagramUrl
- screenshotUpload
- desiredChanges
- garmentType

Acceptance:
- Form is usable on mobile.
- Form validates correctly.
- Form submission does not silently fail.
- Success message explains what happens next.
- Data shape is backend-ready.
