import { RecentTools } from "@/components/recent-tools";
import { AllTools } from "@/components/all-tools";
import { tools } from "@/tools/registry";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="mb-6 sm:mb-10">
        <h1 className="bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl dark:from-neutral-100 dark:via-neutral-300 dark:to-neutral-100">
          Useful tools for runners
        </h1>
        <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-400">
          Running calculators and tools without the bloat
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
            {tools.length} free tools
          </span>
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            No sign-up required
          </span>
        </div>
      </div>

      <RecentTools />

      <AllTools />
    </main>
  );
}
