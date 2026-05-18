import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { returnsAlterationsContent } from "@/content/returns-alterations";

export const metadata: Metadata = {
  title: "Returns & Alterations",
  description:
    "Free alterations within 30 days. We stand behind the fit of every garment we create.",
  alternates: {
    canonical: "/returns-alterations",
  },
  openGraph: {
    title: "Returns & Alterations | Weaver's Atelier",
    description:
      "Free alterations within 30 days. We stand behind the fit of every garment we create.",
    images: [{ url: "/images/hero/home-hero-landscape.jpg" }],
  },
};

export default function ReturnsAlterationsPage() {
  const { hero, guarantee, returns, alterations, nonReturnable, refunds, cta } =
    returnsAlterationsContent;

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

      {/* Fit Guarantee */}
      <section className="container-atelier mb-block-gap">
        <span className="text-label-caps text-secondary tracking-widest block mb-6">
          {guarantee.title}
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {guarantee.policies.map((policy) => (
            <div
              key={policy.title}
              className="border border-outline-variant p-8 hover:border-secondary transition-colors duration-300"
            >
              <h3 className="text-body-lg text-on-surface font-medium mb-3">
                {policy.title}
              </h3>
              <p className="text-body-md text-on-surface-variant mb-4">
                {policy.description}
              </p>
              <p className="text-sm text-on-surface-variant italic">
                {policy.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Ready-to-Wear Returns + Custom Order Alterations */}
      <section className="bg-surface-container-high py-block-gap mb-block-gap">
        <div className="container-atelier">
          <span className="text-label-caps text-secondary tracking-widest block mb-6">
            {returns.title}
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {returns.sections.map((section) => (
              <div key={section.title} className="bg-surface p-8 border border-outline-variant">
                <h3 className="text-headline-md text-on-surface mb-4">
                  {section.title}
                </h3>
                <p className="text-body-md text-on-surface-variant mb-6">
                  {section.description}
                </p>
                {"conditions" in section && section.conditions && (
                  <ul className="space-y-2 mb-6">
                    {section.conditions.map((condition) => (
                      <li key={condition} className="flex gap-3">
                        <span className="w-1.5 h-1.5 bg-secondary mt-2 flex-shrink-0" />
                        <span className="text-body-md text-on-surface-variant">
                          {condition}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {"note" in section && section.note && (
                  <div className="border-l-2 border-secondary pl-4">
                    <p className="text-body-md text-on-surface-variant italic">
                      {section.note}
                    </p>
                  </div>
                )}
                {section.title === "Custom Order Alterations" && (
                  <details className="border border-outline-variant p-4 mt-6 bg-surface">
                    <summary className="cursor-pointer text-body-md text-on-surface font-medium">
                      View alteration process
                    </summary>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {alterations.steps.map((step) => (
                        <div key={step.number} className="border border-outline-variant p-4">
                          <span className="text-label-caps text-secondary">{step.number}</span>
                          <h4 className="text-body-md text-on-surface font-medium mt-2 mb-1">
                            {step.title}
                          </h4>
                          <p className="text-sm text-on-surface-variant">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
                {"cta" in section && section.cta && (
                  <Link
                    href={section.cta.href}
                    className="text-label-caps text-secondary hover:text-on-surface transition-colors inline-flex items-center gap-2 mt-4"
                  >
                    {section.cta.text}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Non-Returnable Items */}
      <section className="container-atelier mb-block-gap">
        <div className="border border-outline-variant p-8 md:p-12">
          <span className="text-label-caps text-secondary tracking-widest block mb-6">
            {nonReturnable.title}
          </span>
          <details className="border border-outline-variant p-6 bg-surface">
            <summary className="cursor-pointer text-body-md text-on-surface font-medium">
              View full non-returnable list
            </summary>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {nonReturnable.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-on-surface-variant">✕</span>
                  <span className="text-body-md text-on-surface-variant">{item}</span>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </section>

      {/* Refund Timing */}
      <section className="container-atelier mb-block-gap">
        <span className="text-label-caps text-secondary tracking-widest block mb-6">
          {refunds.title}
        </span>
        <details className="border border-outline-variant p-6 bg-surface">
          <summary className="cursor-pointer text-body-lg text-on-surface font-medium">
            View refund and payment details
          </summary>
          <div className="space-y-6 mt-6">
            {refunds.items.map((item) => (
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

      {/* Need Help */}
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
