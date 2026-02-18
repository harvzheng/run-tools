import { tools } from "@/tools/registry";
import { ToolCard } from "@/components/tool-card";

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

      {tools.length === 0 ? (
        <p className="text-neutral-400">No tools available yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {tools.map((tool, i) => (
            <ToolCard key={tool.slug} tool={tool} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
