"use client";

import Link from "next/link";
import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import type { NavItem } from "./SiteHeader";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  navigation: NavItem[];
}

export function MobileNav({ open, onClose, navigation }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-surface border-l border-outline-variant/20 p-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
            <span className="text-headline-md tracking-widest text-secondary">
              WEAVERS ATELIER
            </span>
            <button
              type="button"
              className="p-2 -mr-2 text-on-surface-variant hover:text-primary transition-colors"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Primary Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-6">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block py-4 text-headline-md text-on-surface hover:text-primary transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Theme Toggle Row */}
            <div className="mt-8 pt-6 border-t border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="text-body-md text-on-surface-variant">
                  Theme
                </span>
                <ThemeToggle />
              </div>
            </div>
          </nav>

          {/* Footer CTA - Pinned */}
          <div className="p-6 border-t border-outline-variant/20">
            <Link
              href="/customize/shirt"
              onClick={onClose}
              className="flex items-center justify-center w-full py-4 text-label-caps bg-primary-container text-on-primary-container hover:bg-surface hover:text-primary-container hover:border hover:border-primary-container transition-all duration-300"
            >
              Start a Custom Order
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
