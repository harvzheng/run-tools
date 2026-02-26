"use client";

import { Suspense } from "react";
import { useToolState } from "@/hooks/use-tool-state";
import { NumberInput } from "@/components/number-input";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { config } from "./config";
import { estimateVO2max, type PaceUnit } from "./logic";

interface VO2maxState {
  paceMinutes: number;
  paceSeconds: number;
  paceUnit: string;
  avgHR: number;
  maxHR: number;
  restHR: number;
}

const inputClass =
  "focus:border-brand-400 focus:ring-brand-100 dark:focus:border-brand-500 dark:focus:ring-brand-500/20 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm tabular-nums transition-all outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900";

const PACE_UNITS: { value: PaceUnit; label: string }[] = [
  { value: "min/km", label: "min/km" },
  { value: "min/mi", label: "min/mi" },
];

function VO2maxEstimatorInner() {
  const [state, update] = useToolState<VO2maxState>(
    config.slug,
    config.defaultInputs as VO2maxState,
  );

  const paceUnit = (state.paceUnit ?? "min/km") as PaceUnit;

  const result = estimateVO2max({
    paceMinutes: state.paceMinutes,
    paceSeconds: state.paceSeconds,
    paceUnit,
    avgHR: state.avgHR,
    maxHR: state.maxHR,
    restHR: state.restHR,
  });

  const outputItems = [
    {
      label: "Estimated VO2max",
      value: `${result.vo2max.toFixed(1)} ml/kg/min`,
      highlight: true,
    },
    {
      label: "Fitness level",
      value: result.fitnessLabel,
      highlight: false,
    },
    {
      label: "% VO2max",
      value: `${result.percentVO2max.toFixed(1)}%`,
      highlight: false,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Pace */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Pace
          </label>
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-1">
              <input
                type="number"
                min={3}
                max={20}
                value={state.paceMinutes}
                onChange={(e) =>
                  update({ paceMinutes: Math.max(0, Number(e.target.value)) })
                }
                className={inputClass}
                aria-label="Pace minutes"
              />
              <span className="text-sm text-neutral-500">:</span>
              <input
                type="number"
                min={0}
                max={59}
                value={String(state.paceSeconds).padStart(2, "0")}
                onChange={(e) => {
                  const val = Math.min(59, Math.max(0, Number(e.target.value)));
                  update({ paceSeconds: val });
                }}
                className={inputClass}
                aria-label="Pace seconds"
              />
            </div>
            <select
              value={paceUnit}
              onChange={(e) => update({ paceUnit: e.target.value as PaceUnit })}
              className="focus:border-brand-400 focus:ring-brand-100 dark:focus:border-brand-500 dark:focus:ring-brand-500/20 h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm transition-all outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900"
            >
              {PACE_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <NumberInput
          label="Average HR"
          value={state.avgHR}
          onChange={(avgHR) => update({ avgHR })}
          min={80}
          max={200}
          unit="bpm"
        />

        <NumberInput
          label="Max HR"
          value={state.maxHR}
          onChange={(maxHR) => update({ maxHR })}
          min={150}
          max={220}
          unit="bpm"
        />

        <NumberInput
          label="Resting HR"
          value={state.restHR}
          onChange={(restHR) => update({ restHR })}
          min={30}
          max={100}
          unit="bpm"
        />
      </div>

      {/* Results */}
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Estimate
        </h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {outputItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className={`rounded-xl p-3.5 ${
                item.highlight
                  ? "bg-brand-50 dark:bg-brand-950/30"
                  : "bg-neutral-50 dark:bg-neutral-900"
              }`}
            >
              <div className="text-xs font-medium text-neutral-500">
                {item.label}
              </div>
              <div
                className={`mt-1 text-lg font-bold ${
                  item.highlight
                    ? "text-brand-700 dark:text-brand-300"
                    : "text-neutral-900 dark:text-neutral-100"
                }`}
              >
                {item.value}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Warning */}
      {result.warning && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-300"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{result.warning}</span>
        </motion.div>
      )}

      {/* Note */}
      <p className="text-xs text-neutral-400 dark:text-neutral-500">
        Most accurate for steady-state aerobic runs. Avoid using data from
        intervals, tempo workouts, or walks. Uses the Daniels-Gilbert oxygen
        cost formula with Karvonen HR scaling.
      </p>
    </div>
  );
}

export default function VO2maxEstimator() {
  return (
    <Suspense>
      <VO2maxEstimatorInner />
    </Suspense>
  );
}
