"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";
import {
  staggerContainer,
  staggerItem,
  staggerItemRight,
  staggerItemUp,
} from "@/components/animations/stagger";

const EASE = [0.25, 0.1, 0.25, 1] as const;
// Wix "Thunderbolt" reveal easing (cubic-bezier 0.22, 1, 0.36, 1) — a firm
// ease-out settle that gives reveals their glide-into-place character.
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const VIEWPORT = { once: true, margin: "-80px" } as const;

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  /** Vertical offset (px). Default 0 — text sharpens in place, it doesn't rise. */
  y?: number;
  /** Horizontal offset (px). */
  x?: number;
  /** Start blur in px that sharpens to 0 ("blurIn"). 0 disables it. */
  blur?: number;
  duration?: number;
};

/**
 * Text reveal: fades in while sharpening from a blur ("blurIn") — the brief's
 * text motion (mờ → rõ dần), in place rather than sliding up. Blur is on by
 * default; pass blur={0} to opt a block out.
 */
export function Reveal({
  delay = 0,
  y = 0,
  x = 0,
  blur = 10,
  duration = 1,
  children,
  ...props
}: RevealProps) {
  const reduce = useReducedMotion();
  // MotionConfig handles transform/opacity under reduced motion; filter is not
  // a "motion" property, so drop the blur ourselves to avoid a needless paint.
  const blurFilter = blur > 0 && !reduce;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y,
        x,
        ...(blurFilter ? { filter: `blur(${blur}px)` } : {}),
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        x: 0,
        ...(blurFilter ? { filter: "blur(0px)" } : {}),
      }}
      viewport={VIEWPORT}
      transition={{ duration, ease: EASE_OUT, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// GSAP `back.out(s)` ease-out form, replicated exactly so the per-character
// overshoot matches the brief's `back.out(1.7)` frame-for-frame (s = 1.7).
const BACK_OUT_17 = (p: number) => {
  const s = 1.7;
  p -= 1;
  return p * p * ((s + 1) * p + s) + 1;
};

// Each character flips up from below (rotateX) and fades in. The variant is a
// resolver so every char reads its own global index → delay = index * stagger.
const splitCharVariants: Variants = {
  hidden: { opacity: 0, y: 20, rotateX: -90 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.5, ease: BACK_OUT_17, delay },
  }),
};

/** A run of text in the heading that shares one style (e.g. an emphasized word). */
type Segment = { text: string; className?: string };

type SplitTextProps = {
  /** Heading text as styled runs; concatenated for the accessible label. */
  segments: Segment[];
  className?: string;
  /** Per-character delay step (GSAP `stagger`). */
  stagger?: number;
  /** Delay before the first character flips in (lets it follow other intro blocks). */
  delay?: number;
};

/**
 * Character-by-character heading reveal: each letter flips up with a `back.out`
 * overshoot, staggered in reading order — the brief's SplitText motion, built on
 * Framer Motion. Words stay unbreakable (inline-block) while spaces remain normal
 * text so the line still wraps. Screen readers get the full string via aria-label;
 * the split letters are aria-hidden. Reduced motion renders the styled text as-is.
 */
export function SplitText({
  segments,
  className,
  stagger = 0.02,
  delay = 0,
}: SplitTextProps) {
  const reduce = useReducedMotion();
  const label = segments.map((s) => s.text).join("");

  if (reduce) {
    return (
      <span className={className}>
        {segments.map((s, i) => (
          <span key={i} className={s.className}>
            {s.text}
          </span>
        ))}
      </span>
    );
  }

  // Flatten to per-character (carrying each run's style), then regroup into
  // word/space tokens so words never break mid-letter but lines still wrap.
  type Char = { ch: string; className?: string };
  type Token = { type: "word"; chars: Char[] } | { type: "space" };
  const tokens: Token[] = [];
  let word: Char[] = [];
  for (const seg of segments) {
    for (const ch of seg.text) {
      if (ch === " ") {
        if (word.length) tokens.push({ type: "word", chars: word });
        word = [];
        tokens.push({ type: "space" });
      } else {
        word.push({ ch, className: seg.className });
      }
    }
  }
  if (word.length) tokens.push({ type: "word", chars: word });

  let index = 0;
  return (
    <motion.span
      aria-label={label}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      style={{ display: "inline-block" }}
    >
      {tokens.map((token, ti) =>
        token.type === "space" ? (
          <span key={ti}> </span>
        ) : (
          <span
            key={ti}
            aria-hidden
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {token.chars.map((c, ci) => {
              const charDelay = delay + index++ * stagger;
              return (
                <motion.span
                  key={ci}
                  custom={charDelay}
                  variants={splitCharVariants}
                  className={c.className}
                  style={{ display: "inline-block", transformPerspective: 600 }}
                >
                  {c.ch}
                </motion.span>
              );
            })}
          </span>
        )
      )}
    </motion.span>
  );
}

/** Container that staggers its <StaggerItem> children into view. */
export function Stagger({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      {...props}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = HTMLMotionProps<"div"> & {
  /** Glide in from the right instead of rising — for info cards (Wix glideIn). */
  fromRight?: boolean;
  /** Rise in from below with a longer travel (opacity + y:50) — image cards. */
  rise?: boolean;
};

export function StaggerItem({
  fromRight,
  rise,
  children,
  ...props
}: StaggerItemProps) {
  const variant = fromRight
    ? staggerItemRight
    : rise
      ? staggerItemUp
      : staggerItem;
  return (
    <motion.div variants={variant} {...props}>
      {children}
    </motion.div>
  );
}

/** Fixed reading-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-dsc-brand"
      aria-hidden
    />
  );
}

/** Horizontal line that draws itself in (scaleX 0→1) when scrolled into view. */
export function DrawLine({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      initial={{ scaleX: reduce ? 1 : 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: EASE }}
      className={cn("origin-left", className)}
    />
  );
}

type ParallaxImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  /** Classes for the inner <Image> (object-position, opacity, etc.). */
  imageClassName?: string;
  /** Parallax travel in px across the element's scroll range. */
  speed?: number;
  /** One-shot ken-burns zoom on mount. */
  zoom?: boolean;
};

/**
 * Full-bleed background image with scroll parallax and optional mount zoom.
 * The media layer is oversized (inset -12%) so translation never reveals edges.
 */
export function ParallaxImage({
  src,
  alt,
  priority,
  sizes = "100vw",
  imageClassName,
  speed = 60,
  zoom = false,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);

  return (
    <div ref={ref} aria-hidden={alt === ""} className="absolute inset-0 overflow-hidden">
      <motion.div style={{ y: reduce ? 0 : y }} className="absolute inset-[-12%]">
        <motion.div
          className="relative size-full"
          initial={zoom && !reduce ? { scale: 1.12 } : false}
          animate={zoom && !reduce ? { scale: 1 } : undefined}
          transition={{ duration: 8, ease: "easeOut" }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className={cn("object-cover", imageClassName)}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
