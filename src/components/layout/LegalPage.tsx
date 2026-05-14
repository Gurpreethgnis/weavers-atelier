"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { legalContent } from "@/content/legal";

interface LegalPageProps {
  initialAnchor?: string;
}

export function LegalPage({ initialAnchor }: LegalPageProps) {
  const { header, sidebar, privacy, terms, shipping, contact } = legalContent;
  const hasScrolled = useRef(false);

  useEffect(() => {
    if (initialAnchor && !hasScrolled.current) {
      hasScrolled.current = true;
      const element = document.getElementById(initialAnchor);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [initialAnchor]);

  return (
    <>
      {/* Hero */}
      <section className="container-atelier pt-24 md:pt-40 mb-16">
        <div className="max-w-3xl">
          <span className="text-label-caps text-secondary tracking-widest block mb-4">
            {header.kicker}
          </span>
          <h1 className="text-display-lg text-on-surface leading-tight whitespace-pre-line mb-8">
            {header.headline}
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Effective: {header.effectiveDate}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-atelier mb-block-gap">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Sticky Sidebar */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-32 space-y-8">
              <nav className="space-y-2">
                {sidebar.anchors.map((anchor) => (
                  <a
                    key={anchor.id}
                    href={`#${anchor.id}`}
                    className="block py-2 px-4 text-body-md text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-colors duration-300"
                  >
                    {anchor.label}
                  </a>
                ))}
              </nav>

              <div className="bronze-border p-6">
                <span className="text-label-caps text-secondary block mb-2">
                  {sidebar.callout.title}
                </span>
                <p className="text-body-md text-on-surface-variant">
                  {sidebar.callout.description}
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 lg:col-start-5 space-y-24">
            {/* Privacy Policy */}
            <article id="privacy">
              <h2 className="text-headline-lg text-on-surface mb-6 pb-6 border-b border-outline-variant">
                {privacy.title}
              </h2>
              <p className="text-body-lg text-on-surface-variant mb-12">
                {privacy.intro}
              </p>

              {privacy.sections.map((section) => (
                <div key={section.id} id={section.id} className="mb-16">
                  <h3 className="text-headline-md text-on-surface mb-6">
                    {section.title}
                  </h3>

                  {"content" in section && section.content && (
                    <p className="text-body-lg text-on-surface-variant mb-6">
                      {section.content}
                    </p>
                  )}

                  {"subsections" in section && section.subsections && (
                    <div className="space-y-6 mb-6">
                      {section.subsections.map((sub) => (
                        <div
                          key={sub.title}
                          className="border-l-2 border-secondary pl-6 py-2"
                        >
                          <h4 className="text-body-lg text-on-surface font-medium mb-2">
                            {sub.title}
                          </h4>
                          {"description" in sub && sub.description && (
                            <p className="text-body-md text-on-surface-variant">
                              {sub.description}
                            </p>
                          )}
                          {"items" in sub && sub.items && (
                            <ul className="space-y-2">
                              {sub.items.map((item, idx) => (
                                <li
                                  key={idx}
                                  className="text-body-md text-on-surface-variant flex items-start gap-2"
                                >
                                  <span className="text-secondary">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {"items" in section && section.items && (
                    <ul className="space-y-3 mb-6">
                      {section.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-body-md text-on-surface-variant flex items-start gap-2"
                        >
                          <span className="text-secondary">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {"note" in section && section.note && (
                    <p className="text-body-sm text-on-surface-variant italic border-l-2 border-outline-variant pl-4 mt-6">
                      {section.note}
                    </p>
                  )}

                  {"cta" in section && section.cta && (
                    <p className="text-body-md text-secondary mt-6">
                      {section.cta.text}
                    </p>
                  )}
                </div>
              ))}
            </article>

            {/* Terms of Service */}
            <article id="terms">
              <h2 className="text-headline-lg text-on-surface mb-6 pb-6 border-b border-outline-variant">
                {terms.title}
              </h2>
              <p className="text-body-lg text-on-surface-variant mb-12">
                {terms.intro}
              </p>

              {terms.sections.map((section) => (
                <div key={section.id} id={section.id} className="mb-16">
                  <h3 className="text-headline-md text-on-surface mb-6">
                    {section.title}
                  </h3>

                  {"content" in section && section.content && (
                    <p className="text-body-lg text-on-surface-variant mb-6">
                      {section.content}
                    </p>
                  )}

                  {"items" in section && section.items && (
                    <ul className="space-y-3 mb-6">
                      {section.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-body-md text-on-surface-variant flex items-start gap-2"
                        >
                          <span className="text-secondary">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
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
            </article>

            {/* Shipping Policy */}
            <article id="shipping">
              <h2 className="text-headline-lg text-on-surface mb-6 pb-6 border-b border-outline-variant">
                {shipping.title}
              </h2>
              <p className="text-body-lg text-on-surface-variant mb-6">
                {shipping.content}
              </p>
              <Link
                href={shipping.cta.href}
                className="text-label-caps text-secondary hover:text-on-surface transition-colors inline-flex items-center gap-2"
              >
                {shipping.cta.text}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </article>

            {/* Contact */}
            <div className="bronze-border p-8 md:p-12">
              <h3 className="text-headline-md text-on-surface mb-4">
                {contact.title}
              </h3>
              <p className="text-body-lg text-on-surface-variant mb-6">
                {contact.description}
              </p>
              <div className="space-y-2 mb-6">
                <p className="text-body-md text-on-surface">
                  {contact.address.company}
                </p>
                <p className="text-body-md text-on-surface-variant">
                  {contact.address.line1}
                </p>
                <p className="text-body-md text-on-surface-variant">
                  {contact.address.line2}
                </p>
                <p className="text-body-md text-on-surface-variant">
                  {contact.address.country}
                </p>
              </div>
              <a
                href={`mailto:${contact.email}`}
                className="text-label-caps text-secondary hover:text-on-surface transition-colors duration-300"
              >
                {contact.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
