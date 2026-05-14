import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { SizeSelector } from "@/components/shop/SizeSelector";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { CustomizeButton } from "@/components/shop/CustomizeButton";
import { SizeGuideDrawer } from "@/components/shop/SizeGuideDrawer";
import { shopContent } from "@/content/shop";
import type {
  Product,
  ProductImage,
  ProductOption,
  Collection,
  ProductWithDetails,
} from "@/lib/supabase/types";

interface ProductPageProps {
  params: Promise<{ collection: string; product: string }>;
}

const CATEGORY_MAP: Record<string, "shirt" | "trouser" | "denim"> = {
  shirts: "shirt",
  trousers: "trouser",
  denim: "denim",
};

async function getProduct(
  collectionSlug: string,
  productSlug: string
): Promise<ProductWithDetails | null> {
  const category = CATEGORY_MAP[collectionSlug];
  if (!category) return null;

  try {
    const supabase = await createServiceClient();

    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        product_images(*),
        product_options(*),
        collections(*)
      `
      )
      .eq("slug", productSlug)
      .eq("category", category)
      .eq("status", "published")
      .single();

    if (error || !data) {
      return null;
    }

    return data as ProductWithDetails;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { collection, product: productSlug } = await params;
  const product = await getProduct(collection, productSlug);

  if (!product) {
    return {
      title: "Product Not Found | Weavers Atelier",
    };
  }

  const primaryImage = product.product_images?.find((img) => img.is_primary);

  return {
    title: product.seo_title || `${product.name} | Weavers Atelier`,
    description:
      product.seo_description ||
      product.description?.slice(0, 160) ||
      `Shop ${product.name} from Weavers Atelier`,
    openGraph: {
      title: product.seo_title || product.name,
      description: product.seo_description || product.description || "",
      images: primaryImage ? [{ url: primaryImage.url }] : [],
    },
  };
}

export async function generateStaticParams() {
  try {
    const supabase = await createServiceClient();

    const { data: products } = await supabase
      .from("products")
      .select("slug, category")
      .eq("status", "published")
      .in("category", ["shirt", "trouser", "denim"]);

    if (!products) return [];

    const categoryToSlug: Record<string, string> = {
      shirt: "shirts",
      trouser: "trousers",
      denim: "denim",
    };

    return products.map((p) => ({
      collection: categoryToSlug[p.category] || p.category,
      product: p.slug,
    }));
  } catch {
    return [];
  }
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { collection, product: productSlug } = await params;
  const product = await getProduct(collection, productSlug);

  if (!product) {
    notFound();
  }

  const categoryInfo =
    shopContent.categories[product.category as keyof typeof shopContent.categories];
  const sortedImages = [...(product.product_images || [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  const breadcrumbs = [
    { label: "Shop", href: "/shop" },
    { label: categoryInfo?.name || product.category, href: `/shop/${collection}` },
    { label: product.name },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} className="container-atelier pt-4" />

      <article className="container-atelier py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <ProductGallery images={sortedImages} productName={product.name} />

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-2">
              {product.name}
            </h1>

            <p className="text-2xl font-medium mb-6">
              {formatPrice(product.base_price_cents)}
            </p>

            {product.description && (
              <div
                className="prose prose-sm mb-8 text-on-surface-variant"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {/* RTW Options */}
            {product.rtw_available && product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-medium uppercase tracking-wider">
                    Select Size
                  </h2>
                  <SizeGuideDrawer />
                </div>
                <SizeSelector
                  sizes={product.sizes.filter((s) => s !== "custom")}
                  productId={product.id}
                />
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {product.rtw_available && (
                <AddToCartButton
                  product={{
                    id: product.id,
                    name: product.name,
                    price_cents: product.base_price_cents,
                    image:
                      sortedImages.find((i) => i.is_primary)?.url ||
                      sortedImages[0]?.url,
                  }}
                />
              )}

              {product.custom_available && (
                <CustomizeButton
                  product={{
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    base_price_cents: product.base_price_cents,
                  }}
                  isPrimary={!product.rtw_available}
                />
              )}
            </div>

            {/* Lead Time */}
            <div className="mt-8 pt-8 border-t border-outline-variant">
              <h3 className="text-sm font-medium uppercase tracking-wider mb-3">
                {shopContent.leadTime.title}
              </h3>
              <div className="space-y-2 text-sm text-on-surface-variant">
                <p>
                  <strong>Production:</strong> {product.lead_time_days} business
                  days
                </p>
                <p>
                  <strong>US Shipping:</strong>{" "}
                  {shopContent.leadTime.shipping.domestic.days} —{" "}
                  {shopContent.leadTime.shipping.domestic.price}
                </p>
                <p>
                  <strong>International:</strong>{" "}
                  {shopContent.leadTime.shipping.international.days} —{" "}
                  {shopContent.leadTime.shipping.international.price}
                </p>
              </div>
            </div>

            {/* Product Options (for display) */}
            {product.product_options && product.product_options.length > 0 && (
              <div className="mt-8 pt-8 border-t border-outline-variant">
                <h3 className="text-sm font-medium uppercase tracking-wider mb-3">
                  Details
                </h3>
                <dl className="space-y-2 text-sm">
                  {product.product_options
                    .filter((opt) => opt.shown_on !== "custom")
                    .map((option) => (
                      <div key={option.id} className="flex">
                        <dt className="text-on-surface-variant w-32">
                          {option.label}:
                        </dt>
                        <dd className="text-on-surface">
                          {Array.isArray(option.values)
                            ? option.values.join(", ")
                            : String(option.values)}
                        </dd>
                      </div>
                    ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
