import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { statementPiecesContent } from "@/content/statement-pieces";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

export const metadata: Metadata = {
  title: "Statement Pieces | Weaver's Atelier",
  description:
    "Custom jackets, embroidered outerwear, bespoke waistcoats, and one-of-a-kind creations. Beyond categories.",
  alternates: {
    canonical: "/statement-pieces",
  },
  openGraph: {
    title: "Statement Pieces | Weaver's Atelier",
    description:
      "Custom jackets, embroidered outerwear, bespoke waistcoats, and one-of-a-kind creations.",
    images: [{ url: "/images/hero/home-hero-landscape.jpg" }],
  },
};

export default function StatementPiecesPage() {
  const { hero, categories, process, timeline, cta } = statementPiecesContent;

  return (
    <>
      <section className="container-atelier pt-24 md:pt-40 mb-block-gap">
        <div className="max-w-3xl">
          <h1 className="text-display-lg text-on-surface leading-tight mb-8">
            {hero.headline}
          </h1>
          <p className="text-body-lg text-on-surface-variant mb-10">
            {hero.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={hero.cta.href}
              className="bg-inverse-surface text-inverse-on-surface font-ui-button px-10 py-5 hover:bg-surface-tint hover:text-on-surface transition-colors duration-300 inline-flex items-center justify-center gap-3"
            >
              {hero.cta.text}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact?subject=custom"
              className="border border-outline-variant text-on-surface font-ui-button px-10 py-5 hover:border-secondary transition-colors duration-300 inline-flex items-center justify-center"
            >
              Send Inspiration
            </Link>
          </div>
        </div>
      </section>

      <section className="container-atelier mb-block-gap">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {categories.slice(0, 4).map((category) => (
            <article key={category.name} className="border border-outline-variant bg-surface p-8">
              <h2 className="text-headline-md text-on-surface mb-3">{category.name}</h2>
              <p className="text-body-md text-on-surface-variant">{category.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-surface-container-high py-block-gap mb-block-gap">
        <div className="container-atelier">
          <h2 className="text-headline-lg text-on-surface mb-10">Creation Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
            {process.steps.map((step) => (
              <div key={step.number} className="border border-outline-variant bg-surface p-6">
                <span className="text-label-caps text-secondary">{step.number}</span>
                <h3 className="text-body-lg text-on-surface font-medium mt-2 mb-2">{step.title}</h3>
                <p className="text-body-md text-on-surface-variant">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-atelier mb-block-gap">
        <details className="border border-outline-variant bg-surface p-6">
          <summary className="cursor-pointer text-body-lg text-on-surface font-medium">
            Timeline and additional categories
          </summary>
          <p className="text-body-md text-on-surface-variant mt-4 mb-6">{timeline.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {categories.slice(4).map((category) => (
              <div key={category.name} className="border border-outline-variant p-6">
                <h3 className="text-body-lg text-on-surface font-medium mb-2">{category.name}</h3>
                <p className="text-body-md text-on-surface-variant">{category.description}</p>
              </div>
            ))}
          </div>
        </details>
      </section>

      <section className="border-y border-outline-variant py-24 mb-block-gap">
        <div className="container-atelier">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-headline-lg text-on-surface mb-4">{cta.headline}</h2>
            <p className="text-body-lg text-on-surface-variant mb-10">{cta.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={cta.primaryCta.href}
                className="bg-inverse-surface text-inverse-on-surface font-ui-button px-8 py-5 hover:bg-surface-tint hover:text-on-surface transition-colors duration-300 inline-flex items-center justify-center gap-3"
              >
                {cta.primaryCta.text}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <WhatsAppButton
                context={cta.secondaryCta.context}
                label={cta.secondaryCta.text}
                variant="outline"
                size="lg"
                className="!font-ui-button !px-8 !py-5 !rounded-none border-outline-variant hover:!border-[#25D366]"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
