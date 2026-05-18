export const howItWorksContent = {
  hero: {
    headline: "How It Works",
    subheadline:
      "Choose from the collection or begin a custom piece. Either way, the process is personal and clearly guided.",
  },

  paths: {
    headline: "Two Ways to Shop",
    standard: {
      title: "Ready-to-Wear",
      description:
        "Select your piece, choose your size, and complete checkout. We prepare the garment and ship with tracking.",
      steps: [
        "Browse and select your piece",
        "Choose size and complete checkout",
        "We prepare and deliver with tracking",
      ],
      cta: {
        text: "Shop Menswear",
        href: "/shop",
      },
    },
    custom: {
      title: "Start Custom",
      description:
        "Share your measurements, preferences, or inspiration. We confirm direction before production begins.",
      steps: [
        "Submit your request and reference details",
        "Review and approve your quote",
        "We craft and deliver your piece",
      ],
      cta: {
        text: "Start a Custom Order",
        href: "#custom-process",
      },
    },
  },

  customProcess: {
    headline: "Custom Process",
    steps: [
      {
        number: "01",
        title: "Submit Your Request",
        description:
          "Share measurements, fit preferences, and reference imagery if available.",
        details: [
          "No payment required to request a quote",
          "References from any source are welcome",
          "Event date and timeline help us plan accurately",
        ],
      },
      {
        number: "02",
        title: "Approve Direction",
        description:
          "We send a clear quote with timeline and specification summary for approval.",
        details: [
          "Transparent pricing and lead-time",
          "Questions resolved before production begins",
          "Secure payment via Stripe invoice",
        ],
        cta: {
          text: "Speak With the Atelier",
          href: "/contact",
        },
      },
      {
        number: "03",
        title: "Craft & Deliver",
        description:
          "Once approved, your piece moves into production, quality review, and tracked delivery.",
        details: [
          "Quality check before dispatch",
          "Tracking shared once shipped",
          "Aftercare support if refinement is needed",
        ],
        cta: {
          text: "Delivery Details",
          href: "/delivery",
        },
      },
    ],
  },

  timeline: {
    headline: "Production Times",
    note: "These are guide ranges. Complexity, fabric sourcing, and event dates can affect timing.",
    items: [
      { garment: "Shirts (RTW)", time: "2–3 weeks" },
      { garment: "Shirts (Custom)", time: "2–4 weeks" },
      { garment: "Trousers", time: "2–3 weeks" },
      { garment: "Denim (standard)", time: "3–4 weeks" },
      { garment: "Denim (embroidered)", time: "4–5 weeks" },
      { garment: "Weddingwear", time: "8–16 weeks" },
      { garment: "Statement Pieces", time: "4–8 weeks" },
    ],
  },

  trust: {
    headline: "Atelier Standard",
    points: [
      {
        icon: "verified",
        title: "Made With Care",
        description:
          "Each piece is reviewed for fit, finish, and consistency.",
      },
      {
        icon: "sync_alt",
        title: "Fit-Conscious Support",
        description:
          "If refinement is needed, we help guide the next step.",
      },
      {
        icon: "lock",
        title: "Secure Payments",
        description:
          "All transactions processed through Stripe with industry-standard encryption.",
      },
      {
        icon: "support_agent",
        title: "Guided Process",
        description:
          "Direct support from request to delivery.",
      },
    ],
  },

  cta: {
    headline: "Choose Your Route",
    description:
      "Shop ready-to-wear essentials or begin a custom order with clear, guided steps.",
    primaryCta: {
      text: "Shop Menswear",
      href: "/shop",
    },
    secondaryCta: {
      text: "Speak With the Atelier",
      href: "/contact",
    },
  },
};
