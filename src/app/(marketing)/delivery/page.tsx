import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { deliveryContent } from "@/content/delivery";

export const metadata: Metadata = {
  title: "Worldwide Delivery | Weaver's Atelier",
  description:
    "Free shipping on orders over $250. Express and standard options available. Track your order every step of the way.",
  openGraph: {
    title: "Worldwide Delivery | Weaver's Atelier",
    description:
      "Free shipping on orders over $250. Express and standard options available.",
  },
};

export default function DeliveryPage() {
  const { hero, shipping, destinations, timelines, packaging, duties, tracking, issues, cta } =
    deliveryContent;

  return (
    <>
      {/* Hero */}
      <section className="container-atelier pt-24 md:pt-40 mb-block-gap">
        <div className="max-w-3xl">
          <span className="text-label-caps text-secondary tracking-widest block mb-4">
            {hero.kicker}
          </span>
          <h1 className="text-display-lg text-on-surface leading-tight mb-8">
            {hero.headline}
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            {hero.description}
          </p>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="container-atelier mb-block-gap">
        <span className="text-label-caps text-secondary tracking-widest block mb-4">
          {shipping.title}
        </span>
        <p className="text-body-lg text-on-surface-variant mb-8 max-w-2xl">
          {shipping.description}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-6">
          {shipping.options.map((option) => (
            <div
              key={option.title}
              className="border border-outline-variant p-8"
            >
              <h3 className="text-body-lg text-on-surface font-medium mb-2">
                {option.title}
              </h3>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-headline-md text-secondary">
                  {option.price}
                </span>
                {"priceNote" in option && option.priceNote && (
                  <span className="text-body-md text-on-surface-variant">
                    {option.priceNote}
                  </span>
                )}
              </div>
              <span className="text-label-caps text-on-surface-variant block mb-3">
                {option.time}
              </span>
              <p className="text-body-md text-on-surface-variant">
                {option.description}
              </p>
            </div>
          ))}
        </div>
        <p className="text-sm text-on-surface-variant">{shipping.note}</p>
      </section>

      {/* Destinations */}
      <section className="bg-surface-container-high py-block-gap mb-block-gap">
        <div className="container-atelier">
          <span className="text-label-caps text-secondary tracking-widest block mb-4">
            {destinations.title}
          </span>
          <p className="text-body-lg text-on-surface-variant mb-12 max-w-2xl">
            {destinations.description}
          </p>
          <details className="border border-outline-variant bg-surface p-6">
            <summary className="cursor-pointer text-body-lg text-on-surface font-medium">
              View regional destination details
            </summary>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mt-6">
              {destinations.regions.map((region) => (
                <div key={region.name}>
                  <h3 className="text-body-lg text-on-surface font-medium mb-4">
                    {region.name}
                  </h3>
                  <ul className="space-y-2">
                    {region.countries.map((country) => (
                      <li
                        key={country}
                        className="text-body-md text-on-surface-variant"
                      >
                        {country}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* Production Times */}
      <section className="container-atelier mb-block-gap">
        <span className="text-label-caps text-secondary tracking-widest block mb-4">
          {timelines.title}
        </span>
        <p className="text-body-lg text-on-surface-variant mb-8 max-w-2xl">
          {timelines.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {timelines.items.map((item) => (
            <div
              key={item.title}
              className="border border-outline-variant p-6"
            >
              <h3 className="text-body-lg text-on-surface font-medium mb-2">
                {item.title}
              </h3>
              <span className="text-headline-md text-secondary block mb-2">
                {item.duration}
              </span>
              <p className="text-sm text-on-surface-variant">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packaging Note */}
      <section className="container-atelier mb-block-gap">
        <div className="bronze-border p-12 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-1 flex justify-center md:justify-start">
              <span className="material-symbols-outlined text-secondary text-[48px]">
                inventory_2
              </span>
            </div>
            <div className="md:col-span-11">
              <span className="text-label-caps text-secondary tracking-widest block mb-4">
                {packaging.title}
              </span>
              <p className="text-body-lg text-on-surface-variant">
                {packaging.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customs & Duties */}
      <section className="container-atelier mb-block-gap">
        <div className="border border-outline-variant p-8 md:p-12">
          <span className="text-label-caps text-secondary tracking-widest block mb-4">
            {duties.title}
          </span>
          <p className="text-body-lg text-on-surface-variant mb-4">
            {duties.description}
          </p>
          <p className="text-sm text-on-surface-variant italic">{duties.note}</p>
        </div>
      </section>

      {/* Tracking CTA */}
      <section className="container-atelier mb-block-gap">
        <div className="bg-surface-container p-12 md:p-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-8">
              <span className="text-label-caps text-secondary tracking-widest block mb-4">
                {tracking.title}
              </span>
              <p className="text-body-lg text-on-surface-variant">
                {tracking.description}
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Link
                href={tracking.cta.href}
                className="bg-inverse-surface text-inverse-on-surface font-ui-button px-10 py-5 hover:bg-surface-tint hover:text-on-surface transition-colors duration-300 inline-flex items-center justify-center gap-3"
              >
                {tracking.cta.text}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Issues FAQ */}
      <section className="container-atelier mb-block-gap">
        <span className="text-label-caps text-secondary tracking-widest block mb-6">
          {issues.title}
        </span>
        <details className="border border-outline-variant p-6 bg-surface">
          <summary className="cursor-pointer text-body-lg text-on-surface font-medium">
            View delivery support guidance
          </summary>
          <div className="space-y-6 mt-6">
            {issues.items.map((item) => (
              <div key={item.question} className="border-l-2 border-secondary pl-6">
                <h3 className="text-body-lg font-medium text-on-surface mb-2">
                  {item.question}
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </details>
      </section>

      {/* Final CTA */}
      <section className="border-y border-outline-variant py-32 mb-block-gap">
        <div className="container-atelier">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-6">
              <span className="text-label-caps text-secondary tracking-widest block mb-4">
                {cta.kicker}
              </span>
              <h2 className="text-display-lg text-on-surface mb-4">
                {cta.headline}
              </h2>
              <p className="text-body-lg text-on-surface-variant">
                {cta.description}
              </p>
            </div>
            <div className="md:col-span-5 md:col-start-8 flex flex-col sm:flex-row gap-4">
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
