import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createServiceClient } from "@/lib/supabase/server";
import { PageHero } from "@/components/layout/PageHero";
import { shopContent } from "@/content/shop";
import type { Collection } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Shop the Collection | Weavers Atelier",
  description:
    "Premium menswear designed for the modern man. Shop shirts, trousers, and statement denim in standard sizes or customize for your perfect fit.",
  openGraph: {
    title: "Shop the Collection | Weavers Atelier",
    description:
      "Premium menswear designed for the modern man. Standard sizes XS–XL, or customize any piece.",
  },
};

async function getCollections(): Promise<Collection[]> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .not("published_at", "is", null)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching collections:", error);
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}

export default async function ShopPage() {
  const collections = await getCollections();

  const categories = [
    {
      slug: "shirts",
      category: "shirt" as const,
      ...shopContent.categories.shirt,
    },
    {
      slug: "trousers",
      category: "trouser" as const,
      ...shopContent.categories.trouser,
    },
    {
      slug: "denim",
      category: "denim" as const,
      ...shopContent.categories.denim,
    },
  ];

  return (
    <>
      <PageHero
        headline={shopContent.landing.headline}
        subheadline={shopContent.landing.subheadline}
        size="md"
        alignment="center"
      />

      {/* Categories Grid */}
      <section className="container-atelier py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => {
            const categoryCollections = collections.filter(
              (c) => c.category === category.category
            );
            const hasCollections = categoryCollections.length > 0;

            return (
              <Link
                key={category.slug}
                href={`/shop/${category.slug}`}
                className="group relative aspect-[3/4] overflow-hidden bg-surface-dim"
              >
                {/* Placeholder or Hero Image */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-inverse-surface/80" />
                {category.heroImage && (
                  <Image
                    src={category.heroImage}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-heading font-semibold text-surface mb-2">
                    {category.name}
                  </h2>
                  <p className="text-surface/80 text-sm md:text-base line-clamp-2 mb-4">
                    {category.description}
                  </p>
                  {hasCollections && (
                    <span className="text-xs uppercase tracking-wider text-surface/60">
                      {categoryCollections.length} collection
                      {categoryCollections.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-inverse-surface/0 group-hover:bg-inverse-surface/20 transition-colors duration-300" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Lead Time Info */}
      <section className="bg-surface-dim py-16 md:py-20">
        <div className="container-atelier">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-4">
              {shopContent.leadTime.title}
            </h2>
            <p className="text-on-surface-variant text-lg mb-12">
              {shopContent.leadTime.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-surface p-6 rounded-lg">
                <h3 className="font-medium text-lg mb-2">
                  {shopContent.leadTime.standard.label}
                </h3>
                <p className="text-2xl font-semibold text-secondary mb-2">
                  {shopContent.leadTime.standard.days}
                </p>
                <p className="text-sm text-on-surface-variant">
                  {shopContent.leadTime.standard.note}
                </p>
              </div>

              <div className="bg-surface p-6 rounded-lg">
                <h3 className="font-medium text-lg mb-2">
                  {shopContent.leadTime.custom.label}
                </h3>
                <p className="text-2xl font-semibold text-secondary mb-2">
                  {shopContent.leadTime.custom.days}
                </p>
                <p className="text-sm text-on-surface-variant">
                  {shopContent.leadTime.custom.note}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse By Occasion */}
      <section className="container-atelier py-16 md:py-24">
        <h2 className="text-2xl md:text-3xl font-heading font-semibold text-center mb-4">
          Custom & Consultation
        </h2>
        <p className="text-on-surface-variant text-center max-w-2xl mx-auto mb-12">
          Some occasions call for something truly bespoke. For weddingwear and
          statement pieces, our team works with you from concept to completion.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link
            href="/weddingwear"
            className="group relative aspect-video overflow-hidden bg-surface-dim rounded-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/70 to-transparent" />
            <div className="absolute inset-0 flex items-end p-6">
              <div>
                <h3 className="text-xl font-heading font-semibold text-surface mb-1">
                  Weddingwear
                </h3>
                <p className="text-surface/80 text-sm">
                  Book a consultation →
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/statement-pieces"
            className="group relative aspect-video overflow-hidden bg-surface-dim rounded-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/70 to-transparent" />
            <div className="absolute inset-0 flex items-end p-6">
              <div>
                <h3 className="text-xl font-heading font-semibold text-surface mb-1">
                  Statement Pieces
                </h3>
                <p className="text-surface/80 text-sm">
                  Book a consultation →
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
