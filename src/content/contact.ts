export const contactContent = {
  hero: {
    kicker: "Atelier Access",
    headline: "Speak With the Atelier",
  },

  channels: {
    primary: {
      title: "Email",
      description:
        "For detailed custom requests, weddingwear planning, and project notes.",
      email: "support@weaversatelier.com",
      responseTime: "We usually respond within one business day.",
    },
    whatsapp: {
      title: "WhatsApp",
      description:
        "For quick guidance, inspiration images, and order direction.",
      cta: {
        text: "Speak With the Atelier",
        href: "https://wa.me/12025551234?text=Hello%20Weavers%20Atelier",
      },
      note: "Available Mon–Fri, 9am–6pm EST",
    },
  },

  businessInfo: {
    title: "Business Information",
    company: "Weaver's Atelier LLC",
    address: {
      line1: "651 N Broad St, Suite 201",
      line2: "Middletown, DE 19709",
      country: "United States",
    },
    note: "This is our registered business address. We don't have a retail location — all orders are made-to-order from our production facility.",
  },

  departments: {
    title: "Specialist Support",
    items: [
      {
        department: "Order Support",
        email: "support@weaversatelier.com",
        description: "Order status, delivery, and tracking",
      },
      {
        department: "Custom Quotes",
        email: "custom@weaversatelier.com",
        description: "Custom builds and quote requests",
      },
      {
        department: "Weddingwear",
        email: "weddings@weaversatelier.com",
        description: "Groom, groomsmen, and occasion planning",
      },
      {
        department: "Returns & Alterations",
        email: "returns@weaversatelier.com",
        description: "Return requests, fit issues, alterations",
      },
      {
        department: "Business & Press",
        email: "business@weaversatelier.com",
        description: "Partnerships and press inquiries",
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
        placeholder: "Tell us what you are looking for.",
      },
    },
    consent: {
      label:
        "I agree to Weaver's Atelier storing my information to respond to this inquiry.",
    },
    submit: "Send Message",
    successMessage: "Thank you. We'll follow up with clear next steps shortly.",
  },

  faq: {
    title: "Before You Send",
    items: [
      {
        question: "How long does shipping take?",
        answer:
          "Production and shipping vary by piece and destination. You'll find current timelines on the Delivery page.",
        link: {
          text: "See Delivery Page",
          href: "/delivery",
        },
      },
      {
        question: "What's your return policy?",
        answer:
          "Ready-to-wear returns and custom fit support are outlined in Returns & Alterations.",
        link: {
          text: "See Returns Policy",
          href: "/returns-alterations",
        },
      },
      {
        question: "How does custom ordering work?",
        answer:
          "Start with a quote request, confirm direction, then we move into production once approved.",
        link: {
          text: "See How It Works",
          href: "/how-it-works",
        },
      },
      {
        question: "What sizes do you carry?",
        answer:
          "Standard XS–XL for ready-to-wear, with custom sizing available when precision is needed.",
        link: {
          text: "See Size Guide",
          href: "/fit-guide",
        },
      },
    ],
  },

  cta: {
    kicker: "Next Step",
    headline: "Explore the Collection",
    description:
      "Choose a piece to purchase directly or start a custom order with guided support.",
    primaryCta: {
      text: "Shop Menswear",
      href: "/shop",
    },
  },
};
