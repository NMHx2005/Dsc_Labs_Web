"use client";

import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { SplitReveal, Counter } from "@/components/ui/gsap-effects";
import { useVanillaTilt } from "@/hooks/useVanillaTilt";

const PARTNERS = [
  {
    title: "Startups",
    desc: "Accelerate path to market with simulation-first validation.",
    metric: { to: 40, suffix: "%", label: "Faster to market" },
  },
  {
    title: "Research",
    desc: "Bridging academic theory with industrial-grade deployment.",
    metric: { to: 3, suffix: "x", label: "Faster validation" },
  },
  {
    title: "Industry",
    desc: "Standardizing automation tools for global enterprise scale.",
    metric: { to: 120, suffix: "+", label: "Global deployments" },
  },
  {
    title: "Ecosystem",
    desc: "Fostering open collaboration for robotic interoperability.",
    metric: { to: 50, suffix: "+", label: "Partner integrations" },
  },
];

type Partner = (typeof PARTNERS)[number];

// Square panel with a chamfered bottom-left corner (Figma "Rectangle 6").
const CUT_CORNER = {
  clipPath: "polygon(0 0, 100% 0, 100% 100%, 26px 100%, 0 calc(100% - 30px))",
};

// Each panel tilts in 3D toward the cursor (capped at 10°) and eases back on
// mouse-leave (vanilla-tilt). The metric counts up when scrolled into view.
function PartnerCard({ title, desc, metric }: Partner) {
  const tiltRef = useVanillaTilt<HTMLDivElement>({
    max: 10,
    easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  });

  return (
    <StaggerItem fromRight>
      <div ref={tiltRef} data-cursor="grow">
        <div
          style={CUT_CORNER}
          className="flex min-h-[238px] flex-col gap-2.5 bg-[#141B2F] p-5 transition-colors duration-300 hover:bg-[#1a2440]"
        >
          <p className="text-base font-semibold text-white">{title}</p>
          <div className="h-px w-full bg-white/15" />
          <p className="text-sm leading-snug text-dsc-b90">{desc}</p>
          <div className="mt-auto pt-3">
            <Counter
              to={metric.to}
              suffix={metric.suffix}
              className="font-expanded text-2xl font-light text-white sm:text-3xl"
            />
            <p className="text-xs uppercase tracking-[0.12em] text-dsc-b90">
              {metric.label}
            </p>
          </div>
        </div>
      </div>
    </StaggerItem>
  );
}

export function Partner() {
  return (
    <section
      id="partners"
      className="relative w-full overflow-hidden bg-dsc-dark py-24 lg:py-0"
    >
      <Image
        src="/images/partner/bg.png"
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="object-cover"
      />
      {/* Neutral dark wash (not navy/purple). */}
      <div className="absolute inset-0 bg-dsc-dark/55" />

      <div className="container relative flex min-h-[520px] items-center lg:min-h-[800px]">
        <div className="flex w-full flex-col gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="flex max-w-[531px] flex-col gap-5">
            <Reveal>
              <p className="text-2xl uppercase text-dsc-b100">Global Ecosystem</p>
            </Reveal>
            <SplitReveal
              as="h2"
              className="font-expanded text-[clamp(2rem,4.5vw,4rem)] font-light uppercase leading-[1.05] text-white"
            >
              <span className="whitespace-nowrap">
                Partner{" "}
                <span className="font-semibold md:text-[0.625em]">With</span>
              </span>{" "}
              <span className="whitespace-nowrap">DSC Labs</span>
            </SplitReveal>
            <Reveal delay={0.05}>
              <p className="max-w-md text-sm leading-relaxed text-dsc-b90 md:text-base">
                We collaborate with robotics startups, AI teams, universities,
                research groups, hardware companies, automation partners, and
                education organizations to test and develop practical robotics
                solutions.
              </p>
            </Reveal>
          </div>

          <Stagger className="grid w-full max-w-[393px] grid-cols-2 gap-x-[21px] gap-y-[15px] lg:shrink-0">
            {PARTNERS.map((partner) => (
              <PartnerCard key={partner.title} {...partner} />
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
