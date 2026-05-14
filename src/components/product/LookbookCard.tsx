"use client";

import Image from "next/image";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { VideoFrame } from "@/components/layout/VideoFrame";

type LookbookCardVariant = "default" | "tall" | "wide";

interface LookbookCardProps {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  instagramUrl?: string;
  startingPrice: string;
  tags: string[];
  /** Optional video slug — when set, overlays a hover-play video on the card */
  videoSlug?: string;
  /** Layout variant: default (3:4), tall (2:3), wide (4:3) */
  variant?: LookbookCardVariant;
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const variantAspects: Record<LookbookCardVariant, string> = {
  default: "aspect-[3/4]",
  tall: "aspect-[2/3]",
  wide: "aspect-[4/3]",
};

export function LookbookCard({
  id,
  title,
  imageUrl,
  instagramUrl,
  startingPrice,
  tags,
  videoSlug,
  variant = "default",
}: LookbookCardProps) {
  const aspectClass = variantAspects[variant];
  const handleRecreateClick = () => {
    trackEvent("recreate_look_click", { look_id: id, title });
  };

  return (
    <article className="group">
      {/* Image Container */}
      <div className={`relative ${aspectClass} bg-surface-container border border-outline-variant overflow-hidden mb-4`}>
        {/* Static poster image */}
        <Image
          src={imageUrl}
          alt={`${title} — Weavers Atelier custom menswear look`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />

        {/* Hover video overlay when videoSlug is provided */}
        {videoSlug && (
          <div className="absolute inset-0 z-[5] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <VideoFrame
              mp4Src={`/videos/${videoSlug}/${videoSlug}.mp4`}
              webmSrc={`/videos/${videoSlug}/${videoSlug}.webm`}
              poster={`/videos/${videoSlug}/${videoSlug}-poster.jpg`}
              label={`${title} video preview`}
              aspect={aspectClass}
              className="w-full h-full border-0"
              mode="hover"
            />
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-surface/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 p-6">
          <Link
            href={`/book-consultation?type=instagram_recreate&ref=${id}`}
            onClick={handleRecreateClick}
            className="bg-inverse-surface text-inverse-on-surface text-label-caps px-6 py-3 tracking-widest hover:bg-surface-tint hover:text-on-surface transition-colors duration-300"
          >
            Recreate This Look
          </Link>
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-body-md text-on-surface-variant hover:text-secondary transition-colors duration-300"
            >
              <InstagramIcon className="h-4 w-4" />
              View on Instagram
            </a>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-body-lg text-on-surface font-medium">{title}</h3>
          <span className="text-body-md text-secondary">{startingPrice}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-label-caps text-on-surface-variant/70 lowercase"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
