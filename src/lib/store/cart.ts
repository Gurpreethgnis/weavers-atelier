"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SizeOption } from "@/lib/supabase/types";

export interface CartItem {
  productId: string;
  name: string;
  size: SizeOption;
  price_cents: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  selectedSize: Record<string, SizeOption>;
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string, size: SizeOption) => void;
  updateQuantity: (productId: string, size: SizeOption, quantity: number) => void;
  clearCart: () => void;
  setSelectedSize: (productId: string, size: SizeOption) => void;
  setIsOpen: (isOpen: boolean) => void;

  // Computed
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedSize: {},
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === item.productId && i.size === item.size
          );

          if (existingIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += 1;
            return { items: newItems, isOpen: true };
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId, size) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.size === size)
          ),
        }));
      },

      updateQuantity: (productId, size, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (i) => !(i.productId === productId && i.size === size)
              ),
            };
          }

          return {
            items: state.items.map((i) =>
              i.productId === productId && i.size === size
                ? { ...i, quantity }
                : i
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      setSelectedSize: (productId, size) => {
        set((state) => ({
          selectedSize: { ...state.selectedSize, [productId]: size },
        }));
      },

      setIsOpen: (isOpen) => {
        set({ isOpen });
      },

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      subtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price_cents * item.quantity,
          0
        );
      },
    }),
    {
      name: "weavers-cart",
      partialize: (state) => ({
        items: state.items,
        selectedSize: state.selectedSize,
      }),
    }
  )
);
