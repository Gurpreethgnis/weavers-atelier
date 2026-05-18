export const trackOrderContent = {
  hero: {
    headline: "Track Your Order",
    subheadline:
      "Enter your order details to view the latest status and next step.",
  },

  form: {
    orderNumberLabel: "Order Number",
    orderNumberPlaceholder: "e.g., WA-2024-001234",
    submitButton: "Track Order",
    helpText:
      "Use the tracking token from your confirmation email. Need help? Contact support@weaversatelier.com.",
  },

  statuses: {
    received: {
      title: "Order Received",
      description: "We've received your order and it's being processed.",
      icon: "check_circle",
    },
    confirmed: {
      title: "Confirmed",
      description:
        "Payment confirmed. Your order is queued for production.",
      icon: "verified",
    },
    in_production: {
      title: "In Production",
      description:
        "Your pieces are being crafted. This is where the magic happens.",
      icon: "precision_manufacturing",
    },
    quality_check: {
      title: "Quality Check",
      description:
        "Final inspection to ensure everything meets our standards.",
      icon: "fact_check",
    },
    ready_to_ship: {
      title: "Ready to Ship",
      description:
        "Your order has passed inspection and is being prepared for shipment.",
      icon: "inventory_2",
    },
    shipped: {
      title: "Shipped",
      description: "Your order is on its way. Track it with the link below.",
      icon: "local_shipping",
    },
    delivered: {
      title: "Delivered",
      description: "Your order has been delivered. Enjoy your new pieces.",
      icon: "home",
    },
  },

  customQuoteStatuses: {
    received: {
      title: "Quote Request Received",
      description: "We're reviewing your custom request.",
      icon: "inbox",
    },
    reviewing: {
      title: "Under Review",
      description:
        "Our team is assessing your requirements and preparing a quote.",
      icon: "rate_review",
    },
    quoted: {
      title: "Quote Sent",
      description: "We've sent you a detailed quote. Check your email.",
      icon: "request_quote",
    },
    accepted: {
      title: "Quote Accepted",
      description: "You've accepted the quote. Invoice pending.",
      icon: "thumb_up",
    },
    invoiced: {
      title: "Invoice Sent",
      description: "Payment invoice sent. Complete payment to begin production.",
      icon: "receipt_long",
    },
    paid: {
      title: "Payment Received",
      description:
        "Thank you! Production will begin shortly.",
      icon: "payments",
    },
    declined: {
      title: "Quote Declined",
      description: "This quote was declined. Contact us if you'd like to discuss.",
      icon: "cancel",
    },
    expired: {
      title: "Quote Expired",
      description: "This quote has expired. Submit a new request to proceed.",
      icon: "schedule",
    },
  },

  noOrderFound: {
    headline: "Order Not Found",
    description:
      "We couldn't find an order with that number. Double-check your order number and email, or contact us for help.",
    cta: {
      text: "Speak With the Atelier",
      href: "/contact",
    },
  },

  needHelp: {
    headline: "Need Help?",
    description:
      "If you need support with tracking or delivery, we're here to assist.",
    email: "support@weaversatelier.com",
    cta: {
      text: "Speak With the Atelier",
      href: "/contact",
    },
  },
};
