"use client";

import { Suspense, useCallback, useState } from "react";
import { useToolState } from "@/hooks/use-tool-state";
import {
  convertPace,
  formatValue,
  parseValue,
  calculateRaceTimes,
  calculateCustomTime,
  timeToSeconds,
  paceFromTime,
  KM_PER_MILE,
  RACE_DISTANCES_KM,
} from "./logic";
import { config } from "./config";
import type { PaceUnit } from "@/lib/types";
import { motion } from "framer-motion";

type DistanceUnit = "km" | "mi";

interface PaceState {
  paceMinKm: number;
  customDistance: number;
  customDistanceUnit: string;
}

const UNITS: { unit: PaceUnit; label: string }[] = [
  { unit: "min/km", label: "min/km" },
  { unit: "min/mi", label: "min/mi" },
  { unit: "km/h", label: "km/h" },
  { unit: "mph", label: "mph" },
];

const RACE_NAMES = ["5K", "10K", "Half Marathon", "Marathon"] as const;

const inputClass =
  "focus:border-brand-400 focus:ring-brand-100 dark:focus:border-brand-500 dark:focus:ring-brand-500/20 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm tabular-nums transition-all outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900";

function TimeInput({
  value,
  onCommit,
  id,
  variant = "bordered",
}: {
  value: string;
  onCommit: (time: string) => void;
  id?: string;
  variant?: "bordered" | "inline";
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");

  const className =
    variant === "inline"
      ? "mt-1 h-auto w-full rounded-lg bg-transparent p-0 text-lg font-bold tabular-nums text-neutral-900 outline-none focus:ring-0 dark:text-neutral-100"
      : inputClass;

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
      className={className}
    />
  );
}

function PaceConverterInner() {
  const [state, update] = useToolState<PaceState>(
    config.slug,
    config.defaultInputs as PaceState,
  );
  const [activeField, setActiveField] = useState<PaceUnit | null>(null);
  const [editingText, setEditingText] = useState("");
  const secPerKm = state.paceMinKm;
  const customDistance = state.customDistance ?? 5;
  const customDistanceUnit = (state.customDistanceUnit ?? "km") as DistanceUnit;
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

  const commitTimeForDistance = useCallback(
    (timeStr: string, distanceKm: number) => {
      const totalSec = timeToSeconds(timeStr);
      if (isNaN(totalSec) || totalSec <= 0 || distanceKm <= 0) return;
      const newSecPerKm = paceFromTime(totalSec, distanceKm);
      if (isFinite(newSecPerKm) && newSecPerKm > 0) {
        update({ paceMinKm: newSecPerKm });
      }
    },
    [update],
  );

  const customDistanceKm =
    customDistanceUnit === "mi"
      ? customDistance * KM_PER_MILE
      : customDistance;

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
                className={inputClass}
              />
            </div>
          );
        })}
      </div>

      {/* Custom distance */}
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Custom distance
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2">
            <input
              type="number"
              id="custom-distance"
              value={customDistance}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v > 0) update({ customDistance: v });
              }}
              min={0.1}
              step={0.1}
              className={inputClass}
            />
            <select
              value={customDistanceUnit}
              onChange={(e) =>
                update({
                  customDistanceUnit: e.target.value as DistanceUnit,
                })
              }
              className="focus:border-brand-400 focus:ring-brand-100 dark:focus:border-brand-500 dark:focus:ring-brand-500/20 h-11 rounded-xl border border-neutral-200 bg-white px-3 text-sm transition-all outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option value="km">km</option>
              <option value="mi">mi</option>
            </select>
          </div>
          <div className="w-32">
            <TimeInput
              id="custom-time"
              value={calculateCustomTime(customDistanceKm, secPerKm)}
              onCommit={(t) => commitTimeForDistance(t, customDistanceKm)}
            />
          </div>
        </div>
      </div>

      {/* Race times */}
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Race finish times
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {RACE_NAMES.map((race, i) => (
            <motion.div
              key={race}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="rounded-xl bg-neutral-50 p-3.5 dark:bg-neutral-900"
            >
              <label
                htmlFor={`race-${race}`}
                className="text-xs font-medium text-neutral-500"
              >
                {race}
              </label>
              <TimeInput
                id={`race-${race}`}
                variant="inline"
                value={raceTimes[race]}
                onCommit={(t) =>
                  commitTimeForDistance(t, RACE_DISTANCES_KM[race])
                }
              />
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
