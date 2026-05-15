"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, User } from "lucide-react";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";
import { CartIcon } from "@/components/shop/CartIcon";

type NavItem = {
  name: string;
  type: "link" | "dropdown";
  href?: string;
  items?: { name: string; href: string }[];
};

const navigation: NavItem[] = [
  {
    name: "Shop",
    type: "dropdown",
    items: [
      { name: "All Products", href: "/shop" },
      { name: "Shirts", href: "/shop/shirts" },
      { name: "Trousers", href: "/shop/trousers" },
      { name: "Denim", href: "/shop/denim" },
    ],
  },
  { name: "Lookbook", type: "link", href: "/lookbook" },
  { name: "Weddingwear", type: "link", href: "/weddingwear" },
  { name: "Statement Pieces", type: "link", href: "/statement-pieces" },
  { name: "How It Works", type: "link", href: "/how-it-works" },
  { name: "Contact", type: "link", href: "/contact" },
];

function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: { name: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
        className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300"
      >
        {label}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-surface border border-outline-variant/30 shadow-lg py-2 z-50">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-body-md text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors duration-200"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30">
      <nav
        className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-4 md:px-8 py-4"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Weaver's Atelier - Home"
        >
          <span className="text-headline-md tracking-widest text-secondary">
            WEAVER'S ATELIER
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">
          {navigation.map((item) =>
            item.type === "dropdown" && item.items ? (
              <NavDropdown
                key={item.name}
                label={item.name}
                items={item.items}
              />
            ) : (
              <Link
                key={item.name}
                href={item.href || "#"}
                className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300"
              >
                {item.name}
              </Link>
            )
          )}
        </div>

        {/* Desktop Right Cluster: Icons */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <CartIcon />
          <Link
            href="/account"
            className="p-2 text-on-surface-variant hover:text-primary transition-all duration-300 hover:bg-surface-container rounded-full"
            aria-label="Account"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <CartIcon />
          <Link
            href="/account"
            className="p-2 text-on-surface-variant hover:text-primary transition-all duration-300"
            aria-label="Account"
          >
            <User className="w-5 h-5" />
          </Link>
          <button
            type="button"
            className="p-2 text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Open main menu"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNav
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navigation={navigation}
      />
    </header>
  );
}

export type { NavItem };
