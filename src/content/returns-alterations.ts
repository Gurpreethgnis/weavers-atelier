export const returnsAlterationsContent = {
  hero: {
    kicker: "Returns & Alterations",
    headline: "Returns & Alterations",
    description:
      "We stand behind the fit and finish of every piece. If something needs attention, we’ll guide the right next step.",
  },

  guarantee: {
    title: "The Weavers Guarantee",
    policies: [
      {
        title: "30-Day Fit Adjustments",
        description:
          "Within 30 days of delivery, we offer fit-focused adjustment support for eligible requests.",
        note: "Applies to both ready-to-wear and custom orders.",
      },
      {
        title: "Remake Policy",
        description:
          "If a garment cannot be reasonably adjusted due to a confirmed production issue, we evaluate remakes at no additional cost.",
        note: "Applies to manufacturing defects or measurement errors by our team.",
      },
      {
        title: "Future Alterations",
        description:
          "Additional alterations can be arranged after the guarantee period.",
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
          "Ready-to-wear items may be returned within policy windows when unworn and in original condition.",
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
          "Custom pieces are made to your specifications and are final sale.",
        note: "However, our fit guarantee still applies. If the fit isn't right, we'll alter or remake at no charge.",
      },
    ],
  },

  alterations: {
    title: "Alteration Process",
    steps: [
      {
        number: "01",
        title: "Send Your Request",
        description:
          "Contact us with your order number and a brief description of the issue.",
      },
      {
        number: "02",
        title: "Review & Guidance",
        description:
          "We review your case and share clear instructions, including any photos needed.",
      },
      {
        number: "03",
        title: "Send Item",
        description:
          "For approved cases, we provide shipping guidance and next steps.",
      },
      {
        number: "04",
        title: "Refine & Return",
        description:
          "We complete the approved refinement and return your garment with tracking.",
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
    headline: "Need Fit or Return Support?",
    description:
      "Share your request and we will guide the right path quickly and clearly.",
    primaryCta: {
      text: "Speak With the Atelier",
      href: "/contact",
    },
    secondaryCta: {
      text: "Track Your Order",
      href: "/track-order",
    },
  },
};
