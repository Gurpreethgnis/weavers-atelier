"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { bookConsultationContent } from "@/content/book-consultation";

/**
 * This page is deprecated and redirected via next.config.ts.
 * This component shows a fallback for users who might see it briefly
 * before the redirect kicks in, or if redirects fail for any reason.
 */
export default function BookConsultationPage() {
  const { redirect } = bookConsultationContent;

  return (
    <section className="container-atelier pt-24 md:pt-40 mb-block-gap">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-display-lg text-on-surface leading-tight mb-6">
          {redirect.headline}
        </h1>
        <p className="text-body-lg text-on-surface-variant mb-12 max-w-xl mx-auto">
          {redirect.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {redirect.options.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              className={`border p-6 text-left transition-colors duration-300 ${
                option.primary
                  ? "bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint hover:text-on-surface"
                  : "border-outline-variant hover:border-secondary"
              }`}
            >
              <h3 className="text-body-lg font-medium mb-2">{option.label}</h3>
              <p
                className={`text-body-md ${
                  option.primary ? "opacity-80" : "text-on-surface-variant"
                }`}
              >
                {option.description}
              </p>
              <ArrowRight className="h-4 w-4 mt-4" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
