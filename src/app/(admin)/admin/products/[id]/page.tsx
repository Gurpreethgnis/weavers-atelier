import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProductForm } from "./ProductForm";
import type { Json } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductEditPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === "new";

  const supabase = await createClient();

  // Get collections for dropdown
  const { data: collections } = await supabase
    .from("collections")
    .select("id, name, category")
    .order("name");

  let product = null;
  let productImages: Array<{
    id: string;
    created_at: string;
    product_id: string;
    url: string;
    alt: string | null;
    is_primary: boolean;
    sort_order: number;
  }> = [];
  let productOptions: Array<{
    id: string;
    created_at: string;
    updated_at: string;
    product_id: string;
    key: string;
    label: string;
    values: Json;
    shown_on: "rtw" | "custom" | "both";
    sort_order: number;
  }> = [];

  if (!isNew) {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        product_images (
          id,
          created_at,
          product_id,
          url,
          alt,
          is_primary,
          sort_order
        ),
        product_options (
          id,
          created_at,
          updated_at,
          product_id,
          key,
          label,
          values,
          shown_on,
          sort_order
        )
      `
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      notFound();
    }

    product = data;
    productImages = data.product_images || [];
    productOptions = data.product_options || [];
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isNew ? "New Product" : `Edit: ${product?.name}`}
      </h1>

      <ProductForm
        product={product}
        productImages={productImages}
        productOptions={productOptions}
        collections={collections || []}
        isNew={isNew}
      />
    </div>
  );
}
