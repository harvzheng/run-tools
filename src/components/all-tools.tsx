"use client";

import { useState } from "react";
import { tools, MORE_TOOLS_SLUGS } from "@/tools/registry";
import { useMruTools } from "@/hooks/use-mru-tools";
import { ToolCard } from "./tool-card";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MAX_RECENT = 2;

export function AllTools() {
  const { slugs } = useMruTools();
  const [moreOpen, setMoreOpen] = useState(false);
  const recentSlugs = new Set(slugs.slice(0, MAX_RECENT));
  const remaining = tools.filter((t) => !recentSlugs.has(t.slug));

  const primary = remaining.filter((t) => !MORE_TOOLS_SLUGS.has(t.slug));
  const more = remaining.filter((t) => MORE_TOOLS_SLUGS.has(t.slug));

  if (remaining.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        All tools
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {primary.map((tool, i) => (
          <ToolCard key={tool.slug} tool={tool} index={i} />
        ))}
      </div>

      {more.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-neutral-200 py-2 text-xs font-medium text-neutral-400 transition-colors hover:border-neutral-300 hover:text-neutral-600 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:text-neutral-300"
          >
            More tools
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`}
            />
          </button>
          <AnimatePresence>
            {moreOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-2 pt-2 sm:gap-3">
                  {more.map((tool, i) => (
                    <ToolCard key={tool.slug} tool={tool} index={i} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
