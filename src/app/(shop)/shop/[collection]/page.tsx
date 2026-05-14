import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { PageHero } from "@/components/layout/PageHero";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { shopContent } from "@/content/shop";
import type { Collection, Product, ProductImage } from "@/lib/supabase/types";

interface CollectionPageProps {
  params: Promise<{ collection: string }>;
}

const CATEGORY_MAP: Record<string, "shirt" | "trouser" | "denim"> = {
  shirts: "shirt",
  trousers: "trouser",
  denim: "denim",
};

async function getCollectionData(slug: string): Promise<{
  collections: Collection[];
  products: (Product & { product_images: ProductImage[] })[];
  categoryInfo: (typeof shopContent.categories)[keyof typeof shopContent.categories];
  categoryKey: string;
} | null> {
  const category = CATEGORY_MAP[slug];
  if (!category) return null;

  const categoryInfo = shopContent.categories[category];
  if (!categoryInfo) return null;

  try {
    const supabase = await createServiceClient();

    // Get collections for this category
    const { data: collections } = await supabase
      .from("collections")
      .select("*")
      .eq("category", category)
      .not("published_at", "is", null)
      .order("sort_order", { ascending: true });

    // Get products for this category
    const { data: products } = await supabase
      .from("products")
      .select("*, product_images(*)")
      .eq("category", category)
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    return {
      collections: collections || [],
      products: products || [],
      categoryInfo,
      categoryKey: slug,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { collection } = await params;
  const data = await getCollectionData(collection);

  if (!data) {
    return {
      title: "Collection Not Found | Weavers Atelier",
    };
  }

  return {
    title: `${data.categoryInfo.name} | Weavers Atelier`,
    description: data.categoryInfo.description,
    openGraph: {
      title: `Shop ${data.categoryInfo.name} | Weavers Atelier`,
      description: data.categoryInfo.description,
    },
  };
}

export function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((collection) => ({
    collection,
  }));
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collection } = await params;
  const data = await getCollectionData(collection);

  if (!data) {
    notFound();
  }

  const { products, categoryInfo, categoryKey } = data;

  const breadcrumbs = [
    { label: "Shop", href: "/shop" },
    { label: categoryInfo.name },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} className="container-atelier pt-4" />

      <PageHero
        headline={categoryInfo.name}
        subheadline={categoryInfo.description}
        backgroundImage={categoryInfo.heroImage}
        size="md"
        alignment="center"
      />

      {/* Products Grid */}
      <section className="container-atelier py-12 md:py-16">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-4">
              {shopContent.emptyState.title}
            </h2>
            <p className="text-on-surface-variant mb-6">
              {shopContent.emptyState.description}
            </p>
            <Link
              href={shopContent.emptyState.cta.href}
              className="inline-flex items-center px-6 py-3 bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint transition-colors"
            >
              {shopContent.emptyState.cta.label}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <p className="text-on-surface-variant">
                {products.length} product{products.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => {
                const primaryImage = product.product_images?.find(
                  (img) => img.is_primary
                ) || product.product_images?.[0];

                return (
                  <Link
                    key={product.id}
                    href={`/shop/${categoryKey}/${product.slug}`}
                    className="group"
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] bg-surface-dim overflow-hidden mb-3">
                      {primaryImage ? (
                        <Image
                          src={primaryImage.url}
                          alt={primaryImage.alt || product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant">
                          <span className="text-sm">No image</span>
                        </div>
                      )}

                      {/* Quick Actions Overlay */}
                      <div className="absolute inset-0 bg-inverse-surface/0 group-hover:bg-inverse-surface/10 transition-colors duration-300" />

                      {/* Custom Badge */}
                      {product.custom_available && !product.rtw_available && (
                        <span className="absolute top-2 left-2 px-2 py-1 bg-secondary text-surface text-xs font-medium">
                          Custom Only
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <h3 className="font-medium text-sm md:text-base mb-1 group-hover:text-secondary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-on-surface-variant text-sm">
                      {formatPrice(product.base_price_cents)}
                      {product.custom_available && product.rtw_available && (
                        <span className="text-xs ml-2">• Custom available</span>
                      )}
                    </p>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* Size Guide CTA */}
      <section className="bg-surface-dim py-12 md:py-16">
        <div className="container-atelier text-center">
          <h2 className="text-xl md:text-2xl font-heading font-semibold mb-3">
            {shopContent.sizeGuide.title}
          </h2>
          <p className="text-on-surface-variant mb-6 max-w-xl mx-auto">
            {shopContent.sizeGuide.intro}
          </p>
          <Link
            href="/fit-guide"
            className="inline-flex items-center px-6 py-3 border border-outline hover:bg-surface transition-colors"
          >
            View Size Guide
          </Link>
        </div>
      </section>
    </>
  );
}
