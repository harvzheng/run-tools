"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";

const links = [
  { href: "/", label: "Tools" },
  { href: "/changelog", label: "Changelog" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="hidden border-b border-neutral-200 bg-white/80 pt-[env(safe-area-inset-top)] backdrop-blur-md md:block dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <Zap className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            RunTools
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const isActive =
              href === "/"
                ? pathname === "/" || pathname.startsWith("/tools")
                : pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
