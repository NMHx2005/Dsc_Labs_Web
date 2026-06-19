import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "solid" | "dark";
  className?: string;
};

const VARIANTS = {
  solid: "bg-white text-dsc-b900 hover:bg-dsc-b30",
  dark: "bg-dsc-b900 text-white hover:bg-dsc-brand",
} as const;

// Rectangle with a chamfered bottom-right corner (Figma button shape).
const CUT_CORNER = {
  clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)",
};

/** Chamfered CTA with an arrow that nudges on hover ("Explore Our Work →"). */
export function Button({
  href = "#contact",
  children,
  variant = "solid",
  className,
}: ButtonProps) {
  return (
    <Link
      href={href}
      style={CUT_CORNER}
      className={cn(
        "group inline-flex items-center gap-2 px-7 py-3 text-sm font-medium transition duration-200 active:scale-[0.98]",
        VARIANTS[variant],
        className,
      )}
    >
      <span>{children}</span>
      <span
        aria-hidden
        className="transition-transform duration-200 group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}
