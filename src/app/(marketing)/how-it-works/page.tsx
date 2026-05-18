import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { howItWorksContent } from "@/content/how-it-works";

export const metadata: Metadata = {
  title: "How It Works | Weaver's Atelier",
  description:
    "From selection to your door. Whether you're buying off the rack or going custom, here's what to expect.",
  alternates: {
    canonical: "/how-it-works",
  },
  openGraph: {
    title: "How It Works | Weaver's Atelier",
    description:
      "From selection to your door. Whether you're buying off the rack or going custom, here's what to expect.",
    images: [{ url: "/images/hero/home-hero-landscape.jpg" }],
  },
};

export default function HowItWorksPage() {
  const { hero, paths, customProcess, cta } = howItWorksContent;

  return (
    <>
      {/* Hero — Centered */}
      <section className="container-atelier pt-24 md:pt-40 mb-block-gap">
        <div className="grid grid-cols-4 md:grid-cols-12 gap-gutter">
          <div className="col-span-4 md:col-span-10 md:col-start-2 text-center">
            <h1 className="text-display-lg text-on-surface leading-tight mb-8">
              {hero.headline}
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              {hero.subheadline}
            </p>
          </div>
        </div>
      </section>

      {/* Two Paths Section */}
      <section className="container-atelier mb-block-gap">
        <h2 className="text-headline-lg text-on-surface text-center mb-12">
          {paths.headline}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {/* Standard / RTW */}
          <div className="border border-outline-variant p-8 md:p-12 hover:border-secondary transition-colors duration-300">
            <h3 className="text-headline-md text-on-surface mb-4">
              {paths.standard.title}
            </h3>
            <p className="text-body-lg text-on-surface-variant mb-8">
              {paths.standard.description}
            </p>
            <ol className="space-y-3 mb-8">
              {paths.standard.steps.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-label-caps text-secondary w-6 flex-shrink-0">
                    {idx + 1}.
                  </span>
                  <span className="text-body-md text-on-surface-variant">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
            <Link
              href={paths.standard.cta.href}
              className="bg-inverse-surface text-inverse-on-surface font-ui-button px-8 py-4 hover:bg-surface-tint hover:text-on-surface transition-colors duration-300 inline-flex items-center gap-3"
            >
              {paths.standard.cta.text}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Custom */}
          <div className="border border-secondary bg-surface-container p-8 md:p-12">
            <h3 className="text-headline-md text-on-surface mb-4">
              {paths.custom.title}
            </h3>
            <p className="text-body-lg text-on-surface-variant mb-8">
              {paths.custom.description}
            </p>
            <ol className="space-y-3 mb-8">
              {paths.custom.steps.map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-label-caps text-secondary w-6 flex-shrink-0">
                    {idx + 1}.
                  </span>
                  <span className="text-body-md text-on-surface-variant">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
            <Link
              href={paths.custom.cta.href}
              className="border border-inverse-surface text-on-surface font-ui-button px-8 py-4 hover:border-secondary hover:text-secondary transition-colors duration-300 inline-flex items-center gap-3"
            >
              {paths.custom.cta.text}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Process Detailed Steps */}
      <section id="custom-process" className="bg-surface-container-high py-block-gap mb-block-gap">
        <div className="container-atelier">
          <div className="text-center mb-16">
            <h2 className="text-headline-lg text-on-surface">
              {customProcess.headline}
            </h2>
          </div>

          <details className="border border-outline-variant bg-surface p-6 md:p-8">
            <summary className="cursor-pointer text-body-lg text-on-surface font-medium">
              View detailed custom steps
            </summary>
            <div className="space-y-12 mt-8">
              {customProcess.steps.map((step) => (
                <div
                  key={step.number}
                  className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start"
                >
                  {/* Step Number */}
                  <div className="md:col-span-2">
                    <span className="text-display-lg text-secondary/20 block">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-10">
                    <h3 className="text-headline-md text-on-surface mb-4">
                      {step.title}
                    </h3>
                    <p className="text-body-lg text-on-surface-variant mb-6 max-w-2xl">
                      {step.description}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {step.details.map((detail) => (
                        <li key={detail} className="flex gap-3">
                          <span className="w-1.5 h-1.5 bg-secondary mt-2.5 flex-shrink-0" />
                          <span className="text-body-md text-on-surface-variant">
                            {detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {"cta" in step && step.cta && (
                      <Link
                        href={step.cta.href}
                        className="text-label-caps text-secondary hover:text-on-surface transition-colors inline-flex items-center gap-2"
                      >
                        {step.cta.text}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      </section>

      {/* CTA */}
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
