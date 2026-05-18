export const returnsAlterationsContent = {
  hero: {
    kicker: "Returns & Alterations",
    headline: "Returns & Alterations",
    description:
      "We stand behind the fit and finish of every piece. If something needs attention, we’ll guide the right next step.",
  },

  guarantee: {
    title: "Fit Guarantee",
    policies: [
      {
        title: "30-Day Fit Support",
        description:
          "Within 30 days of delivery, we support fit-focused refinements for eligible requests.",
        note: "Applies to ready-to-wear and custom orders.",
      },
      {
        title: "Remake Review",
        description:
          "If a garment cannot be reasonably adjusted due to a confirmed production issue, we review remake eligibility at no additional cost.",
        note: "Applies to confirmed production or measurement errors from our team.",
      },
    ],
  },

  returns: {
    title: "Ready-to-Wear Returns",
    sections: [
      {
        title: "Ready-to-Wear Returns",
        description:
          "Ready-to-wear items may be returned within policy windows when unworn and in original condition.",
        conditions: [
          "US returns: prepaid return shipping",
          "International returns: customer arranges return shipping",
          "Refund processed within 5–7 business days of receipt",
          "Original shipping fees are non-refundable",
        ],
        cta: {
          text: "Start a Return",
          href: "/contact?subject=return",
        },
      },
      {
        title: "Custom Order Alterations",
        description:
          "Custom pieces are final sale. If fit refinement is needed, we guide an alteration path under the fit guarantee.",
        note: "Use your order number and fit notes when reaching out.",
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
        title: "Send the Piece",
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
    title: "Refund Timing",
    items: [
      {
        question: "How long does a refund take?",
        answer:
          "Refunds are processed within 5–7 business days after the return is received and approved. Banks may take an additional 3–5 business days to post the refund.",
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
    kicker: "Need Help",
    headline: "Need Fit or Return Support?",
    description:
      "Share your order details and we’ll guide the right next step.",
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
