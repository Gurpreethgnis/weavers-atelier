import Image from "next/image";

interface HeroImageProps {
  src: string;
  alt: string;
  aspect?: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

/**
 * Editorial hero image frame for category/page heros.
 * Uses the atelier-style framed look (surface-container + outline-variant border)
 * and a Next.js Image for responsive optimization.
 */
export function HeroImage({
  src,
  alt,
  aspect = "aspect-[4/5] md:aspect-[4/3]",
  priority = false,
  className = "",
  sizes = "(min-width: 768px) 55vw, 100vw",
}: HeroImageProps) {
  return (
    <div
      className={`relative ${aspect} bg-surface-container border border-outline-variant overflow-hidden ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}
