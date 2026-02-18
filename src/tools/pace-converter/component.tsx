"use client";

import { Suspense, useCallback, useState } from "react";
import { useToolState } from "@/hooks/use-tool-state";
import {
  convertPace,
  formatValue,
  parseValue,
  calculateRaceTimes,
} from "./logic";
import { config } from "./config";
import type { PaceUnit } from "@/lib/types";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

interface PaceState {
  paceMinKm: number;
}

const UNITS: { unit: PaceUnit; label: string }[] = [
  { unit: "min/km", label: "min/km" },
  { unit: "min/mi", label: "min/mi" },
  { unit: "km/h", label: "km/h" },
  { unit: "mph", label: "mph" },
];

const RACE_NAMES = ["5K", "10K", "Half Marathon", "Marathon"] as const;

function PaceConverterInner() {
  const [state, update] = useToolState<PaceState>(
    config.slug,
    config.defaultInputs as PaceState,
  );
  const [activeField, setActiveField] = useState<PaceUnit | null>(null);
  const [editingText, setEditingText] = useState("");
  const [copied, setCopied] = useState(false);

  const secPerKm = state.paceMinKm;
  const raceTimes = calculateRaceTimes(secPerKm);

  const commitValue = useCallback(
    (input: string, unit: PaceUnit) => {
      const value = parseValue(input, unit);
      if (isNaN(value) || value <= 0) return;
      const newSecPerKm = convertPace(value, unit, "min/km");
      if (isFinite(newSecPerKm) && newSecPerKm > 0) {
        update({ paceMinKm: newSecPerKm });
      }
    },
    [update],
  );

  const handleCopy = useCallback(async () => {
    const lines = UNITS.map((u) => {
      const val = convertPace(secPerKm, "min/km", u.unit);
      return `${u.label}: ${formatValue(val, u.unit)}`;
    });
    const raceLines = RACE_NAMES.map((r) => `${r}: ${raceTimes[r]}`);
    const text = [...lines, "", "Race Times:", ...raceLines].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  }, [secPerKm, raceTimes]);

  return (
    <div className="flex flex-col gap-6">
      {/* Pace/speed inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        {UNITS.map(({ unit, label }) => {
          const computed = convertPace(secPerKm, "min/km", unit);
          const isEditing = activeField === unit;
          const displayValue = isEditing
            ? editingText
            : formatValue(computed, unit);

          return (
            <div key={unit} className="flex flex-col gap-1.5">
              <label
                htmlFor={`pace-${unit}`}
                className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
              >
                {label}
              </label>
              <input
                id={`pace-${unit}`}
                type="text"
                inputMode={
                  unit === "mph" || unit === "km/h" ? "decimal" : "text"
                }
                value={displayValue}
                onFocus={() => {
                  setActiveField(unit);
                  setEditingText(formatValue(computed, unit));
                }}
                onBlur={(e) => {
                  commitValue(e.target.value, unit);
                  setActiveField(null);
                }}
                onChange={(e) => {
                  setEditingText(e.target.value);
                  commitValue(e.target.value, unit);
                }}
                className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm tabular-nums outline-none transition-colors focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:border-neutral-500 dark:focus:ring-neutral-700"
              />
            </div>
          );
        })}
      </div>

      {/* Race times */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            Race Finish Times
          </h2>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
            aria-label="Copy results as text"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {RACE_NAMES.map((race, i) => (
            <motion.div
              key={race}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
            >
              <div className="text-xs text-neutral-500">{race}</div>
              <div className="mt-0.5 text-lg font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
                {raceTimes[race]}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PaceConverter() {
  return (
    <Suspense>
      <PaceConverterInner />
    </Suspense>
  );
}
