"use client";

import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Lenis smooth scroll wired into GSAP: Lenis is driven by the gsap ticker and
 * reports every scroll to ScrollTrigger, so all GSAP ScrollTriggers stay in
 * sync with the smoothed scroll position (the standard Lenis + GSAP setup).
 * Only runs on desktop fine-pointer + non-reduced-motion; otherwise ScrollTrigger
 * falls back to native scroll. The MotionConfig keeps the remaining framer-motion
 * animations (InsideLabs) honoring the OS reduced-motion setting.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reduceMotion.matches || !desktopPointer.matches) return;

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 0,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
