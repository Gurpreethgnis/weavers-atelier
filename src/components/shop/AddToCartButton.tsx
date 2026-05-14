"use client";

import { useCartStore } from "@/lib/store/cart";
import { Button } from "@/components/ui/button";
import { shopContent } from "@/content/shop";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price_cents: number;
    image?: string;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { selectedSize, addItem } = useCartStore();
  const size = selectedSize[product.id];

  const handleAddToCart = () => {
    if (!size) {
      toast.error("Please select a size");
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      size,
      price_cents: product.price_cents,
      image: product.image,
    });

    toast.success(`${product.name} (${size}) added to cart`);
  };

  return (
    <Button
      onClick={handleAddToCart}
      className="w-full py-4 text-base bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint"
      disabled={!size}
    >
      {size ? shopContent.productCtas.addToCart : "Select a Size"}
    </Button>
  );
}
