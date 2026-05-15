import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import type { Order, OrderItem, OrderStatus } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Track Order | Weaver's Atelier",
  description: "Track your order status and shipment.",
};

interface TrackPageProps {
  params: Promise<{ token: string }>;
}

interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

async function getOrderByToken(token: string): Promise<OrderWithItems | null> {
  try {
    const supabase = await createServiceClient();

    const { data: order, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (*)
      `
      )
      .eq("track_token", token)
      .single();

    if (error || !order) {
      return null;
    }

    return order as OrderWithItems;
  } catch {
    return null;
  }
}

const statusSteps: { status: OrderStatus; label: string; icon: typeof Clock }[] =
  [
    { status: "submitted", label: "Order Received", icon: Clock },
    { status: "confirmed", label: "Confirmed", icon: CheckCircle },
    { status: "in_production", label: "In Production", icon: Package },
    { status: "ready_to_dispatch", label: "Ready to Ship", icon: CheckCircle },
    { status: "dispatched", label: "Shipped", icon: Truck },
    { status: "delivered", label: "Delivered", icon: CheckCircle },
  ];

function getStatusIndex(status: OrderStatus): number {
  const index = statusSteps.findIndex((step) => step.status === status);
  return index >= 0 ? index : 0;
}

export default async function TrackOrderPage({ params }: TrackPageProps) {
  const { token } = await params;
  const order = await getOrderByToken(token);

  if (!order) {
    notFound();
  }

  const currentStatusIndex = getStatusIndex(order.status as OrderStatus);

  return (
    <div className="container-atelier py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-semibold mb-2">
            Track Your Order
          </h1>
          <p className="text-on-surface-variant">
            Order #{order.order_number}
          </p>
        </div>

        {/* Status Timeline */}
        <div className="bg-surface-container p-6 md:p-8 mb-8">
          <h2 className="font-heading font-semibold mb-6">Order Status</h2>

          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-outline-variant" />
            <div
              className="absolute left-4 top-6 w-0.5 bg-secondary transition-all"
              style={{
                height: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%`,
              }}
            />

            {/* Steps */}
            <div className="space-y-6">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const Icon = step.icon;

                return (
                  <div key={step.status} className="relative flex items-start gap-4">
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted
                          ? "bg-secondary text-surface"
                          : "bg-surface-dim text-on-surface-variant"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p
                        className={`font-medium ${
                          isCurrent ? "text-secondary" : ""
                        } ${!isCompleted ? "text-on-surface-variant" : ""}`}
                      >
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-sm text-on-surface-variant mt-1">
                          Current status
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tracking Link */}
          {order.tracking_url && (
            <div className="mt-8 pt-6 border-t border-outline-variant">
              <a
                href={order.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-secondary hover:underline"
              >
                Track Shipment
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="bg-surface-container p-6 md:p-8 mb-8">
          <h2 className="font-heading font-semibold mb-6">Order Details</h2>

          {/* Items */}
          <div className="divide-y divide-outline-variant mb-6">
            {order.order_items.map((item) => {
              const snapshot = item.product_snapshot as {
                name?: string;
                image?: string;
              } | null;
              return (
                <div key={item.id} className="py-4 flex gap-4">
                  <div className="w-16 h-20 bg-surface-dim flex-shrink-0 relative">
                    {snapshot?.image ? (
                      <Image
                        src={snapshot.image}
                        alt={snapshot?.name || "Product"}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{snapshot?.name || "Item"}</h3>
                    <p className="text-sm text-on-surface-variant">
                      Size: {item.size} · Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-medium">
                    ${(item.line_total_cents / 100).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="space-y-2 text-sm border-t border-outline-variant pt-4">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Subtotal</span>
              <span>${(order.subtotal_cents / 100).toFixed(2)}</span>
            </div>
            {order.shipping_cents > 0 && (
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Shipping</span>
                <span>${(order.shipping_cents / 100).toFixed(2)}</span>
              </div>
            )}
            {order.tax_cents > 0 && (
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Tax</span>
                <span>${(order.tax_cents / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium text-base pt-2">
              <span>Total</span>
              <span>${(order.total_cents / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Estimated Delivery */}
        {order.estimated_ship_date && (
          <div className="bg-surface-dim p-6 mb-8">
            <h3 className="font-medium mb-2">Estimated Ship Date</h3>
            <p className="text-on-surface-variant">
              {new Date(order.estimated_ship_date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        )}

        {/* Help */}
        <div className="text-center">
          <p className="text-sm text-on-surface-variant mb-4">
            Questions about your order?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-secondary hover:underline"
          >
            Contact Us
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
