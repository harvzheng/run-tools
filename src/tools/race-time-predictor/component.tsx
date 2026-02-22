"use client";

import { Suspense, useCallback, useState } from "react";
import { useToolState } from "@/hooks/use-tool-state";
import { NumberInput } from "@/components/number-input";
import { motion } from "framer-motion";
import { config } from "./config";
import {
  KM_PER_MILE,
  RACE_DISTANCES_KM,
  DEFAULT_RIEGEL_EXPONENT,
  timeToSeconds,
  predictTime,
  formatPrediction,
} from "./logic";
import { formatTime } from "@/lib/utils";

type DistanceUnit = "km" | "mi";

interface RaceTimeState {
  baseTimeSeconds: number;
  baseDistance: number;
  baseDistanceUnit: string;
  exponent: number;
  targetDistance: number;
  targetDistanceUnit: string;
}

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

function RaceTimePredictorInner() {
  const [state, update] = useToolState<RaceTimeState>(
    config.slug,
    config.defaultInputs as RaceTimeState,
  );

  const baseDistanceUnit = (state.baseDistanceUnit ?? "km") as DistanceUnit;
  const targetDistanceUnit = (state.targetDistanceUnit ?? "km") as DistanceUnit;

  const baseDistanceKm =
    baseDistanceUnit === "mi"
      ? state.baseDistance * KM_PER_MILE
      : state.baseDistance;

  const targetDistanceKm =
    targetDistanceUnit === "mi"
      ? state.targetDistance * KM_PER_MILE
      : state.targetDistance;

  const exponent = state.exponent || DEFAULT_RIEGEL_EXPONENT;

  const baseTimeDisplay = formatTime(state.baseTimeSeconds);

  const commitBaseTime = useCallback(
    (value: string) => {
      const seconds = timeToSeconds(value);
      if (!isNaN(seconds) && seconds > 0) {
        update({ baseTimeSeconds: seconds });
      }
    },
    [update],
  );

  const standardPredictions = RACE_DISTANCES_KM.map((race) => ({
    name: race.name,
    time: formatPrediction(
      predictTime(
        state.baseTimeSeconds,
        baseDistanceKm,
        race.distanceKm,
        exponent,
      ),
    ),
  }));

  const customPrediction = formatPrediction(
    predictTime(
      state.baseTimeSeconds,
      baseDistanceKm,
      targetDistanceKm,
      exponent,
    ),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="base-time"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Recent Race Time
          </label>
          <TimeInput
            id="base-time"
            value={baseTimeDisplay}
            onCommit={commitBaseTime}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="base-distance"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Recent Race Distance
          </label>
          <div className="flex items-center gap-2">
            <input
              id="base-distance"
              type="number"
              min={0.5}
              step={0.1}
              value={state.baseDistance}
              onChange={(e) => update({ baseDistance: Number(e.target.value) })}
              className={inputClass}
            />
            <select
              value={baseDistanceUnit}
              onChange={(e) =>
                update({ baseDistanceUnit: e.target.value as DistanceUnit })
              }
              className="focus:border-brand-400 focus:ring-brand-100 dark:focus:border-brand-500 dark:focus:ring-brand-500/20 h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm transition-all outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option value="km">km</option>
              <option value="mi">mi</option>
            </select>
          </div>
        </div>

        <NumberInput
          label="Riegel Exponent"
          value={exponent}
          onChange={(value) => update({ exponent: value })}
          min={1.02}
          max={1.15}
          step={0.01}
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="target-distance"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Custom Target Distance
          </label>
          <div className="flex items-center gap-2">
            <input
              id="target-distance"
              type="number"
              min={0.5}
              step={0.1}
              value={state.targetDistance}
              onChange={(e) =>
                update({ targetDistance: Number(e.target.value) })
              }
              className={inputClass}
            />
            <select
              value={targetDistanceUnit}
              onChange={(e) =>
                update({ targetDistanceUnit: e.target.value as DistanceUnit })
              }
              className="focus:border-brand-400 focus:ring-brand-100 dark:focus:border-brand-500 dark:focus:ring-brand-500/20 h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm transition-all outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option value="km">km</option>
              <option value="mi">mi</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Predicted finish times
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {standardPredictions.map((race, i) => (
            <motion.div
              key={race.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="rounded-xl bg-neutral-50 p-3.5 dark:bg-neutral-900"
            >
              <div className="text-xs font-medium text-neutral-500">
                {race.name}
              </div>
              <div className="mt-1 text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {race.time}
              </div>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.25 }}
            className="rounded-xl border border-dashed border-neutral-200 bg-white p-3.5 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="text-xs font-medium text-neutral-500">Custom</div>
            <div className="mt-1 text-sm text-neutral-500">
              {state.targetDistance} {targetDistanceUnit}
            </div>
            <div className="mt-1 text-lg font-bold text-neutral-900 dark:text-neutral-100">
              {customPrediction}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function RaceTimePredictor() {
  return (
    <Suspense>
      <RaceTimePredictorInner />
    </Suspense>
  );
}
