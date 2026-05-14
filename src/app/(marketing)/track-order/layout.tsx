import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Commission | Weavers Atelier",
  description:
    "Track your custom garment order status. Enter your commission ID to view production progress and shipping details.",
  openGraph: {
    title: "Track Your Commission | Weavers Atelier",
    description:
      "Track your custom garment order status. Enter your commission ID to view production progress and shipping details.",
  },
};

export default function TrackOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
