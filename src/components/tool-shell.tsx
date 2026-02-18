"use client";

import type { ToolConfig } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft, Share2, Check } from "lucide-react";
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
      className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Tools
        </Link>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
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

      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {tool.name}
        </h1>
        <p className="mt-1 text-neutral-500">{tool.description}</p>
      </div>

      <div className="flex-1">{children}</div>
    </motion.div>
  );
}
