export const statementPiecesContent = {
  hero: {
    headline: "Statement Pieces",
    subheadline:
      "Beyond categories. Custom jackets, embroidered outerwear, bespoke waistcoats, and one-of-a-kind creations. When you want something the world has never seen.",
    cta: {
      text: "Start a Consultation",
      href: "/contact?subject=custom",
    },
  },

  introduction: {
    headline: "One of a Kind",
    description:
      "Some pieces defy categorization. A bomber jacket with family crest embroidery. A velvet dinner jacket for a milestone birthday. A reversible coat that tells two stories. We create what doesn't exist yet — designed around your vision, crafted to last.",
  },

  categories: [
    {
      name: "Custom Jackets",
      description:
        "From aviator silhouettes to tailored blazers. Leather, suede, wool, denim — or unexpected combinations.",
      examples: "Bombers, Trucker Jackets, Field Coats, Overshirts",
    },
    {
      name: "Embroidered Outerwear",
      description:
        "Transform any garment with thread art. Florals, portraits, typography, abstract patterns — hand-stitched.",
      examples: "Embroidered Bombers, Souvenir Jackets, Art Coats",
    },
    {
      name: "Bespoke Waistcoats",
      description:
        "Not just wedding accessories. Statement waistcoats in brocade, velvet, or hand-painted silk.",
      examples: "Formal Vests, Double-breasted Waistcoats, Lapeled Vests",
    },
    {
      name: "Ceremonial Attire",
      description:
        "For milestone moments. Graduations, honors, cultural celebrations, and special occasions.",
      examples: "Ceremony Jackets, Celebration Wear, Milestone Attire",
    },
    {
      name: "Signature Coats",
      description:
        "The piece you reach for every day. Overcoats, topcoats, and car coats built to your specifications.",
      examples: "Camel Coats, Peacoats, Trench Coats, Dusters",
    },
    {
      name: "Experimental",
      description:
        "When you have an idea we haven't listed. We love projects that push our craft.",
      examples: "Your Vision",
    },
  ],

  customizationDepth: [
    {
      icon: "palette",
      name: "Fabric Sourcing",
      description:
        "We hunt down exactly what you need. Vintage textiles, heritage mills, deadstock luxury fabrics.",
    },
    {
      icon: "architecture",
      name: "Structure & Silhouette",
      description:
        "Every dimension is adjustable. Shoulder width, body length, sleeve shape — designed around your proportions.",
    },
    {
      icon: "draw",
      name: "Artwork Translation",
      description:
        "Send us an image, sketch, or idea. We translate it into embroidery, print, or textile manipulation.",
    },
    {
      icon: "diamond",
      name: "Hardware & Finishes",
      description:
        "Custom buttons, closures, and metal details. Engraved, enameled, or sourced vintage.",
    },
  ],

  process: {
    headline: "The Creation Process",
    steps: [
      {
        number: "01",
        title: "Discovery",
        description:
          "Deep dive into your vision. Mood boards, references, sketches — we map out every detail.",
      },
      {
        number: "02",
        title: "Design & Quote",
        description:
          "We produce detailed renderings and a quote. Nothing moves forward until you approve.",
      },
      {
        number: "03",
        title: "Sourcing",
        description:
          "Fabrics, trims, hardware — we source or create exactly what the design requires.",
      },
      {
        number: "04",
        title: "Crafting",
        description:
          "Weeks of skilled work. Progress updates throughout. No shortcuts, no compromises.",
      },
    ],
  },

  timeline: {
    headline: "Timeline",
    description:
      "Statement pieces take time. Most projects require 8–16 weeks depending on complexity, embroidery, and sourcing. Rush projects are evaluated case-by-case.",
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
    headline: "Let's Make Something New",
    description:
      "Tell us what you're imagining. No idea is too ambitious — we've built pieces we never thought possible.",
    primaryCta: {
      text: "Start a Consultation",
      href: "/contact?subject=custom",
    },
    secondaryCta: {
      text: "Chat on WhatsApp",
      context: "statement_piece" as const,
    },
  },
};
