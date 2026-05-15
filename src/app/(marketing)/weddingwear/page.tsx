import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { weddingwearContent } from "@/content/weddingwear";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { HeroImage } from "@/components/layout/HeroImage";

export const metadata: Metadata = {
  title: "Weddingwear | Weaver's Atelier",
  description:
    "Custom wedding suits, tuxedos, sherwanis, and bandhgalas. Made to your measurements for grooms, groomsmen, and guests.",
  openGraph: {
    title: "Weddingwear | Weaver's Atelier",
    description:
      "Custom wedding suits, tuxedos, sherwanis, and bandhgalas. Made to your measurements.",
  },
};

export default function WeddingwearPage() {
  const {
    hero,
    introduction,
    attireCategories,
    customizationOptions,
    timeline,
    groomsmenProgram,
    process,
    pricing,
    cta,
  } = weddingwearContent;

  return (
    <>
      {/* Hero — Centered Editorial */}
      <section className="container-atelier pt-24 md:pt-40 mb-block-gap">
        <div className="grid grid-cols-4 md:grid-cols-12 gap-gutter">
          <div className="col-span-4 md:col-span-10 md:col-start-2 text-center">
            <span className="text-label-caps text-secondary tracking-widest block mb-6">
              Ceremonial Attire
            </span>
            <h1 className="text-display-lg text-on-surface leading-tight mb-8">
              {hero.headline}
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12">
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
        </div>
      </section>

      {/* Introduction — Asymmetric Split */}
      <section className="container-atelier mb-block-gap">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <div className="md:col-span-6 order-2 md:order-1">
            <HeroImage
              src="/images/weddingwear/sherwani-detail.jpg"
              alt="Hand-embroidered sherwani detail showing intricate craftsmanship"
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

      {/* Attire Categories — Left/Right Lookbook Grid */}
      <section className="container-atelier mb-block-gap">
        <div className="mb-12">
          <span className="text-label-caps text-secondary tracking-widest block mb-4">
            Archive
          </span>
          <h2 className="text-headline-lg text-on-surface">Wedding Attire</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Left Column — Single Tall Card */}
          <div className="md:col-span-6">
            <div className="relative aspect-[4/5] mb-6 bg-surface-container overflow-hidden">
              <HeroImage
                src="/images/weddingwear/wedding-suits.jpg"
                alt={attireCategories[0].name}
                aspect="aspect-[4/5]"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            </div>
            <span className="text-label-caps text-secondary tracking-widest block mb-3">
              {attireCategories[0].for}
            </span>
            <h3 className="text-headline-md text-on-surface mb-4">
              {attireCategories[0].name}
            </h3>
            <p className="text-body-lg text-on-surface-variant mb-6">
              {attireCategories[0].description}
            </p>
            <Link
              href="/book-consultation?type=weddingwear"
              className="text-label-caps text-secondary hover:text-on-surface transition-colors inline-flex items-center gap-2"
            >
              Inquire <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Right Column — Two Stacked Cards */}
          <div className="md:col-span-6 flex flex-col gap-gutter">
            {attireCategories.slice(1, 3).map((category) => (
              <div key={category.name}>
                <div className="relative aspect-[3/2] mb-4 bg-surface-container overflow-hidden">
                  <HeroImage
                    src={`/images/weddingwear/${category.name.toLowerCase().replace(/\s+/g, "-")}.jpg`}
                    alt={category.name}
                    aspect="aspect-[3/2]"
                    sizes="(min-width: 768px) 45vw, 100vw"
                  />
                </div>
                <span className="text-label-caps text-secondary tracking-widest block mb-2">
                  {category.for}
                </span>
                <h4 className="text-headline-md text-on-surface mb-3">
                  {category.name}
                </h4>
                <p className="text-body-md text-on-surface-variant">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-16">
          {attireCategories.slice(3).map((category) => (
            <div
              key={category.name}
              className="border border-outline-variant p-8 hover:border-secondary transition-colors duration-300"
            >
              <span className="text-label-caps text-secondary block mb-3">
                {category.for}
              </span>
              <h3 className="text-body-lg text-on-surface font-medium mb-3">
                {category.name}
              </h3>
              <p className="text-body-md text-on-surface-variant">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Personalization Band */}
      <section className="bg-primary-container py-block-gap mb-block-gap">
        <div className="container-atelier">
          <h2 className="text-headline-lg text-on-surface text-center mb-16">
            Personalization
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {customizationOptions.map((item) => (
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

      {/* Timeline — Numbered Horizontal Flow */}
      <section className="container-atelier mb-block-gap">
        <div className="text-center mb-16">
          <h2 className="text-headline-lg text-on-surface mb-4">
            {timeline.headline}
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            {timeline.description}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {timeline.milestones.map((milestone, index) => (
            <div
              key={milestone.title}
              className="md:col-span-3 relative text-center"
            >
              <span className="text-display-lg text-surface-container-highest opacity-30 block mb-4">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-label-caps text-secondary block mb-2">
                {milestone.weeks}
              </span>
              <h3 className="text-body-lg text-on-surface font-medium mb-2">
                {milestone.title}
              </h3>
              <p className="text-body-md text-on-surface-variant">
                {milestone.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Groomsmen Program — Split Layout */}
      <section className="container-atelier mb-block-gap">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
          <div className="md:col-span-5">
            <span className="text-label-caps text-secondary tracking-widest block mb-4">
              Group Orders
            </span>
            <h2 className="text-headline-lg text-on-surface mb-6">
              {groomsmenProgram.headline}
            </h2>
            <p className="text-body-lg text-on-surface-variant mb-8">
              {groomsmenProgram.description}
            </p>
            <Link
              href="/book-consultation?type=weddingwear&group=true"
              className="text-label-caps text-secondary hover:text-on-surface transition-colors inline-flex items-center gap-2"
            >
              Inquire About Group Pricing <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="md:col-span-7">
            <HeroImage
              src="/images/weddingwear/groomsmen.jpg"
              alt="Coordinated groomsmen in custom weddingwear"
              aspect="aspect-[4/3]"
              sizes="(min-width: 768px) 55vw, 100vw"
            />
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

      {/* Final CTA with Event Date Capture */}
      <section className="container-atelier mb-block-gap">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-label-caps text-secondary tracking-widest block mb-6">
            Start Your Journey
          </span>
          <h2 className="text-headline-lg-mobile md:text-display-lg text-on-surface mb-8">
            {cta.headline}
          </h2>
          <p className="text-body-lg text-on-surface-variant mb-12">
            {cta.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`${cta.primaryCta.href}&eventDate=`}
              className="bg-inverse-surface text-inverse-on-surface font-ui-button px-10 py-5 hover:bg-surface-tint hover:text-on-surface transition-colors duration-300 inline-flex items-center justify-center gap-3"
            >
              {cta.primaryCta.text}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <WhatsAppButton
              context={cta.secondaryCta.context}
              label={cta.secondaryCta.text}
              variant="outline"
              size="lg"
              className="!font-ui-button !px-10 !py-5 !rounded-none border-outline-variant hover:!border-[#25D366]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
