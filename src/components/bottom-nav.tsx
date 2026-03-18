"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ScrollText, Info } from "lucide-react";

const tabs = [
  { href: "/", label: "Tools", Icon: Home },
  { href: "/changelog", label: "Changelog", Icon: ScrollText },
  { href: "/about", label: "About", Icon: Info },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="flex items-center justify-around px-2">
        {tabs.map(({ href, label, Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/" || pathname.startsWith("/tools")
              : pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors ${
                isActive
                  ? "text-brand-600 dark:text-brand-400"
                  : "text-neutral-400"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
