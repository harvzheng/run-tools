"use client";

import { Suspense, useCallback, useMemo } from "react";
import { useToolState } from "@/hooks/use-tool-state";
import { SegmentedControl } from "@/components/segmented-control";
import { TimeInput } from "@/components/time-input";
import { inputClass, selectClass } from "@/lib/styles";
import { motion } from "framer-motion";
import { config, type SplitState } from "./config";
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

const STRATEGY_OPTIONS: { value: SplitStrategy; label: string }[] = [
  { value: "even", label: "Even" },
  { value: "negative", label: "Negative" },
  { value: "positive", label: "Positive" },
];

function SplitCalculatorInner() {
  const [state, update] = useToolState<SplitState>(
    config.slug,
    config.defaultInputs,
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
              className={selectClass}
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
          <SegmentedControl
            value={splitUnit}
            onChange={(value) => update({ splitUnit: value })}
            options={[
              { value: "km", label: "1 km" },
              { value: "mi", label: "1 mi" },
            ]}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Strategy
          </label>
          <SegmentedControl
            value={strategy}
            onChange={(value) => update({ strategy: value })}
            options={STRATEGY_OPTIONS}
          />
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
