"use client";

import type { ToolConfig } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export function ToolShell({
  tool,
  children,
}: {
  tool: ToolConfig;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto flex max-w-3xl flex-col px-4 py-5 sm:py-8"
    >
      <Link
        href="/"
        className="mb-5 flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 -ml-2 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to tools
      </Link>

      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {tool.name}
        </h1>
        <p className="mt-1.5 text-neutral-600 dark:text-neutral-400">
          {tool.description}
        </p>
      </div>

      <div className="flex-1">{children}</div>
    </motion.div>
  );
}
