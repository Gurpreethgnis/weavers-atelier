"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { shopContent } from "@/content/shop";
import { CustomizeDrawer } from "./CustomizeDrawer";
import type { ProductCategory } from "@/lib/supabase/types";

interface CustomizeButtonProps {
  product: {
    id: string;
    name: string;
    category: ProductCategory;
    base_price_cents: number;
  };
  isPrimary?: boolean;
}

export function CustomizeButton({ product, isPrimary = false }: CustomizeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant={isPrimary ? "default" : "outline"}
        className={`w-full py-4 text-base ${
          isPrimary
            ? "bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint"
            : "border-outline hover:bg-surface-container"
        }`}
      >
        {shopContent.productCtas.customize}
      </Button>

      <CustomizeDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        product={product}
      />
    </>
  );
}
