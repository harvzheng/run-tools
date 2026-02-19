import type { Metadata, Viewport } from "next";
import { Nav } from "@/components/nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "RunTools — Utility Tools for Runners",
  description:
    "Free running calculators: heart rate zones, pace converter, and more. No sign-up required.",
  metadataBase: new URL("https://runtools.app"),
  openGraph: {
    title: "RunTools",
    description: "Quick utility tools for runners",
    type: "website",
    url: "https://runtools.app",
  },
  twitter: {
    card: "summary",
    title: "RunTools — Utility Tools for Runners",
    description:
      "Free running calculators: heart rate zones, pace converter, and more. No sign-up required.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
        <Nav />
        <div className="min-h-[calc(100vh-3.5rem)]">{children}</div>
      </body>
    </html>
  );
}
