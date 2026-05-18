export const shopContent = {
  landing: {
    headline: "The Collection",
    subheadline:
      "Refined menswear essentials, made with considered proportions, custom options, and a sharper sense of fit.",
    featuredCta: {
      label: "Shop Menswear",
      href: "/shop",
    },
  },

  categories: {
    shirt: {
      name: "Shirts",
      description:
        "Clean lines, custom details, everyday precision.",
      heroImage: "/images/custom-shirts/hero-shirt.jpg",
    },
    trouser: {
      name: "Trousers",
      description:
        "Tailored structure with room for movement.",
      heroImage: "/images/trousers/dress-trousers.jpg",
    },
    denim: {
      name: "Denim",
      description:
        "Statement washes and sharper cuts, made to stand apart.",
      heroImage: "/images/denim/hero-denim.jpg",
    },
    weddingwear: {
      name: "Weddingwear",
      description:
        "For the most important day. Bespoke suits, sherwanis, and coordinated ensembles crafted to your exact specifications.",
      heroImage: "/images/weddingwear/sherwanis.jpg",
    },
    statement: {
      name: "Statement Pieces",
      description:
        "One-of-a-kind pieces that define your style. Embroidered jackets, custom blazers, and conversation starters.",
      heroImage: "/images/statement/hero-statement.jpg",
    },
  },

  sizeGuide: {
    title: "Size Guide",
    intro:
      "Find your perfect fit. Our standard sizes are designed for a modern, comfortable fit. If you're between sizes or want adjustments, choose 'Customize' for a made-to-measure option.",
    chart: [
      { size: "XS", chest: "34-36", waist: "28-30", hip: "34-36" },
      { size: "S", chest: "36-38", waist: "30-32", hip: "36-38" },
      { size: "M", chest: "38-40", waist: "32-34", hip: "38-40" },
      { size: "L", chest: "40-42", waist: "34-36", hip: "40-42" },
      { size: "XL", chest: "42-44", waist: "36-38", hip: "42-44" },
    ],
    betweenSizes:
      "If you're between sizes, we recommend sizing up for a more relaxed fit, or sizing down for a slimmer silhouette. You can also use our 'Customize' option for exact measurements.",
    customCta: {
      label: "Need a different fit?",
      description:
        "Our custom option lets you specify exact measurements for any garment.",
      href: "#customize",
    },
  },

  leadTime: {
    title: "Made with Intention",
    description:
      "Each order is prepared with care, whether selected from the collection or adjusted through custom detail.",
    standard: {
      label: "Standard Sizes",
      days: "10–14 business days",
      note: "Includes quality check and careful packaging",
    },
    custom: {
      label: "Custom Orders",
      days: "21–28 business days",
      note: "Includes pattern drafting and fit consultation",
    },
    shipping: {
      domestic: {
        label: "US Domestic",
        days: "3–5 business days",
        price: "Free",
      },
      international: {
        label: "International",
        days: "7–14 business days",
        price: "$25",
      },
    },
  },

  productCtas: {
    addToCart: "Add to Cart",
    customize: "Customize This Piece",
    customizeDescription:
      "Request a custom fit with your exact measurements and personalization options.",
    outOfStock: "Made to Order",
    viewDetails: "View Details",
  },

  emptyState: {
    title: "No Products Yet",
    description:
      "We're curating this collection. Check back soon or explore our other offerings.",
    cta: {
      label: "Shop Menswear",
      href: "/shop",
    },
  },
};

export const lookbookContent = {
  title: "Lookbook",
  subtitle:
    "A curated view of recent work, styling ideas, and custom pieces that can be recreated or reinterpreted around you.",
  cta: "Send Inspiration",
};
