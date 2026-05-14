import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { customShirtsContent } from "@/content/custom-shirts";

export const metadata: Metadata = {
  title: "Custom Shirts | The Architecture of the Shirt",
  description:
    "Bespoke custom shirts engineered for precision. Every collar point and cuff line maintains structural integrity. Commission your piece at Weavers Atelier.",
  openGraph: {
    title: "Custom Shirts | Weavers Atelier",
    description:
      "A study in precision. Bespoke shirts with architectural construction and premium fabrics.",
  },
};

export default function CustomShirtsPage() {
  const { hero, fabrics, structure, fit, cta } = customShirtsContent;

  return (
    <main className="pt-24 md:pt-36 px-5 md:px-16 max-w-[1920px] mx-auto">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-block-gap">
        <div className="lg:col-span-5 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-outline-variant pb-8 lg:pb-0 lg:pr-8">
          <p className="text-label-caps tracking-[0.15em] text-secondary mb-8">
            {hero.label}
          </p>
          <h1 className="text-headline-lg-mobile md:text-display-lg text-on-surface mb-6 leading-tight">
            {hero.headline}
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-md">
            {hero.subheadline}
          </p>
        </div>
        <div className="lg:col-span-7 h-[614px] lg:h-[819px] relative border border-outline-variant">
          <Image
            src="/images/custom-shirts/hero-shirt.jpg"
            alt="Bespoke custom shirt on minimalist dress form in nocturnal atelier setting"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 58vw, 100vw"
            priority
          />
        </div>
      </section>

      {/* Material Science */}
      <section className="mb-block-gap">
        <div className="flex items-center justify-between border-b border-outline-variant pb-4 mb-12">
          <h2 className="text-headline-md text-on-surface">{fabrics.headline}</h2>
          <span className="text-label-caps tracking-[0.15em] text-secondary">
            {fabrics.label}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {fabrics.items.map((fabric) => (
            <div
              key={fabric.name}
              className="border border-outline-variant bg-surface-container-low group cursor-pointer relative overflow-hidden transition-all duration-500 hover:border-secondary"
            >
              <div className="h-64 overflow-hidden relative border-b border-outline-variant">
                <Image
                  src={fabric.image.src}
                  alt={fabric.image.alt}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-headline-md text-on-surface mb-2">
                  {fabric.name}
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  {fabric.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Structural Details */}
      <section className="mb-block-gap">
        <div className="flex items-center justify-between border-b border-outline-variant pb-4 mb-12">
          <h2 className="text-headline-md text-on-surface">{structure.headline}</h2>
          <span className="text-label-caps tracking-[0.15em] text-secondary">
            {structure.label}
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          <div className="border border-outline-variant p-8 lg:p-12 bg-surface-container flex flex-col justify-center">
            <div className="space-y-8">
              {structure.items.map((item, index) => (
                <div
                  key={item.name}
                  className={`flex items-start gap-6 ${
                    index > 0 ? "border-t border-outline-variant pt-8" : ""
                  }`}
                >
                  <span className="text-display-lg text-outline-variant opacity-20 select-none">
                    {item.number}
                  </span>
                  <div>
                    <h4 className="text-headline-md text-on-surface mb-2">
                      {item.name}
                    </h4>
                    <p className="text-body-md text-on-surface-variant">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="h-[600px] border border-outline-variant relative">
            <Image
              src="/images/custom-shirts/structural-detail.jpg"
              alt="Shirt structural details showing collar and placket"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Geometry of Fit */}
      <section className="mb-block-gap">
        <div className="flex items-center justify-between border-b border-outline-variant pb-4 mb-12">
          <h2 className="text-headline-md text-on-surface">{fit.headline}</h2>
          <span className="text-label-caps tracking-[0.15em] text-secondary">
            {fit.label}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-gutter gap-y-12">
          {fit.options.map((option) => (
            <div
              key={option.name}
              className="border-t border-outline-variant pt-6 relative group"
            >
              <div className="absolute top-0 right-0 w-3 h-3 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity mt-6" />
              <h3 className="text-headline-lg-mobile text-on-surface mb-4">
                {option.name}
              </h3>
              <p className="text-body-md text-on-surface-variant mb-6">
                {option.description}
              </p>
              <button className="text-label-caps tracking-[0.15em] text-secondary border-b border-secondary pb-1 hover:text-primary hover:border-primary transition-colors">
                SELECT FIT
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border border-outline-variant bg-surface-container-low p-12 md:p-24 flex flex-col items-center text-center mb-block-gap">
        <h2 className="text-headline-lg text-on-surface mb-6">{cta.headline}</h2>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mb-12">
          {cta.description}
        </p>
        <Link
          href={cta.primaryCta.href}
          className="bg-secondary text-on-secondary px-8 py-4 text-label-caps tracking-widest uppercase hover:bg-primary transition-colors duration-300 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
        >
          {cta.primaryCta.text}
        </Link>
      </section>
    </main>
  );
}
