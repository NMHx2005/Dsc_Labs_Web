import { Reveal, ParallaxImage } from "@/components/ui/motion";
import { SplitReveal, Magnetic } from "@/components/ui/gsap-effects";
import { Button } from "@/components/ui/Button";

export function CallToAction() {
  return (
    <section
      id="contact"
      className="relative flex py-[80px] w-full items-center justify-center overflow-hidden"
    >
      <ParallaxImage
        src="/images/cta/cta-bg.png"
        alt=""
        speed={40}
        imageClassName="object-bottom"
      />
      {/* Lift the top of the image so the navy headline stays crisp. */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/20 to-transparent" />

      <div className="container relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <SplitReveal
            as="h2"
            className="font-expanded text-[32px] font-semibold leading-[1.1] text-dsc-b800 md:text-[clamp(1.75rem,3.6vw,2.75rem)] md:leading-[1.15]"
          >
            Build, Test, and Validate the Future of{" "}
            <span className="text-[32px] font-light md:text-[1.25em]">
              Robotics
            </span>{" "}
            With{" "}
            <span className="text-[32px] font-light md:text-[1.25em]">
              DSC Labs
            </span>
          </SplitReveal>
          <Reveal delay={0.1}>
            <p className="max-w-xl text-sm leading-relaxed text-dsc-b200 md:text-base">
              Whether you are developing robotic systems, testing AI models, or
              exploring simulation workflows, DSC Labs is ready to collaborate.
            </p>
          </Reveal>
          <Magnetic>
            <Button href="#about" variant="dark">
              Explore Our Work
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
