"use client";

import { Suspense, useCallback, useState } from "react";
import { useToolState } from "@/hooks/use-tool-state";
import { TimeInput } from "@/components/time-input";
import { inputClass, selectClass } from "@/lib/styles";
import {
  convertPace,
  formatValue,
  parseValue,
  calculateRaceTimes,
  calculateCustomTime,
  timeToSeconds,
  paceFromTime,
  KM_PER_MILE,
  RACE_DISTANCES,
} from "./logic";
import { config, type PaceState } from "./config";
import type { PaceUnit } from "@/lib/types";
import { motion } from "framer-motion";

type DistanceUnit = "km" | "mi";

const UNITS: { unit: PaceUnit; label: string }[] = [
  { unit: "min/km", label: "min/km" },
  { unit: "min/mi", label: "min/mi" },
  { unit: "km/h", label: "km/h" },
  { unit: "mph", label: "mph" },
];

const RACE_NAMES = RACE_DISTANCES.map((r) => r.name);

const PACE_CHIPS = [
  { label: "7:00/mi", secPerMi: 420 },
  { label: "8:00/mi", secPerMi: 480 },
  { label: "9:00/mi", secPerMi: 540 },
  { label: "10:00/mi", secPerMi: 600 },
  { label: "11:00/mi", secPerMi: 660 },
];

function PaceConverterInner() {
  const [state, update] = useToolState<PaceState>(
    config.slug,
    config.defaultInputs,
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
      <div className="grid grid-cols-2 gap-4">
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

      {/* Quick pace chips */}
      <div className="flex flex-wrap gap-1.5">
        {PACE_CHIPS.map(({ label, secPerMi }) => {
          const secPerKmValue = secPerMi / KM_PER_MILE;
          const isActive = Math.abs(secPerKm - secPerKmValue) < 1;
          return (
            <button
              key={label}
              onClick={() => update({ paceMinKm: secPerKmValue })}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-900/20 dark:text-brand-300"
                  : "border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 dark:border-neutral-700 dark:hover:border-neutral-600 dark:hover:text-neutral-300"
              }`}
            >
              {label}
            </button>
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
              className={selectClass}
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
                value={raceTimes[race as keyof typeof raceTimes]}
                onCommit={(t) =>
                  commitTimeForDistance(
                    t,
                    RACE_DISTANCES.find((r) => r.name === race)!.distanceKm,
                  )
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
