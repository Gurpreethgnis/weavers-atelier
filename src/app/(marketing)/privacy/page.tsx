import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Weavers Atelier",
  description:
    "Learn how Weavers Atelier collects, uses, and protects your personal information.",
  openGraph: {
    title: "Privacy Policy | Weavers Atelier",
    description:
      "Learn how Weavers Atelier collects, uses, and protects your personal information.",
  },
};

export default function PrivacyPage() {
  return <LegalPage initialAnchor="privacy" />;
}
