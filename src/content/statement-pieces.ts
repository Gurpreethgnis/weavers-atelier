export const statementPiecesContent = {
  hero: {
    headline: "Statement Pieces",
    subheadline:
      "For pieces outside the usual categories — custom jackets, expressive denim, embroidered sets, and one-offs built around your vision.",
    cta: {
      text: "Start a Statement Piece",
      href: "/contact?subject=custom",
    },
  },

  introduction: {
    headline: "Made from an Idea",
    description:
      "Bring a reference, sketch, fabric direction, or mood. We translate it into a wearable piece with structure and intent.",
  },

  categories: [
    {
      name: "Custom Jackets",
      description:
        "From aviator silhouettes to tailored blazers in expected and unexpected materials.",
      examples: "Bombers, Trucker Jackets, Field Coats, Overshirts",
    },
    {
      name: "Embroidered Outerwear",
      description:
        "Threadwork and surface detail translated from your references.",
      examples: "Embroidered Bombers, Souvenir Jackets, Art Coats",
    },
    {
      name: "Bespoke Waistcoats",
      description:
        "Formal and expressive waistcoats in brocade, velvet, or textured blends.",
      examples: "Formal Vests, Double-breasted Waistcoats, Lapeled Vests",
    },
    {
      name: "Ceremonial Attire",
      description:
        "Pieces designed for milestones, honors, and ceremonial settings.",
      examples: "Ceremony Jackets, Celebration Wear, Milestone Attire",
    },
    {
      name: "Signature Coats",
      description:
        "Outerwear with sharper proportion and custom finishing.",
      examples: "Camel Coats, Peacoats, Trench Coats, Dusters",
    },
    {
      name: "Experimental",
      description:
        "For unconventional direction, we build the brief with you.",
      examples: "Your Vision",
    },
  ],

  customizationDepth: [
    {
      icon: "palette",
      name: "Fabric Sourcing",
      description:
        "Sourcing direction aligned to look, handfeel, and occasion.",
    },
    {
      icon: "architecture",
      name: "Structure & Silhouette",
      description:
        "Shoulder, balance, length, and drape tuned to your frame.",
    },
    {
      icon: "draw",
      name: "Artwork Translation",
      description:
        "Images, sketches, and references translated into wearable detail.",
    },
    {
      icon: "diamond",
      name: "Hardware & Finishes",
      description:
        "Closures and trim selected to support the full visual direction.",
    },
  ],

  process: {
    headline: "The Creation Process",
    steps: [
      {
        number: "01",
        title: "Discovery",
        description:
          "We align on silhouette, references, and intended use.",
      },
      {
        number: "02",
        title: "Design & Quote",
        description:
          "You receive a clear quote and direction summary before production starts.",
      },
      {
        number: "03",
        title: "Sourcing",
        description:
          "Materials and trims are sourced to match approved direction.",
      },
      {
        number: "04",
        title: "Crafting",
        description:
          "The piece is built, reviewed, and prepared for tracked delivery.",
      },
    ],
  },

  timeline: {
    headline: "Timeline",
    description:
      "Most statement projects require longer lead times based on complexity, sourcing, and finishing.",
  },

  pricing: {
    note: "Every statement piece is quoted individually based on design complexity, materials, and crafting time.",
    examples: [
      {
        name: "Custom Bomber",
        price: "From $449",
        description: "Premium fabrics, standard customization",
      },
      {
        name: "Embroidered Jacket",
        price: "From $799",
        description: "Hand-embroidered artwork, custom silhouette",
      },
      {
        name: "Signature Creation",
        price: "From $1,699",
        description: "Complex design, rare materials, museum-quality craft",
      },
    ],
  },

  cta: {
    headline: "Start Your Statement Piece",
    description:
      "Share your direction and references. We'll shape the next step with you.",
    primaryCta: {
      text: "Start a Statement Piece",
      href: "/contact?subject=custom",
    },
    secondaryCta: {
      text: "Send Inspiration",
      context: "statement_piece" as const,
    },
  },
};
