"use client";

import { useEffect, useCallback } from "react";
import { X } from "lucide-react";
import type { ProductCategory } from "@/lib/supabase/types";
import Link from "next/link";

interface CustomizeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    category: ProductCategory;
    base_price_cents: number;
  };
}

export function CustomizeDrawer({ isOpen, onClose, product }: CustomizeDrawerProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  const categoryPath = getCategoryPath(product.category);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-inverse-surface/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-surface shadow-xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customize-drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <h2 id="customize-drawer-title" className="text-xl font-heading font-semibold">
            Customize This Piece
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container rounded-full transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <p className="text-on-surface-variant mb-4">
                You're customizing: <strong className="text-on-surface">{product.name}</strong>
              </p>
              <p className="text-sm text-on-surface-variant">
                Starting from ${(product.base_price_cents / 100).toFixed(0)}
              </p>
            </div>

            <div className="bg-surface-container p-6 rounded-lg">
              <h3 className="font-medium mb-3">How Custom Orders Work</h3>
              <ol className="space-y-3 text-sm text-on-surface-variant">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary text-surface flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  <span>Submit your preferences and measurements</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary text-surface flex items-center justify-center text-xs font-medium">
                    2
                  </span>
                  <span>We'll review and send you a detailed quote</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary text-surface flex items-center justify-center text-xs font-medium">
                    3
                  </span>
                  <span>Pay securely online once you approve</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary text-surface flex items-center justify-center text-xs font-medium">
                    4
                  </span>
                  <span>Your custom piece is crafted and shipped</span>
                </li>
              </ol>
            </div>

            <p className="text-sm text-on-surface-variant">
              Our custom orders include personalized fit based on your measurements,
              fabric and detail selection, and direct communication with our team
              throughout the process.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-outline-variant space-y-3">
          <Link
            href={`${categoryPath}?product=${product.id}&customize=true`}
            className="w-full py-4 text-base bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint flex items-center justify-center"
          >
            Continue to Quote Form
          </Link>
          <p className="text-xs text-center text-on-surface-variant">
            Free quote • No commitment required
          </p>
        </div>
      </div>
    </div>
  );
}

function getCategoryPath(category: ProductCategory): string {
  switch (category) {
    case "shirt":
      return "/customize/shirt";
    case "trouser":
      return "/customize/trouser";
    case "denim":
      return "/customize/denim";
    case "weddingwear":
      return "/weddingwear";
    case "statement":
      return "/statement-pieces";
    default:
      return "/contact";
  }
}
