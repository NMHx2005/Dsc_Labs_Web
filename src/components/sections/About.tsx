import { Fragment } from "react";
import { Reveal, SplitText, Stagger, StaggerItem } from "@/components/ui/motion";
import { MarkerFive } from "@/components/ui/MarkerFive";
import { BackgroundVideo } from "@/components/ui/BackgroundVideo";

const CAPABILITIES = [
  { label: "Robotic simulation", detail: "High-fidelity physics for safe, fast iteration." },
  { label: "Data-centric robotics", detail: "Synthetic and real datasets generated at scale." },
  { label: "Industry collaboration", detail: "Co-developing with hardware and automation partners." },
  { label: "Sim-to-real transfer", detail: "Policies that survive the reality gap." },
  { label: "Applied AI testing", detail: "Benchmarking models on real robotic tasks." },
];

export function About() {
  return (
    // Dark section padding below the video frame forms a 160px gap (like Hero).
    <section id="about" className="relative w-full bg-dsc-dark md:pb-[160px]">
      <div className="relative flex min-h-[600px] items-center overflow-hidden md:min-h-[700px]">
        <BackgroundVideo
          src="/video/about.mp4"
          poster="/images/about/tech-bg.png"
        />
        {/* Gradient scrim sits under the copy (per Figma note), video at right. */}
        <div className="absolute inset-0 scrim-x" />
        <div className="absolute inset-0 bg-dsc-dark/60 lg:hidden" />

        <div className="container relative py-24 md:py-32">
          <div className="flex max-w-xl flex-col gap-8">
            <h2 className="font-expanded text-[clamp(1.875rem,3.4vw,2.75rem)] font-light leading-[1.15] text-white">
              <SplitText
                segments={[
                  { text: "A " },
                  { text: "Robotics", className: "text-[1.45em] font-medium" },
                  { text: " Lab for " },
                  {
                    text: "Simulation, Data, and Real-World",
                    className: "font-extralight text-dsc-b90",
                  },
                  { text: " Intelligence" },
                ]}
              />
            </h2>

            <div className="flex flex-col gap-[21px]">
              <Reveal delay={0.05}>
                <p className="max-w-md text-base leading-relaxed text-dsc-b90">
                  DSC Labs is an applied robotics lab focused on helping robotic
                  systems learn, test, and improve before real-world deployment.
                  We work across robotic simulation, data collection, synthetic
                  data, AI model evaluation, and sim-to-real validation.
                </p>
              </Reveal>

              {/* Capability list — hover a row to reveal its one-line detail. */}
              <Stagger className="flex w-full max-w-[280px] flex-col items-start gap-2 px-6 lg:px-16">
                {CAPABILITIES.map(({ label, detail }, i) => (
                  <Fragment key={label}>
                    <StaggerItem className="group w-full cursor-default">
                      <div className="flex items-center gap-1.5 transition-transform duration-300 group-hover:translate-x-1">
                        <MarkerFive className="size-4 text-white transition-colors duration-300 group-hover:text-dsc-brand" />
                        <span className="whitespace-nowrap text-base text-white">
                          {label}
                        </span>
                      </div>
                      <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 group-hover:grid-rows-[1fr] group-hover:opacity-100">
                        <span className="overflow-hidden pl-[22px] pt-1 text-sm leading-snug text-dsc-b90">
                          {detail}
                        </span>
                      </div>
                    </StaggerItem>
                    {i < CAPABILITIES.length - 1 && (
                      <div className="h-px w-full bg-white/20" />
                    )}
                  </Fragment>
                ))}
              </Stagger>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
