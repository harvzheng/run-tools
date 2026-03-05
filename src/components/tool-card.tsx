"use client";

import type { ToolConfig } from "@/lib/types";
import { iconMap } from "@/lib/icons";
import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function ToolCard({ tool, index }: { tool: ToolConfig; index: number }) {
  const Icon = iconMap[tool.icon] ?? Activity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link
        href={`/tools/${tool.slug}`}
        className="group relative flex h-full flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 transition-all hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
      >
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${tool.accent} text-white shadow-sm`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {tool.name}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-neutral-500">
            {tool.description}
          </p>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-brand-400">
          Open tool <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </Link>
    </motion.div>
  );
}
