"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
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

// One beam sweeps the whole line over SWEEP seconds; node i lights as the head
// reaches it (delay = OFFSET + i * STEP_DELAY), so flashes stay in sync.
const SWEEP = 1.6;
const OFFSET = 0.1;
const STEP_DELAY = SWEEP / (STEPS.length - 1);

export function Workflow() {
  const reduce = useReducedMotion() ?? false;

  const beamX: Variants = {
    hidden: { scaleX: reduce ? 1 : 0 },
    visible: { scaleX: 1, transition: { duration: SWEEP, ease: "linear" } },
  };
  const cometX: Variants = {
    hidden: { left: "0%", opacity: 0 },
    visible: reduce
      ? { opacity: 0 }
      : {
          left: ["0%", "100%"],
          opacity: [0, 1, 1, 0],
          transition: { duration: SWEEP, ease: "linear", times: [0, 0.05, 0.95, 1] },
        },
  };

  // Node parts: dark → flash bright (bloom) → settle to a maintained lit state.
  const lit: Variants = {
    hidden: { opacity: reduce ? 1 : 0.32 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: reduce ? 0 : OFFSET + i * STEP_DELAY,
      },
    }),
  };
  const bloom: Variants = {
    hidden: { opacity: 0, scale: 0.6 },
    visible: (i: number) => ({
      opacity: reduce ? 0.18 : [0, 0.85, 0.18],
      scale: reduce ? 1 : [0.6, 1.35, 1],
      transition: {
        duration: 0.8,
        times: [0, 0.32, 1],
        ease: "easeOut",
        delay: reduce ? 0 : OFFSET + i * STEP_DELAY,
      },
    }),
  };
  const diamond: Variants = {
    hidden: { scale: reduce ? 1 : 0.5, opacity: reduce ? 1 : 0.4, rotate: 45 },
    visible: (i: number) => ({
      scale: reduce ? 1 : [0.5, 1.4, 1],
      opacity: 1,
      rotate: 45,
      transition: {
        duration: 0.7,
        times: [0, 0.34, 1],
        ease: "easeOut",
        delay: reduce ? 0 : OFFSET + i * STEP_DELAY,
      },
    }),
  };

  return (
    <section
      id="process"
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

        <motion.div
          className="relative mt-14 md:mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Desktop beam — track + sweeping fill + comet head, on the marker row. */}
          <div
            aria-hidden
            className="absolute inset-x-[10%] top-[90px] hidden h-px lg:block"
          >
            <div className="absolute inset-0 bg-white/12" />
            <motion.div
              variants={beamX}
              className="absolute inset-0 origin-left bg-gradient-to-r from-dsc-brand/40 to-dsc-brand shadow-[0_0_10px_1px_rgba(20,63,141,0.6)]"
            />
            <motion.div
              variants={cometX}
              className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_16px_6px_rgba(20,63,141,0.95)]"
            />
          </div>

          {/* Mobile: swipe horizontally (scroll-snap). Desktop: 5-up grid. */}
          <ol className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0">
            {STEPS.map((step, i) => (
              <li
                key={step.n}
                className="flex w-[72vw] shrink-0 snap-center flex-col items-center text-center sm:w-[42vw] lg:w-auto"
              >
                <motion.div variants={lit} custom={i} className="mb-7">
                  <span className="relative flex size-14 items-center justify-center">
                    <motion.span
                      variants={bloom}
                      custom={i}
                      aria-hidden
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
                  </span>
                </motion.div>

                <div className="relative z-10 mb-7 flex w-full justify-center">
                  <motion.span
                    variants={diamond}
                    custom={i}
                    aria-hidden
                    className="size-3 bg-dsc-brand shadow-[0_0_10px_2px_rgba(20,63,141,0.6)] ring-4 ring-dsc-dark"
                  />
                </div>

                <motion.div
                  variants={lit}
                  custom={i}
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
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
