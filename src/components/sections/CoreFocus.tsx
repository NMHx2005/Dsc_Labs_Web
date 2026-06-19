import Image from "next/image";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";

const FOCUS_AREAS = [
  {
    title: "Robotic Simulation",
    desc: "Build virtual environments to test robot behavior safely and repeatedly without hardware wear.",
    img: "/images/focus/simulation.png?v=2",
  },
  {
    title: "Sim-to-Real Transfer",
    desc: "Improve how robots transfer learning from simulation to noisy, unpredictable real-world conditions.",
    img: "/images/focus/sim-to-real.png?v=2",
  },
  {
    title: "Robotics Data Pipeline",
    desc: "Collect, process, label, and evaluate complex robotic data from sensors and telemetry.",
    img: "/images/focus/data-pipeline.png?v=2",
  },
  {
    title: "Synthetic Data",
    desc: "Generate scalable training and testing data for perception and autonomous decision-making.",
    img: "/images/focus/synthetic-data.png?v=2",
  },
  {
    title: "Robot Evaluation",
    desc: "Benchmark performance, reliability, and edge failure cases before enterprise deployment.",
    img: "/images/focus/evaluation.png?v=2",
  },
  {
    title: "Partner Experimentation",
    desc: "Collaborate with startups and research teams on high-impact applied robotics projects.",
    img: "/images/focus/partner.png?v=2",
  },
];

export function CoreFocus() {
  return (
    <section id="work" className="w-full bg-white py-24 md:py-32">
      <div className="container">
        <Reveal>
          <h2 className="font-expanded text-center text-[clamp(2rem,4vw,3.5rem)] font-light leading-tight text-dsc-b800">
            CORE{" "}
            <span className="text-[0.62em] font-semibold">FOCUS AREAS</span>
          </h2>
        </Reveal>

        <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FOCUS_AREAS.map((area) => (
            <StaggerItem key={area.title}>
              <article className="group flex h-full flex-col gap-2 bg-white">
                <div className="relative aspect-[37/21] w-full overflow-hidden">
                  <Image
                    src={area.img}
                    alt={area.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-2 p-6">
                  <h3 className="text-base font-semibold uppercase text-dsc-b800">
                    {area.title}
                  </h3>
                  <p className="text-base leading-snug text-dsc-b90">
                    {area.desc}
                  </p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
