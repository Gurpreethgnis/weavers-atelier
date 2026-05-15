import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | Weaver's Atelier",
  description:
    "Terms and conditions governing the use of Weaver's Atelier services.",
  openGraph: {
    title: "Terms of Service | Weaver's Atelier",
    description:
      "Terms and conditions governing the use of Weaver's Atelier services.",
  },
};

export default function TermsPage() {
  return <LegalPage initialAnchor="terms" />;
}
