"use client";

import { useRef } from "react";
import Image from "next/image";
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
            cards), then the track is draggable. The Stagger container doubles as
            the drag track — its variants only orchestrate timing, so they don't
            touch the drag transform. The track is wider than the viewport;
            framer constrains the drag to the viewport bounds. */}
        <div ref={viewportRef} className="mt-14 hidden overflow-hidden lg:block">
          <Stagger
            drag="x"
            dragConstraints={viewportRef}
            dragElastic={0.08}
            className="flex w-max cursor-grab gap-6 active:cursor-grabbing"
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
