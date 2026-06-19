import Image from "next/image";
import { Reveal, Stagger, StaggerItem, DrawLine } from "@/components/ui/motion";

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

export function Workflow() {
  return (
    <section id="process" className="w-full bg-dsc-dark py-24 md:py-32">
      <div className="container">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2 className="font-expanded text-[clamp(1.5rem,3vw,2.5rem)] font-semibold leading-[1.12] text-white">
            From <span className="text-[1.5em] font-light">Virtual Testing</span>{" "}
            to <span className="text-[1.5em] font-light">Real-World</span>{" "}
            Validation
          </h2>
          <p className="text-base leading-relaxed text-dsc-b90">
            Our standardized workflow ensures safety and precision at every
            stage of the robotics lifecycle.
          </p>
        </Reveal>

        {/* Mobile keeps the row and scrolls horizontally; desktop fits 5-up. */}
        <div className="mt-20 overflow-x-auto pb-2">
          <div className="relative min-w-[1040px] lg:min-w-0">
            <DrawLine className="absolute inset-x-[10%] top-[91px] h-px bg-white/15" />
            <Stagger className="grid grid-cols-5 gap-x-6">
            {STEPS.map((step) => (
              <StaggerItem
                key={step.n}
                className="flex flex-col items-center gap-6 text-center"
              >
                <Image
                  src={step.icon}
                  alt=""
                  aria-hidden
                  width={60}
                  height={60}
                  className="size-[60px] object-contain"
                />
                <span className="size-3.5 rotate-45 bg-dsc-b100 ring-4 ring-dsc-dark" />
                <div className="flex flex-col items-center gap-2">
                  <p className="text-3xl font-semibold tracking-tight text-white">
                    {step.n}
                  </p>
                  <p className="text-base font-medium text-white">
                    {step.title}
                  </p>
                  <p className="max-w-[16rem] text-base leading-snug text-dsc-b90">
                    {step.desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
