import Link from "next/link";
import { Zap } from "lucide-react";

const footerLinks = [
  { href: "/", label: "Tools" },
  { href: "/changelog", label: "Changelog" },
  { href: "/about", label: "About" },
  {
    href: "https://github.com/harvzheng/run-tools",
    label: "GitHub",
    external: true,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2 text-neutral-400 dark:text-neutral-500">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <Zap className="h-3 w-3" />
          </div>
          <span className="text-sm font-medium">RunTools</span>
        </div>

        <nav className="flex items-center gap-4">
          {footerLinks.map(({ href, label, external }) =>
            external ? (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
              >
                {label}
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                className="text-sm text-neutral-400 transition-colors hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
              >
                {label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </footer>
  );
}
