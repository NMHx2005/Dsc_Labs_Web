import { cn } from "@/lib/utils";
import { Marker } from "@/components/ui/Marker";

type EyebrowProps = {
  children: React.ReactNode;
  marker?: boolean;
  /** Replace the diamond marker with a live, pulsing status dot. */
  pulse?: boolean;
  className?: string;
};

/** Mono uppercase label used for status / section eyebrows. */
export function Eyebrow({
  children,
  marker = true,
  pulse = false,
  className,
}: EyebrowProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.22em] text-dsc-b90",
        className,
      )}
    >
      {pulse ? (
        <span className="relative flex size-2.5 shrink-0">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-dsc-brand opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-dsc-brand" />
        </span>
      ) : (
        marker && <Marker className="size-2" />
      )}
      {children}
    </p>
  );
}
