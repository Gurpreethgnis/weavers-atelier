import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import type { ProductCategory } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  const supabase = await createClient();

  const { data: collections } = await supabase
    .from("collections")
    .select(
      `
      id,
      name,
      slug,
      category,
      description,
      hero_image_url,
      published_at,
      created_at,
      products (count)
    `
    )
    .order("sort_order", { ascending: true });

  const getCategoryLabel = (cat: ProductCategory) => {
    const labels: Record<ProductCategory, string> = {
      shirt: "Shirts",
      trouser: "Trousers",
      denim: "Denim",
      weddingwear: "Weddingwear",
      statement: "Statement Pieces",
    };
    return labels[cat];
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
        <Link
          href="/admin/collections/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Collection
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Collection
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                Products
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {collections?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No collections found
                </td>
              </tr>
            )}
            {collections?.map((collection) => {
              const productCount =
                Array.isArray(collection.products) && collection.products[0]
                  ? (collection.products[0] as { count: number }).count
                  : 0;

              return (
                <tr key={collection.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {collection.hero_image_url ? (
                        <img
                          src={collection.hero_image_url}
                          alt={collection.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {collection.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {collection.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-gray-700">
                      {getCategoryLabel(collection.category as ProductCategory)}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-sm text-gray-700">{productCount}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                        collection.published_at
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {collection.published_at ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/collections/${collection.id}`}
                      className="p-2 text-gray-500 hover:text-gray-700 inline-block"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
