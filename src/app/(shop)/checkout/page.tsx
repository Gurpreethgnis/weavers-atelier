"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, ShoppingBag, Lock } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { createCheckoutSession } from "@/lib/actions/checkout";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal } = useCartStore();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const subtotalAmount = subtotal();

  const breadcrumbs = [
    { label: "Shop", href: "/shop" },
    { label: "Cart", href: "/cart" },
    { label: "Checkout" },
  ];

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const result = await createCheckoutSession({
        items,
        customerEmail: email,
      });

      if (result.success && result.url) {
        window.location.href = result.url;
      } else {
        toast.error(result.error || "Failed to start checkout");
        setIsLoading(false);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-atelier py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-on-surface-variant/50 mb-6" />
        <h1 className="text-2xl font-heading font-semibold mb-3">
          Your cart is empty
        </h1>
        <p className="text-on-surface-variant mb-8">
          Add some items to your cart before checking out.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center px-8 py-4 bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint hover:text-on-surface transition-colors"
        >
          Shop the Collection
        </Link>
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs items={breadcrumbs} className="container-atelier pt-4" />

      <div className="container-atelier py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-7">
            <h1 className="text-3xl font-heading font-semibold mb-8">
              Checkout
            </h1>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-on-surface-variant mt-2">
                    We'll send your order confirmation to this address.
                  </p>
                </div>
              </div>
            </div>

            {/* Shipping Note */}
            <div className="mb-8 p-4 bg-surface-container rounded">
              <h3 className="text-sm font-medium mb-2">
                Shipping & Payment
              </h3>
              <p className="text-sm text-on-surface-variant">
                You'll enter your shipping address and payment details on the
                secure Stripe checkout page. We accept all major credit cards,
                Apple Pay, and Google Pay.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handleCheckout}
                disabled={isLoading || !email}
                className="w-full py-4 bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint hover:text-on-surface transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Redirecting to payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Continue to Payment
                  </>
                )}
              </button>

              <Link
                href="/cart"
                className="flex items-center justify-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Cart
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container p-6 sticky top-24">
              <h2 className="text-lg font-heading font-semibold mb-6">
                Order Summary
              </h2>

              {/* Items */}
              <div className="divide-y divide-outline-variant mb-6">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="py-4 flex gap-4"
                  >
                    <div className="w-16 h-20 bg-surface-dim flex-shrink-0 relative">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-secondary text-surface text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-xs text-on-surface-variant">
                        Size: {item.size}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      ${((item.price_cents * item.quantity) / 100).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm border-t border-outline-variant pt-4">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Subtotal</span>
                  <span>${(subtotalAmount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Shipping</span>
                  <span className="text-on-surface-variant">
                    Calculated next
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Tax</span>
                  <span className="text-on-surface-variant">
                    Calculated next
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-outline-variant">
                <div className="flex justify-between text-lg font-medium">
                  <span>Estimated Total</span>
                  <span>${(subtotalAmount / 100).toFixed(2)}</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-2">
                  Final total calculated at payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
