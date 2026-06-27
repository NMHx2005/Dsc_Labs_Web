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
    desc: "Establishing the constraints, parameters, and success criteria for the robotic objective.",
    icon: "/images/process/define-task.png",
  },
  {
    n: "02",
    title: "Sim Environment",
    desc: "Building the high-fidelity digital twin where behaviours can be tested safely.",
    icon: "/images/process/sim-environment.png",
  },
  {
    n: "03",
    title: "Collect Data",
    desc: "Generating diverse synthetic datasets across thousands of randomized scenarios.",
    icon: "/images/process/collect-data.png",
  },
  {
    n: "04",
    title: "Train Models",
    desc: "Refining AI behaviour in simulation until policies are robust and reliable.",
    icon: "/images/process/train-models.png",
  },
  {
    n: "05",
    title: "Real Validation",
    desc: "Deploying validated policies to physical hardware and confirming real-world performance.",
    icon: "/images/process/real-validation.png",
  },
];

const ACTIVATE = STEPS.map((_, i) => i / (STEPS.length - 1));

type StepData = (typeof STEPS)[number];

/* ---------- Desktop: pinned stage driven by scroll progress ---------- */

/** The large centre panel for one step; cross-fades as the beam reaches it. */
function StagePanel({
  step,
  index,
  progress,
}: {
  step: StepData;
  index: number;
  progress: MotionValue<number>;
}) {
  const at = ACTIVATE[index];
  const opacity = useTransform(
    progress,
    [at - 0.12, at - 0.03, at + 0.03, at + 0.12],
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, [at - 0.12, at, at + 0.12], [40, 0, -40]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
    >
      <div className="relative mb-6 flex size-20 items-center justify-center">
        <span className="absolute size-24 rounded-full bg-dsc-brand/30 blur-2xl" />
        <Image
          src={step.icon}
          alt=""
          aria-hidden
          width={80}
          height={80}
          className="relative size-20 object-contain"
        />
      </div>
      <span className="font-expanded text-[clamp(4rem,12vw,9rem)] font-extralight leading-none text-white/10">
        {step.n}
      </span>
      <h3 className="-mt-6 font-expanded text-3xl font-semibold uppercase tracking-[0.04em] text-white md:text-4xl">
        {step.title}
      </h3>
      <p className="mt-4 max-w-md text-base leading-relaxed text-dsc-b90">
        {step.desc}
      </p>
    </motion.div>
  );
}

/** Compact node on the timeline rail — lights and holds as the beam passes. */
function RailNode({
  step,
  index,
  progress,
}: {
  step: StepData;
  index: number;
  progress: MotionValue<number>;
}) {
  const at = ACTIVATE[index];
  const lit = useTransform(progress, [at - 0.1, at], [0.3, 1]);
  const diamondScale = useTransform(
    progress,
    [at - 0.05, at, at + 0.06],
    [0.6, 1.4, 1],
  );

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <motion.span
        aria-hidden
        style={{ scale: diamondScale, opacity: lit, rotate: 45 }}
        className="size-3 bg-dsc-brand shadow-[0_0_10px_2px_rgba(20,63,141,0.6)] ring-4 ring-dsc-dark"
      />
      <motion.div style={{ opacity: lit }} className="flex flex-col items-center gap-0.5">
        <span className="font-expanded text-xl font-light text-white">{step.n}</span>
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-dsc-b90">
          {step.title}
        </span>
      </motion.div>
    </div>
  );
}

/* ---------- Mobile: static stacked steps ---------- */

function StepCardMobile({ step }: { step: StepData }) {
  return (
    <Reveal className="flex w-[78vw] shrink-0 snap-center flex-col items-center gap-3 text-center sm:w-[46vw]">
      <div className="relative flex size-14 items-center justify-center">
        <span className="absolute size-16 rounded-full bg-dsc-brand/25 blur-xl" />
        <Image
          src={step.icon}
          alt=""
          aria-hidden
          width={56}
          height={56}
          className="relative size-14 object-contain"
        />
      </div>
      <span aria-hidden className="size-3 rotate-45 bg-dsc-brand shadow-[0_0_10px_2px_rgba(20,63,141,0.6)]" />
      <span className="font-expanded text-5xl font-light leading-none text-white">
        {step.n}
      </span>
      <p className="text-base font-semibold uppercase tracking-[0.04em] text-white">
        {step.title}
      </p>
      <p className="max-w-[15rem] text-sm leading-snug text-dsc-b90">{step.desc}</p>
    </Reveal>
  );
}

export function Workflow() {
  const reduce = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);

  // The section is 3 viewport-heights tall on desktop; an inner panel pins to
  // the screen while progress runs 0→1 across that scroll distance.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
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
      className="relative w-full bg-dsc-dark lg:h-[300vh]"
    >
      {/* Desktop: pinned storytelling stage. */}
      <div className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:overflow-hidden">
        <div className="container">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <h2 className="font-expanded text-[clamp(1.5rem,3vw,2.5rem)] font-semibold leading-[1.12] text-white">
              From <span className="font-light md:text-[1.5em]">Virtual Testing</span> to{" "}
              <span className="font-light md:text-[1.5em]">Real-World</span> Validation
            </h2>
            <p className="text-base leading-relaxed text-dsc-b90">
              Our standardized workflow ensures safety and precision at every
              stage of the robotics lifecycle.
            </p>
          </Reveal>

          <div className="relative mx-auto mt-10 h-[360px] max-w-3xl">
            {STEPS.map((step, i) => (
              <StagePanel key={step.n} step={step} index={i} progress={progress} />
            ))}
          </div>

          {/* Timeline rail: track + scroll-scrubbed fill + comet head. */}
          <div className="relative mt-8">
            <div aria-hidden className="absolute inset-x-[10%] top-[6px] h-px">
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
            <div className="grid grid-cols-5 px-[10%]">
              {STEPS.map((step, i) => (
                <RailNode key={step.n} step={step} index={i} progress={progress} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: heading + swipeable step carousel. */}
      <div className="container py-24 md:py-32 lg:hidden">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2 className="font-expanded text-[2rem] font-semibold leading-[1.12] text-white">
            From <span className="font-light">Virtual Testing</span> to{" "}
            <span className="font-light">Real-World</span> Validation
          </h2>
          <p className="text-sm leading-relaxed text-dsc-b90">
            Our standardized workflow ensures safety and precision at every
            stage of the robotics lifecycle.
          </p>
        </Reveal>

        <ol className="-mx-6 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STEPS.map((step) => (
            <li key={step.n} className="flex">
              <StepCardMobile step={step} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
