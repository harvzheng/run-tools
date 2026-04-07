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
        className="group relative flex h-full flex-col items-center gap-1.5 rounded-xl border border-neutral-200 bg-white p-2.5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-lg sm:items-start sm:gap-3 sm:rounded-2xl sm:p-4 sm:text-left dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:shadow-neutral-900/50"
      >
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br sm:h-10 sm:w-10 sm:rounded-xl ${tool.accent} text-white shadow-sm`}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-neutral-900 sm:text-lg dark:text-neutral-100">
            {tool.name}
          </h2>
          <p className="mt-1 hidden text-sm leading-relaxed text-neutral-600 sm:block dark:text-neutral-400">
            {tool.description}
          </p>
        </div>
        <div className="hidden items-center gap-1 text-sm font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100 sm:flex dark:text-brand-400">
          Open tool <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </Link>
    </motion.div>
  );
}
