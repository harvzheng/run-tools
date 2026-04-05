import type { Metadata } from "next";
import { changelog } from "@/data/changelog";

export const metadata: Metadata = {
  title: "Changelog — RunTools",
  description: "What's new in RunTools.",
};

export default function ChangelogPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
        Changelog
      </h1>
      <p className="mt-2 text-neutral-600 dark:text-neutral-400">
        New features, improvements, and fixes.
      </p>

      <div className="mt-10 space-y-0">
        {changelog.map((entry, i) => (
          <div key={entry.version} className="relative flex gap-6 pb-10">
            {/* Timeline line */}
            {i < changelog.length - 1 && (
              <div className="absolute left-[7px] top-5 h-full w-px bg-neutral-200 dark:bg-neutral-800" />
            )}

            {/* Timeline dot */}
            <div
              className={`relative mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border-[3px] bg-white dark:bg-neutral-950 ${
                i === 0
                  ? "border-brand-500"
                  : "border-neutral-300 dark:border-neutral-600"
              }`}
            />

            <div className="flex-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {entry.title}
                </h2>
                <span className="rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
                  v{entry.version}
                </span>
              </div>
              <time className="mt-0.5 block text-sm text-neutral-400">
                {new Date(entry.date + "T00:00:00").toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </time>
              <ul className="mt-3 space-y-1.5">
                {entry.changes.map((change) => (
                  <li
                    key={change}
                    className="flex gap-2 text-sm text-neutral-600 dark:text-neutral-400"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
