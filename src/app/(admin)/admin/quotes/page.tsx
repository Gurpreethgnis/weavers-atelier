import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Search, Filter, Eye } from "lucide-react";
import type { QuoteStatus } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function AdminQuotesPage({ searchParams }: PageProps) {
  const { status, search, page = "1" } = await searchParams;
  const supabase = await createClient();

  const pageSize = 20;
  const currentPage = parseInt(page) || 1;
  const offset = (currentPage - 1) * pageSize;

  let query = supabase
    .from("custom_quotes")
    .select(
      `
      id,
      customer_name,
      customer_email,
      status,
      quoted_price_cents,
      created_at,
      products (
        name
      )
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (status) {
    query = query.eq("status", status);
  }
  if (search) {
    query = query.or(
      `customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`
    );
  }

  const { data: quotes, count } = await query;

  const totalPages = count ? Math.ceil(count / pageSize) : 1;

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusColor = (s: QuoteStatus) => {
    const colors: Record<QuoteStatus, string> = {
      received: "bg-gray-100 text-gray-700",
      reviewing: "bg-yellow-100 text-yellow-700",
      quoted: "bg-blue-100 text-blue-700",
      accepted: "bg-cyan-100 text-cyan-700",
      invoiced: "bg-purple-100 text-purple-700",
      paid: "bg-green-100 text-green-700",
      declined: "bg-red-100 text-red-700",
      expired: "bg-gray-100 text-gray-500",
    };
    return colors[s];
  };

  const statuses: QuoteStatus[] = [
    "received",
    "reviewing",
    "quoted",
    "accepted",
    "invoiced",
    "paid",
    "declined",
    "expired",
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Custom Quotes</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <form className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            name="status"
            defaultValue={status}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </form>
      </div>

      {/* Quotes Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                Quoted Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {quotes?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No quotes found
                </td>
              </tr>
            )}
            {quotes?.map((quote) => {
              const product = Array.isArray(quote.products)
                ? (quote.products as Array<{ name: string }>)[0]
                : (quote.products as { name: string } | null);
              return (
              <tr key={quote.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {quote.customer_name}
                    </p>
                    <p className="text-sm text-gray-500">{quote.customer_email}</p>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-sm text-gray-700">
                    {product?.name || "—"}
                  </span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="font-medium text-gray-900">
                    {quote.quoted_price_cents
                      ? formatCurrency(quote.quoted_price_cents)
                      : "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                      quote.status as QuoteStatus
                    )}`}
                  >
                    {quote.status}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-sm text-gray-500">
                    {formatDate(quote.created_at)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/quotes/${quote.id}`}
                    className="p-2 text-gray-500 hover:text-gray-700 inline-block"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {offset + 1} to {Math.min(offset + pageSize, count || 0)}{" "}
              of {count} quotes
            </p>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <Link
                  href={`/admin/quotes?page=${currentPage - 1}${
                    status ? `&status=${status}` : ""
                  }${search ? `&search=${search}` : ""}`}
                  className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50"
                >
                  Previous
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={`/admin/quotes?page=${currentPage + 1}${
                    status ? `&status=${status}` : ""
                  }${search ? `&search=${search}` : ""}`}
                  className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
