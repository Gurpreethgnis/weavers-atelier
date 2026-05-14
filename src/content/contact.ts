export const contactContent = {
  hero: {
    kicker: "Get in Touch",
    headline: "Contact Us",
  },

  channels: {
    primary: {
      title: "Fastest Response",
      description:
        "For quick questions about orders, sizing, or general inquiries, email is the fastest way to reach us.",
      email: "support@weaversatelier.com",
      responseTime: "We respond within 24 hours, often faster.",
    },
    whatsapp: {
      title: "WhatsApp",
      description:
        "Prefer chat? Reach us on WhatsApp for real-time assistance.",
      cta: {
        text: "Open WhatsApp",
        href: "https://wa.me/12025551234?text=Hello%20Weavers%20Atelier",
      },
      note: "Available Mon–Fri, 9am–6pm EST",
    },
  },

  businessInfo: {
    title: "Business Information",
    company: "Weavers Atelier LLC",
    address: {
      line1: "651 N Broad St, Suite 201",
      line2: "Middletown, DE 19709",
      country: "United States",
    },
    note: "This is our registered business address. We don't have a retail location — all orders are made-to-order from our production facility.",
  },

  departments: {
    title: "Specific Inquiries",
    items: [
      {
        department: "Order Support",
        email: "support@weaversatelier.com",
        description: "Order status, shipping, sizing questions",
      },
      {
        department: "Custom Quotes",
        email: "custom@weaversatelier.com",
        description: "Custom order inquiries, quote requests",
      },
      {
        department: "Weddingwear",
        email: "weddings@weaversatelier.com",
        description: "Groomswear, wedding party, special occasions",
      },
      {
        department: "Returns & Alterations",
        email: "returns@weaversatelier.com",
        description: "Return requests, fit issues, alterations",
      },
      {
        department: "Business & Press",
        email: "business@weaversatelier.com",
        description: "Partnerships, press inquiries, collaborations",
      },
    ],
  },

  form: {
    title: "Send a Message",
    fields: {
      fullName: {
        label: "Name",
        placeholder: "Your name",
      },
      email: {
        label: "Email",
        placeholder: "you@example.com",
      },
      subject: {
        label: "Subject",
        options: [
          { value: "order", label: "Order Question" },
          { value: "sizing", label: "Sizing Help" },
          { value: "custom", label: "Custom Quote" },
          { value: "wedding", label: "Weddingwear Inquiry" },
          { value: "return", label: "Return or Alteration" },
          { value: "general", label: "General Question" },
        ],
      },
      orderNumber: {
        label: "Order Number (if applicable)",
        placeholder: "WA-XXXXX",
      },
      message: {
        label: "Message",
        placeholder: "How can we help?",
      },
    },
    consent: {
      label:
        "I agree to Weavers Atelier storing my information to respond to this inquiry.",
    },
    submit: "Send Message",
    successMessage: "Thanks! We'll get back to you within 24 hours.",
  },

  faq: {
    title: "Common Questions",
    items: [
      {
        question: "How long does shipping take?",
        answer:
          "Production takes 1–4 weeks depending on the item. Shipping is 3–14 days depending on destination and service selected.",
        link: {
          text: "See Delivery Page",
          href: "/delivery",
        },
      },
      {
        question: "What's your return policy?",
        answer:
          "RTW items can be returned within 14 days, unworn with tags. Custom items are final sale but covered by our fit guarantee.",
        link: {
          text: "See Returns Policy",
          href: "/returns-alterations",
        },
      },
      {
        question: "How does custom ordering work?",
        answer:
          "Submit a quote request on any product page. We'll send you a quote within 48 hours. Accept, pay, and we'll make it to your specifications.",
        link: {
          text: "See How It Works",
          href: "/how-it-works",
        },
      },
      {
        question: "What sizes do you carry?",
        answer:
          "Standard sizes XS–XL for RTW. For custom, we can make any size to your measurements.",
        link: {
          text: "See Size Guide",
          href: "/fit-guide",
        },
      },
    ],
  },

  cta: {
    kicker: "Ready to Shop?",
    headline: "Browse the Collection",
    description:
      "Find your next favorite piece. Shirts, trousers, and statement denim — all made to order.",
    primaryCta: {
      text: "Shop Now",
      href: "/shop",
    },
  },
};
