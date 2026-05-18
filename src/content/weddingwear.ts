export const weddingwearContent = {
  hero: {
    headline: "Weddingwear Made for the Moment",
    subheadline:
      "For the groom, the wedding party, and the details that deserve more than ordinary tailoring.",
    cta: {
      text: "Start a Wedding Consultation",
      href: "/contact?subject=wedding",
    },
  },

  introduction: {
    headline: "Ceremonial, Personal, Precise",
    description:
      "Weddingwear with presence, proportion, and personal intent.",
  },

  attireCategories: [
    {
      name: "Wedding Suits",
      description:
        "Classic two- and three-piece tailoring shaped around your frame and ceremony tone.",
      for: "Groom, Groomsmen",
    },
    {
      name: "Tuxedos",
      description:
        "Peak or shawl lapels with formal finishing for black-tie moments.",
      for: "Black Tie Events",
    },
    {
      name: "Dinner Jackets",
      description:
        "Reception-ready pieces with richer texture and evening presence.",
      for: "Receptions, Formal Events",
    },
    {
      name: "Morning Suits",
      description:
        "Traditional daytime formalwear for classic ceremonies.",
      for: "Formal Day Weddings",
    },
    {
      name: "Ceremony Separates",
      description:
        "Coordinated looks across rehearsal, ceremony, and reception.",
      for: "Multi-day Celebrations",
    },
  ],

  customizationOptions: [
    {
      icon: "format_paint",
      name: "Custom Colors",
      description:
        "Fabric direction aligned to venue, light, and ceremony palette.",
    },
    {
      icon: "draw",
      name: "Personal Details",
      description:
        "Monograms, dates, and lining details kept intentional.",
    },
    {
      icon: "style",
      name: "Lapel & Collar Styles",
      description:
        "Lapel shape, proportion, and closure tuned to your silhouette.",
    },
    {
      icon: "checkroom",
      name: "Lining & Finishes",
      description:
        "Finishes handled with restraint and precision.",
    },
  ],

  timeline: {
    headline: "Timeline",
    description:
      "Begin early for best fit and fabric access. Rush routes are assessed case by case.",
    milestones: [
      {
        weeks: "16–24 weeks",
        title: "Initial Consultation",
        description: "Design discussion, fabric selection, measurements",
      },
      {
        weeks: "12–16 weeks",
        title: "Production",
        description: "Pattern drafting, construction, initial fitting",
      },
      {
        weeks: "6–8 weeks",
        title: "Fitting & Adjustments",
        description: "Try-on and any necessary alterations",
      },
      {
        weeks: "2–4 weeks",
        title: "Final Delivery",
        description: "Pressed, packaged, ready for your day",
      },
    ],
  },

  groomsmenProgram: {
    headline: "Groom & Groomsmen",
    description:
      "Coordinate the full wedding party with role-specific guidance and consistent finishing.",
  },

  process: {
    headline: "Wedding Process",
    steps: [
      {
        number: "01",
        title: "Consultation",
        description:
          "We align on ceremony context, visual direction, and event timeline.",
      },
      {
        number: "02",
        title: "Design & Fabric",
        description:
          "Fabric, structure, and details are confirmed with you before production.",
      },
      {
        number: "03",
        title: "Measurements & Fittings",
        description:
          "Measurements and fitting direction are captured for confident execution.",
      },
      {
        number: "04",
        title: "Delivery",
        description:
          "Delivery is planned with room for any final refinements.",
      },
    ],
  },

  pricing: {
    note: "Pricing varies by design complexity and finishing level. Detailed quotes are provided after consultation.",
    tiers: [
      {
        name: "Classic Suit",
        price: "From $599",
        description: "Two-piece suit, premium wool, standard customization",
      },
      {
        name: "Tuxedo",
        price: "From $899",
        description: "Formal attire, satin details, premium fabrics",
      },
      {
        name: "Full Ensemble",
        price: "From $1,499",
        description: "Multiple pieces, accessories, all events covered",
      },
    ],
  },

  cta: {
    headline: "Start Your Wedding Consultation",
    description:
      "Share your date, role, and direction. We'll guide the rest.",
    primaryCta: {
      text: "Start a Wedding Consultation",
      href: "/contact?subject=wedding",
    },
    secondaryCta: {
      text: "Speak With the Atelier",
      context: "weddingwear" as const,
    },
  },
};
