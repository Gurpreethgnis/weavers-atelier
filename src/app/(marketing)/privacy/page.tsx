import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Weaver's Atelier",
  description:
    "Learn how Weaver's Atelier collects, uses, and protects your personal information.",
  openGraph: {
    title: "Privacy Policy | Weaver's Atelier",
    description:
      "Learn how Weaver's Atelier collects, uses, and protects your personal information.",
  },
};

export default function PrivacyPage() {
  return <LegalPage initialAnchor="privacy" />;
}
