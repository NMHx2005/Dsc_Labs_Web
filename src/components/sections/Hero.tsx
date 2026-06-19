import Image from "next/image";
import { Reveal } from "@/components/ui/motion";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Hero() {
  return (
    // Section stays a full 100svh; the right/bottom padding is the dark frame
    // gap *inside* that height. The inner frame fills the remaining content box.
    <section
      id="top"
      className="relative flex min-h-[100svh] w-full bg-dsc-dark md:pb-[100px] md:pr-[60px]"
    >
      <div className="relative flex w-full items-end overflow-hidden">
        {/* Cover fills the frame flush on the left/top; object-bottom keeps the
            image's clipped bottom-right corner (only the top edge is trimmed). */}
        <Image
          src="/images/hero/hero-bg.png"
          alt="DSC Labs robotics facility"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] md:object-bottom"
        />
        {/* Scrims keep the lower-left headline legible over the imagery. */}
        {/* <div className="absolute inset-0 scrim-y" /> */}
        <div className="absolute inset-0 bg-gradient-to-r from-dsc-dark/85 via-dsc-dark/30 to-transparent" />

        <div className="container relative pb-20 pt-32 md:pb-28">
          <div className="flex max-w-3xl flex-col items-start gap-6">
            <Reveal>
              <Eyebrow pulse>OPERATIONAL STATUS: ACTIVE</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-expanded text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[1.05] text-white">
                <span className="font-light">Building the Bridge</span> Between
                Simulation and{" "}
                <span className="font-light">Real-World Robotics</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="max-w-xl text-base leading-relaxed text-dsc-b90">
                DSC Labs develops simulation workflows, robotic data pipelines,
                and testing environments that help robots move from virtual
                experiments to real-world performance.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <Button href="#work">Explore Our Work</Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
