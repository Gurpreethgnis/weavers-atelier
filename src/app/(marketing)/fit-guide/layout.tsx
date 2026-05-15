import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fit Studio",
  description:
    "Perfect fit starts with accurate measurements. Use our interactive guide or schedule a video session for personalized assistance.",
  openGraph: {
    title: "Fit Studio | Weaver's Atelier",
    description:
      "Perfect fit starts with accurate measurements. Use our interactive guide or schedule a video session for personalized assistance.",
  },
};

export default function FitGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
