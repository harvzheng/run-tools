"use client";

import type { ToolConfig } from "@/lib/types";
import Link from "next/link";
import {
  Heart,
  Timer,
  Activity,
  Gauge,
  Footprints,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

const iconMap: Record<string, LucideIcon> = {
  Heart,
  Timer,
  Activity,
  Gauge,
  Footprints,
};

export function ToolCard({ tool, index }: { tool: ToolConfig; index: number }) {
  const Icon = iconMap[tool.icon] ?? Activity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link
        href={`/tools/${tool.slug}`}
        className="group flex items-start gap-3 rounded-xl border border-neutral-200 p-4 transition-all hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:hover:border-neutral-700"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600 transition-colors group-hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:group-hover:bg-neutral-700">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
            {tool.name}
          </h2>
          <p className="mt-0.5 text-sm text-neutral-500">
            {tool.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
