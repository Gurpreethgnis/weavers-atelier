import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | Weavers Atelier",
  description:
    "Terms and conditions governing the use of Weavers Atelier services.",
  openGraph: {
    title: "Terms of Service | Weavers Atelier",
    description:
      "Terms and conditions governing the use of Weavers Atelier services.",
  },
};

export default function TermsPage() {
  return <LegalPage initialAnchor="terms" />;
}
