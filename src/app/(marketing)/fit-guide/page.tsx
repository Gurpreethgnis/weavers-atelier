"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { fitGuideContent } from "@/content/fit-guide";

export default function FitGuidePage() {
  const {
    hero,
    sizeChart,
    whenToCustom,
    measurementGuide,
    cta,
  } = fitGuideContent;

  const [selectedChartTab, setSelectedChartTab] = useState<"shirts" | "trousers" | "denim">("shirts");
  const [selectedGuide, setSelectedGuide] = useState<string>("shirt");

  const currentChart = sizeChart[selectedChartTab];
  const activeGuide = measurementGuide.garmentGuides.find((g) => g.id === selectedGuide);

  return (
    <>
      {/* Hero */}
      <section className="container-atelier pt-24 md:pt-40 mb-block-gap">
        <div className="grid grid-cols-4 md:grid-cols-12 gap-gutter">
          <div className="col-span-4 md:col-span-10 md:col-start-2 text-center">
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

      {/* Size Chart Section */}
      <section id="size-chart" className="bg-surface-container-high py-block-gap mb-block-gap">
        <div className="container-atelier">
          <div className="mb-12">
            <h2 className="text-headline-lg text-on-surface mb-4">
              {sizeChart.headline}
            </h2>
            <p className="text-body-md text-on-surface-variant max-w-2xl">
              {sizeChart.note}
            </p>
          </div>

          {/* Chart Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {(["shirts", "trousers", "denim"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedChartTab(tab)}
                className={`font-ui-button px-6 py-3 capitalize transition-colors duration-300 ${
                  selectedChartTab === tab
                    ? "bg-inverse-surface text-inverse-on-surface"
                    : "text-on-surface-variant hover:text-on-surface border border-outline-variant hover:border-secondary"
                }`}
              >
                {sizeChart[tab].title}
              </button>
            ))}
          </div>

          {/* Size Chart Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-outline-variant">
              <thead>
                <tr className="bg-surface">
                  {currentChart.headers.map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-label-caps text-on-surface-variant border-b border-outline-variant"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentChart.rows.map((row) => (
                  <tr key={row.size} className="hover:bg-surface-container transition-colors">
                    {Object.values(row).map((value, idx) => (
                      <td
                        key={idx}
                        className={`px-6 py-4 text-body-md border-b border-outline-variant ${
                          idx === 0 ? "font-medium text-on-surface" : "text-on-surface-variant"
                        }`}
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* When to Go Custom */}
      <section className="container-atelier mb-block-gap">
        <div className="mb-12">
          <h2 className="text-headline-lg text-on-surface mb-4">
            {whenToCustom.headline}
          </h2>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            {whenToCustom.description}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-8">
          {whenToCustom.reasons.map((reason) => (
            <div
              key={reason.title}
              className="border border-outline-variant p-8 hover:border-secondary transition-colors duration-300"
            >
              <h3 className="text-body-lg text-on-surface font-medium mb-3">
                {reason.title}
              </h3>
              <p className="text-body-md text-on-surface-variant">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
        <Link
          href={whenToCustom.cta.href}
          className="text-label-caps text-secondary hover:text-on-surface transition-colors inline-flex items-center gap-2"
        >
          {whenToCustom.cta.text}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </section>

      {/* Measurement Guide for Custom */}
      <section id="custom-measurements" className="bg-surface-container-high py-block-gap mb-block-gap">
        <div className="container-atelier">
          <div className="mb-12">
            <h2 className="text-headline-lg text-on-surface mb-4">
              {measurementGuide.headline}
            </h2>
            <p className="text-body-md text-on-surface-variant max-w-2xl">
              {measurementGuide.note}
            </p>
          </div>
          <details className="border border-outline-variant bg-surface">
            <summary className="cursor-pointer px-6 py-4 text-body-lg text-on-surface font-medium">
              Detailed measurement instructions
            </summary>
            <div className="px-6 pb-6 pt-2">
              {/* Tips */}
              <div className="bronze-border p-8 mb-12 bg-surface">
                <span className="text-label-caps text-secondary block mb-4">Best Practices</span>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {measurementGuide.tips.map((tip) => (
                    <li key={tip} className="flex gap-3">
                      <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span className="text-body-md text-on-surface-variant">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Garment Tabs */}
              <div className="flex flex-wrap gap-2 mb-8">
                {measurementGuide.garmentGuides.map((guide) => (
                  <button
                    key={guide.id}
                    onClick={() => setSelectedGuide(guide.id)}
                    className={`font-ui-button px-6 py-3 transition-colors duration-300 ${
                      selectedGuide === guide.id
                        ? "bg-inverse-surface text-inverse-on-surface"
                        : "text-on-surface-variant hover:text-on-surface border border-outline-variant hover:border-secondary"
                    }`}
                  >
                    {guide.name}
                  </button>
                ))}
              </div>

              {/* Measurements List */}
              {activeGuide && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {activeGuide.measurements.map((m, index) => (
                    <div
                      key={m.name}
                      className="bg-surface p-6 border border-outline-variant"
                    >
                      <span className="text-label-caps text-secondary block mb-2">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h4 className="text-body-lg text-on-surface font-medium mb-2">
                        {m.name}
                      </h4>
                      <p className="text-body-md text-on-surface-variant">
                        {m.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
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
