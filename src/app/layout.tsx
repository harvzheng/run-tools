import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { BottomNav } from "@/components/bottom-nav";
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
  viewportFit: "cover",
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
      <body className="bg-white pt-[env(safe-area-inset-top)] text-neutral-900 antialiased md:pt-0 dark:bg-neutral-950 dark:text-neutral-100">
        <Nav />
        <div className="min-h-[calc(100vh-3.5rem)] pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </div>
        <Footer />
        <BottomNav />
        <Analytics />
      </body>
    </html>
  );
}
