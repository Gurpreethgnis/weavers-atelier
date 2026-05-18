import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SizeSelector } from "@/components/shop/SizeSelector";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { SizeGuideDrawer } from "@/components/shop/SizeGuideDrawer";
import type { LookbookCategory, SizeOption } from "@/lib/supabase/types";

interface LookbookDetailPageProps {
  params: Promise<{ id: string }>;
}

interface LookbookItemDetail {
  id: string;
  title: string;
  category: LookbookCategory;
  tags: string[];
  image_url: string;
  video_url: string | null;
  instagram_url: string | null;
  description: string | null;
  cta_label: string | null;
  featured: boolean;
  product_id: string | null;
  price_cents: number | null;
  sizes: SizeOption[] | null;
  rtw_available: boolean;
}

async function getLookbookItem(id: string): Promise<LookbookItemDetail | null> {
  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("lookbook_items")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as LookbookItemDetail;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: LookbookDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getLookbookItem(id);

  if (!item) {
    return {
      title: "Look Not Found | Weaver's Atelier",
    };
  }

  return {
    title: `${item.title} | Lookbook | Weaver's Atelier`,
    description:
      item.description ||
      `Shop or customize this ${getCategoryDisplayName(item.category).toLowerCase()} from our lookbook.`,
    openGraph: {
      title: `${item.title} | Weaver's Atelier`,
      description:
        item.description ||
        `Shop or customize this ${getCategoryDisplayName(item.category).toLowerCase()} from our lookbook.`,
      images: [{ url: item.image_url }],
    },
  };
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function getCategorySlug(category: string): string {
  switch (category.toLowerCase()) {
    case "shirts":
    case "shirt":
      return "shirt";
    case "trousers":
    case "trouser":
      return "trouser";
    case "denim":
      return "denim";
    case "weddingwear":
      return "weddingwear";
    default:
      return "shirt";
  }
}

function getCategoryDisplayName(category: LookbookCategory): string {
  const names: Record<LookbookCategory, string> = {
    shirts: "Shirts",
    trousers: "Trousers",
    denim: "Denim",
    weddingwear: "Weddingwear",
    kurtas: "Kurtas",
    blazers: "Blazers",
    waistcoats: "Waistcoats",
    embroidery: "Embroidery",
    statement_pieces: "Statement Pieces",
  };
  return names[category] || category;
}

export default async function LookbookDetailPage({
  params,
}: LookbookDetailPageProps) {
  const { id } = await params;
  const item = await getLookbookItem(id);

  if (!item) {
    notFound();
  }

  const hasStandardPurchase =
    item.rtw_available && (item.price_cents || item.product_id);
  const availableSizes =
    (item.sizes?.filter((s) => s !== "custom") as SizeOption[]) ||
    (["S", "M", "L", "XL"] as SizeOption[]);
  const effectivePrice = item.price_cents || 0;

  const breadcrumbs = [
    { label: "Lookbook", href: "/lookbook" },
    { label: item.title },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} className="container-atelier pt-4" />

      <article className="container-atelier py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative aspect-[3/4] bg-surface-dim overflow-hidden">
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            {item.featured && (
              <span className="absolute top-4 left-4 bg-secondary text-on-secondary text-xs font-medium px-3 py-1">
                Featured
              </span>
            )}
          </div>

          {/* Details */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            {/* Category Badge */}
            <span className="text-label-caps text-secondary tracking-widest">
              {getCategoryDisplayName(item.category)}
            </span>

            <h1 className="text-3xl md:text-4xl font-heading font-semibold">
              {item.title}
            </h1>

            {hasStandardPurchase && effectivePrice > 0 && (
              <p className="text-2xl font-medium">
                {formatPrice(effectivePrice)}
              </p>
            )}

            {item.description && (
              <p className="text-on-surface-variant leading-relaxed">
                {item.description}
              </p>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-on-surface-variant border border-outline-variant px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="pt-6 border-t border-outline-variant space-y-4">
              {hasStandardPurchase && effectivePrice > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium uppercase tracking-wider">
                      Select Size
                    </h2>
                    <SizeGuideDrawer />
                  </div>
                  <SizeSelector sizes={availableSizes} productId={item.id} />
                  <AddToCartButton
                    product={{
                      id: item.id,
                      name: item.title,
                      price_cents: effectivePrice,
                      image: item.image_url,
                    }}
                  />
                </>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hasStandardPurchase && (
                  <Link
                    href="/shop"
                    className="w-full py-4 text-base inline-flex items-center justify-center gap-2 border border-outline hover:bg-surface-container transition-colors"
                  >
                    Shop This Look
                  </Link>
                )}
                <Link
                  href={`/customize/${getCategorySlug(item.category)}?ref=${item.id}&look=${encodeURIComponent(item.title)}`}
                  className="w-full py-4 text-base inline-flex items-center justify-center gap-2 border border-outline hover:bg-surface-container transition-colors"
                >
                  Recreate This Look
                </Link>
              </div>
              <Link
                href="/contact?subject=custom"
                className="w-full py-4 text-base inline-flex items-center justify-center gap-2 bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint hover:text-on-surface transition-colors"
              >
                Send Inspiration
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Instagram Link */}
            {item.instagram_url && (
              <div className="pt-6">
                <a
                  href={item.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-secondary hover:underline inline-flex items-center gap-2"
                >
                  View on Instagram
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            )}

            {/* Back Link */}
            <div className="pt-8">
              <Link
                href="/lookbook"
                className="text-sm text-on-surface-variant hover:text-on-surface inline-flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Lookbook
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
