import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { getStripeServer } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Order Confirmed | Weaver's Atelier",
  description: "Thank you for your order.",
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

interface OrderDetails {
  orderNumber: string;
  email: string;
  amount: number;
  currency: string;
  trackToken: string;
}

async function getOrderDetails(
  sessionId: string
): Promise<OrderDetails | null> {
  try {
    const stripe = getStripeServer();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer_details"],
    });

    if (session.payment_status !== "paid") {
      return null;
    }

    const supabase = await createServiceClient();

    // Find the order by stripe session ID
    const { data: order } = await supabase
      .from("orders")
      .select("order_number, track_token")
      .eq("stripe_checkout_session_id", sessionId)
      .single();

    return {
      orderNumber: order?.order_number || "Pending",
      email: session.customer_details?.email || "",
      amount: session.amount_total || 0,
      currency: session.currency || "usd",
      trackToken: order?.track_token || "",
    };
  } catch (error) {
    console.error("Error fetching order details:", error);
    return null;
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <div className="container-atelier py-16 text-center">
        <h1 className="text-2xl font-heading font-semibold mb-4">
          Invalid Session
        </h1>
        <p className="text-on-surface-variant mb-8">
          This checkout session is invalid or has expired.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center px-8 py-4 bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint hover:text-on-surface transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const order = await getOrderDetails(session_id);

  if (!order) {
    return (
      <div className="container-atelier py-16 text-center">
        <h1 className="text-2xl font-heading font-semibold mb-4">
          Processing Your Order
        </h1>
        <p className="text-on-surface-variant mb-8">
          We're processing your order. You'll receive a confirmation email
          shortly.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center px-8 py-4 bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint hover:text-on-surface transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-atelier py-12 md:py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
          Order Confirmed
        </h1>

        <p className="text-lg text-on-surface-variant mb-8">
          Thank you. Your order has been received and is now being reviewed. We&apos;ll send updates as your piece moves through preparation and dispatch.
        </p>

        {/* Order Details */}
        <div className="bg-surface-container p-6 md:p-8 text-left mb-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="text-sm text-on-surface-variant block mb-1">
                Order Number
              </span>
              <span className="font-medium">{order.orderNumber}</span>
            </div>
            <div>
              <span className="text-sm text-on-surface-variant block mb-1">
                Total
              </span>
              <span className="font-medium">
                ${(order.amount / 100).toFixed(2)}{" "}
                {order.currency.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="border-t border-outline-variant pt-4">
            <span className="text-sm text-on-surface-variant block mb-1">
              Confirmation sent to
            </span>
            <span className="font-medium">{order.email}</span>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-surface-dim p-6 text-left mb-8">
          <h2 className="font-heading font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            What Happens Next?
          </h2>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-secondary text-surface rounded-full flex items-center justify-center text-xs font-medium">
                1
              </span>
              <span>
                We'll start crafting your order within 1-2 business days.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-secondary/30 text-on-surface rounded-full flex items-center justify-center text-xs font-medium">
                2
              </span>
              <span>
                You'll receive updates as your order progresses through
                production.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-secondary/30 text-on-surface rounded-full flex items-center justify-center text-xs font-medium">
                3
              </span>
              <span>
                Once shipped, you'll get tracking information via email.
              </span>
            </li>
          </ol>
        </div>

        {/* Track Order */}
        {order.trackToken && (
          <div className="mb-8">
            <Link
              href={`/track/${order.trackToken}`}
              className="inline-flex items-center gap-2 text-secondary hover:underline"
            >
              Track Your Order
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Create Account CTA */}
        <div className="p-6 border border-outline-variant bg-surface mb-8">
          <h3 className="font-medium mb-2">Create an Account</h3>
          <p className="text-sm text-on-surface-variant mb-4">
            Save your details for faster checkout next time, track all your
            orders, and save your measurements for custom orders.
          </p>
          <Link
            href={`/account/login?email=${encodeURIComponent(order.email)}`}
            className="inline-flex items-center px-6 py-3 border border-outline hover:bg-surface-container transition-colors text-sm"
          >
            Create Account
          </Link>
        </div>

        {/* Continue Shopping */}
        <Link
          href="/shop"
          className="inline-flex items-center px-8 py-4 bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint hover:text-on-surface transition-colors gap-2"
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
