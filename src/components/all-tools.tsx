"use client";

import { tools } from "@/tools/registry";
import { useMruTools } from "@/hooks/use-mru-tools";
import { ToolCard } from "./tool-card";

const MAX_RECENT = 2;

export function AllTools() {
  const { slugs } = useMruTools();
  const recentSlugs = new Set(slugs.slice(0, MAX_RECENT));
  const remaining = tools.filter((t) => !recentSlugs.has(t.slug));

  if (remaining.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        All tools
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {remaining.map((tool, i) => (
          <ToolCard key={tool.slug} tool={tool} index={i} />
        ))}
      </div>
    </section>
  );
}
