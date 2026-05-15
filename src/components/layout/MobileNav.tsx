"use client";

import Link from "next/link";
import { useState } from "react";
import { X, ChevronDown } from "lucide-react";
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

function AccordionItem({
  item,
  onClose,
}: {
  item: NavItem;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  if (item.type === "link") {
    return (
      <Link
        href={item.href || "#"}
        onClick={onClose}
        className="block py-4 text-headline-md text-on-surface hover:text-primary transition-colors duration-300"
      >
        {item.name}
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex items-center justify-between w-full py-4 text-headline-md text-on-surface hover:text-primary transition-colors duration-300"
      >
        {item.name}
        <ChevronDown
          className={`h-5 w-5 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>
      {expanded && item.items && (
        <div className="pl-4 pb-2 space-y-1">
          {item.items.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              onClick={onClose}
              className="block py-2 text-body-lg text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              {subItem.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
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
              WEAVER'S ATELIER
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

          {/* Primary Navigation - Accordion */}
          <nav className="flex-1 overflow-y-auto py-6 px-6">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <AccordionItem item={item} onClose={onClose} />
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
              href="/book-consultation"
              onClick={onClose}
              className="flex items-center justify-center w-full py-4 text-label-caps bg-primary-container text-on-primary-container hover:bg-surface hover:text-primary-container hover:border hover:border-primary-container transition-all duration-300"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
