import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-surface-container-lowest w-full border-t border-outline-variant/20">
      <div className="w-full max-w-[1440px] mx-auto py-16 px-4 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <span className="text-headline-md tracking-widest text-secondary">
            WEAVER'S ATELIER
          </span>
        </Link>

        {/* Links */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-center">
          <Link
            href="/delivery"
            className="text-body-md text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-all duration-500 ease-in-out"
          >
            Logistics
          </Link>
          <Link
            href="/track-order"
            className="text-body-md text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-all duration-500 ease-in-out"
          >
            Track Order
          </Link>
          <Link
            href="/faq"
            className="text-body-md text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-all duration-500 ease-in-out"
          >
            FAQ
          </Link>
          <Link
            href="/privacy"
            className="text-body-md text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-all duration-500 ease-in-out"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-body-md text-on-surface-variant hover:text-primary underline-offset-4 hover:underline transition-all duration-500 ease-in-out"
          >
            Terms
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-label-md text-on-surface-variant">
          © 2024 ATELIER. GEOMETRY OF FIT.
        </p>
      </div>
    </footer>
  );
}
