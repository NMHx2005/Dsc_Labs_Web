import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { InsideLabs } from "@/components/sections/InsideLabs";
import { Workflow } from "@/components/sections/Workflow";
import { Partner } from "@/components/sections/Partner";
import { CallToAction } from "@/components/sections/CallToAction";
import { Marquee } from "@/components/ui/gsap-effects";

const MARQUEE_TOP = [
  "SIMULATION",
  "ROBOTIC DATA",
  "SIM-TO-REAL",
  "AI VALIDATION",
  "DIGITAL TWIN",
];
const MARQUEE_BOTTOM = [
  "SYNTHETIC DATA",
  "MODEL EVALUATION",
  "SAFETY TESTING",
  "REINFORCEMENT",
  "DEPLOYMENT",
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col overflow-x-clip">
      <Hero />
      <About />
      {/* Kinetic marquee band (scroll-velocity linked) between sections. */}
      <section className="border-y border-white/10 bg-dsc-dark py-8 md:py-12">
        <div className="flex flex-col gap-3 font-expanded text-[clamp(2rem,7vw,5rem)] font-light uppercase leading-none text-white">
          <Marquee items={MARQUEE_TOP} />
          <Marquee items={MARQUEE_BOTTOM} reverse />
        </div>
      </section>
      <InsideLabs />
      <Workflow />
      <Partner />
      <CallToAction />
    </main>
  );
}
