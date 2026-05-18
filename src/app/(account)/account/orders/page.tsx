import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/supabase/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  measurement_review: "Measurement Review",
  quote_needed: "Quote Needed",
  quote_sent: "Quote Sent",
  payment_pending: "Payment Pending",
  confirmed: "Confirmed",
  in_production: "In Production",
  ready_to_dispatch: "Ready to Ship",
  dispatched: "Shipped",
  delivered: "Delivered",
  alteration_support: "Alteration Support",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  in_production: "bg-blue-100 text-blue-800",
  dispatched: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  default: "bg-gray-100 text-gray-800",
};

export default async function OrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login?redirect=/account/orders");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      id,
      order_number,
      order_type,
      status,
      total_cents,
      currency,
      created_at,
      track_token,
      order_items (
        id,
        product_snapshot,
        size,
        quantity
      )
    `
    )
    .eq("customer_email", user.email)
    .order("created_at", { ascending: false });

  return (
    <div className="container-atelier py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-secondary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Account
          </Link>

          <h1 className="text-3xl font-heading font-semibold">Your Orders</h1>
        </div>

        {/* Orders List */}
        {!orders || orders.length === 0 ? (
          <div className="text-center py-12 bg-surface-container">
            <Package className="w-12 h-12 mx-auto text-on-surface-variant mb-4" />
            <h2 className="text-lg font-medium mb-2">No orders yet</h2>
            <p className="text-on-surface-variant mb-6">
              When you place an order, it will appear here.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint hover:text-on-surface transition-colors"
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusColor =
                STATUS_COLORS[order.status] || STATUS_COLORS.default;
              const items = order.order_items || [];
              const firstItem = items[0];
              const productSnapshot = firstItem?.product_snapshot as {
                name?: string;
                image?: string;
              } | null;

              return (
                <div
                  key={order.id}
                  className="bg-surface border border-outline-variant p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-on-surface-variant">
                        Order #{order.order_number}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        {new Date(order.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${statusColor}`}
                    >
                      {STATUS_LABELS[order.status as OrderStatus] || order.status}
                    </span>
                  </div>

                  {/* Order Items Summary */}
                  <div className="mb-4">
                    {items.length > 0 ? (
                      <div className="space-y-2">
                        {items.slice(0, 2).map((item) => {
                          const snapshot = item.product_snapshot as {
                            name?: string;
                          } | null;
                          return (
                            <div
                              key={item.id}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {snapshot?.name || "Product"} ({item.size}) ×{" "}
                                {item.quantity}
                              </span>
                            </div>
                          );
                        })}
                        {items.length > 2 && (
                          <p className="text-sm text-on-surface-variant">
                            +{items.length - 2} more item
                            {items.length - 2 !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-on-surface-variant">
                        {order.order_type === "custom"
                          ? "Custom Order"
                          : "Order details unavailable"}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
                    <p className="font-medium">
                      {order.currency} $
                      {(order.total_cents / 100).toFixed(2)}
                    </p>
                    <Link
                      href={`/track/${order.track_token}`}
                      className="inline-flex items-center gap-1 text-sm text-secondary hover:underline"
                    >
                      Track Order
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
