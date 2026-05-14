export const instagramLooksContent = {
  hero: {
    headline: "Lookbook",
    subheadline:
      "Inspiration from our latest work. Every piece can be shopped directly or customized to your preferences.",
    cta: {
      text: "Shop the Collection",
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
          "Browse our lookbook for pieces that catch your eye. Each look links directly to shoppable products.",
      },
      {
        number: "02",
        title: "Shop or Customize",
        description:
          "Buy in standard sizes (XS–XL) or click 'Customize' for a made-to-measure version with your specifications.",
      },
      {
        number: "03",
        title: "Made for You",
        description:
          "Every order is made to order. Your piece is crafted specifically for you.",
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
    headline: "Don't See What You're Looking For?",
    description:
      "Browse our full collection or contact us for custom requests.",
    primaryCta: {
      text: "Shop the Collection",
      href: "/shop",
    },
    secondaryCta: {
      text: "Contact Us",
      href: "/contact",
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
