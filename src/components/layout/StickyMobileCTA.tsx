"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface StickyMobileCTAProps {
  label: string;
  href: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  showAfterScroll?: number;
  className?: string;
}

export function StickyMobileCTA({
  label,
  href,
  secondaryLabel,
  secondaryHref,
  showAfterScroll = 400,
  className,
}: StickyMobileCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfterScroll]);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 lg:hidden",
        "transform transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "translate-y-full",
        className
      )}
    >
      <div className="bg-surface/95 backdrop-blur-sm border-t border-outline-variant/30 px-4 py-3 safe-area-pb">
        <div className="flex gap-3">
          {secondaryHref && secondaryLabel && (
            <Link
              href={secondaryHref}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors"
            >
              {secondaryLabel}
            </Link>
          )}
          <Link
            href={href}
            className={cn(
              "inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-inverse-on-surface bg-inverse-surface hover:bg-surface-tint transition-colors",
              secondaryHref ? "flex-1" : "flex-1"
            )}
          >
            {label}
          </Link>
        </div>
      </div>
    </div>
  );
}
