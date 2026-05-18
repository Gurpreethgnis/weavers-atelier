export const contactContent = {
  hero: {
    kicker: "Concierge",
    headline: "Speak With the Atelier",
    subheadline:
      "For custom orders, weddingwear, sizing guidance, or a specific idea, send us a note. We’ll help you choose the right next step.",
  },

  channels: {
    primary: {
      title: "Email",
      description:
        "For detailed custom requests, weddingwear, and project notes.",
      email: "gurpreets.nanda@gmail.com",
      responseTime: "Response within one business day.",
    },
    whatsapp: {
      title: "WhatsApp",
      description:
        "For quick questions, inspiration images, and order guidance.",
      cta: {
        text: "Speak With the Atelier",
        href: "https://wa.me/19293448376?text=Hello%20Weavers%20Atelier",
      },
      note: "+1-929(344)8376 | Available Mon–Fri, 9am–6pm EST",
    },
    consultation: {
      title: "Consultation",
      description:
        "For pieces that need more time, proportion, and personal direction.",
      cta: {
        text: "Start a Custom Order",
        href: "/customize/shirt",
      },
    },
  },

  businessInfo: {
    title: "Business Information",
    company: "Weaver's Atelier LLC",
    address: {
      line1: "13 Cornelius Way",
      line2: "Somerset, NJ-08873",
      country: "United States",
    },
    note: "This is our registered business address. We don't have a retail location — all orders are made-to-order from our production facility.",
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
    submit: "Speak With the Atelier",
    successMessage: "Thank you. We'll follow up with clear next steps shortly.",
  },

  cta: {
    kicker: "Next Step",
    headline: "View the Lookbook",
    description:
      "See recent work and references you can recreate or reinterpret.",
    primaryCta: {
      text: "View the Lookbook",
      href: "/lookbook",
    },
  },
};
