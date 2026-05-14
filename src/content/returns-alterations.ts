export const returnsAlterationsContent = {
  hero: {
    kicker: "Returns & Alterations",
    headline: "Our Fit Guarantee",
    description:
      "We stand behind every piece we make. If something doesn't fit right, we'll fix it. If it can't be fixed, we'll remake it.",
  },

  guarantee: {
    title: "The Weavers Guarantee",
    policies: [
      {
        title: "30-Day Fit Adjustments",
        description:
          "Within 30 days of delivery, we offer complimentary alterations to ensure your garment fits perfectly. This covers minor fit refinements that may be needed after your first wear.",
        note: "Applies to both ready-to-wear and custom orders.",
      },
      {
        title: "Remake Policy",
        description:
          "If a garment cannot be altered to achieve proper fit (e.g., significant sizing error on our part), we will remake the piece at no additional cost.",
        note: "Applies to manufacturing defects or measurement errors by our team.",
      },
      {
        title: "Future Alterations",
        description:
          "Body changes over time? We offer alteration services at preferential rates for Weavers customers. Contact us to discuss your needs.",
        note: "Subject to current alteration pricing.",
      },
    ],
  },

  returns: {
    title: "Return Policy",
    sections: [
      {
        title: "Ready-to-Wear Returns",
        description:
          "Ready-to-wear items in standard sizes may be returned within 14 days of delivery for a full refund. Items must be unworn, unwashed, with all tags attached, in original packaging.",
        conditions: [
          "Return shipping is prepaid by us (US customers)",
          "International return shipping is customer responsibility",
          "Refund processed within 5–7 business days of receipt",
          "Original shipping fees are non-refundable",
        ],
        cta: {
          text: "Start a Return",
          href: "/contact?subject=return",
        },
      },
      {
        title: "Custom Orders",
        description:
          "Custom pieces are made to your specifications and measurements. Due to the personalized nature of bespoke work, custom orders are final sale — they cannot be returned or refunded.",
        note: "However, our fit guarantee still applies. If the fit isn't right, we'll alter or remake at no charge.",
      },
    ],
  },

  alterations: {
    title: "Alteration Process",
    steps: [
      {
        number: "01",
        title: "Contact Us",
        description:
          "Email us at support@weaversatelier.com with your order number and describe the fit issue.",
      },
      {
        number: "02",
        title: "We Assess & Respond",
        description:
          "Within 48 hours, we'll review your case and provide instructions. We may request photos of the fit issue.",
      },
      {
        number: "03",
        title: "Ship to Us",
        description:
          "We'll provide a prepaid shipping label (US) or shipping instructions (international). Send the garment in its original packaging.",
      },
      {
        number: "04",
        title: "Alteration & Return",
        description:
          "Turnaround is typically 5–7 business days after receipt. We'll ship the altered garment back to you with tracking.",
      },
    ],
  },

  nonReturnable: {
    title: "What Can't Be Returned",
    items: [
      "Custom orders (any size or specification customization)",
      "Items worn, washed, or altered by third parties",
      "Items without original tags or packaging",
      "Items returned after 14 days",
      "Weddingwear and statement pieces (consultation items)",
    ],
  },

  refunds: {
    title: "Refund Information",
    items: [
      {
        question: "How long does a refund take?",
        answer:
          "Refunds are processed within 5–7 business days of receiving your return. It may take an additional 3–5 business days for the refund to appear on your statement, depending on your bank.",
      },
      {
        question: "What payment methods are refunded?",
        answer:
          "Refunds are issued to the original payment method. We cannot refund to a different card or account.",
      },
      {
        question: "Is shipping refunded?",
        answer:
          "Original shipping fees are non-refundable. However, if you received a defective item or if the error was ours, we'll refund shipping as well.",
      },
    ],
  },

  cta: {
    kicker: "Questions?",
    headline: "We're Here to Help",
    description:
      "Have questions about fit, alterations, or returns? Our team responds within 24 hours.",
    primaryCta: {
      text: "Contact Us",
      href: "/contact",
    },
    secondaryCta: {
      text: "Track Your Order",
      href: "/track-order",
    },
  },
};
