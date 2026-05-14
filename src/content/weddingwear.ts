export const weddingwearContent = {
  hero: {
    headline: "Weddingwear Made for the Moment",
    subheadline:
      "Whether you're walking down the aisle or standing beside your best friend, you deserve more than a rental. Custom-fitted suits, tuxedos, and ceremony attire designed around your vision.",
    cta: {
      text: "Start a Consultation",
      href: "/contact?subject=wedding",
    },
  },

  introduction: {
    headline: "Your Day, Your Way",
    description:
      "Wedding attire carries meaning. We listen to what the day means to you, understand the ceremony's context, and craft garments that honor the occasion while reflecting your personal style. This isn't a transaction — it's a collaboration.",
  },

  attireCategories: [
    {
      name: "Wedding Suits",
      description:
        "Classic two-piece or three-piece suits. Single or double-breasted. From navy to midnight, charcoal to soft grey.",
      for: "Groom, Groomsmen",
    },
    {
      name: "Tuxedos",
      description:
        "Peak or shawl lapels. Satin or grosgrain trim. Midnight blue or classic black. The formal choice for black-tie celebrations.",
      for: "Black Tie Events",
    },
    {
      name: "Dinner Jackets",
      description:
        "Velvet, patterned, or classic black. Statement pieces for receptions and rehearsal dinners.",
      for: "Receptions, Formal Events",
    },
    {
      name: "Morning Suits",
      description:
        "Traditional formal wear for daytime ceremonies. Tailcoat, waistcoat, and striped trousers.",
      for: "Formal Day Weddings",
    },
    {
      name: "Ceremony Separates",
      description:
        "Mix and match pieces for multi-event weddings. Coordinate across rehearsal dinner, ceremony, and reception.",
      for: "Multi-day Celebrations",
    },
  ],

  customizationOptions: [
    {
      icon: "format_paint",
      name: "Custom Colors",
      description:
        "We source fabrics to match your exact vision. Bring a swatch, a Pantone code, or describe the shade.",
    },
    {
      icon: "draw",
      name: "Personal Details",
      description:
        "Monograms, embroidered dates, or custom linings. The hidden details that make it uniquely yours.",
    },
    {
      icon: "style",
      name: "Lapel & Collar Styles",
      description:
        "Peak, notch, or shawl lapels. Custom width and button configurations to suit your build and style.",
    },
    {
      icon: "checkroom",
      name: "Lining & Finishes",
      description:
        "Personalized lining with photos, dates, or messages. Premium finishing throughout.",
    },
  ],

  timeline: {
    headline: "Plan Ahead",
    description:
      "Wedding garments require time. We recommend starting 4–6 months before your event for fittings and any adjustments. Rush orders (8–10 weeks) may be available for an additional fee.",
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
    headline: "Groomsmen Coordination",
    description:
      "Outfit your entire party with coordinated pieces. We offer remote measurement assistance and group pricing. Each groomsman gets a garment that fits — not a rental that approximates.",
  },

  process: {
    headline: "The Wedding Journey",
    steps: [
      {
        number: "01",
        title: "Consultation",
        description:
          "Share your wedding details — venue, theme, colors, your role. We'll design around your story.",
      },
      {
        number: "02",
        title: "Design & Fabric",
        description:
          "Review options, select fabrics, confirm every detail from buttons to buttonholes.",
      },
      {
        number: "03",
        title: "Measurements & Fittings",
        description:
          "Comprehensive measurements captured. Remote fitting options available.",
      },
      {
        number: "04",
        title: "Delivery",
        description:
          "Pressed and ready, delivered before your event. Emergency alterations available.",
      },
    ],
  },

  pricing: {
    note: "Wedding pricing varies by design complexity. Contact us for a detailed quote.",
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
    headline: "Make It Memorable",
    description:
      "You'll look back at these photos for the rest of your life. Let's create something extraordinary.",
    primaryCta: {
      text: "Start a Consultation",
      href: "/contact?subject=wedding",
    },
    secondaryCta: {
      text: "Chat on WhatsApp",
      context: "weddingwear" as const,
    },
  },
};
