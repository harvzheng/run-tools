"use client";

import { useMruTools } from "@/hooks/use-mru-tools";
import { getToolBySlug } from "@/tools/registry";
import { ToolCard } from "./tool-card";

const MAX_RECENT = 2;

export function RecentTools() {
  const { slugs } = useMruTools();
  const recent = slugs
    .slice(0, MAX_RECENT)
    .map((slug) => getToolBySlug(slug))
    .filter(Boolean) as NonNullable<ReturnType<typeof getToolBySlug>>[];

  if (recent.length === 0) return null;

  return (
    <section className="mb-6 sm:mb-10">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        Recent
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {recent.map((tool, i) => (
          <ToolCard key={tool.slug} tool={tool} index={i} />
        ))}
      </div>
    </section>
  );
}
