import type { Variants } from "framer-motion";

// Snappy ease-out: high initial velocity then settle — the "fast fly-in" feel.
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      // Wide gap so cards arrive one-by-one (lần lượt), not all at once.
      staggerChildren: 0.2,
      delayChildren: 0.05,
    },
  },
};

/** Default item: fades + rises into view (lists, steps). */
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASE_OUT,
    },
  },
};

/** Image-card item: rises from below as it scrolls into view (vertical stacks). */
export const staggerItemUp: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE_OUT,
    },
  },
};

/**
 * Info-card item: shoots in fast from the far right edge (off-screen), one
 * after another. x is element-relative so each card starts well off to the
 * right; <main> clips the overflow so no horizontal scrollbar appears.
 */
export const staggerItemRight: Variants = {
  hidden: {
    opacity: 0,
    x: "180%",
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: EASE_OUT,
    },
  },
};
