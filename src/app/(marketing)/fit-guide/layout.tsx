import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fit Studio",
  description:
    "Perfect fit starts with accurate measurements. Use our interactive guide or schedule a video session for personalized assistance.",
  alternates: {
    canonical: "/fit-guide",
  },
  openGraph: {
    title: "Fit Studio | Weaver's Atelier",
    description:
      "Perfect fit starts with accurate measurements. Use our interactive guide or schedule a video session for personalized assistance.",
    images: [{ url: "/images/hero/home-hero-landscape.jpg" }],
  },
};

export default function FitGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
