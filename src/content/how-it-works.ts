export const howItWorksContent = {
  hero: {
    headline: "How It Works",
    subheadline:
      "Choose from the collection or begin a custom piece. Either way, the process is simple, personal, and guided from start to finish.",
  },

  paths: {
    headline: "Two Ways to Shop",
    standard: {
      title: "Shop the Collection",
      description:
        "Select a finished piece, choose your size, and complete your order.",
      steps: [
        "Select your piece",
        "Choose your size",
        "Complete checkout",
      ],
      cta: {
        text: "Shop Menswear",
        href: "/shop",
      },
    },
    custom: {
      title: "Start Custom",
      description:
        "Share your measurements, preferences, or inspiration. We guide the details before production begins.",
      steps: [
        "Share your direction",
        "Confirm the details",
        "Receive your piece",
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
        title: "Share the direction",
        description: "Tell us what you want to make, and how you want it to fit.",
        details: [
          "Reference images are welcome",
          "No payment required to request review",
          "Event dates help us plan lead time",
        ],
      },
      {
        number: "02",
        title: "Confirm the details",
        description:
          "We send the quote, timeline, and build details for your approval.",
        details: [
          "Transparent pricing and lead time",
          "Questions resolved before production",
          "Secure payment via Stripe invoice",
        ],
        cta: {
          text: "Speak With the Atelier",
          href: "/contact",
        },
      },
      {
        number: "03",
        title: "Receive your piece",
        description:
          "After approval, your piece moves into production and tracked delivery.",
        details: [
          "Quality review before dispatch",
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
