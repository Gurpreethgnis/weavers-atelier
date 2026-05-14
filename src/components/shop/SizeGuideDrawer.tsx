"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shopContent } from "@/content/shop";

export function SizeGuideDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
  }, []);

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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 text-sm text-on-surface-variant hover:text-secondary transition-colors"
      >
        <Ruler className="w-4 h-4" />
        Size Guide
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-inverse-surface/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div
            className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-surface shadow-xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="size-guide-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-outline-variant">
              <h2 id="size-guide-title" className="text-xl font-heading font-semibold">
                Size Guide
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-surface-container rounded-full transition-colors"
                aria-label="Close size guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-8">
                {/* Intro */}
                <p className="text-on-surface-variant">{shopContent.sizeGuide.intro}</p>

                {/* Size Chart */}
                <div>
                  <h3 className="font-medium mb-4">Standard Sizes</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-outline-variant">
                          <th className="text-left py-3 pr-4 font-medium">Size</th>
                          <th className="text-left py-3 px-4 font-medium">Chest (in)</th>
                          <th className="text-left py-3 px-4 font-medium">Waist (in)</th>
                          <th className="text-left py-3 pl-4 font-medium">Hip (in)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shopContent.sizeGuide.chart.map((row) => (
                          <tr key={row.size} className="border-b border-outline-variant/50">
                            <td className="py-3 pr-4 font-medium">{row.size}</td>
                            <td className="py-3 px-4 text-on-surface-variant">{row.chest}</td>
                            <td className="py-3 px-4 text-on-surface-variant">{row.waist}</td>
                            <td className="py-3 pl-4 text-on-surface-variant">{row.hip}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* How to Measure */}
                <div>
                  <h3 className="font-medium mb-4">How to Measure</h3>
                  <ul className="space-y-3 text-sm text-on-surface-variant">
                    <li>
                      <strong className="text-on-surface">Chest:</strong> Measure around the fullest
                      part of your chest, keeping the tape horizontal.
                    </li>
                    <li>
                      <strong className="text-on-surface">Waist:</strong> Measure around your natural
                      waistline, which is typically the narrowest part of your torso.
                    </li>
                    <li>
                      <strong className="text-on-surface">Hip:</strong> Stand with feet together and
                      measure around the fullest part of your hips.
                    </li>
                  </ul>
                </div>

                {/* Between Sizes */}
                <div className="bg-surface-container p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Between Sizes?</h3>
                  <p className="text-sm text-on-surface-variant">
                    {shopContent.sizeGuide.betweenSizes}
                  </p>
                </div>

                {/* Custom Option */}
                <div className="bg-secondary/10 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Need a Perfect Fit?</h3>
                  <p className="text-sm text-on-surface-variant mb-3">
                    Our custom option lets you provide your exact measurements for a
                    tailored fit. Available on all products.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-outline-variant">
              <Button
                onClick={() => setIsOpen(false)}
                className="w-full py-4 bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
