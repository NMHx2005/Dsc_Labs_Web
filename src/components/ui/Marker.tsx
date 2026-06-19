import { cn } from "@/lib/utils";

/** Small diamond accent — stands in for the Figma "marker-five" glyph. */
export function Marker({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-2.5 rotate-45 bg-dsc-brand shadow-[0_0_8px_rgba(20,63,141,0.8)]",
        className,
      )}
    />
  );
}
