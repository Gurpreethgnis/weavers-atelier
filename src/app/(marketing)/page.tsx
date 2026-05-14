import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { homeContent } from "@/content/home";

export default function HomePage() {
  const { hero, categories, madeForYou, occasions, trust, cta } = homeContent;

  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-[#140a07] aspect-[16/9] min-h-[600px]">
        <div className="absolute inset-0">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Gradient overlay */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.0)_0%,rgba(0,0,0,0.0)_55%,rgba(0,0,0,0.55)_85%,rgba(0,0,0,0.9)_100%)]"
        />

        {/* Hero copy */}
        <div className="relative z-10 h-full w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center justify-end pb-16 md:pb-24">
          <div className="text-center flex flex-col gap-6 max-w-2xl mx-auto">
            <h1 className="font-display-lg text-[44px] leading-[48px] md:text-[88px] md:leading-[92px] tracking-[-0.02em] font-normal text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.7)]">
              {hero.headline}
            </h1>
            <p className="font-body-lg text-[18px] leading-[28px] font-normal text-white/85 max-w-xl mx-auto drop-shadow-[0_1px_12px_rgba(0,0,0,0.6)]">
              {hero.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Link
                href={hero.cta.href}
                className="bg-white text-[#171717] font-ui-button px-10 py-5 hover:bg-white/90 transition-colors duration-300 inline-flex items-center justify-center gap-3"
              >
                {hero.cta.text}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={hero.secondaryCta.href}
                className="border border-white text-white font-ui-button px-10 py-5 hover:bg-white/10 transition-colors duration-300 inline-flex items-center justify-center"
              >
                {hero.secondaryCta.text}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container-atelier py-block-gap">
        <div className="border-b border-outline-variant pb-8 mb-16">
          <h2 className="text-headline-lg text-on-surface">
            {categories.headline}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {categories.items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group block"
            >
              <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-surface-container">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-headline-md text-on-surface mb-2 group-hover:text-secondary transition-colors">
                {item.name}
              </h3>
              <p className="text-body-md text-on-surface-variant">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Made for You Section */}
      <section className="bg-surface-container-high py-block-gap">
        <div className="container-atelier">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-label-caps text-secondary tracking-widest block mb-4">
              Customize
            </span>
            <h2 className="text-headline-lg text-on-surface mb-6">
              {madeForYou.headline}
            </h2>
            <p className="text-body-lg text-on-surface-variant">
              {madeForYou.subheadline}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-12">
            {madeForYou.features.map((feature) => (
              <div
                key={feature.title}
                className="border border-outline-variant bg-surface p-8 hover:border-secondary transition-colors duration-300"
              >
                <span className="material-symbols-outlined text-secondary text-[32px] mb-4 block">
                  {feature.icon}
                </span>
                <h3 className="text-body-lg text-on-surface font-medium mb-2">
                  {feature.title}
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href={madeForYou.cta.href}
              className="text-label-caps text-secondary hover:text-on-surface transition-colors inline-flex items-center gap-2"
            >
              {madeForYou.cta.text}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Occasions Section (Wedding + Statement) */}
      <section className="container-atelier py-block-gap">
        <div className="border-b border-outline-variant pb-8 mb-16">
          <span className="text-label-caps text-secondary tracking-widest block mb-4">
            Special Orders
          </span>
          <h2 className="text-headline-lg text-on-surface">
            {occasions.headline}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-8">
          {occasions.items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group"
            >
              <div className="relative aspect-[4/3] mb-6 overflow-hidden bg-surface-container">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-headline-md text-on-surface mb-2 group-hover:text-secondary transition-colors">
                {item.name}
              </h3>
              <p className="text-body-md text-on-surface-variant">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
        <p className="text-body-md text-on-surface-variant italic">
          {occasions.note}
        </p>
      </section>

      {/* Trust Section */}
      <section className="border-y border-outline-variant py-16">
        <div className="container-atelier">
          <div className="mb-12">
            <h2 className="text-headline-lg text-on-surface">{trust.headline}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {trust.items.map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="material-symbols-outlined text-secondary text-[24px] flex-shrink-0">
                  {item.icon}
                </span>
                <div>
                  <h3 className="text-body-lg text-on-surface font-medium mb-1">
                    {item.title}
                  </h3>
                  <p className="text-body-md text-on-surface-variant">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-atelier py-block-gap">
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
      </section>
    </main>
  );
}
