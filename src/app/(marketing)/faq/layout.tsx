import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Weavers Atelier",
  description:
    "Frequently asked questions about custom menswear, measurements, pricing, delivery, and alterations at Weavers Atelier.",
  openGraph: {
    title: "FAQ | Weavers Atelier",
    description:
      "Frequently asked questions about custom menswear, measurements, pricing, delivery, and alterations at Weavers Atelier.",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
