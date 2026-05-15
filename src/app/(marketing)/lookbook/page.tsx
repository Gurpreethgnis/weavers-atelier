import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { PageHero } from "@/components/layout/PageHero";
import { lookbookContent } from "@/content/shop";

export const metadata: Metadata = {
  title: "Lookbook | Weaver's Atelier",
  description:
    "Inspiration from our latest work. Every piece can be recreated or customized to your preferences.",
  openGraph: {
    title: "Lookbook | Weaver's Atelier",
    description:
      "Inspiration from our latest work. Every piece can be recreated or customized to your preferences.",
  },
};

interface LookbookItem {
  id: string;
  title: string;
  category: string;
  image_url: string;
  product_id: string | null;
  tags: string[];
  starting_price: string;
}

async function getLookbookItems(): Promise<LookbookItem[]> {
  try {
    const supabase = await createServiceClient();

    const { data: items, error } = await supabase
      .from("lookbook_items")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !items) {
      return [];
    }

    return items;
  } catch {
    return [];
  }
}

export default async function LookbookPage() {
  const items = await getLookbookItems();

  return (
    <>
      <PageHero
        headline={lookbookContent.title}
        subheadline={lookbookContent.subtitle}
      />

      <section className="container-atelier py-block-gap">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {items.map((item) => (
              <LookbookCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <FallbackLookbook />
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-surface-container-high py-block-gap">
        <div className="container-atelier text-center max-w-2xl mx-auto">
          <span className="text-label-caps text-secondary tracking-widest block mb-6">
            Your Vision
          </span>
          <h2 className="text-headline-lg-mobile md:text-headline-lg text-on-surface mb-8">
            Don't See What You're Looking For?
          </h2>
          <p className="text-body-lg text-on-surface-variant mb-12">
            Send us any image — from any source. If we can make it, we will. And
            we can make almost anything.
          </p>
          <Link
            href="/customize/shirts"
            className="bg-inverse-surface text-inverse-on-surface font-ui-button px-10 py-5 hover:bg-surface-tint hover:text-on-surface transition-colors duration-300 inline-flex items-center justify-center gap-3"
          >
            Start Your Custom Order
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function LookbookCard({ item }: { item: LookbookItem }) {
  // Link to customize page for custom ordering (products are made-to-order)
  const href = `/customize/${getCategorySlug(item.category)}`;

  return (
    <Link href={href} className="group block">
      <article className="space-y-4">
        <div className="relative aspect-[3/4] overflow-hidden bg-surface-dim">
          <Image
            src={item.image_url}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="text-inverse-on-surface font-ui-button text-sm inline-flex items-center gap-2">
              {lookbookContent.cta}
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-body-lg font-medium text-on-surface group-hover:text-secondary transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-on-surface-variant">{item.starting_price}</p>
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs text-on-surface-variant border border-outline-variant px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}

function FallbackLookbook() {
  const { sampleLookbookItems } = require("@/content/instagram-looks");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
      {sampleLookbookItems.slice(0, 6).map((item: {
        id: string;
        title: string;
        category: string;
        imageUrl: string;
        startingPrice: string;
        tags?: string[];
      }) => (
        <Link
          key={item.id}
          href={`/customize/${getCategorySlug(item.category)}`}
          className="group block"
        >
          <article className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden bg-surface-dim">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-inverse-on-surface font-ui-button text-sm inline-flex items-center gap-2">
                  {lookbookContent.cta}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-body-lg font-medium text-on-surface group-hover:text-secondary transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-on-surface-variant">
                {item.startingPrice}
              </p>
            </div>

            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.slice(0, 3).map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs text-on-surface-variant border border-outline-variant px-2 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        </Link>
      ))}
    </div>
  );
}

function getCategorySlug(category: string): string {
  switch (category.toLowerCase()) {
    case "shirts":
      return "shirts";
    case "trousers":
      return "trousers";
    case "denim":
      return "denim";
    case "outerwear":
    case "sets":
    case "weddingwear":
      return "shirts"; // Default fallback to shirts for now
    default:
      return "shirts";
  }
}
