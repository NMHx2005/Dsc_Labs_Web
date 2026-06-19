import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";

const CARDS = [
  { title: "Workshop", poster: "/images/inside/workshop.png?v=2" },
  {
    title: "Robotic Experiments",
    poster: "/images/inside/robotic-experiments.png?v=2",
  },
  { title: "Data Collection", poster: "/images/inside/data-collection.png?v=2" },
];

export function InsideLabs() {
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
      {/* Deep navy wash (no blue tint) so the backdrop reads dark, not purple. */}
      <div className="absolute inset-0 bg-gradient-to-b from-dsc-b900/60 via-dsc-b900/90 to-dsc-b900" />

      <div className="container relative">
        <Reveal className="flex max-w-xl flex-col gap-4">
          <div className="font-expanded leading-[1.1] text-white">
            <p className="text-[clamp(1.5rem,2.8vw,2.5rem)] font-semibold">
              Inside
            </p>
            <p>
              <span className="text-[clamp(2.5rem,5vw,4rem)] font-light">
                DSC
              </span>
              <span className="text-[clamp(1.5rem,2.8vw,2.5rem)] font-light">
                {" "}
                Labs
              </span>
            </p>
          </div>
          <p className="max-w-md text-base leading-relaxed text-white/70">
            A hands-on environment for robotic experiments, simulation testing,
            data collection, workshops, and partner demonstrations.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-8 md:grid-cols-3">
          {CARDS.map((card) => (
            <StaggerItem key={card.title}>
              <div className="group flex flex-col items-center gap-6 bg-dsc-brand pb-6">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={card.poster}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col items-center gap-1 text-center text-white">
                  <p className="text-base font-semibold uppercase">
                    {card.title}
                  </p>
                  <p className="text-base font-light">Simulation experiments</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
