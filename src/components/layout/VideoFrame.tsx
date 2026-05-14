"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface VideoFrameProps {
  /** Public path to the .mp4 (e.g. /videos/home-hero/home-hero.mp4) */
  mp4Src: string;
  /** Public path to the .webm variant (preferred where supported) */
  webmSrc?: string;
  /** Public path to the poster JPG used before video loads and as reduced-motion fallback */
  poster: string;
  /** Required descriptive label for the visual — used as aria-label and fallback alt text */
  label: string;
  /** Tailwind aspect class. Defaults to a portrait hero shape. */
  aspect?: string;
  className?: string;
  /**
   * Behavior on the page:
   *   - 'ambient' (default): autoplay, muted, loop, no controls. For decorative use.
   *   - 'hover':  play on hover only. Useful in lookbook grids.
   *   - 'inview': autoplay only when in viewport, pause when out. For long pages.
   */
  mode?: "ambient" | "hover" | "inview";
}

/**
 * Decorative video frame that follows the same editorial framing as HeroImage.
 *
 * Key behaviors:
 *   - Respects `prefers-reduced-motion`: renders the poster image only.
 *   - Always muted + playsInline so autoplay works on iOS/Safari.
 *   - In 'inview' mode, uses IntersectionObserver to avoid burning CPU
 *     decoding video that isn't visible.
 *   - Falls back to the poster if the source fails to load.
 *
 * This is intentionally NOT a generic <video> wrapper — it's tailored to the
 * ambient/decorative use case that fits a premium editorial site. If we ever
 * need a real "play a video with sound" experience, that's a different
 * component.
 */
export function VideoFrame({
  mp4Src,
  webmSrc,
  poster,
  label,
  aspect = "aspect-[4/5] md:aspect-[4/3]",
  className = "",
  mode = "ambient",
}: VideoFrameProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion || failed) return;
    if (mode !== "inview") return;
    const el = containerRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mode, reducedMotion, failed]);

  const handleMouseEnter = () => {
    if (mode !== "hover" || reducedMotion || failed) return;
    videoRef.current?.play().catch(() => {});
  };
  const handleMouseLeave = () => {
    if (mode !== "hover") return;
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  if (reducedMotion || failed) {
    return (
      <div
        className={`relative ${aspect} bg-surface-container border border-outline-variant overflow-hidden ${className}`}
        aria-label={label}
      >
        <Image
          src={poster}
          alt={label}
          fill
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${aspect} bg-surface-container border border-outline-variant overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={label}
    >
      <video
        ref={videoRef}
        poster={poster}
        autoPlay={mode === "ambient"}
        loop
        muted
        playsInline
        preload={mode === "ambient" ? "auto" : "metadata"}
        className="w-full h-full object-cover"
        onError={() => setFailed(true)}
      >
        {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
        <source src={mp4Src} type="video/mp4" />
      </video>
    </div>
  );
}
