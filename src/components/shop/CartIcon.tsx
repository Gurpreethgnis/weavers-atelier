"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";

export function CartIcon() {
  const { totalItems } = useCartStore();
  const count = totalItems();

  return (
    <Link
      href="/cart"
      className="relative p-2 hover:bg-surface-container rounded-full transition-colors"
      aria-label={`Shopping cart with ${count} items`}
    >
      <ShoppingBag className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-surface text-xs rounded-full flex items-center justify-center font-medium">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
