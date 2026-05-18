import Link from "next/link";

export function SiteFooter() {
  const groups = [
    {
      title: "Shop",
      links: [
        { label: "Shirts", href: "/shop/shirts" },
        { label: "Trousers", href: "/shop/trousers" },
        { label: "Denim", href: "/shop/denim" },
        { label: "Lookbook", href: "/lookbook" },
      ],
    },
    {
      title: "Atelier",
      links: [
        { label: "Weddingwear", href: "/weddingwear" },
        { label: "Statement Pieces", href: "/statement-pieces" },
        { label: "How It Works", href: "/how-it-works" },
        { label: "Fit Guide", href: "/fit-guide" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Contact", href: "/contact" },
        { label: "FAQ", href: "/faq" },
        { label: "Delivery", href: "/delivery" },
        { label: "Returns & Alterations", href: "/returns-alterations" },
        { label: "Track Order", href: "/track-order" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="bg-surface-container-lowest w-full border-t border-outline-variant/20">
      <div className="w-full max-w-[1440px] mx-auto py-16 px-4 md:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-headline-md tracking-widest text-secondary">
              WEAVERS ATELIER
            </span>
          </Link>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            {groups.map((group) => (
              <div key={group.title}>
                <h3 className="text-label-caps text-secondary mb-3">{group.title}</h3>
                <nav className="flex flex-col gap-2" aria-label={`${group.title} links`}>
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>

        <p className="text-label-md text-on-surface-variant mt-10">
          © 2024 ATELIER. GEOMETRY OF FIT.
        </p>
      </div>
    </footer>
  );
}
