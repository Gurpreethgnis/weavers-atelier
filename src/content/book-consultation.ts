/**
 * @deprecated This page has been retired.
 *
 * - For custom orders: Use the "Customize" button on any product page
 * - For weddingwear: Visit /contact?subject=wedding
 * - For statement pieces: Visit /contact?subject=custom
 *
 * This content file is kept for reference only.
 * The /book-consultation route should redirect to /shop or /contact.
 */

export const bookConsultationContent = {
  // Redirect message for anyone who lands on this page via direct URL
  redirect: {
    headline: "We've Improved Our Process",
    description:
      "Our consultation booking has been integrated into the shopping experience. You can now customize any product directly from its page, or contact us for wedding and custom projects.",
    options: [
      {
        label: "Shop the Collection",
        description: "Browse and customize any piece from our catalog.",
        href: "/shop",
        primary: true,
      },
      {
        label: "Wedding Consultation",
        description: "Planning wedding attire? Let's talk.",
        href: "/contact?subject=wedding",
        primary: false,
      },
      {
        label: "Custom Project",
        description: "Have something unique in mind? We're listening.",
        href: "/contact?subject=custom",
        primary: false,
      },
    ],
  },

  // Legacy content preserved for reference
  legacy: {
    consultationTypes: [
      {
        id: "shirt",
        label: "Custom Shirt",
        newPath: "/shop/shirts",
      },
      {
        id: "trouser",
        label: "Custom Trousers",
        newPath: "/shop/trousers",
      },
      {
        id: "denim",
        label: "Custom Denim",
        newPath: "/shop/denim",
      },
      {
        id: "weddingwear",
        label: "Weddingwear",
        newPath: "/contact?subject=wedding",
      },
      {
        id: "statement_piece",
        label: "Statement Piece",
        newPath: "/contact?subject=custom",
      },
      {
        id: "instagram_recreate",
        label: "Recreate a Look",
        newPath: "/lookbook",
      },
    ],
  },
};
