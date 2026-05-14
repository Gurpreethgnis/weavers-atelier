import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  ctaLabel?: string;
  variant?: "default" | "large";
  className?: string;
}

export function CategoryCard({
  title,
  description,
  href,
  imageSrc,
  imageAlt,
  ctaLabel = "Explore",
  variant = "default",
  className,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative block overflow-hidden bg-surface-container",
        variant === "large" ? "aspect-[4/5]" : "aspect-[3/4]",
        className
      )}
    >
      {/* Image */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={
          variant === "large"
            ? "(max-width: 768px) 100vw, 50vw"
            : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        }
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-heading text-xl md:text-2xl font-semibold text-inverse-on-surface">
          {title}
        </h3>
        <p className="mt-2 text-sm text-inverse-on-surface/80 line-clamp-2">
          {description}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-inverse-on-surface group-hover:text-secondary transition-colors">
          {ctaLabel}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
