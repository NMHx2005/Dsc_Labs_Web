"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Reveal } from "@/components/ui/motion";

const STEPS = [
  {
    n: "01",
    title: "Define Task",
    desc: "Establishing constraints and parameters.",
    icon: "/images/process/define-task.png",
  },
  {
    n: "02",
    title: "Sim Environment",
    desc: "Building the high-fidelity digital twin.",
    icon: "/images/process/sim-environment.png",
  },
  {
    n: "03",
    title: "Collect Data",
    desc: "Generating diverse synthetic datasets.",
    icon: "/images/process/collect-data.png",
  },
  {
    n: "04",
    title: "Train Models",
    desc: "Refining AI behavior in simulation.",
    icon: "/images/process/train-models.png",
  },
  {
    n: "05",
    title: "Real Validation",
    desc: "Deploying to physical hardware.",
    icon: "/images/process/real-validation.png",
  },
];

// The beam head sits at line-fraction `progress`; with five columns evenly
// spanning the 10%–90% line, the head reaches step i exactly at progress i/4.
// Each node lights and pulses as the head passes that point.
const ACTIVATE = STEPS.map((_, i) => i / (STEPS.length - 1));

type StepData = (typeof STEPS)[number];

function ProcessStep({
  step,
  index,
  progress,
  reduce,
}: {
  step: StepData;
  index: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const at = ACTIVATE[index];
  // Dim → lit as the head arrives; a brief overshoot pulses the icon + diamond
  // (scale 1.1 then settle), then the bloom glow flashes and holds faint.
  const litMV = useTransform(progress, [at - 0.12, at], [0.32, 1]);
  const pulseMV = useTransform(progress, [at - 0.06, at, at + 0.06], [1, 1.1, 1]);
  const bloomOpacityMV = useTransform(
    progress,
    [at - 0.06, at, at + 0.14],
    [0, 0.85, 0.18],
  );
  const bloomScaleMV = useTransform(
    progress,
    [at - 0.06, at, at + 0.14],
    [0.6, 1.35, 1],
  );
  const diamondScaleMV = useTransform(
    progress,
    [at - 0.05, at, at + 0.08],
    [0.5, 1.4, 1],
  );

  const lit = reduce ? 1 : litMV;
  const pulse = reduce ? 1 : pulseMV;

  return (
    <li className="flex w-[72vw] shrink-0 snap-center flex-col items-center text-center sm:w-[42vw] lg:w-auto">
      <motion.div style={{ opacity: lit }} className="mb-7">
        <motion.span
          style={{ scale: pulse }}
          className="relative flex size-14 items-center justify-center"
        >
          <motion.span
            aria-hidden
            style={{
              opacity: reduce ? 0.18 : bloomOpacityMV,
              scale: reduce ? 1 : bloomScaleMV,
            }}
            className="absolute size-16 rounded-full bg-dsc-brand blur-2xl"
          />
          <Image
            src={step.icon}
            alt=""
            aria-hidden
            width={56}
            height={56}
            className="relative size-14 object-contain"
          />
        </motion.span>
      </motion.div>

      <div className="relative z-10 mb-7 flex w-full justify-center">
        <motion.span
          aria-hidden
          style={{ scale: reduce ? 1 : diamondScaleMV, opacity: lit, rotate: 45 }}
          className="size-3 bg-dsc-brand shadow-[0_0_10px_2px_rgba(20,63,141,0.6)] ring-4 ring-dsc-dark"
        />
      </div>

      <motion.div
        style={{ opacity: lit }}
        className="flex flex-col items-center gap-2"
      >
        <span className="font-expanded text-6xl font-light leading-none text-white">
          {step.n}
        </span>
        <p className="text-base font-semibold uppercase tracking-[0.04em] text-white">
          {step.title}
        </p>
        <p className="max-w-[15rem] text-base leading-snug text-dsc-b90">
          {step.desc}
        </p>
      </motion.div>
    </li>
  );
}

export function Workflow() {
  const reduce = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-driven timeline: progress runs 0→1 as the section travels from
  // "top at viewport centre" to "bottom at viewport centre" (GSAP start/end).
  // The spring is the scrub smoothing — Framer's analogue of `scrub: 1`.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.4,
  });

  const beamScaleX = reduce ? 1 : progress;
  const cometLeft = useTransform(progress, [0, 1], ["0%", "100%"]);
  const cometOpacity = useTransform(progress, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-dsc-dark py-24 md:py-32"
    >
      <div className="container">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2 className="font-expanded text-[2rem] font-semibold leading-[1.12] text-white md:text-[clamp(1.5rem,3vw,2.5rem)]">
            From{" "}
            <span className="font-light md:text-[1.5em]">Virtual Testing</span> to{" "}
            <span className="font-light md:text-[1.5em]">Real-World</span>{" "}
            Validation
          </h2>
          <p className="text-sm leading-relaxed text-dsc-b90 md:text-base">
            Our standardized workflow ensures safety and precision at every
            stage of the robotics lifecycle.
          </p>
        </Reveal>

        <div className="relative mt-14 md:mt-20">
          {/* Desktop beam — track + scroll-scrubbed fill + comet head, on the
              marker row. scaleX is bound to scroll progress (not a tween). */}
          <div
            aria-hidden
            className="absolute inset-x-[10%] top-[90px] hidden h-px lg:block"
          >
            <div className="absolute inset-0 bg-white/12" />
            <motion.div
              style={{ scaleX: beamScaleX }}
              className="absolute inset-0 origin-left bg-gradient-to-r from-dsc-brand/40 to-dsc-brand shadow-[0_0_10px_1px_rgba(20,63,141,0.6)]"
            />
            {!reduce && (
              <motion.div
                style={{ left: cometLeft, opacity: cometOpacity }}
                className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_16px_6px_rgba(20,63,141,0.95)]"
              />
            )}
          </div>

          {/* Mobile: swipe horizontally (scroll-snap). Desktop: 5-up grid. */}
          <ol className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0">
            {STEPS.map((step, i) => (
              <ProcessStep
                key={step.n}
                step={step}
                index={i}
                progress={progress}
                reduce={reduce}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
