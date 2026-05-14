"use client";

import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterPillsProps {
  options: FilterOption[];
  selected: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterPills({
  options,
  selected,
  onChange,
  className,
}: FilterPillsProps) {
  const handleChange = (value: string) => {
    trackEvent("lookbook_filter_click", { filter: value });
    onChange(value);
  };

  return (
    <div
      className={cn("flex flex-wrap gap-2", className)}
      role="group"
      aria-label="Filter options"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => handleChange(option.value)}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2",
            selected === option.value
              ? "bg-inverse-surface text-inverse-on-surface"
              : "bg-surface-container text-on-surface hover:bg-surface-container-high"
          )}
          aria-pressed={selected === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
