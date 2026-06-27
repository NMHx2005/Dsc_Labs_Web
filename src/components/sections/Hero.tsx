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
          className="origin-bottom scale-[1.3] object-cover object-[60%_100%] md:scale-100 md:object-bottom"
        />
        <div className="container relative pb-[38px] pt-32 md:pb-28">
          <div className="flex max-w-3xl flex-col items-start gap-6">
            {/* On-load intro: each block rises 30px and fades+sharpens in,
                staggered 0.2s so the order reads top-to-bottom. */}
            <Reveal y={30}>
              <Eyebrow
                pulse
                className="text-sm font-normal tracking-normal text-white md:text-xs md:font-medium md:tracking-[0.22em] md:text-dsc-b90"
              >
                OPERATIONAL STATUS: ACTIVE
              </Eyebrow>
            </Reveal>
            <Reveal y={30} delay={0.2}>
              <h1 className="font-expanded text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.05] text-white">
                <span className="font-light">Building the Bridge</span> Between
                Simulation and{" "}
                <span className="font-light">Real-World Robotics</span>
              </h1>
            </Reveal>
            <Reveal y={30} delay={0.4}>
              <p className="max-w-xl text-sm leading-relaxed text-dsc-b90 md:text-base">
                DSC Labs develops simulation workflows, robotic data pipelines,
                and testing environments that help robots move from virtual
                experiments to real-world performance.
              </p>
            </Reveal>
            <Reveal y={30} delay={0.6}>
              <Button href="#inside">Explore Our Work</Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
