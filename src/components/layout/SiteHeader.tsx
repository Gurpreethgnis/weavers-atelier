"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, User } from "lucide-react";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";
import { CartIcon } from "@/components/shop/CartIcon";

type NavItem = {
  name: string;
  href: string;
};

const navigation: NavItem[] = [
  { name: "Shop", href: "/shop" },
  { name: "Lookbook", href: "/lookbook" },
  { name: "Weddingwear", href: "/weddingwear" },
  { name: "Statement Pieces", href: "/statement-pieces" },
  { name: "Contact", href: "/contact" },
];

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
            WEAVERS ATELIER
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300"
            >
              {item.name}
            </Link>
          ))}
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
