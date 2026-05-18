import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CustomQuoteForm } from "@/components/shop/CustomQuoteForm";
import type { ProductCategory } from "@/lib/supabase/types";

const VALID_CATEGORIES: ProductCategory[] = ["shirt", "trouser", "denim"];

const CATEGORY_INFO: Record<
  string,
  { title: string; description: string; pluralSlug: string }
> = {
  shirt: {
    title: "Custom Shirt",
    description:
      "Share the fit, fabric direction, and details you want us to review.",
    pluralSlug: "shirts",
  },
  trouser: {
    title: "Custom Trousers",
    description:
      "Tell us the structure, fit, and finish you want us to shape.",
    pluralSlug: "trousers",
  },
  denim: {
    title: "Custom Denim",
    description:
      "Send your denim direction, references, and finishing preferences.",
    pluralSlug: "denim",
  },
};

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ product?: string }>;
}

async function getProduct(productId: string) {
  try {
    const supabase = await createServiceClient();
    const { data: product } = await supabase
      .from("products")
      .select("id, name, category, base_price_cents, slug")
      .eq("id", productId)
      .single();

    return product;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const info = CATEGORY_INFO[category];

  if (!info) {
    return { title: "Customize | Weaver's Atelier" };
  }

  return {
    title: `${info.title} | Weaver's Atelier`,
    description: info.description,
    openGraph: {
      title: `${info.title} | Weaver's Atelier`,
      description: info.description,
    },
  };
}

export function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

export default async function CustomizePage({ params, searchParams }: PageProps) {
  const { category } = await params;
  const { product: productId } = await searchParams;

  if (!VALID_CATEGORIES.includes(category as ProductCategory)) {
    notFound();
  }

  const info = CATEGORY_INFO[category];
  const product = productId ? await getProduct(productId) : null;

  const breadcrumbs = [
    { label: "Shop", href: "/shop" },
    { label: info.title.replace("Custom ", "") + "s", href: `/shop/${info.pluralSlug}` },
    { label: product?.name || "Customize" },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} className="container-atelier pt-4" />

      <div className="container-atelier py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href={product ? `/shop/${info.pluralSlug}/${product.slug}` : `/shop/${info.pluralSlug}`}
              className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-secondary transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {product?.name || info.pluralSlug}
            </Link>

            <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-3">
              {product ? `Customize: ${product.name}` : info.title}
            </h1>

            <p className="text-on-surface-variant">{info.description}</p>
          </div>

          {/* Request Info Card */}
          <div className="bg-surface-container p-6 mb-8">
            <h2 className="font-medium mb-3">How Custom Review Works</h2>
            <ol className="text-sm text-on-surface-variant space-y-2 list-decimal list-inside">
              <li>Send your request with size direction and references</li>
              <li>We review and respond with clear next steps</li>
              <li>If approved, we issue your invoice and begin production</li>
            </ol>
            <p className="text-sm text-on-surface-variant mt-4">
              No commitment required to submit a custom request.
            </p>
          </div>

          {/* Form */}
          <CustomQuoteForm
            product={
              product
                ? {
                    id: product.id,
                    name: product.name,
                    category: product.category as ProductCategory,
                    base_price_cents: product.base_price_cents,
                  }
                : undefined
            }
            category={category as ProductCategory}
          />
        </div>
      </div>
    </>
  );
}
