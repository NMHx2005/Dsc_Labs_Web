"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Magnetic } from "@/components/ui/gsap-effects";
import { LiquidLogo } from "@/components/ui/LiquidLogo";

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

      // On-load intro: logo → eyebrow → headline (char by char) → copy → CTA.
      const title = q(".hero-title")[0] as HTMLElement | undefined;
      const split = title
        ? new SplitText(title, {
            type: "words,chars",
            wordsClass: "split-word",
            charsClass: "split-char",
          })
        : null;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(q(".hero-logo"), {
        y: 24,
        scale: 1.04,
        autoAlpha: 0,
        duration: 1,
        ease: "power2.out",
      });
      tl.from(q(".hero-eyebrow"), { y: 30, autoAlpha: 0, duration: 0.8 }, "-=0.5");
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
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-dsc-dark"
    >
      {/* Background: looping video with a radial-glow vignette overlaid on top. */}
      <div className="hero-bg absolute inset-[-4%]">
        <video
          className="size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero/hero-bg.png"
        >
          <source src="/video/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* White-center → dark-edge radial; multiply keeps the center clear and
            darkens the edges into a subtle vignette. */}
        <Image
          src="/images/hero/hero-overlay.png"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover opacity-70 mix-blend-multiply"
        />
        {/* Uniform tint + bottom fade keep the white logo and bottom copy legible. */}
        <div aria-hidden className="absolute inset-0 bg-dsc-dark/20" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-dsc-dark via-dsc-dark/20 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-dsc-dark via-dsc-dark/20 to-transparent"
        />
      </div>

      {/* Centered brand logo with a cursor-following chrome sweep. */}
      <div
        data-cursor="grow"
        className="relative z-10 flex flex-1 items-center justify-center px-6 pt-28 md:pt-24"
      >
        <LiquidLogo
          src="/images/hero/dsc-labs-logo.png"
          alt="DSC Labs"
          ratio={3400 / 800}
          className="hero-logo w-[clamp(220px,55vw,944px)]"
        />
      </div>

      {/* Bottom row: headline (left) and supporting copy + CTA (right). */}
      <div className="container relative z-10 pb-12 md:pb-20">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
          <div className="flex max-w-3xl flex-col items-start gap-2 md:max-w-[52rem]">
            <Eyebrow
              marker={false}
              className="hero-eyebrow text-sm font-normal tracking-normal text-white md:text-xs md:font-medium md:tracking-[0.22em]"
            >
              <span>OPERATIONAL STATUS:</span>
              <span className="relative flex size-2.5 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#00FF2F] opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full border border-[#A8FFD5] bg-[#00FF77] shadow-[0_0_14px_0_#00FF2F]" />
              </span>
              <span>Active</span>
            </Eyebrow>
            <h1 className="hero-title font-expanded text-[clamp(2rem,5vw,3.75rem)] font-[540] leading-none text-white">
              <span className="block font-[270]">Building the Bridge</span>
              <span className="block md:whitespace-nowrap">
                Between Simulation and
              </span>
              <span className="block font-[270]">Real-World Robotics</span>
            </h1>
          </div>

          <div className="flex flex-col items-start gap-6 md:w-[300px] md:shrink-0 md:items-end md:text-right">
            <p className="hero-sub text-sm leading-relaxed text-dsc-b90 md:text-base">
              <span className="font-medium text-dsc-b30">DSC Labs</span> develops
              simulation workflows, robotic data pipelines, and testing
              environments that help robots move{" "}
              <span className="text-dsc-b30">
                from virtual experiments to real-world performance.
              </span>
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
