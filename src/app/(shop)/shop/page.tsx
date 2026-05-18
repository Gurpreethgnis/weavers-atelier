import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createServiceClient } from "@/lib/supabase/server";
import { PageHero } from "@/components/layout/PageHero";
import { shopContent } from "@/content/shop";
import type { Collection } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Shop the Collection | Weaver's Atelier",
  description:
    "Premium menswear designed for the modern man. Shop shirts, trousers, and statement denim in standard sizes or customize for your perfect fit.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    title: "Shop the Collection | Weaver's Atelier",
    description:
      "Premium menswear designed for the modern man. Standard sizes XS–XL, or customize any piece.",
    images: [{ url: "/images/hero/home-hero-landscape.jpg" }],
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

      <section className="bg-surface-dim py-14 md:py-16">
        <div className="container-atelier text-center max-w-3xl">
          <p className="text-on-surface-variant mb-6">
            Made-to-order timelines vary by piece and level of customization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/weddingwear"
              className="inline-flex items-center justify-center px-8 py-4 border border-outline text-on-surface hover:border-secondary transition-colors"
            >
              Start a Wedding Consultation
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint hover:text-on-surface transition-colors"
            >
              Speak With the Atelier
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
