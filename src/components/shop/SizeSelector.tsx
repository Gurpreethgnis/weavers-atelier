"use client";

import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import type { SizeOption } from "@/lib/supabase/types";

interface SizeSelectorProps {
  sizes: SizeOption[];
  productId: string;
}

export function SizeSelector({ sizes, productId }: SizeSelectorProps) {
  const { selectedSize, setSelectedSize } = useCartStore();
  const currentSize = selectedSize[productId];

  return (
    <div
      className="flex flex-wrap gap-2"
      role="radiogroup"
      aria-label="Select size"
    >
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => setSelectedSize(productId, size)}
          className={cn(
            "min-w-[3rem] px-4 py-3 text-sm font-medium border transition-all",
            currentSize === size
              ? "border-secondary bg-secondary text-surface"
              : "border-outline-variant hover:border-outline"
          )}
          role="radio"
          aria-checked={currentSize === size}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
