import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { statementPiecesContent } from "@/content/statement-pieces";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { HeroImage } from "@/components/layout/HeroImage";

export const metadata: Metadata = {
  title: "Statement Pieces | Weavers Atelier",
  description:
    "Custom jackets, embroidered outerwear, bespoke waistcoats, and one-of-a-kind creations. Beyond categories.",
  openGraph: {
    title: "Statement Pieces | Weavers Atelier",
    description:
      "Custom jackets, embroidered outerwear, bespoke waistcoats, and one-of-a-kind creations.",
  },
};

export default function StatementPiecesPage() {
  const {
    hero,
    introduction,
    categories,
    customizationDepth,
    process,
    timeline,
    pricing,
    cta,
  } = statementPiecesContent;

  return (
    <>
      {/* Hero — Cinematic Full-Bleed with cinematic-shadow */}
      <section className="relative w-full h-screen min-h-[600px] max-h-[900px] mb-block-gap overflow-hidden cinematic-shadow">
        <HeroImage
          src="/images/hero/statement-navy-gold.jpg"
          alt="A navy long jacket with gold embroidered placket photographed in a heritage-styled set — a Weavers Atelier statement piece"
          aspect="aspect-auto"
          priority
          sizes="100vw"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-end pb-20 md:pb-32 z-10">
          <div className="container-atelier">
            <div className="max-w-2xl">
              <span className="text-label-caps text-white/80 tracking-widest block mb-4">
                Beyond Categories
              </span>
              <h1 className="text-display-lg text-white leading-tight mb-6">
                {hero.headline}
              </h1>
              <p className="text-body-lg text-white/90 mb-10">
                {hero.subheadline}
              </p>
              <Link
                href={hero.cta.href}
                className="bg-white text-on-surface font-ui-button px-10 py-5 hover:bg-white/90 transition-colors duration-300 inline-flex items-center gap-3"
              >
                {hero.cta.text}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction — Asymmetric */}
      <section className="container-atelier mb-block-gap">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <div className="md:col-span-5">
            <h2 className="text-headline-lg text-on-surface mb-6">
              {introduction.headline}
            </h2>
            <p className="text-body-lg text-on-surface-variant">
              {introduction.description}
            </p>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <HeroImage
              src="/images/statement/embroidery-detail.jpg"
              alt="Close-up of hand embroidery detail on statement piece"
              aspect="aspect-[4/3]"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
      </section>

      {/* Categories — Editorial 12-col Asymmetric Grid with bronze-border */}
      <section className="container-atelier mb-block-gap">
        <div className="mb-12">
          <span className="text-label-caps text-secondary tracking-widest block mb-4">
            Archive
          </span>
          <h2 className="text-headline-lg text-on-surface">What We Create</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Row 1: Large + Small */}
          <div className="md:col-span-7 bronze-border p-8 hover:border-secondary transition-colors duration-300">
            <span className="text-label-caps text-on-surface-variant/60 block mb-6">
              {categories[0].examples}
            </span>
            <h3 className="text-headline-md text-on-surface mb-4">
              {categories[0].name}
            </h3>
            <p className="text-body-lg text-on-surface-variant">
              {categories[0].description}
            </p>
          </div>
          <div className="md:col-span-5 bronze-border p-8 hover:border-secondary transition-colors duration-300">
            <span className="text-label-caps text-on-surface-variant/60 block mb-6">
              {categories[1].examples}
            </span>
            <h3 className="text-headline-md text-on-surface mb-4">
              {categories[1].name}
            </h3>
            <p className="text-body-lg text-on-surface-variant">
              {categories[1].description}
            </p>
          </div>

          {/* Row 2: Small + Large */}
          <div className="md:col-span-4 bronze-border p-8 hover:border-secondary transition-colors duration-300">
            <span className="text-label-caps text-on-surface-variant/60 block mb-6">
              {categories[2].examples}
            </span>
            <h3 className="text-headline-md text-on-surface mb-4">
              {categories[2].name}
            </h3>
            <p className="text-body-lg text-on-surface-variant">
              {categories[2].description}
            </p>
          </div>
          <div className="md:col-span-8 bronze-border p-8 hover:border-secondary transition-colors duration-300">
            <span className="text-label-caps text-on-surface-variant/60 block mb-6">
              {categories[3].examples}
            </span>
            <h3 className="text-headline-md text-on-surface mb-4">
              {categories[3].name}
            </h3>
            <p className="text-body-lg text-on-surface-variant">
              {categories[3].description}
            </p>
          </div>

          {/* Row 3: Two Equal */}
          {categories.slice(4).map((category) => (
            <div
              key={category.name}
              className="md:col-span-6 bronze-border p-8 hover:border-secondary transition-colors duration-300"
            >
              <span className="text-label-caps text-on-surface-variant/60 block mb-6">
                {category.examples}
              </span>
              <h3 className="text-headline-md text-on-surface mb-4">
                {category.name}
              </h3>
              <p className="text-body-lg text-on-surface-variant">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Customization Depth */}
      <section className="bg-surface-container-high py-block-gap mb-block-gap">
        <div className="container-atelier">
          <h2 className="text-headline-lg text-on-surface text-center mb-16">
            The Depth of Customization
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {customizationDepth.map((item) => (
              <div key={item.name} className="text-center">
                <span className="material-symbols-outlined text-secondary text-[48px] mb-6 block">
                  {item.icon}
                </span>
                <h3 className="text-body-lg text-on-surface font-medium mb-3">
                  {item.name}
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process — Numbered Steps */}
      <section className="container-atelier mb-block-gap">
        <div className="border-b border-outline-variant pb-8 mb-16">
          <h2 className="text-headline-lg text-on-surface">{process.headline}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {process.steps.map((step) => (
            <div key={step.number} className="md:col-span-3 relative">
              <span className="text-display-lg text-surface-container-highest opacity-50 absolute -top-4 -left-2 pointer-events-none select-none">
                {step.number}
              </span>
              <div className="pt-16">
                <h3 className="text-body-lg text-on-surface font-medium mb-3">
                  {step.title}
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline — Bordered Box */}
      <section className="container-atelier mb-block-gap">
        <div className="bronze-border p-12 md:p-16 bg-surface-container">
          <span className="text-label-caps text-secondary tracking-widest block mb-6">
            Planning Ahead
          </span>
          <h2 className="text-headline-md text-on-surface mb-6">
            {timeline.headline}
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            {timeline.description}
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-surface-container-high py-block-gap mb-block-gap">
        <div className="container-atelier">
          <div className="text-center mb-16">
            <span className="text-label-caps text-secondary tracking-widest block mb-4">
              Investment
            </span>
            <h2 className="text-headline-lg text-on-surface mb-4">
              Starting Points
            </h2>
            <p className="text-body-md text-on-surface-variant max-w-xl mx-auto">
              {pricing.note}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter max-w-4xl mx-auto">
            {pricing.examples.map((example) => (
              <div
                key={example.name}
                className="border border-outline-variant/30 bg-surface p-8 text-center hover:border-secondary transition-colors duration-300"
              >
                <h3 className="text-body-lg text-on-surface font-medium mb-2">
                  {example.name}
                </h3>
                <p className="text-headline-md text-secondary mb-4">
                  {example.price}
                </p>
                <p className="text-body-md text-on-surface-variant">
                  {example.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Private Archive CTA Strip */}
      <section className="border-y border-outline-variant py-20 mb-block-gap">
        <div className="container-atelier">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-6">
              <span className="text-label-caps text-secondary tracking-widest block mb-4">
                Private Archive
              </span>
              <h2 className="text-headline-lg text-on-surface mb-4">
                {cta.headline}
              </h2>
              <p className="text-body-lg text-on-surface-variant">
                {cta.description}
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8 flex flex-col sm:flex-row gap-4">
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
