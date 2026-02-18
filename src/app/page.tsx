import { tools } from "@/tools/registry";
import { ToolCard } from "@/components/tool-card";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          RunTools
        </h1>
        <p className="mt-2 text-neutral-500">
          Quick utilities for runners. No sign-up required.
        </p>
      </div>

      {tools.length === 0 ? (
        <p className="text-neutral-400">No tools available yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {tools.map((tool, i) => (
            <ToolCard key={tool.slug} tool={tool} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
