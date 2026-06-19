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
} from "framer-motion";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/components/animations/stagger";

const EASE = [0.25, 0.1, 0.25, 1] as const;
const VIEWPORT = { once: true, margin: "-80px" } as const;

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
};

/** Single element that fades + rises into view once on scroll. */
export function Reveal({ delay = 0, y = 24, children, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE, delay }}
      {...props}
    >
      {children}
    </motion.div>
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

export function StaggerItem({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={staggerItem} {...props}>
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
