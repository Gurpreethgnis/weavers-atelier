export const shopContent = {
  landing: {
    headline: "Shop the Collection",
    subheadline:
      "Premium menswear designed for the modern man. Standard sizes XS–XL, or customize any piece for your perfect fit.",
    featuredCta: {
      label: "View All",
      href: "/shop",
    },
  },

  categories: {
    shirt: {
      name: "Shirts",
      description:
        "From crisp oxford cloth to luxurious linen. Every shirt is made to order with meticulous attention to detail.",
      heroImage: "/images/custom-shirts/hero-shirt.jpg",
    },
    trouser: {
      name: "Trousers",
      description:
        "Classic tailored trousers built for comfort and style. Versatile pieces that move from office to evening with ease.",
      heroImage: "/images/trousers/dress-trousers.jpg",
    },
    denim: {
      name: "Denim",
      description:
        "Statement denim with character. Premium Japanese and Italian selvedge, custom embroidery options, and a fit that's yours alone.",
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
    title: "Made to Order",
    description:
      "Every piece is crafted after you order—no mass production, no inventory sitting in a warehouse.",
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
      label: "Browse All",
      href: "/shop",
    },
  },
};

export const lookbookContent = {
  title: "Lookbook",
  subtitle:
    "Inspiration from our latest work. Every piece can be recreated or customized to your preferences.",
  cta: "Shop This Look",
};
