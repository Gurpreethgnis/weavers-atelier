export const howItWorksContent = {
  hero: {
    headline: "How It Works",
    subheadline:
      "From selection to your door. Whether you're buying off the rack or going custom, here's what to expect.",
  },

  paths: {
    headline: "Two Ways to Shop",
    standard: {
      title: "Ready-to-Wear",
      description:
        "Choose your piece, select your size (XS–XL), and check out. Made to order with a 2–3 week lead time. No stock limits — every size is always available.",
      steps: [
        "Browse the collection",
        "Select your size",
        "Checkout with Stripe",
        "We make it, you receive it",
      ],
      cta: {
        text: "Shop the Collection",
        href: "/shop",
      },
    },
    custom: {
      title: "Made for You",
      description:
        "Want something uniquely yours? Submit your measurements and preferences, we'll send you a quote, and once you approve, we craft your piece exactly as specified.",
      steps: [
        "Select a product and click 'Customize'",
        "Tell us your size, preferences, and vision",
        "Receive a quote (free, no commitment)",
        "Accept the quote and pay via secure invoice",
        "We make it to your exact specifications",
      ],
      cta: {
        text: "How Custom Works",
        href: "#custom-process",
      },
    },
  },

  customProcess: {
    headline: "The Custom Process",
    steps: [
      {
        number: "01",
        title: "Submit Your Request",
        description:
          "On any product page, click 'Customize This Piece.' Tell us about the fit you want, any modifications, and share inspiration images if you have them.",
        details: [
          "No payment required to request a quote",
          "Share reference images from anywhere",
          "Tell us your timeline and budget if relevant",
        ],
      },
      {
        number: "02",
        title: "Measurements & Preferences",
        description:
          "Complete our measurement guide or send us a garment that fits well. We'll capture everything we need to build your piece perfectly.",
        details: [
          "Self-measurement guide with clear instructions",
          "Video fitting available for complex pieces",
          "Your measurements saved for future orders",
        ],
        cta: {
          text: "View Fit Guide",
          href: "/fit-guide",
        },
      },
      {
        number: "03",
        title: "Receive Your Quote",
        description:
          "Within 48 hours, you'll receive a detailed quote with price, lead time, and specifications. No surprises — just clear terms.",
        details: [
          "Transparent pricing with no hidden fees",
          "Exact production timeline",
          "Any questions answered before you commit",
        ],
      },
      {
        number: "04",
        title: "Approve & Pay",
        description:
          "Happy with the quote? Accept it and pay securely via Stripe. We'll begin production immediately.",
        details: [
          "Pay via credit card, Apple Pay, or Google Pay",
          "Secure invoicing through Stripe",
          "Full receipt and order confirmation",
        ],
      },
      {
        number: "05",
        title: "Crafting",
        description:
          "Skilled tailors cut, construct, and finish your piece. Quality checks at every stage.",
        details: [
          "Shirts: 7–10 days",
          "Trousers: 10–14 days",
          "Denim: 14–21 days (embroidery adds time)",
          "Weddingwear & Statement: 4–8 weeks",
        ],
      },
      {
        number: "06",
        title: "Delivery & Beyond",
        description:
          "Your garment is carefully packaged and shipped worldwide with tracking. If anything isn't right, we'll fix it.",
        details: [
          "Express and standard shipping available",
          "Full tracking from dispatch to delivery",
          "Free alterations within 30 days",
        ],
        cta: {
          text: "Shipping Details",
          href: "/delivery",
        },
      },
    ],
  },

  timeline: {
    headline: "Production Times",
    note: "These are standard estimates. Complex designs, embroidery, and custom fabrics may add time. Wedding orders should start 4–6 months early.",
    items: [
      { garment: "Shirts (RTW)", time: "2–3 weeks" },
      { garment: "Shirts (Custom)", time: "2–3 weeks" },
      { garment: "Trousers", time: "2–3 weeks" },
      { garment: "Denim (standard)", time: "3–4 weeks" },
      { garment: "Denim (embroidered)", time: "4–5 weeks" },
      { garment: "Weddingwear", time: "8–16 weeks" },
      { garment: "Statement Pieces", time: "4–8 weeks" },
    ],
  },

  trust: {
    headline: "Our Commitment",
    points: [
      {
        icon: "verified",
        title: "Quality Guarantee",
        description:
          "If you're not satisfied with craftsmanship, we'll remake the garment at no extra cost.",
      },
      {
        icon: "sync_alt",
        title: "Free Alterations",
        description:
          "Within 30 days of delivery, we'll adjust fit at no charge. Return shipping is on us.",
      },
      {
        icon: "lock",
        title: "Secure Payments",
        description:
          "All transactions processed through Stripe with industry-standard encryption.",
      },
      {
        icon: "support_agent",
        title: "Real Support",
        description:
          "Questions at any stage? Reach us via WhatsApp or email. We respond within 24 hours.",
      },
    ],
  },

  cta: {
    headline: "Ready to Start?",
    description:
      "Shop the collection for ready sizes, or customize any piece to your exact specifications.",
    primaryCta: {
      text: "Shop the Collection",
      href: "/shop",
    },
    secondaryCta: {
      text: "Contact Us",
      href: "/contact",
    },
  },
};
