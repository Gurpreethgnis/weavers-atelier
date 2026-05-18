export const fitGuideContent = {
  hero: {
    headline: "Fit Guide",
    subheadline:
      "A simple guide to choosing your size, sharing measurements, and deciding when custom is the better path.",
    cta: {
      text: "Shop Menswear",
      href: "/shop",
    },
  },

  sizeChart: {
    headline: "Standard Size Guide",
    note: "Our garments are cut for a regular fit with comfortable ease. If you prefer slim or relaxed, consider going custom.",
    shirts: {
      title: "Shirts",
      headers: ["Size", "Chest", "Neck", "Sleeve", "Length"],
      rows: [
        { size: "XS", chest: "34–36″", neck: "14–14.5″", sleeve: "32–33″", length: "28″" },
        { size: "S", chest: "36–38″", neck: "14.5–15″", sleeve: "33–34″", length: "29″" },
        { size: "M", chest: "38–40″", neck: "15–15.5″", sleeve: "34–35″", length: "30″" },
        { size: "L", chest: "40–42″", neck: "15.5–16″", sleeve: "35–36″", length: "31″" },
        { size: "XL", chest: "42–44″", neck: "16–16.5″", sleeve: "36–37″", length: "32″" },
      ],
    },
    trousers: {
      title: "Trousers",
      headers: ["Size", "Waist", "Hip", "Inseam", "Thigh"],
      rows: [
        { size: "XS", waist: "28–30″", hip: "34–36″", inseam: "30″", thigh: "21″" },
        { size: "S", waist: "30–32″", hip: "36–38″", inseam: "31″", thigh: "22″" },
        { size: "M", waist: "32–34″", hip: "38–40″", inseam: "32″", thigh: "23″" },
        { size: "L", waist: "34–36″", hip: "40–42″", inseam: "32″", thigh: "24″" },
        { size: "XL", waist: "36–38″", hip: "42–44″", inseam: "33″", thigh: "25″" },
      ],
    },
    denim: {
      title: "Denim",
      headers: ["Size", "Waist", "Hip", "Inseam", "Leg Opening"],
      rows: [
        { size: "XS", waist: "28–30″", hip: "34–36″", inseam: "30″", leg: "14″" },
        { size: "S", waist: "30–32″", hip: "36–38″", inseam: "31″", leg: "15″" },
        { size: "M", waist: "32–34″", hip: "38–40″", inseam: "32″", leg: "16″" },
        { size: "L", waist: "34–36″", hip: "40–42″", inseam: "32″", leg: "17″" },
        { size: "XL", waist: "36–38″", hip: "42–44″", inseam: "33″", leg: "18″" },
      ],
    },
  },

  whenToCustom: {
    headline: "When to Go Custom",
    description:
      "Standard sizes work for many builds. Choose custom when precision, proportion, or personal detail matters.",
    reasons: [
      {
        title: "You're Between Sizes",
        description:
          "If your measurements fall between two sizes, a custom fit ensures the garment is perfect in every dimension.",
      },
      {
        title: "You Want a Different Fit",
        description:
          "Our RTW is regular fit. If you prefer slim, relaxed, or anything else, custom lets you specify exactly how you want it to drape.",
      },
      {
        title: "You Have Specific Preferences",
        description:
          "Collar, length, rise, taper, or finishing details can all be adjusted.",
      },
      {
        title: "Your Body Doesn't Fit Standard Charts",
        description:
          "Broad shoulders with narrow waist? Long torso with short legs? Custom accommodates any body type.",
      },
    ],
    cta: {
      text: "Start a Custom Order",
      href: "/customize/shirt",
    },
  },

  measurementGuide: {
    headline: "How to Measure (for Custom)",
    note: "Only needed if you're going custom. For standard sizes, just refer to the size chart above.",
    tips: [
      "Use a flexible measuring tape, not a metal one",
      "Have someone help you for best accuracy",
      "Measure over light undergarments, not bulky clothing",
      "Stand naturally — don't hold your breath or pose",
      "Measure with care",
      "When in doubt, round up slightly",
    ],
    garmentGuides: [
      {
        id: "shirt",
        name: "Shirts",
        measurements: [
          { name: "Neck", description: "Around the base of the neck, plus a finger of breathing room" },
          { name: "Chest", description: "Under arms, around the fullest part of chest" },
          { name: "Waist", description: "At natural waist, where you want the shirt to fall" },
          { name: "Shoulder", description: "Shoulder point to shoulder point, across back" },
          { name: "Sleeve Length", description: "Shoulder point to wrist bone, arm slightly bent" },
          { name: "Shirt Length", description: "Base of neck to desired hem" },
          { name: "Bicep", description: "Around the fullest part of upper arm" },
          { name: "Wrist", description: "Around wrist bone, snug but comfortable" },
        ],
      },
      {
        id: "trouser",
        name: "Trousers",
        measurements: [
          { name: "Waist", description: "Where you wear your trousers, not necessarily natural waist" },
          { name: "Hip", description: "Around the fullest part of hips and seat" },
          { name: "Rise", description: "From crotch seam to top of waistband (front)" },
          { name: "Thigh", description: "Around fullest part of upper leg" },
          { name: "Knee", description: "Around knee at a slight bend" },
          { name: "Leg Opening", description: "Desired width at hem (affects silhouette)" },
          { name: "Inseam", description: "From crotch to ankle bone" },
          { name: "Outseam", description: "Waistband to hem along outer leg" },
        ],
      },
      {
        id: "jeans",
        name: "Denim",
        measurements: [
          { name: "Waist", description: "Where jeans sit (often lower than dress trousers)" },
          { name: "Hip", description: "Fullest part of seat" },
          { name: "Rise", description: "Front rise for comfortable sitting" },
          { name: "Thigh", description: "Fullest part plus comfort ease" },
          { name: "Knee", description: "Determines silhouette (straight, tapered)" },
          { name: "Leg Opening", description: "For straight, tapered, or wide leg look" },
          { name: "Inseam", description: "Crotch to desired break point" },
        ],
      },
    ],
  },

  fitPreferences: {
    headline: "Fit Preferences (Custom Only)",
    options: [
      {
        id: "slim",
        name: "Slim",
        description:
          "Close to the body. Modern silhouette with minimal ease. For those who prefer a fitted look.",
      },
      {
        id: "regular",
        name: "Regular",
        description:
          "Classic proportions. Comfortable room to move. The timeless choice that works for most.",
      },
      {
        id: "relaxed",
        name: "Relaxed",
        description:
          "Generous fit throughout. Maximum comfort. For those who prefer a looser drape.",
      },
    ],
  },

  confidence: {
    headline: "Not Sure About Your Measurements?",
    options: [
      {
        id: "reference_garment",
        title: "Send a Reference Garment",
        description:
          "Ship us a piece that fits you well. We'll take measurements from it and ship it back.",
      },
      {
        id: "video_fitting",
        title: "Book a Video Fitting",
        description:
          "Schedule a 15-minute call. We'll guide you through measurements in real-time.",
      },
      {
        id: "start_with_rtw",
        title: "Start with Ready-to-Wear",
        description:
          "Order a standard size first. If it's close but not perfect, we can use it as a baseline for your custom orders.",
      },
    ],
    cta: {
      text: "Speak With the Atelier",
      href: "/contact",
    },
  },

  cta: {
    headline: "Know Your Size?",
    description:
      "Start with your closest size, then move to custom when precision is needed.",
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
