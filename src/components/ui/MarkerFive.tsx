import { cn } from "@/lib/utils";

/** Figma "marker-five" glyph — concentric pentagon emblem. Inherits text color. */
export function MarkerFive({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <path
        d="M11.75 6.15659L13 11.2083L8.00004 12.6517L3.00004 11.2083L4.25004 6.15659L8.00004 2.54819L11.75 6.15659ZM5.47465 6.86362L4.63285 10.266L8.00004 11.2376L11.3672 10.266L10.5254 6.86362L8.00004 4.43393L5.47465 6.86362ZM9.22465 7.61459L9.63285 9.26401L8.00004 9.73569L6.36723 9.26401L6.77543 7.61459L8.00004 6.43686L9.22465 7.61459Z"
        fill="currentColor"
      />
    </svg>
  );
}
