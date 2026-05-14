"use client";

import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type WhatsAppContext =
  | "general"
  | "custom_shirt"
  | "denim"
  | "weddingwear"
  | "instagram_look"
  | "trousers"
  | "statement_piece"
  | "measurement_help";

interface WhatsAppButtonProps {
  context?: WhatsAppContext;
  customMessage?: string;
  label?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
}

export function WhatsAppButton({
  context = "general",
  customMessage,
  label = "Chat on WhatsApp",
  variant = "default",
  size = "md",
  className,
  showIcon = true,
}: WhatsAppButtonProps) {
  const url = getWhatsAppUrl(context, customMessage);

  const handleClick = () => {
    trackEvent("whatsapp_click", { context });
  };

  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2";

  const variantStyles = {
    default: "bg-[#25D366] text-white hover:bg-[#20BA5C]",
    outline: "border border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10",
    ghost: "text-[#25D366] hover:bg-[#25D366]/10",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      aria-label={`${label} - Opens in new window`}
    >
      {showIcon && <MessageCircle className="h-5 w-5" aria-hidden="true" />}
      {label}
    </a>
  );
}
