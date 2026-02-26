import { RecentTools } from "@/components/recent-tools";
import { AllTools } from "@/components/all-tools";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          Useful tools for runners
        </h1>
        <p className="mt-3 text-lg text-neutral-500">
          Running calculators and tools without the bloat
        </p>
      </div>

      <RecentTools />

      <AllTools />
    </main>
  );
}
