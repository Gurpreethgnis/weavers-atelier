import { Ruler, Truck, RefreshCw, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const trustItems = [
  {
    icon: Ruler,
    label: "Custom Fit",
    description: "Made to your measurements",
  },
  {
    icon: Truck,
    label: "Worldwide Delivery",
    description: "Safe shipping globally",
  },
  {
    icon: RefreshCw,
    label: "Free Alterations",
    description: "Perfect fit guaranteed",
  },
  {
    icon: MessageCircle,
    label: "Expert Support",
    description: "Personal styling help",
  },
];

interface TrustChipsProps {
  variant?: "light" | "dark";
  size?: "sm" | "md";
  className?: string;
}

export function TrustChips({
  variant = "light",
  size = "md",
  className,
}: TrustChipsProps) {
  const variantStyles = {
    light: {
      container: "bg-surface-container",
      icon: "text-secondary",
      label: "text-on-surface",
      description: "text-on-surface-variant",
    },
    dark: {
      container: "bg-surface-container-low",
      icon: "text-secondary",
      label: "text-on-surface",
      description: "text-on-surface-variant",
    },
  };

  const sizeStyles = {
    sm: {
      padding: "py-8",
      gap: "gap-6",
      icon: "h-5 w-5",
      label: "text-sm",
      description: "text-xs",
    },
    md: {
      padding: "py-12",
      gap: "gap-8",
      icon: "h-6 w-6",
      label: "text-base",
      description: "text-sm",
    },
  };

  const styles = variantStyles[variant];
  const sizes = sizeStyles[size];

  return (
    <section className={cn(sizes.padding, styles.container, className)}>
      <div className="container-premium">
        <div
          className={cn(
            "grid grid-cols-2 lg:grid-cols-4",
            sizes.gap
          )}
        >
          {trustItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center text-center">
              <item.icon
                className={cn(sizes.icon, styles.icon)}
                aria-hidden="true"
              />
              <span className={cn("mt-2 font-medium", sizes.label, styles.label)}>
                {item.label}
              </span>
              <span className={cn("mt-1", sizes.description, styles.description)}>
                {item.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
