"use client";

import type { Zone } from "@/lib/types";
import { motion } from "framer-motion";

export function ZoneBar({
  zone,
  index,
  maxBpm,
}: {
  zone: Zone;
  index: number;
  maxBpm: number;
}) {
  const widthPercent = ((zone.max - zone.min) / maxBpm) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex items-center gap-3 rounded-xl bg-neutral-50 px-3 py-2.5 dark:bg-neutral-900"
    >
      <div
        className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-white"
        style={{ backgroundColor: zone.color }}
      >
        {index + 1}
      </div>
      <div className="flex-1">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {zone.label}
          </span>
          <span className="text-xs font-medium tabular-nums text-neutral-500">
            {zone.min}–{zone.max} bpm
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <motion.div
            className="h-full rounded-full"
            style={{
              backgroundColor: zone.color,
              width: `${widthPercent}%`,
              marginLeft: `${(zone.min / maxBpm) * 100}%`,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
