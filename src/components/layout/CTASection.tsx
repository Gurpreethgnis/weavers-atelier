import Link from "next/link";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  headline: string;
  subheadline?: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  variant?: "light" | "dark" | "brand";
  className?: string;
}

export function CTASection({
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  variant = "dark",
  className,
}: CTASectionProps) {
  const variantStyles = {
    light: {
      section: "bg-surface-container",
      headline: "text-on-surface",
      subheadline: "text-on-surface-variant",
      primary:
        "bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint",
      secondary:
        "border border-outline text-on-surface hover:bg-surface-container-high",
    },
    dark: {
      section: "bg-inverse-surface",
      headline: "text-inverse-on-surface",
      subheadline: "text-inverse-on-surface/70",
      primary:
        "bg-surface text-on-surface hover:bg-surface-container-high",
      secondary:
        "border border-inverse-on-surface/30 text-inverse-on-surface hover:bg-inverse-on-surface/10",
    },
    brand: {
      section: "bg-surface-container-low",
      headline: "text-on-surface",
      subheadline: "text-on-surface-variant",
      primary:
        "bg-secondary text-on-secondary hover:bg-secondary/90",
      secondary:
        "border border-outline-variant text-on-surface hover:bg-surface-container",
    },
  };

  const styles = variantStyles[variant];

  return (
    <section className={cn("py-block-gap", styles.section, className)}>
      <div className="container-atelier text-center">
        <h2
          className={cn(
            "font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-balance max-w-3xl mx-auto",
            styles.headline
          )}
        >
          {headline}
        </h2>

        {subheadline && (
          <p
            className={cn(
              "mt-4 text-lg md:text-xl max-w-2xl mx-auto",
              styles.subheadline
            )}
          >
            {subheadline}
          </p>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={primaryCta.href}
            className={cn(
              "inline-flex items-center justify-center px-8 py-4 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2",
              styles.primary
            )}
          >
            {primaryCta.label}
          </Link>

          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className={cn(
                "inline-flex items-center justify-center px-8 py-4 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2",
                styles.secondary
              )}
            >
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
