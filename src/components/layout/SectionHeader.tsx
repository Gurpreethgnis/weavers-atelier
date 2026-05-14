import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  linkText?: string;
  linkHref?: string;
  alignment?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  linkText,
  linkHref,
  alignment = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 md:mb-12",
        alignment === "center" && "text-center",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-4",
          alignment === "center"
            ? "items-center"
            : "md:flex-row md:items-end md:justify-between"
        )}
      >
        <div>
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-on-surface text-balance">
            {title}
          </h2>
          {subtitle && (
            <p
              className={cn(
                "mt-3 text-base md:text-lg text-on-surface-variant",
                alignment === "center" && "max-w-2xl mx-auto"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>

        {linkText && linkHref && (
          <Link
            href={linkHref}
            className={cn(
              "inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors group",
              alignment === "center" && "mt-2"
            )}
          >
            {linkText}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        )}
      </div>
    </div>
  );
}
