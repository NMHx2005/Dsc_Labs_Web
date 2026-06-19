import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";

const PARTNERS = [
  {
    title: "Startups",
    desc: "Accelerate path to market with simulation-first validation.",
  },
  {
    title: "Research",
    desc: "Bridging academic theory with industrial-grade deployment.",
  },
  {
    title: "Industry",
    desc: "Standardizing automation tools for global enterprise scale.",
  },
  {
    title: "Ecosystem",
    desc: "Fostering open collaboration for robotic interoperability.",
  },
];

// Square panel with a chamfered bottom-left corner (Figma "Rectangle 6").
const CUT_CORNER = {
  clipPath: "polygon(0 0, 100% 0, 100% 100%, 26px 100%, 0 calc(100% - 30px))",
};

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
          <Reveal className="flex max-w-[531px] flex-col gap-5">
            <p className="text-2xl uppercase text-dsc-b100">
              Global Ecosystem
            </p>
            <h2 className="font-expanded text-[clamp(2rem,4.5vw,4rem)] font-light uppercase leading-[1.05] text-white">
              <span className="whitespace-nowrap">
                Partner{" "}
                <span className="font-semibold md:text-[0.625em]">With</span>
              </span>{" "}
              <span className="whitespace-nowrap">DSC Labs</span>
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-dsc-b90 md:text-base">
              We collaborate with robotics startups, AI teams, universities,
              research groups, hardware companies, automation partners, and
              education organizations to test and develop practical robotics
              solutions.
            </p>
          </Reveal>

          <Stagger className="grid w-full max-w-[393px] grid-cols-2 gap-x-[21px] gap-y-[15px] lg:shrink-0">
            {PARTNERS.map((partner) => (
              <StaggerItem key={partner.title} fromRight>
                <div
                  style={CUT_CORNER}
                  className="flex aspect-square flex-col justify-start gap-3 bg-[#141B2F] p-6 transition-colors duration-300 hover:bg-[#1a2440]"
                >
                  <p className="text-base font-semibold text-white">
                    {partner.title}
                  </p>
                  <div className="h-px w-full bg-white/15" />
                  <p className="text-sm leading-snug text-dsc-b90 sm:text-base">
                    {partner.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
