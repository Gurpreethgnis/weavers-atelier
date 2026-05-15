export const legalContent = {
  header: {
    kicker: "Legal",
    headline: "Privacy & Terms",
    effectiveDate: "May 2026",
  },

  sidebar: {
    anchors: [
      { id: "privacy", label: "Privacy Policy" },
      { id: "terms", label: "Terms of Service" },
      { id: "shipping", label: "Shipping Policy" },
    ],
    callout: {
      title: "Questions?",
      description:
        "If you have questions about these policies, contact us at legal@weaversatelier.com.",
    },
  },

  privacy: {
    title: "Privacy Policy",
    intro:
      "Weaver's Atelier ('we', 'us', 'our') is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information.",
    sections: [
      {
        id: "information-collected",
        title: "Information We Collect",
        content:
          "We collect information you provide directly and information collected automatically when you use our website.",
        subsections: [
          {
            title: "Information You Provide",
            items: [
              "Contact information (name, email, phone, address)",
              "Payment information (processed securely by Stripe)",
              "Measurements and fit preferences",
              "Order history and communications",
              "Account credentials if you create an account",
            ],
          },
          {
            title: "Information Collected Automatically",
            items: [
              "Device information (browser, operating system)",
              "IP address and approximate location",
              "Pages viewed and interactions on our site",
              "Referral source and time spent on site",
            ],
          },
        ],
      },
      {
        id: "how-we-use",
        title: "How We Use Your Information",
        items: [
          "Process and fulfill your orders",
          "Communicate about your orders and inquiries",
          "Send transactional emails (confirmations, shipping updates)",
          "Improve our website and services",
          "Send marketing communications (only with your consent)",
          "Comply with legal obligations",
        ],
      },
      {
        id: "data-sharing",
        title: "Who We Share Data With",
        content:
          "We do not sell your personal information. We share data only with service providers necessary to operate our business:",
        items: [
          "Stripe (payment processing)",
          "Shipping carriers (delivery)",
          "Email service providers (transactional and marketing emails)",
          "Analytics providers (website improvement)",
        ],
        note: "All service providers are contractually required to protect your data.",
      },
      {
        id: "your-rights",
        title: "Your Rights",
        content:
          "Depending on your location, you may have the following rights regarding your personal data:",
        items: [
          "Access the personal data we hold about you",
          "Correct inaccurate information",
          "Request deletion of your data",
          "Opt out of marketing communications",
          "Export your data in a portable format",
        ],
        cta: {
          text: "To exercise these rights, contact us at privacy@weaversatelier.com.",
        },
      },
      {
        id: "cookies",
        title: "Cookies",
        content:
          "We use cookies to operate our website and improve your experience.",
        subsections: [
          {
            title: "Essential Cookies",
            description:
              "Required for site functionality (shopping cart, checkout, account sessions). Cannot be disabled.",
          },
          {
            title: "Analytics Cookies",
            description:
              "Help us understand how visitors use our site. You can disable these in your browser settings.",
          },
        ],
        note: "We do not use cookies for third-party advertising.",
      },
      {
        id: "data-retention",
        title: "Data Retention",
        content:
          "We retain your data as long as necessary to provide services and comply with legal obligations. Order records are kept for 7 years for tax and legal purposes. You can request deletion of your account data at any time.",
      },
      {
        id: "security",
        title: "Security",
        content:
          "We protect your data with industry-standard security measures including encryption in transit (HTTPS), secure payment processing through Stripe (PCI-compliant), and restricted access to personal data.",
      },
    ],
  },

  terms: {
    title: "Terms of Service",
    intro:
      "By using Weaver's Atelier ('the Site'), you agree to these terms. If you don't agree, please don't use our services.",
    sections: [
      {
        id: "orders",
        title: "Orders & Payment",
        items: [
          "All prices are in USD unless otherwise stated.",
          "Prices are subject to change without notice. Once you place an order, the price is locked.",
          "We reserve the right to refuse or cancel orders for any reason (you'll be refunded promptly).",
          "Payment is processed securely through Stripe. We do not store your payment details.",
          "For custom orders, payment is due upon acceptance of quote via Stripe invoice.",
        ],
      },
      {
        id: "custom-orders",
        title: "Custom Orders",
        items: [
          "Custom orders are made to your specifications and cannot be returned or refunded.",
          "You are responsible for providing accurate measurements. We'll do our best to guide you.",
          "Quotes are valid for 14 days from issuance.",
          "Production begins only after payment is received.",
          "Custom designs remain the intellectual property of Weaver's Atelier.",
        ],
      },
      {
        id: "returns",
        title: "Returns & Refunds",
        content:
          "See our Returns & Alterations page for full details. In summary:",
        items: [
          "RTW items: 14-day return window, unworn with tags attached.",
          "Custom items: Final sale (but covered by our fit guarantee).",
          "Refunds issued to original payment method within 5–7 business days.",
        ],
        cta: {
          text: "View Returns Policy",
          href: "/returns-alterations",
        },
      },
      {
        id: "intellectual-property",
        title: "Intellectual Property",
        content:
          "All content on this site (images, text, designs, logos) is owned by Weaver's Atelier and protected by copyright. You may not reproduce, distribute, or use our content without written permission.",
      },
      {
        id: "limitation-of-liability",
        title: "Limitation of Liability",
        content:
          "Our liability is limited to the value of your order. We are not liable for indirect, incidental, or consequential damages. We make no warranties beyond what is explicitly stated in these terms.",
      },
      {
        id: "governing-law",
        title: "Governing Law",
        content:
          "These terms are governed by the laws of the State of Delaware, USA. Any disputes shall be resolved in the courts of Delaware.",
      },
      {
        id: "changes",
        title: "Changes to Terms",
        content:
          "We may update these terms from time to time. Continued use of the site after changes constitutes acceptance of the new terms. We'll notify you of material changes via email if you have an account.",
      },
    ],
  },

  shipping: {
    title: "Shipping Policy",
    content: "See our Delivery page for complete shipping information.",
    cta: {
      text: "View Delivery Information",
      href: "/delivery",
    },
  },

  contact: {
    title: "Legal Inquiries",
    description:
      "For questions about these policies or to exercise your data rights:",
    email: "legal@weaversatelier.com",
    address: {
      company: "Weaver's Atelier LLC",
      line1: "651 N Broad St, Suite 201",
      line2: "Middletown, DE 19709",
      country: "United States",
    },
  },
};
