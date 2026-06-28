"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Magnetic } from "@/components/ui/gsap-effects";

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const q = gsap.utils.selector(root);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Background drifts up slowly as the hero scrolls away (parallax depth).
      gsap.to(q(".hero-bg"), {
        yPercent: 12,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
      });

      // On-load intro: eyebrow → headline (char by char) → copy → CTA.
      const title = q(".hero-title")[0] as HTMLElement | undefined;
      const split = title
        ? new SplitText(title, {
            type: "words,chars",
            wordsClass: "split-word",
            charsClass: "split-char",
          })
        : null;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(q(".hero-eyebrow"), { y: 30, autoAlpha: 0, duration: 0.8 });
      if (split) {
        tl.from(
          split.chars,
          {
            yPercent: 110,
            opacity: 0,
            rotateX: -90,
            transformOrigin: "0% 100%",
            stagger: 0.018,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.35",
        );
      }
      tl.from(q(".hero-sub"), { y: 30, autoAlpha: 0, duration: 0.7 }, "-=0.2");
      tl.from(q(".hero-cta"), { y: 30, autoAlpha: 0, duration: 0.6 }, "-=0.3");

      return () => split?.revert();
    },
    { scope: ref },
  );

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] w-full bg-dsc-dark md:pb-[100px] md:pr-[60px]"
    >
      <div className="relative flex w-full items-end overflow-hidden">
        <div className="hero-bg absolute inset-[-4%]">
          <Image
            src="/images/hero/hero-bg.png"
            alt="DSC Labs robotics facility"
            fill
            priority
            sizes="100vw"
            className="origin-bottom scale-[1.3] object-cover object-[60%_100%] md:scale-100 md:object-bottom"
          />
        </div>

        <div className="container relative pb-[38px] pt-32 md:pb-28">
          <div className="flex max-w-3xl flex-col items-start gap-6">
            <Eyebrow
              pulse
              className="hero-eyebrow text-sm font-normal tracking-normal text-white md:text-xs md:font-medium md:tracking-[0.22em] md:text-dsc-b90"
            >
              OPERATIONAL STATUS: ACTIVE
            </Eyebrow>
            <h1 className="hero-title font-expanded text-[clamp(2rem,5vw,3.75rem)] font-medium leading-[1.05] text-white">
              <span className="font-light">Building the Bridge</span> Between
              Simulation and{" "}
              <span className="font-light">Real-World Robotics</span>
            </h1>
            <p className="hero-sub max-w-xl text-sm leading-relaxed text-dsc-b90 md:text-base">
              DSC Labs develops simulation workflows, robotic data pipelines,
              and testing environments that help robots move from virtual
              experiments to real-world performance.
            </p>
            <Magnetic className="hero-cta">
              <Button href="#inside">Explore Our Work</Button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
