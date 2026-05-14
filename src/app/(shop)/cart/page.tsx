"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore, type CartItem } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } =
    useCartStore();

  const subtotalAmount = subtotal();

  const breadcrumbs = [
    { label: "Shop", href: "/shop" },
    { label: "Cart" },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} className="container-atelier pt-4" />

      <div className="container-atelier py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-8">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="divide-y divide-outline-variant">
                {items.map((item) => (
                  <CartItemRow
                    key={`${item.productId}-${item.size}`}
                    item={item}
                    onRemove={() => removeItem(item.productId, item.size)}
                    onUpdateQuantity={(qty) =>
                      updateQuantity(item.productId, item.size, qty)
                    }
                  />
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-outline-variant flex justify-between items-center">
                <button
                  onClick={clearCart}
                  className="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  Clear Cart
                </button>
                <Link
                  href="/shop"
                  className="text-sm text-secondary hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-surface-container p-6 sticky top-24">
                <h2 className="text-lg font-heading font-semibold mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Subtotal</span>
                    <span>${(subtotalAmount / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Shipping</span>
                    <span className="text-on-surface-variant">
                      Calculated at checkout
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Tax</span>
                    <span className="text-on-surface-variant">
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-outline-variant">
                  <div className="flex justify-between text-lg font-medium mb-6">
                    <span>Estimated Total</span>
                    <span>${(subtotalAmount / 100).toFixed(2)}</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full py-4 bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint hover:text-on-surface transition-colors flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <p className="text-xs text-on-surface-variant text-center mt-4">
                    Secure checkout powered by Stripe
                  </p>
                </div>

                {/* Lead Time Note */}
                <div className="mt-6 pt-6 border-t border-outline-variant">
                  <h3 className="text-sm font-medium mb-2">Made to Order</h3>
                  <p className="text-xs text-on-surface-variant">
                    Each piece is crafted after you order. Standard sizes ship
                    in 10–14 business days. Free US shipping.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function CartItemRow({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItem;
  onRemove: () => void;
  onUpdateQuantity: (qty: number) => void;
}) {
  return (
    <div className="py-6 flex gap-4">
      {/* Image */}
      <div className="w-24 h-32 md:w-32 md:h-40 bg-surface-dim flex-shrink-0 relative">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="128px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
            <ShoppingBag className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-on-surface">{item.name}</h3>
          <p className="text-sm text-on-surface-variant mt-1">
            Size: {item.size}
          </p>
          <p className="text-sm font-medium mt-2">
            ${(item.price_cents / 100).toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Quantity */}
          <div className="flex items-center border border-outline-variant">
            <button
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              className="p-2 hover:bg-surface-container transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 min-w-[3rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="p-2 hover:bg-surface-container transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={onRemove}
            className="p-2 text-on-surface-variant hover:text-error transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Line Total (desktop) */}
      <div className="hidden md:block text-right">
        <span className="font-medium">
          ${((item.price_cents * item.quantity) / 100).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="text-center py-16">
      <ShoppingBag className="w-16 h-16 mx-auto text-on-surface-variant/50 mb-6" />
      <h2 className="text-2xl font-heading font-semibold mb-3">
        Your cart is empty
      </h2>
      <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
        Looks like you haven't added anything to your cart yet. Explore our
        collection and find something you love.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center px-8 py-4 bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint hover:text-on-surface transition-colors gap-2"
      >
        Shop the Collection
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
