export const faqContent = {
  hero: {
    headline: "FAQ",
    subheadline:
      "Concise answers to common questions on ordering, fit, delivery, and custom work.",
  },

  categories: [
    {
      id: "ordering",
      name: "Ordering",
      questions: [
        {
          question: "What sizes are available?",
          answer:
            "Ready-to-wear pieces are offered in XS through XL. If you need precision beyond standard sizing, choose custom.",
          link: { label: "Fit Guide", href: "/fit-guide" },
        },
        {
          question: "What is the difference between ready-to-wear and custom?",
          answer:
            "Ready-to-wear uses standard sizing and faster turnaround. Custom is made around your measurements and fit preferences.",
          link: { label: "How It Works", href: "/how-it-works" },
        },
        {
          question: "How do I start a custom order?",
          answer:
            "Use any Customize flow, submit your direction, and we’ll guide the next step before production begins.",
          link: { label: "Start a Custom Order", href: "/customize/shirt" },
        },
      ],
    },
    {
      id: "custom-orders",
      name: "Custom Orders",
      questions: [
        {
          question: "How quickly do you respond to custom requests?",
          answer:
            "Most custom responses are shared within two business days.",
        },
        {
          question: "Can I share reference images?",
          answer:
            "Yes. Instagram links, screenshots, and reference garments are all useful.",
        },
        {
          question: "Can I change details before production starts?",
          answer:
            "Yes. Changes can be made before approval and production start.",
        },
      ],
    },
    {
      id: "sizing-fit",
      name: "Sizing & Fit",
      questions: [
        {
          question: "How do I choose my size?",
          answer:
            "Start with your usual size and check the fit guide. If you sit between sizes, custom is usually best.",
          link: { label: "Fit Guide", href: "/fit-guide" },
        },
        {
          question: "What measurements are needed for custom?",
          answer:
            "Measurement requirements vary by garment. Use the Fit Guide for the exact list.",
          link: { label: "Measurement Steps", href: "/fit-guide" },
        },
        {
          question: "What if I am not confident measuring myself?",
          answer:
            "Contact us before production starts and we’ll guide the right measurement path.",
          link: { label: "Speak With the Atelier", href: "/contact" },
        },
      ],
    },
    {
      id: "weddingwear",
      name: "Weddingwear",
      questions: [
        {
          question: "How far in advance should I begin weddingwear?",
          answer:
            "For best results, begin several months before the event.",
          link: { label: "Weddingwear", href: "/weddingwear" },
        },
        {
          question: "Do you handle groom and groomsmen together?",
          answer:
            "Yes. We support coordinated wedding party orders with role-based guidance.",
        },
        {
          question: "What if fit refinement is needed before the event?",
          answer:
            "We plan delivery windows to leave room for final refinements when needed.",
          link: { label: "Returns & Alterations", href: "/returns-alterations" },
        },
      ],
    },
    {
      id: "delivery",
      name: "Delivery",
      questions: [
        {
          question: "Do you ship internationally?",
          answer:
            "Yes. We deliver internationally with tracked shipping options.",
        },
        {
          question: "How long do production and shipping take?",
          answer:
            "Timing varies by product type, destination, and customization level.",
          link: { label: "Delivery Timelines", href: "/delivery" },
        },
        {
          question: "Will I receive tracking?",
          answer:
            "Yes. Tracking is shared when your shipment leaves production.",
          link: { label: "Track Your Order", href: "/track-order" },
        },
        {
          question: "Will I need to pay duties or taxes?",
          answer:
            "For international orders, local duties or taxes may apply based on destination rules.",
          link: { label: "Delivery Details", href: "/delivery" },
        },
      ],
    },
    {
      id: "returns",
      name: "Returns & Alterations",
      questions: [
        {
          question: "Can ready-to-wear items be returned?",
          answer:
            "Ready-to-wear returns are accepted within policy windows when unworn and in original condition.",
          link: { label: "Returns Policy", href: "/returns-alterations" },
        },
        {
          question: "Are custom orders returnable?",
          answer:
            "Custom orders are final sale. Fit-related refinements are handled through alteration support.",
        },
        {
          question: "What if a custom piece needs fit adjustment?",
          answer:
            "Share your order details and we’ll guide the right adjustment path.",
          link: { label: "Speak With the Atelier", href: "/contact" },
        },
        {
          question: "How do I start a return or alteration request?",
          answer:
            "Send your order reference and request type, and we’ll confirm the correct next steps.",
          link: { label: "Returns & Alterations", href: "/returns-alterations" },
        },
      ],
    },
    {
      id: "weddingwear-details",
      name: "Weddingwear Details",
      questions: [
        {
          question:
            "Can you make weddingwear for specific cultural or ceremonial requirements?",
          answer:
            "Yes. Share your ceremony context and references, and we’ll guide the right construction and details.",
          link: { label: "Weddingwear", href: "/weddingwear" },
        },
      ],
    },
  ],

  contact: {
    headline: "Still Have Questions?",
    description:
      "Reach out with your request and we'll guide the right next step.",
    cta: {
      text: "Speak With the Atelier",
      href: "/contact",
    },
  },
};
