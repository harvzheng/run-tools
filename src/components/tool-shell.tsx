"use client";

import type { ToolConfig } from "@/lib/types";
import { Share2, Check } from "lucide-react";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";

export function ToolShell({
  tool,
  children,
}: {
  tool: ToolConfig;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto flex max-w-3xl flex-col px-4 py-8"
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {tool.name}
          </h1>
          <p className="mt-1 text-neutral-500">{tool.description}</p>
        </div>
        <button
          onClick={handleShare}
          className="mt-1 flex shrink-0 items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:text-neutral-100"
          aria-label="Copy link to share"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Share2 className="h-4 w-4" />
          )}
          {copied ? "Copied!" : "Share"}
        </button>
      </div>

      <div className="flex-1">{children}</div>
    </motion.div>
  );
}
