export const deliveryContent = {
  hero: {
    kicker: "Shipping & Delivery",
    headline: "Delivered Worldwide",
    description:
      "Every Weaver's Atelier piece is carefully packaged and shipped directly to you, anywhere in the world. Express and standard options available.",
  },

  shipping: {
    title: "Shipping Options",
    description:
      "We ship from our production facility to your door. All orders include tracking.",
    options: [
      {
        title: "Standard Shipping",
        price: "$15",
        priceNote: "Free on orders over $250",
        time: "7–14 business days",
        description:
          "Reliable delivery with full tracking. Available to all destinations.",
      },
      {
        title: "Express Shipping",
        price: "$35",
        time: "3–5 business days",
        description:
          "Priority handling and expedited transit. Available to most destinations.",
      },
    ],
    note: "Shipping times are estimates after production is complete. Production time varies by product (see below).",
  },

  destinations: {
    title: "Where We Ship",
    description:
      "We deliver to 40+ countries across six continents. If you don't see your country listed, contact us.",
    regions: [
      {
        name: "Americas",
        countries: ["United States", "Canada", "Mexico", "Brazil", "Argentina", "Chile", "Colombia"],
      },
      {
        name: "Europe",
        countries: [
          "United Kingdom",
          "France",
          "Germany",
          "Italy",
          "Spain",
          "Netherlands",
          "Belgium",
          "Switzerland",
          "Sweden",
          "Denmark",
          "Norway",
          "Ireland",
          "Portugal",
        ],
      },
      {
        name: "Asia Pacific",
        countries: [
          "Australia",
          "New Zealand",
          "Japan",
          "South Korea",
          "Singapore",
          "Hong Kong",
          "Taiwan",
          "Malaysia",
          "Thailand",
        ],
      },
      {
        name: "Middle East & Africa",
        countries: [
          "United Arab Emirates",
          "Saudi Arabia",
          "Qatar",
          "Kuwait",
          "Bahrain",
          "Israel",
          "South Africa",
        ],
      },
    ],
  },

  timelines: {
    title: "Production Times",
    description:
      "Every order is made to order — we don't hold stock. Production begins after you place your order (or after custom quote acceptance).",
    items: [
      {
        title: "Shirts",
        duration: "7–10 days",
        note: "Same for RTW and custom",
      },
      {
        title: "Trousers",
        duration: "10–14 days",
        note: "Same for RTW and custom",
      },
      {
        title: "Denim (Standard)",
        duration: "14–18 days",
        note: "No embroidery",
      },
      {
        title: "Denim (Embroidered)",
        duration: "21–28 days",
        note: "Embroidery adds time",
      },
      {
        title: "Weddingwear",
        duration: "6–12 weeks",
        note: "Start early",
      },
      {
        title: "Statement Pieces",
        duration: "4–8 weeks",
        note: "Varies by complexity",
      },
    ],
  },

  packaging: {
    title: "How We Ship",
    description:
      "Every garment is folded in acid-free tissue, placed in a protective garment bag, and shipped in a reinforced box. No plastic, no waste.",
  },

  duties: {
    title: "Customs & Duties",
    description:
      "International orders may be subject to import duties and taxes, which are the responsibility of the recipient. We mark packages accurately as 'apparel/clothing' with declared value. Check your country's import regulations for estimates.",
    note: "We cannot under-declare values or mark packages as gifts.",
  },

  tracking: {
    title: "Track Your Order",
    description:
      "Once your order ships, you'll receive an email with tracking information. You can also track orders directly on our site.",
    cta: {
      text: "Track Your Order",
      href: "/track-order",
    },
  },

  issues: {
    title: "Delivery Issues?",
    items: [
      {
        question: "What if my package is delayed?",
        answer:
          "Contact us with your order number. We'll investigate with the carrier and keep you updated.",
      },
      {
        question: "What if my package is lost or damaged?",
        answer:
          "All shipments are insured. Contact us within 14 days of expected delivery. We'll file a claim and either reship or refund.",
      },
      {
        question: "Can I change my shipping address after ordering?",
        answer:
          "Contact us immediately. If production hasn't started, we can usually update the address.",
      },
    ],
  },

  cta: {
    kicker: "Ready to Order?",
    headline: "Shop the Collection",
    description:
      "Browse our shirts, trousers, and denim. Free shipping on orders over $250.",
    primaryCta: {
      text: "Shop Now",
      href: "/shop",
    },
    secondaryCta: {
      text: "Contact Us",
      href: "/contact",
    },
  },
};
