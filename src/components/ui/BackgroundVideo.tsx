"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type BackgroundVideoProps = {
  src: string;
  /** Shown before the video loads and as the still frame under reduced motion. */
  poster?: string;
  className?: string;
};

/** Muted, looping full-bleed background video. Pauses for reduced-motion users. */
export function BackgroundVideo({ src, poster, className }: BackgroundVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
    }
  }, []);

  return (
    <video
      ref={ref}
      aria-hidden
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      className={cn("absolute inset-0 size-full object-cover", className)}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
