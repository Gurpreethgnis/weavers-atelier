import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  ShoppingCart,
  FileText,
  DollarSign,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Get order statistics
  const { data: ordersToday } = await supabase
    .from("orders")
    .select("id, total_cents", { count: "exact" })
    .gte("created_at", new Date().toISOString().split("T")[0]);

  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .in("status", ["confirmed", "in_production"]);

  const { count: pendingQuotes } = await supabase
    .from("custom_quotes")
    .select("id", { count: "exact", head: true })
    .in("status", ["received", "reviewing"]);

  const { data: recentOrders } = await supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      customer_email,
      total_cents,
      currency,
      status,
      created_at,
      order_type
    `
    )
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentQuotes } = await supabase
    .from("custom_quotes")
    .select(
      `
      id,
      customer_name,
      customer_email,
      status,
      created_at,
      quoted_price_cents
    `
    )
    .order("created_at", { ascending: false })
    .limit(5);

  // Calculate today's revenue
  const todayRevenue =
    ordersToday?.reduce((sum, o) => sum + (o.total_cents || 0), 0) || 0;

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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: "bg-blue-100 text-blue-700",
      in_production: "bg-yellow-100 text-yellow-700",
      ready_to_ship: "bg-green-100 text-green-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      received: "bg-gray-100 text-gray-700",
      reviewing: "bg-yellow-100 text-yellow-700",
      quoted: "bg-blue-100 text-blue-700",
      invoiced: "bg-purple-100 text-purple-700",
      paid: "bg-green-100 text-green-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today&apos;s Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(todayRevenue)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Orders Today</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {ordersToday?.length || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {pendingOrders || 0}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Quotes</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {pendingQuotes || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders?.length === 0 && (
              <p className="p-4 text-gray-500 text-sm">No orders yet</p>
            )}
            {recentOrders?.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="p-4 hover:bg-gray-50 block"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      #{order.order_number}
                    </p>
                    <p className="text-sm text-gray-500">{order.customer_email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(order.total_cents)}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {formatDate(order.created_at)}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Quotes */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Custom Quotes</h2>
            <Link
              href="/admin/quotes"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentQuotes?.length === 0 && (
              <p className="p-4 text-gray-500 text-sm">No quotes yet</p>
            )}
            {recentQuotes?.map((quote) => (
              <Link
                key={quote.id}
                href={`/admin/quotes/${quote.id}`}
                className="p-4 hover:bg-gray-50 block"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {quote.customer_name}
                    </p>
                    <p className="text-sm text-gray-500">{quote.customer_email}</p>
                  </div>
                  <div className="text-right">
                    {quote.quoted_price_cents && (
                      <p className="font-medium text-gray-900">
                        {formatCurrency(quote.quoted_price_cents)}
                      </p>
                    )}
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                        quote.status
                      )}`}
                    >
                      {quote.status}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {formatDate(quote.created_at)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/products/new"
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all text-center"
          >
            <p className="font-medium text-gray-900">Add Product</p>
            <p className="text-sm text-gray-500">Create new product</p>
          </Link>
          <Link
            href="/admin/orders?status=confirmed"
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all text-center"
          >
            <p className="font-medium text-gray-900">Process Orders</p>
            <p className="text-sm text-gray-500">View confirmed orders</p>
          </Link>
          <Link
            href="/admin/quotes?status=received"
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all text-center"
          >
            <p className="font-medium text-gray-900">Review Quotes</p>
            <p className="text-sm text-gray-500">New quote requests</p>
          </Link>
          <Link
            href="/admin/settings"
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all text-center"
          >
            <p className="font-medium text-gray-900">Settings</p>
            <p className="text-sm text-gray-500">Configure store</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
