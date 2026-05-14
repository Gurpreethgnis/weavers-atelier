import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  headline: string;
  subheadline?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
  backgroundImage?: string;
  overlay?: boolean;
  alignment?: "left" | "center";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function PageHero({
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  backgroundImage,
  overlay = true,
  alignment = "center",
  size = "lg",
  className,
}: PageHeroProps) {
  const sizeStyles = {
    sm: "py-16 md:py-20",
    md: "py-20 md:py-28",
    lg: "py-28 md:py-36 lg:py-44",
    xl: "py-36 md:py-48 lg:py-56",
  };

  const alignmentStyles = {
    left: "text-left items-start",
    center: "text-center items-center",
  };

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        backgroundImage ? "text-on-surface" : "bg-surface text-on-surface",
        sizeStyles[size],
        className
      )}
    >
      {/* Background Image */}
      {backgroundImage && (
        <>
          <Image
            src={backgroundImage}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {overlay && (
            <div
              className="absolute inset-0 bg-inverse-surface/60"
              aria-hidden="true"
            />
          )}
        </>
      )}

      {/* Content */}
      <div
        className={cn(
          "relative container-atelier flex flex-col gap-6",
          alignmentStyles[alignment]
        )}
      >
        <h1
          className={cn(
            "font-heading font-semibold tracking-tight text-balance",
            "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
            backgroundImage && "text-surface",
            alignment === "center" && "max-w-4xl mx-auto"
          )}
        >
          {headline}
        </h1>

        {subheadline && (
          <p
            className={cn(
              "text-lg md:text-xl lg:text-2xl",
              backgroundImage ? "text-surface/90" : "text-on-surface-variant",
              alignment === "center" && "max-w-2xl mx-auto"
            )}
          >
            {subheadline}
          </p>
        )}

        {/* CTAs */}
        {(primaryCta || secondaryCta) && (
          <div
            className={cn(
              "flex flex-col sm:flex-row gap-4 mt-4",
              alignment === "center" && "justify-center"
            )}
          >
            {primaryCta && (
              <Link
                href={primaryCta.href}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium bg-inverse-surface text-inverse-on-surface hover:bg-surface-tint transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
              >
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className={cn(
                  "inline-flex items-center justify-center px-8 py-4 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2",
                  backgroundImage
                    ? "bg-surface/10 text-surface border border-surface/30 hover:bg-surface/20"
                    : "bg-inverse-surface text-inverse-on-surface hover:bg-surface-bright"
                )}
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
