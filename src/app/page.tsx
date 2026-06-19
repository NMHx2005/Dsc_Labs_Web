import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { InsideLabs } from "@/components/sections/InsideLabs";
import { Workflow } from "@/components/sections/Workflow";
import { Partner } from "@/components/sections/Partner";
import { CallToAction } from "@/components/sections/CallToAction";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col overflow-x-clip">
      <Hero />
      <About />
      <InsideLabs />
      <Workflow />
      <Partner />
      <CallToAction />
    </main>
  );
}
