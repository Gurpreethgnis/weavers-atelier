import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { trousersContent } from "@/content/trousers";
import { HeroImage } from "@/components/layout/HeroImage";

export const metadata: Metadata = {
  title: "Tailored Trousers | Weavers Atelier",
  description:
    "From classic dress trousers to casual chinos. Shop standard sizes (XS–XL) or customize every detail for your perfect fit.",
  openGraph: {
    title: "Tailored Trousers | Weavers Atelier",
    description:
      "From classic dress trousers to casual chinos. Shop standard sizes (XS–XL) or customize every detail for your perfect fit.",
  },
};

export default function TrousersPage() {
  const {
    hero,
    introduction,
    styleCategories,
    fitOptions,
    constructionDetails,
    fabricSelection,
    sizing,
    pricing,
    cta,
  } = trousersContent;

  return (
    <>
      {/* Hero Section */}
      <section className="container-atelier pt-24 md:pt-40 mb-block-gap">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <div className="md:col-span-5 flex flex-col gap-6">
            <h1 className="text-headline-lg-mobile md:text-display-lg text-on-surface leading-tight">
              {hero.headline}
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-md">
              {hero.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link
                href={hero.cta.href}
                className="bg-inverse-surface text-inverse-on-surface font-ui-button px-10 py-5 hover:bg-surface-tint hover:text-on-surface transition-colors duration-300 inline-flex items-center gap-3"
              >
                {hero.cta.text}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/fit-guide"
                className="border border-outline-variant text-on-surface font-ui-button px-10 py-5 hover:border-secondary hover:text-secondary transition-colors duration-300 inline-flex items-center gap-3"
              >
                View Size Guide
              </Link>
            </div>
          </div>
          <div className="md:col-span-7 mt-12 md:mt-0">
            <HeroImage
              src="/images/hero/trousers-black-set.jpg"
              alt="Editorial portrait of a man in custom tailored black trousers — Weavers Atelier menswear"
              priority
            />
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="container-atelier mb-block-gap">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <div className="md:col-span-6 order-2 md:order-1">
            <HeroImage
              src={introduction.image.src}
              alt={introduction.image.alt}
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

      {/* Style Categories */}
      <section className="container-atelier mb-block-gap border-t border-secondary-container py-block-gap">
        <div className="mb-12">
          <span className="text-label-caps text-secondary tracking-widest block mb-4">
            Collection
          </span>
          <h2 className="text-headline-lg text-on-surface">Trouser Styles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {styleCategories.map((style) => (
            <Link
              key={style.name}
              href="/shop/trousers"
              className="border border-outline-variant p-8 hover:border-secondary transition-colors duration-300 group"
            >
              <h3 className="text-body-lg text-on-surface font-medium mb-3 group-hover:text-secondary transition-colors">
                {style.name}
              </h3>
              <p className="text-body-md text-on-surface-variant mb-4">
                {style.description}
              </p>
              <span className="text-label-caps text-secondary">
                {style.occasion}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Fit Options */}
      <section className="container-atelier mb-block-gap">
        <div className="border-b border-outline-variant pb-8 mb-16">
          <h2 className="text-headline-lg text-on-surface">Fit Options</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {fitOptions.map((fit, index) => (
            <div key={fit.name} className="border border-outline-variant p-6">
              <span className="text-headline-lg text-secondary/30 block mb-4">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-body-lg text-on-surface font-medium mb-2">
                {fit.name}
              </h3>
              <p className="text-body-md text-on-surface-variant">
                {fit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Construction Details */}
      <section className="container-atelier mb-block-gap">
        <div className="border-b border-outline-variant pb-8 mb-16">
          <h2 className="text-headline-lg text-on-surface">
            Construction Details
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter">
          {constructionDetails.map((item) => (
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
      </section>

      {/* Fabric Selection */}
      <section className="container-atelier mb-block-gap">
        <div className="border border-outline-variant p-12">
          <span className="text-label-caps text-secondary block mb-4">
            Materials
          </span>
          <h3 className="text-headline-md text-on-surface mb-4">
            {fabricSelection.headline}
          </h3>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            {fabricSelection.description}
          </p>
        </div>
      </section>

      {/* Sizing */}
      <section className="container-atelier mb-block-gap">
        <div className="bg-surface-container-high p-12">
          <h3 className="text-headline-md text-on-surface mb-4">
            {sizing.headline}
          </h3>
          <p className="text-body-lg text-on-surface-variant mb-6 max-w-2xl">
            {sizing.description}
          </p>
          <Link
            href={sizing.cta.href}
            className="text-label-caps text-secondary hover:text-on-surface transition-colors inline-flex items-center gap-2"
          >
            {sizing.cta.text}
            <ArrowRight className="h-3 w-3" />
          </Link>
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
              Pricing Tiers
            </h2>
            <p className="text-body-md text-on-surface-variant max-w-xl mx-auto">
              {pricing.note}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter max-w-5xl mx-auto">
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
      <section className="border-y border-outline-variant py-32 mb-block-gap">
        <div className="container-atelier">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-headline-lg text-on-surface mb-8">
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
        </div>
      </section>
    </>
  );
}
