"use client";

import { createElement, useRef, type ElementType, type ReactNode } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const finePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ------------------------------------------------------------------ *
 * SplitReveal — GSAP SplitText heading reveal (chars rise + flip in   *
 * a masked word, staggered) on scroll. Replaces the framer SplitText. *
 * ------------------------------------------------------------------ */
export function SplitReveal({
  children,
  as = "h2",
  className,
  start = "top 85%",
  stagger = 0.018,
  delay = 0,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  start?: string;
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduce()) return;
      const split = new SplitText(el, {
        type: "words,chars",
        wordsClass: "split-word",
        charsClass: "split-char",
      });
      const tween = gsap.from(split.chars, {
        yPercent: 110,
        opacity: 0,
        rotateX: -90,
        transformOrigin: "0% 100%",
        ease: "back.out(1.7)",
        duration: 0.6,
        stagger,
        delay,
        scrollTrigger: { trigger: el, start, once: true },
      });
      return () => {
        tween.scrollTrigger?.kill();
        split.revert();
      };
    },
    { scope: ref },
  );

  return createElement(as, { ref, className }, children);
}

/* ------------------------------------------------------------------ *
 * Parallax — moves an element on scroll via ScrollTrigger scrub.      *
 * ------------------------------------------------------------------ */
export function Parallax({
  children,
  className,
  amount = 80,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduce()) return;
      gsap.fromTo(
        el,
        { yPercent: -amount / 10 },
        {
          yPercent: amount / 10,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Counter — counts 0 → `to` when scrolled into view.                  *
 * ------------------------------------------------------------------ */
export function Counter({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const fmt = (v: number) =>
        prefix +
        v.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }) +
        suffix;
      if (reduce()) {
        el.textContent = fmt(to);
        return;
      }
      const obj = { v: 0 };
      el.textContent = fmt(0);
      gsap.to(obj, {
        v: to,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = fmt(obj.v);
        },
      });
    },
    { scope: ref },
  );

  return <span ref={ref} className={className} />;
}

/* ------------------------------------------------------------------ *
 * Magnetic — element eases toward the cursor (gsap.quickTo).          *
 * ------------------------------------------------------------------ */
export function Magnetic({
  children,
  strength = 0.4,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduce() || !finePointer()) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * strength);
        yTo((e.clientY - (r.top + r.height / 2)) * strength);
      };
      const leave = () => {
        xTo(0);
        yTo(0);
      };
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      return () => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      };
    },
    { scope: ref },
  );

  return (
    <div ref={ref} data-cursor="grow" className={cn("inline-block", className)}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * CustomCursor — global dot + trailing ring (gsap.quickTo). Desktop   *
 * fine-pointer only; hides the native cursor while active.            *
 * ------------------------------------------------------------------ */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring || reduce() || !finePointer()) return;

    document.documentElement.classList.add("has-custom-cursor");
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 1 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });

    const move = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const interactive = (e.target as Element)?.closest?.(
        "a, button, [data-cursor]",
      );
      gsap.to(ring, { scale: interactive ? 2.4 : 1, duration: 0.3, ease: "power3" });
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  });

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] size-8 rounded-full border border-white opacity-0 mix-blend-difference"
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] size-1.5 rounded-full bg-white opacity-0 mix-blend-difference"
      />
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Marquee — seamless horizontal loop whose speed + direction react to *
 * scroll velocity (GSAP). Content is duplicated for the seamless wrap. *
 * ------------------------------------------------------------------ */
export function Marquee({
  items,
  reverse = false,
  duration = 26,
  className,
}: {
  items: string[];
  reverse?: boolean;
  duration?: number;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track || reduce()) return;

      const base = reverse ? -1 : 1;
      const tween = gsap.to(track, {
        xPercent: -50,
        duration,
        ease: "none",
        repeat: -1,
      });
      // Forward range is always 0 → -50. The reverse row jumps to the far end
      // and plays backwards (timeScale -1) so the two rows scroll opposite ways.
      // (The old bug set both ends to -50, leaving a zero range → no motion.)
      if (reverse) tween.progress(1);
      tween.timeScale(base);

      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          const v = self.getVelocity();
          if (!v) return;
          const boost = base * (1 + gsap.utils.clamp(0, 6, Math.abs(v) / 400));
          tween.timeScale(v < 0 ? -boost : boost);
          gsap.to(tween, {
            timeScale: base,
            duration: 0.8,
            ease: "power2.out",
            overwrite: true,
          });
        },
      });

      return () => st.kill();
    },
    { scope: trackRef },
  );

  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          {item}
          <span aria-hidden className="mx-8 text-dsc-brand md:mx-12">
            &#9670;
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div aria-hidden className="w-full overflow-hidden">
      <div ref={trackRef} className={cn("flex w-max", className)}>
        {row}
        {row}
      </div>
    </div>
  );
}
