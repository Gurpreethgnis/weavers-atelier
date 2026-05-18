"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { trackOrderContent } from "@/content/track-order";

export default function TrackOrderPage() {
  const { hero, form, statuses, noOrderFound, needHelp } = trackOrderContent;

  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [searchState, setSearchState] = useState<
    "idle" | "searching" | "found" | "not-found"
  >("idle");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !email.trim()) return;

    setSearchState("searching");

    // In production, this would call an API to look up the order
    setTimeout(() => {
      // Simulate not found for now - real implementation would check Supabase
      setSearchState("not-found");
    }, 1000);
  };

  const statusList = Object.values(statuses);

  return (
    <>
      {/* Hero */}
      <section className="container-atelier pt-24 md:pt-40 mb-16">
        <div className="max-w-3xl">
          <h1 className="text-display-lg text-on-surface leading-tight mb-8">
            {hero.headline}
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            {hero.subheadline}
          </p>
        </div>
      </section>

      {/* Lookup Form */}
      <section className="container-atelier mb-block-gap">
        <div className="max-w-2xl mx-auto">
          <div className="border border-outline-variant p-8 md:p-12">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label
                  htmlFor="orderNumber"
                  className="text-label-caps text-on-surface-variant block mb-2"
                >
                  {form.orderNumberLabel}
                </label>
                <input
                  id="orderNumber"
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder={form.orderNumberPlaceholder}
                  className="w-full bg-surface-container border border-outline-variant px-4 py-4 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-label-caps text-on-surface-variant block mb-2"
                >
                  {form.emailLabel}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={form.emailPlaceholder}
                  className="w-full bg-surface-container border border-outline-variant px-4 py-4 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={searchState === "searching"}
                className="w-full bg-inverse-surface text-inverse-on-surface font-ui-button px-6 py-4 hover:bg-surface-tint hover:text-on-surface transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {searchState === "searching" ? (
                  <span className="animate-spin">⟳</span>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    {form.submitButton}
                  </>
                )}
              </button>

              <p className="text-sm text-on-surface-variant">
                {form.helpText}
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Status Reference (when idle) */}
      {searchState === "idle" && (
        <section className="container-atelier mb-block-gap">
          <div className="max-w-4xl mx-auto">
            <span className="text-label-caps text-secondary tracking-widest block mb-6">
              Order Statuses
            </span>
            <details className="border border-outline-variant p-6 bg-surface">
              <summary className="cursor-pointer text-body-lg text-on-surface font-medium">
                View status reference
              </summary>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {statusList.map((status) => (
                  <div
                    key={status.title}
                    className="border border-outline-variant p-6 hover:border-secondary transition-colors"
                  >
                    <span className="material-symbols-outlined text-secondary text-[24px] mb-3 block">
                      {status.icon}
                    </span>
                    <h3 className="text-body-lg text-on-surface font-medium mb-1">
                      {status.title}
                    </h3>
                    <p className="text-body-md text-on-surface-variant">
                      {status.description}
                    </p>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </section>
      )}

      {/* Not Found State */}
      {searchState === "not-found" && (
        <section className="container-atelier mb-block-gap">
          <div className="max-w-2xl mx-auto text-center">
            <span className="material-symbols-outlined text-secondary text-[48px] mb-6 block">
              search_off
            </span>
            <h2 className="text-headline-md text-on-surface mb-4">
              {noOrderFound.headline}
            </h2>
            <p className="text-body-lg text-on-surface-variant mb-8">
              {noOrderFound.description}
            </p>
            <Link
              href={noOrderFound.cta.href}
              className="text-label-caps text-secondary hover:text-on-surface transition-colors duration-300 inline-flex items-center gap-2"
            >
              {noOrderFound.cta.text}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Need Help CTA */}
      <section className="border-y border-outline-variant py-16 mb-block-gap">
        <div className="container-atelier">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-8">
              <h2 className="text-headline-md text-on-surface mb-2">
                {needHelp.headline}
              </h2>
              <p className="text-body-lg text-on-surface-variant">
                {needHelp.description}
              </p>
              <p className="text-body-md text-secondary mt-2">
                {needHelp.email}
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Link
                href={needHelp.cta.href}
                className="bg-inverse-surface text-inverse-on-surface font-ui-button px-10 py-5 hover:bg-surface-tint hover:text-on-surface transition-colors duration-300 inline-flex items-center justify-center gap-3"
              >
                {needHelp.cta.text}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
