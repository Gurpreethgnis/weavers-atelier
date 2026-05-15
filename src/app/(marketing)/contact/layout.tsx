import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Weaver's Atelier",
  description:
    "Reach the Weaver's Atelier team. Send us an inquiry, book a consultation, or connect via WhatsApp for personalized assistance.",
  openGraph: {
    title: "Contact | Weaver's Atelier",
    description:
      "Reach the Weaver's Atelier team. Send us an inquiry, book a consultation, or connect via WhatsApp for personalized assistance.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
