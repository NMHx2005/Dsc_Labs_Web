"use client";

import { useRef } from "react";
import Image from "next/image";
import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";

const CARDS = [
  { title: "Workshop", poster: "/images/inside/workshop.png?v=3" },
  {
    title: "Robotic Experiments",
    poster: "/images/inside/robotic-experiments.png?v=3",
  },
  { title: "Data Collection", poster: "/images/inside/data-collection.png?v=3" },
  {
    title: "Simulation Testing",
    poster: "/images/inside/simulation-testing.png?v=3",
  },
  {
    title: "Partner Demonstrations",
    poster: "/images/inside/partner-demonstrations.png?v=3",
  },
];

function Card({ poster, title }: { poster: string; title: string }) {
  return (
    <div className="group flex h-full flex-col bg-dsc-brand pb-6">
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={poster}
          alt={title}
          fill
          draggable={false}
          sizes="(max-width: 1024px) 100vw, 340px"
          className="pointer-events-none object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col items-center gap-1 px-4 pt-6 text-center text-white">
        <p className="text-base font-semibold uppercase">{title}</p>
        <p className="text-base font-light">Simulation experiments</p>
      </div>
    </div>
  );
}

export function InsideLabs() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Mouse position drives the horizontal scroll: pointer at the left edge shows
  // the first card, at the right edge the last. A spring smooths the travel.
  const x = useMotionValue(0);
  const scrollX = useSpring(x, { stiffness: 55, damping: 22, mass: 0.6 });

  const handleScrollByPointer = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = viewportRef.current;
    if (!el) return;
    const overflow = el.scrollWidth - el.clientWidth;
    if (overflow <= 0) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    x.set(-ratio * overflow);
  };

  return (
    <section
      id="inside"
      className="relative w-full overflow-hidden bg-dsc-b900 py-24 md:py-32"
    >
      {/* Same imagery as the hero, tinted blue (per request). */}
      <Image
        src="/images/hero/hero-bg.png"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover object-top opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-dsc-b900/60 via-dsc-b900/90 to-dsc-b900" />

      <div className="container relative">
        <Reveal className="flex max-w-xl flex-col gap-4">
          <div className="font-expanded leading-[1.1] text-white">
            <p className="text-[2rem] font-semibold md:text-[clamp(1.5rem,2.8vw,2.5rem)]">
              Inside
            </p>
            <p>
              <span className="text-[2rem] font-light md:text-[clamp(2.5rem,5vw,4rem)]">
                DSC
              </span>
              <span className="text-[2rem] font-light md:text-[clamp(1.5rem,2.8vw,2.5rem)]">
                {" "}
                Labs
              </span>
            </p>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-white/70 md:text-base">
            A hands-on environment for robotic experiments, simulation testing,
            data collection, workshops, and partner demonstrations.
          </p>
        </Reveal>

        {/* Mobile / tablet: a plain vertical stack of all five cards. */}
        <Stagger className="mt-12 flex flex-col gap-8 lg:hidden">
          {CARDS.map((card) => (
            <StaggerItem key={card.title} fromRight>
              <Card {...card} />
            </StaggerItem>
          ))}
        </Stagger>

        {/* Desktop: cards fly in one-by-one from the right (like the Partner
            cards), then moving the mouse across the track auto-scrolls it — no
            dragging. The Stagger container doubles as the scroll track; its
            variants only orchestrate entry timing, leaving the x transform free
            for the pointer-driven scroll.
            Bleed the track to the right edge of the viewport (not just the
            container): the negative right margin cancels the container's right
            padding plus its centering gutter at every width. */}
        <div
          ref={viewportRef}
          onMouseMove={handleScrollByPointer}
          className="mt-14 hidden overflow-hidden lg:mr-[calc(50%-50vw)] lg:block"
        >
          <Stagger
            style={{ x: reduce ? x : scrollX }}
            className="flex w-max gap-6"
          >
            {CARDS.map((card) => (
              <StaggerItem
                key={card.title}
                fromRight
                className="w-[clamp(280px,26vw,340px)] shrink-0 select-none"
              >
                <Card {...card} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
