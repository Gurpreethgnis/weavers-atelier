import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description:
    "Schedule a personalized styling consultation. Discuss your vision, get expert advice, and start your custom menswear journey.",
  openGraph: {
    title: "Book a Consultation | Weavers Atelier",
    description:
      "Schedule a personalized styling consultation. Discuss your vision, get expert advice, and start your custom menswear journey.",
  },
};

export default function BookConsultationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
