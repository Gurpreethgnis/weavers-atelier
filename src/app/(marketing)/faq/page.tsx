"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { faqContent } from "@/content/faq";

export default function FAQPage() {
  const { hero, categories, contact } = faqContent;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categories[0]?.id ?? null
  );
  const [openId, setOpenId] = useState<string | null>(null);

  const allQuestions = useMemo(() => {
    return categories.flatMap((cat) =>
      cat.questions.map((q, idx) => ({
        id: `${cat.id}-${idx}`,
        categoryId: cat.id,
        categoryName: cat.name,
        question: q.question,
        answer: q.answer,
      }))
    );
  }, [categories]);

  const filteredItems = selectedCategory
    ? allQuestions.filter((item) => item.categoryId === selectedCategory)
    : allQuestions;

  const toggleItem = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: string) => {
      const itemButtons = document.querySelectorAll<HTMLButtonElement>(
        "[data-accordion-trigger]"
      );
      const currentIndex = Array.from(itemButtons).findIndex(
        (btn) => btn.dataset.id === id
      );

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (currentIndex < itemButtons.length - 1) {
            itemButtons[currentIndex + 1].focus();
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (currentIndex > 0) {
            itemButtons[currentIndex - 1].focus();
          }
          break;
        case "Home":
          e.preventDefault();
          itemButtons[0]?.focus();
          break;
        case "End":
          e.preventDefault();
          itemButtons[itemButtons.length - 1]?.focus();
          break;
      }
    },
    []
  );

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

      {/* Topic Filter Row */}
      <section className="border-y border-outline-variant mb-block-gap">
        <div className="container-atelier py-6 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`font-ui-button px-6 py-3 transition-colors duration-300 ${
                selectedCategory === null
                  ? "bg-inverse-surface text-inverse-on-surface"
                  : "border border-outline-variant text-on-surface hover:border-secondary"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`font-ui-button px-6 py-3 transition-colors duration-300 ${
                  selectedCategory === cat.id
                    ? "bg-inverse-surface text-inverse-on-surface"
                    : "border border-outline-variant text-on-surface hover:border-secondary"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion */}
      <section className="container-atelier mb-block-gap">
        <div className="max-w-4xl mx-auto" role="region" aria-label="FAQ accordion">
          <div className="space-y-px">
            {filteredItems.map((item, index) => {
              const isOpen = openId === item.id;

              return (
                <div
                  key={item.id}
                  className="border border-outline-variant bg-surface"
                >
                  <h3>
                    <button
                      id={`faq-trigger-${item.id}`}
                      data-accordion-trigger
                      data-id={item.id}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${item.id}`}
                      onClick={() => toggleItem(item.id)}
                      onKeyDown={(e) => handleKeyDown(e, item.id)}
                      className="w-full flex justify-between items-start gap-4 p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-inset"
                    >
                      <div className="flex-1">
                        <span className="text-label-caps text-secondary block mb-1">
                          {item.categoryName}
                        </span>
                        <span className="text-body-lg text-on-surface font-medium">
                          {item.question}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-secondary flex-shrink-0 mt-1 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${item.id}`}
                    hidden={!isOpen}
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="px-6 pb-6">
                      <p className="text-body-md text-on-surface-variant">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-secondary text-[48px] mb-4 block">
                search_off
              </span>
              <p className="text-body-lg text-on-surface-variant">
                No questions found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA Strip */}
      <section className="border-y border-outline-variant py-16 mb-block-gap">
        <div className="container-atelier">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-8">
              <h2 className="text-headline-md text-on-surface mb-2">
                {contact.headline}
              </h2>
              <p className="text-body-lg text-on-surface-variant">
                {contact.description}
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Link
                href={contact.cta.href}
                className="bg-inverse-surface text-inverse-on-surface font-ui-button px-10 py-5 hover:bg-surface-tint hover:text-on-surface transition-colors duration-300 inline-flex items-center justify-center gap-3"
              >
                {contact.cta.text}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
