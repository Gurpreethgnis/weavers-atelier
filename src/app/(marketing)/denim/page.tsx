import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { denimContent } from "@/content/denim";
import { HeroImage } from "@/components/layout/HeroImage";

export const metadata: Metadata = {
  title: "Statement Denim | Weaver's Atelier",
  description:
    "Custom denim with embroidery, patchwork, and distressing. Japanese selvedge and premium denim made to your measurements.",
  openGraph: {
    title: "Statement Denim | Weaver's Atelier",
    description:
      "Custom denim with embroidery, patchwork, and distressing. Japanese selvedge and premium denim.",
  },
};

export default function DenimPage() {
  const {
    hero,
    introduction,
    denimStyles,
    customizations,
    denimWeights,
    selvedge,
    process,
    pricing,
    cta,
  } = denimContent;

  return (
    <>
      {/* Hero — Single-Column Centered */}
      <section className="container-atelier pt-24 md:pt-40 pb-16 mb-block-gap">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-label-caps text-secondary tracking-widest block mb-6">
            Custom Craft
          </span>
          <h1 className="font-display-lg-mobile md:text-display-lg text-on-surface leading-tight mb-8">
            {hero.headline}
          </h1>
          <p className="text-body-lg text-on-surface-variant mb-12">
            {hero.subheadline}
          </p>
          <Link
            href={hero.cta.href}
            className="bg-inverse-surface text-inverse-on-surface font-ui-button px-10 py-5 hover:bg-surface-tint hover:text-on-surface transition-colors duration-300 inline-flex items-center gap-3"
          >
            {hero.cta.text}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Denim Styles — 7/4 Lookbook Two-Card Pattern */}
      <section className="container-atelier mb-block-gap">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Primary Card — col-span-7 */}
          <div className="md:col-span-7">
            <div className="relative aspect-[4/5] mb-6 bg-surface-container overflow-hidden">
              <HeroImage
                src="/images/denim/classic-straight.jpg"
                alt={denimStyles[0].name}
                aspect="aspect-[4/5]"
                sizes="(min-width: 768px) 55vw, 100vw"
              />
            </div>
            <span className="text-label-caps text-secondary tracking-widest block mb-3">
              {denimStyles[0].fit}
            </span>
            <h2 className="text-headline-md text-on-surface mb-4">
              {denimStyles[0].name}
            </h2>
            <p className="text-body-lg text-on-surface-variant mb-6 max-w-md">
              {denimStyles[0].description}
            </p>
            <Link
              href="/shop/denim"
              className="bg-inverse-surface text-inverse-on-surface font-ui-button px-8 py-4 hover:bg-surface-tint hover:text-on-surface transition-colors duration-300 inline-flex items-center gap-3"
            >
              Shop Denim
            </Link>
          </div>

          {/* Secondary Card — col-span-4, offset with mt-32 */}
          <div className="md:col-span-4 md:col-start-9 md:mt-32">
            <div className="relative aspect-[3/4] mb-6 bg-surface-container overflow-hidden">
              <HeroImage
                src="/images/denim/slim-tapered.jpg"
                alt={denimStyles[1].name}
                aspect="aspect-[3/4]"
                sizes="(min-width: 768px) 30vw, 100vw"
              />
            </div>
            <span className="text-label-caps text-secondary tracking-widest block mb-3">
              {denimStyles[1].fit}
            </span>
            <h2 className="text-headline-md text-on-surface mb-4">
              {denimStyles[1].name}
            </h2>
            <p className="text-body-lg text-on-surface-variant mb-6">
              {denimStyles[1].description}
            </p>
            <Link
              href="/shop/denim"
              className="border border-inverse-surface text-on-surface font-ui-button px-8 py-4 hover:border-secondary hover:text-secondary transition-colors duration-300 inline-flex items-center gap-3"
            >
              Shop Denim
            </Link>
          </div>
        </div>

        {/* Additional Styles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mt-20">
          {denimStyles.slice(2).map((style) => (
            <div
              key={style.name}
              className="border border-outline-variant p-8 hover:border-secondary transition-colors duration-300"
            >
              <span className="text-label-caps text-secondary block mb-3">
                {style.fit}
              </span>
              <h3 className="text-body-lg text-on-surface font-medium mb-3">
                {style.name}
              </h3>
              <p className="text-body-md text-on-surface-variant">
                {style.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Introduction — Asymmetric */}
      <section className="container-atelier mb-block-gap">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <div className="md:col-span-6 order-2 md:order-1">
            <HeroImage
              src="/images/denim/denim-detail.jpg"
              alt="Close-up of custom denim craftsmanship showing embroidery and stitching details"
              aspect="aspect-[3/4]"
              sizes="(min-width: 768px) 45vw, 100vw"
            />
          </div>
          <div className="md:col-span-4 md:col-start-8 order-1 md:order-2">
            <h2 className="text-headline-md text-on-surface mb-6">
              {introduction.headline}
            </h2>
            <p className="text-body-lg text-on-surface-variant">
              {introduction.description}
            </p>
          </div>
        </div>
      </section>

      {/* Customizations — 4-Column Icon Grid */}
      <section className="container-atelier mb-block-gap">
        <div className="border-b border-outline-variant pb-8 mb-16">
          <h2 className="text-headline-lg text-on-surface">Make It Yours</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter">
          {customizations.slice(0, 4).map((item) => (
            <div key={item.name} className="flex flex-col gap-4">
              <span className="material-symbols-outlined text-secondary text-[32px]">
                {item.icon}
              </span>
              <h3 className="text-body-lg text-on-surface font-medium">
                {item.name}
              </h3>
              <p className="text-body-md text-on-surface-variant">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        {customizations.length > 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter mt-12">
            {customizations.slice(4).map((item) => (
              <div key={item.name} className="flex gap-4">
                <span className="material-symbols-outlined text-secondary text-[32px] flex-shrink-0">
                  {item.icon}
                </span>
                <div>
                  <h3 className="text-body-lg text-on-surface font-medium mb-2">
                    {item.name}
                  </h3>
                  <p className="text-body-md text-on-surface-variant">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Denim Weights & Selvedge — Two-Column Band on Elevated Background */}
      <section className="bg-surface-container-high py-block-gap mb-block-gap">
        <div className="container-atelier">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            {/* Weights */}
            <div>
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-outline-variant">
                <div className="w-2 h-2 bg-secondary" />
                <div className="w-2 h-2 bg-secondary" />
                <h2 className="text-headline-md text-on-surface">
                  Denim Weights
                </h2>
              </div>
              <div className="space-y-8">
                {denimWeights.map((weight) => (
                  <div key={weight.name} className="flex gap-4">
                    <div className="w-2 h-2 bg-secondary mt-2.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-body-lg text-on-surface font-medium">
                        {weight.name}
                      </h3>
                      <p className="text-body-md text-on-surface-variant">
                        {weight.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selvedge */}
            <div>
              <div className="flex items-center gap-4 mb-10 pb-6 border-b border-outline-variant">
                <div className="w-2 h-2 bg-secondary" />
                <div className="w-2 h-2 bg-secondary" />
                <h2 className="text-headline-md text-on-surface">
                  {selvedge.headline}
                </h2>
              </div>
              <p className="text-body-lg text-on-surface-variant">
                {selvedge.description}
              </p>
            </div>
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

      {/* Pricing — Elevated Background */}
      <section className="bg-surface-container-high py-block-gap mb-block-gap">
        <div className="container-atelier">
          <div className="text-center mb-16">
            <span className="text-label-caps text-secondary tracking-widest block mb-4">
              Investment
            </span>
            <h2 className="text-headline-lg text-on-surface mb-4">
              Pricing Tiers
            </h2>
            <p className="text-body-md text-on-surface-variant max-w-xl mx-auto">
              {pricing.note}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter max-w-4xl mx-auto">
            {pricing.tiers.map((tier) => (
              <div
                key={tier.name}
                className="border border-outline-variant/30 bg-surface p-8 text-center hover:border-secondary transition-colors duration-300"
              >
                <h3 className="text-body-lg text-on-surface font-medium mb-2">
                  {tier.name}
                </h3>
                <p className="text-headline-md text-secondary mb-4">
                  {tier.price}
                </p>
                <p className="text-body-md text-on-surface-variant">
                  {tier.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-atelier mb-block-gap">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-label-caps text-secondary tracking-widest block mb-6">
            Start Your Order
          </span>
          <h2 className="text-headline-lg-mobile md:text-display-lg text-on-surface mb-8">
            {cta.headline}
          </h2>
          <p className="text-body-lg text-on-surface-variant mb-12">
            {cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={cta.primaryCta.href}
              className="bg-inverse-surface text-inverse-on-surface font-ui-button px-10 py-5 hover:bg-surface-tint hover:text-on-surface transition-colors duration-300 inline-flex items-center justify-center gap-3"
            >
              {cta.primaryCta.text}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={cta.secondaryCta.href}
              className="border border-outline-variant text-on-surface font-ui-button px-10 py-5 hover:border-secondary transition-colors duration-300 inline-flex items-center justify-center"
            >
              {cta.secondaryCta.text}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
