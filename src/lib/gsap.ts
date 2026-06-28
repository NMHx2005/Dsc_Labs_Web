// Central GSAP entry: registers the plugins once, client-side only (ScrollTrigger
// and SplitText touch `window`). Import { gsap, ScrollTrigger, SplitText, useGSAP }
// from here in any "use client" component — never from a Server Component.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
