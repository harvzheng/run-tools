"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useToolState } from "@/hooks/use-tool-state";
import { NumberInput } from "@/components/number-input";
import { motion } from "framer-motion";
import { config } from "./config";
import {
  KM_PER_MILE,
  calculateSplits,
  formatSplitTime,
  formatSplitPace,
  timeToSeconds,
  type SplitStrategy,
} from "./logic";
import { formatTime } from "@/lib/utils";

type DistanceUnit = "km" | "mi";

interface SplitState {
  distance: number;
  distanceUnit: string;
  totalTimeSeconds: number;
  splitUnit: string;
  strategy: string;
}

const STRATEGY_OPTIONS: { value: SplitStrategy; label: string }[] = [
  { value: "even", label: "Even" },
  { value: "negative", label: "Negative" },
  { value: "positive", label: "Positive" },
];

const inputClass =
  "focus:border-brand-400 focus:ring-brand-100 dark:focus:border-brand-500 dark:focus:ring-brand-500/20 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm tabular-nums transition-all outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900";

function TimeInput({
  value,
  onCommit,
  id,
}: {
  value: string;
  onCommit: (time: string) => void;
  id?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");

  return (
    <input
      id={id}
      type="text"
      inputMode="text"
      value={editing ? text : value}
      onFocus={() => {
        setEditing(true);
        setText(value);
      }}
      onBlur={(e) => {
        onCommit(e.target.value);
        setEditing(false);
      }}
      onChange={(e) => {
        setText(e.target.value);
        onCommit(e.target.value);
      }}
      className={inputClass}
    />
  );
}

function SplitCalculatorInner() {
  const [state, update] = useToolState<SplitState>(
    config.slug,
    config.defaultInputs as SplitState,
  );

  const distanceUnit = (state.distanceUnit ?? "km") as DistanceUnit;
  const splitUnit = (state.splitUnit ?? "km") as DistanceUnit;
  const strategy = (state.strategy ?? "even") as SplitStrategy;

  const distanceKm =
    distanceUnit === "mi" ? state.distance * KM_PER_MILE : state.distance;
  const splitLengthKm = splitUnit === "mi" ? KM_PER_MILE : 1;

  const splits = useMemo(
    () =>
      calculateSplits(
        distanceKm,
        state.totalTimeSeconds,
        splitLengthKm,
        strategy,
      ),
    [distanceKm, state.totalTimeSeconds, splitLengthKm, strategy],
  );

  const averagePaceSecondsPerKm =
    distanceKm > 0 ? state.totalTimeSeconds / distanceKm : 0;

  const commitTotalTime = useCallback(
    (value: string) => {
      const seconds = timeToSeconds(value);
      if (!isNaN(seconds) && seconds > 0) {
        update({ totalTimeSeconds: seconds });
      }
    },
    [update],
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="race-distance"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Target Distance
          </label>
          <div className="flex items-center gap-2">
            <input
              id="race-distance"
              type="number"
              min={0.5}
              step={0.1}
              value={state.distance}
              onChange={(e) => update({ distance: Number(e.target.value) })}
              className={inputClass}
            />
            <select
              value={distanceUnit}
              onChange={(e) =>
                update({ distanceUnit: e.target.value as DistanceUnit })
              }
              className="focus:border-brand-400 focus:ring-brand-100 dark:focus:border-brand-500 dark:focus:ring-brand-500/20 h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm transition-all outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option value="km">km</option>
              <option value="mi">mi</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="target-time"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Target Time
          </label>
          <TimeInput
            id="target-time"
            value={formatTime(state.totalTimeSeconds)}
            onCommit={commitTotalTime}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="split-unit"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Split Length
          </label>
          <div className="flex gap-1 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800/50">
            {(["km", "mi"] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => update({ splitUnit: unit })}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  splitUnit === unit
                    ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100"
                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                1 {unit}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Strategy
          </label>
          <div className="flex gap-1 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800/50">
            {STRATEGY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update({ strategy: opt.value })}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  strategy === opt.value
                    ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100"
                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            Split plan
          </h2>
          <div className="text-sm text-neutral-500">
            Avg pace:{" "}
            {formatSplitPace(
              averagePaceSecondsPerKm * (splitUnit === "mi" ? KM_PER_MILE : 1),
            )}
            /{splitUnit}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
          <div className="grid grid-cols-5 gap-2 bg-neutral-50 px-3 py-2 text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:bg-neutral-900">
            <div>Split</div>
            <div>Distance</div>
            <div>Split time</div>
            <div>Cumulative</div>
            <div>Pace</div>
          </div>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {splits.map((split, i) => {
              const distanceDisplay =
                splitUnit === "mi"
                  ? split.distanceKm / KM_PER_MILE
                  : split.distanceKm;
              const paceSecondsPerUnit =
                split.paceSecondsPerKm * (splitUnit === "mi" ? KM_PER_MILE : 1);
              return (
                <motion.div
                  key={`${split.index}-${split.distanceKm}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: i * 0.02 }}
                  className="grid grid-cols-5 gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200"
                >
                  <div>#{split.index + 1}</div>
                  <div>
                    {distanceDisplay.toFixed(distanceDisplay < 1 ? 2 : 1)}{" "}
                    {splitUnit}
                  </div>
                  <div>{formatSplitTime(split.splitSeconds)}</div>
                  <div>{formatSplitTime(split.cumulativeSeconds)}</div>
                  <div>
                    {formatSplitPace(paceSecondsPerUnit)}/{splitUnit}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SplitCalculator() {
  return (
    <Suspense>
      <SplitCalculatorInner />
    </Suspense>
  );
}
