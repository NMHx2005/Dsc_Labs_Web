import { Reveal, ParallaxImage } from "@/components/ui/motion";
import { Button } from "@/components/ui/Button";

export function CallToAction() {
  return (
    <section
      id="contact"
      className="relative flex min-h-[560px] w-full items-center justify-center overflow-hidden"
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
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <h2 className="font-expanded text-[clamp(1.75rem,3.6vw,2.75rem)] font-semibold leading-[1.15] text-dsc-b800">
            Build, Test, and Validate the Future of{" "}
            <span className="text-[1.25em] font-light">Robotics</span> With{" "}
            <span className="text-[1.25em] font-light">DSC Labs</span>
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-dsc-b200">
            Whether you are developing robotic systems, testing AI models, or
            exploring simulation workflows, DSC Labs is ready to collaborate.
          </p>
          <Button href="#about" variant="dark">
            Explore Our Work
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
