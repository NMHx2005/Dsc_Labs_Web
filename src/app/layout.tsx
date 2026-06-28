import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { ScrollProgress } from "@/components/ui/motion";
import { CustomCursor } from "@/components/ui/gsap-effects";

// SF Pro — self-hosted variable font (subset to latin, woff2). Exposes the
// weight (1–1000) and width (30–150) axes; .font-expanded uses width 132 for
// display headings, matching the Figma "SF Pro Expanded" titles.
const sfPro = localFont({
  src: "./fonts/SF-Pro.woff2",
  variable: "--font-sf",
  display: "swap",
  weight: "1 1000",
  preload: true,
});

// Cross-platform fallback while SF Pro loads (size-adjusted by next/font).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sfPro.variable} ${inter.variable}`}
    >
      <body className="min-h-screen antialiased">
        <ScrollProgress />
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
