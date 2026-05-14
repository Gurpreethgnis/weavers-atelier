import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Truck, Check, X } from "lucide-react";
import { OrderStatusForm } from "./OrderStatusForm";
import type { EcommerceOrderStatus, ShippingAddress } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface OrderItem {
  id: string;
  product_snapshot: unknown;
  size: string;
  unit_price_cents: number;
  quantity: number;
  line_total_cents: number;
  custom_quote_id: string | null;
}

interface CustomerInfo {
  id: string;
  full_name: string | null;
  phone: string | null;
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        id,
        product_snapshot,
        size,
        unit_price_cents,
        quantity,
        line_total_cents,
        custom_quote_id
      ),
      customers (
        id,
        full_name,
        phone
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !order) {
    notFound();
  }

  const formatCurrency = (cents: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(cents / 100);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusColor = (status: EcommerceOrderStatus) => {
    const colors: Record<EcommerceOrderStatus, string> = {
      pending_payment: "bg-yellow-100 text-yellow-700 border-yellow-300",
      confirmed: "bg-blue-100 text-blue-700 border-blue-300",
      in_production: "bg-purple-100 text-purple-700 border-purple-300",
      quality_check: "bg-indigo-100 text-indigo-700 border-indigo-300",
      ready_to_ship: "bg-cyan-100 text-cyan-700 border-cyan-300",
      shipped: "bg-green-100 text-green-700 border-green-300",
      delivered: "bg-green-100 text-green-700 border-green-300",
      completed: "bg-green-100 text-green-700 border-green-300",
      cancelled: "bg-red-100 text-red-700 border-red-300",
      refunded: "bg-gray-100 text-gray-700 border-gray-300",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const shippingAddress = order.shipping_address as ShippingAddress | null;
  const orderItems = (order.order_items || []) as OrderItem[];
  const customer = order.customers as CustomerInfo | null;

  // Status timeline
  const statusSteps = [
    { key: "confirmed", label: "Confirmed", icon: Check },
    { key: "in_production", label: "Production", icon: Package },
    { key: "ready_to_ship", label: "Ready", icon: Package },
    { key: "shipped", label: "Shipped", icon: Truck },
    { key: "delivered", label: "Delivered", icon: Check },
  ];

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.key === order.status
  );

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.order_number}
            </h1>
            <p className="text-sm text-gray-500">
              Placed {formatDate(order.created_at)}
            </p>
          </div>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
              order.status as EcommerceOrderStatus
            )}`}
          >
            {order.status.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Timeline */}
          {!["cancelled", "refunded"].includes(order.status) && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Progress
              </h2>
              <div className="flex justify-between">
                {statusSteps.map((step, index) => {
                  const isActive = index <= currentStepIndex;
                  const isCurrent = step.key === order.status;
                  return (
                    <div
                      key={step.key}
                      className="flex flex-col items-center flex-1"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isActive
                            ? isCurrent
                              ? "bg-blue-600 text-white"
                              : "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <step.icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs mt-2 ${
                          isActive ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Items</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {orderItems.map((item) => {
                const snapshot = item.product_snapshot as {
                  name?: string;
                  image_url?: string;
                };
                return (
                  <div key={item.id} className="p-4 flex items-center gap-4">
                    {snapshot?.image_url ? (
                      <img
                        src={snapshot.image_url}
                        alt={snapshot?.name || "Product"}
                        className="w-16 h-16 rounded object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded bg-gray-100" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {snapshot?.name || "Product"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                      {item.custom_quote_id && (
                        <Link
                          href={`/admin/quotes/${item.custom_quote_id}`}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View Custom Quote
                        </Link>
                      )}
                    </div>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(item.line_total_cents, order.currency)}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">
                  {formatCurrency(order.subtotal_cents, order.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-900">
                  {formatCurrency(order.tax_cents, order.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-900">
                  {formatCurrency(order.shipping_cents, order.currency)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatCurrency(order.total_cents, order.currency)}</span>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Manage Order
            </h2>
            <OrderStatusForm
              orderId={order.id}
              currentStatus={order.status as EcommerceOrderStatus}
              trackingNumber={order.tracking_number || ""}
              trackingUrl={order.tracking_url || ""}
              internalNotes={order.internal_notes || ""}
              hasPaymentIntent={!!order.stripe_payment_intent_id}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Customer</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-900">
                {customer?.full_name || "Guest"}
              </p>
              <p className="text-gray-500">{order.customer_email}</p>
              {customer?.phone && (
                <p className="text-gray-500">{customer.phone}</p>
              )}
              {customer?.id && (
                <Link
                  href={`/admin/customers/${customer.id}`}
                  className="text-blue-600 hover:underline block mt-2"
                >
                  View Customer
                </Link>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {shippingAddress && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Shipping Address
              </h3>
              <div className="text-sm text-gray-700">
                <p>{shippingAddress.full_name}</p>
                <p>{shippingAddress.line1}</p>
                {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
                <p>
                  {shippingAddress.city}
                  {shippingAddress.state && `, ${shippingAddress.state}`}{" "}
                  {shippingAddress.postal_code}
                </p>
                <p>{shippingAddress.country}</p>
                {shippingAddress.phone && (
                  <p className="mt-2">{shippingAddress.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Order Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Type</dt>
                <dd className="text-gray-900 font-medium">
                  {order.order_type === "rtw" ? "Ready-to-Wear" : "Custom"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Lead Time</dt>
                <dd className="text-gray-900">
                  {order.lead_time_days || "—"} days
                </dd>
              </div>
              {order.estimated_ship_date && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Est. Ship</dt>
                  <dd className="text-gray-900">
                    {new Date(order.estimated_ship_date).toLocaleDateString()}
                  </dd>
                </div>
              )}
              {order.shipped_at && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Shipped</dt>
                  <dd className="text-gray-900">
                    {new Date(order.shipped_at).toLocaleDateString()}
                  </dd>
                </div>
              )}
              {order.tracking_url && (
                <div className="pt-2 border-t border-gray-200">
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Track Package →
                  </a>
                </div>
              )}
            </dl>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Payment</h3>
            <dl className="space-y-2 text-sm">
              {order.stripe_checkout_session_id && (
                <div>
                  <dt className="text-gray-500">Checkout Session</dt>
                  <dd className="text-gray-700 font-mono text-xs truncate">
                    {order.stripe_checkout_session_id}
                  </dd>
                </div>
              )}
              {order.stripe_payment_intent_id && (
                <div>
                  <dt className="text-gray-500">Payment Intent</dt>
                  <dd className="text-gray-700 font-mono text-xs truncate">
                    {order.stripe_payment_intent_id}
                  </dd>
                </div>
              )}
              {order.stripe_invoice_id && (
                <div>
                  <dt className="text-gray-500">Invoice</dt>
                  <dd className="text-gray-700 font-mono text-xs truncate">
                    {order.stripe_invoice_id}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
