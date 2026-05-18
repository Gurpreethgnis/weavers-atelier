export const deliveryContent = {
  hero: {
    kicker: "Delivery",
    headline: "Prepared With Care, Delivered Worldwide",
    description:
      "Each order is prepared with care and shipped with tracking once complete. Timelines vary by product type, destination, and customization.",
  },

  shipping: {
    title: "Shipping Options",
    description:
      "Choose standard or express shipping once production is complete.",
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
    title: "Destinations",
    description:
      "We ship internationally. Region details are available below for planning purposes.",
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
      "Production begins after order placement or custom approval.",
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
    title: "Packaging",
    description:
      "Garments are packed in protective materials and reinforced shipping boxes.",
  },

  duties: {
    title: "Customs & Duties",
    description:
      "International orders may be subject to local duties and taxes based on destination regulations.",
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
          "Share your order number and we will coordinate with the carrier and update you.",
      },
      {
        question: "What if my package is lost or damaged?",
        answer:
          "All shipments are insured. Contact us quickly so we can open a claim and arrange resolution.",
      },
      {
        question: "Can I change my shipping address after ordering?",
        answer:
          "Contact us immediately. If production hasn't started, we can usually update the address.",
      },
    ],
  },

  cta: {
    kicker: "Next Step",
    headline: "Explore the Collection",
    description:
      "Choose ready-to-wear essentials or begin a custom order with guided support.",
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
