export const instagramLooksContent = {
  hero: {
    headline: "Lookbook",
    subheadline:
      "A curated view of recent work, styling ideas, and custom pieces that can be recreated or reinterpreted around you.",
    cta: {
      text: "Shop Menswear",
      href: "/shop",
    },
  },

  howItWorks: {
    headline: "Shop the Look",
    steps: [
      {
        number: "01",
        title: "Find Your Inspiration",
        description:
          "Browse looks that align with your style direction.",
      },
      {
        number: "02",
        title: "Shop or Customize",
        description:
          "Shop directly or send a reference for custom interpretation.",
      },
      {
        number: "03",
        title: "Made for You",
        description:
          "Every piece is prepared with care and delivered with tracking.",
      },
    ],
  },

  categories: [
    { id: "all", label: "All Looks" },
    { id: "shirts", label: "Shirts" },
    { id: "trousers", label: "Trousers" },
    { id: "denim", label: "Denim" },
    { id: "outerwear", label: "Outerwear" },
  ],

  cta: {
    headline: "Have a reference in mind?",
    description:
      "Send us an image, a mood, or a garment you want to reinterpret. We’ll help shape it into a custom piece with the right fit, fabric, and finish.",
    primaryCta: {
      text: "Send Inspiration",
      href: "/contact?subject=custom",
    },
    secondaryCta: {
      text: "View the Lookbook",
      href: "/lookbook",
    },
  },

  instagramHandle: "@weaversatelier",
};

export const sampleLookbookItems = [
  {
    id: "look-white-oxford",
    title: "Classic White Oxford",
    category: "shirts",
    imageUrl: "/images/lookbook/white-oxford.jpg",
    productSlug: "white-oxford-shirt",
    startingPrice: "From $149",
    tags: ["oxford", "white", "classic"],
  },
  {
    id: "look-navy-chinos",
    title: "Navy Tailored Chinos",
    category: "trousers",
    imageUrl: "/images/lookbook/navy-chinos.jpg",
    productSlug: "navy-cotton-chinos",
    startingPrice: "From $119",
    tags: ["chinos", "navy", "classic"],
  },
  {
    id: "look-indigo-denim",
    title: "Indigo Statement Denim",
    category: "denim",
    imageUrl: "/images/lookbook/indigo-statement.jpg",
    productSlug: "indigo-selvedge-jeans",
    startingPrice: "From $249",
    tags: ["denim", "selvedge", "indigo"],
  },
  {
    id: "look-linen-summer",
    title: "Summer Linen Shirt",
    category: "shirts",
    imageUrl: "/images/lookbook/linen-natural.jpg",
    productSlug: "natural-linen-shirt",
    startingPrice: "From $169",
    tags: ["linen", "summer", "natural"],
  },
  {
    id: "look-grey-flannel",
    title: "Grey Flannel Trousers",
    category: "trousers",
    imageUrl: "/images/lookbook/grey-flannel.jpg",
    productSlug: "grey-flannel-trousers",
    startingPrice: "From $189",
    tags: ["flannel", "grey", "formal"],
  },
  {
    id: "look-embroidered-denim",
    title: "Embroidered Statement Jeans",
    category: "denim",
    imageUrl: "/images/lookbook/embroidered-jeans.jpg",
    productSlug: "embroidered-statement-jeans",
    startingPrice: "From $399",
    tags: ["denim", "embroidery", "statement"],
  },
  {
    id: "look-chambray-casual",
    title: "Chambray Work Shirt",
    category: "shirts",
    imageUrl: "/images/lookbook/chambray-work.jpg",
    productSlug: "chambray-work-shirt",
    startingPrice: "From $139",
    tags: ["chambray", "casual", "denim"],
  },
  {
    id: "look-corduroy-autumn",
    title: "Corduroy Trousers",
    category: "trousers",
    imageUrl: "/images/lookbook/corduroy-autumn.jpg",
    productSlug: "corduroy-trousers",
    startingPrice: "From $149",
    tags: ["corduroy", "autumn", "texture"],
  },
];
