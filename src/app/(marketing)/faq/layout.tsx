import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Weaver's Atelier",
  description:
    "Frequently asked questions about custom menswear, measurements, pricing, delivery, and alterations at Weaver's Atelier.",
  openGraph: {
    title: "FAQ | Weaver's Atelier",
    description:
      "Frequently asked questions about custom menswear, measurements, pricing, delivery, and alterations at Weaver's Atelier.",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
