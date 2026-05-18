import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Weaver's Atelier",
  description:
    "Frequently asked questions about custom menswear, measurements, pricing, delivery, and alterations at Weaver's Atelier.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQ | Weaver's Atelier",
    description:
      "Frequently asked questions about custom menswear, measurements, pricing, delivery, and alterations at Weaver's Atelier.",
    images: [{ url: "/images/hero/home-hero-landscape.jpg" }],
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
