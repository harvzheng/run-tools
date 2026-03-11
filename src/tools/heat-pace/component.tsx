"use client";

import { Suspense, useCallback, useState } from "react";
import { useToolState } from "@/hooks/use-tool-state";
import { inputClass, selectClass, cardClass } from "@/lib/styles";
import { motion } from "framer-motion";
import { config, type HeatPaceState } from "./config";
import {
  adjustPaceForHeat,
  cToF,
  fToC,
  formatPaceValue,
  heatSlowdownPct,
} from "./logic";
import { formatPace } from "@/lib/utils";

type TempUnit = "F" | "C";

/** Parse a pace string like "5:30" into total seconds. */
function parsePace(input: string): number {
  const trimmed = input.trim();
  if (trimmed.includes(":")) {
    const [min, sec] = trimmed.split(":");
    return Number(min) * 60 + Number(sec || 0);
  }
  return Number(trimmed);
}

const TEMP_PRESETS_F = [65, 70, 75, 80, 85, 90, 95];

function HeatPaceInner() {
  const [state, update] = useToolState<HeatPaceState>(
    config.slug,
    config.defaultInputs,
  );
  const [editingPace, setEditingPace] = useState(false);
  const [paceText, setPaceText] = useState("");

  const tempUnit = (state.tempUnit ?? "F") as TempUnit;
  const tempF = tempUnit === "C" ? cToF(state.temperature) : state.temperature;
  const result = adjustPaceForHeat(state.paceMinKm, tempF);

  const commitPace = useCallback(
    (input: string) => {
      const sec = parsePace(input);
      if (!isNaN(sec) && sec > 0 && isFinite(sec)) {
        update({ paceMinKm: sec });
      }
    },
    [update],
  );

  const displayPace = editingPace ? paceText : formatPace(state.paceMinKm);

  return (
    <div className="flex flex-col gap-6">
      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="base-pace"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Base pace (min/km)
          </label>
          <input
            id="base-pace"
            type="text"
            inputMode="text"
            value={displayPace}
            onFocus={() => {
              setEditingPace(true);
              setPaceText(formatPace(state.paceMinKm));
            }}
            onBlur={(e) => {
              commitPace(e.target.value);
              setEditingPace(false);
            }}
            onChange={(e) => {
              setPaceText(e.target.value);
              commitPace(e.target.value);
            }}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="temperature"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Temperature
          </label>
          <div className="flex items-center gap-2">
            <input
              id="temperature"
              type="number"
              value={state.temperature}
              onChange={(e) => update({ temperature: Number(e.target.value) })}
              min={tempUnit === "C" ? -20 : -4}
              max={tempUnit === "C" ? 50 : 122}
              step={1}
              className={inputClass}
            />
            <select
              value={tempUnit}
              onChange={(e) => {
                const newUnit = e.target.value as TempUnit;
                const converted =
                  newUnit === "C"
                    ? Math.round(fToC(state.temperature))
                    : Math.round(cToF(state.temperature));
                update({ tempUnit: newUnit, temperature: converted });
              }}
              className={selectClass}
            >
              <option value="F">°F</option>
              <option value="C">°C</option>
            </select>
          </div>
        </div>
      </div>

      {/* Slowdown summary */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-xl bg-orange-50 p-4 dark:bg-orange-950/30"
      >
        <div className="text-sm font-medium text-orange-800 dark:text-orange-300">
          {result.slowdownPct > 0
            ? `+${(result.slowdownPct * 100).toFixed(1)}% slower in the heat`
            : "No adjustment needed at this temperature"}
        </div>
      </motion.div>

      {/* Adjusted pace */}
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Adjusted pace
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            {
              label: "min/km",
              original: formatPaceValue(result.originalPaceSecPerKm),
              adjusted: formatPaceValue(result.adjustedPaceSecPerKm),
            },
            {
              label: "min/mi",
              original: formatPaceValue(result.originalPaceSecPerMi),
              adjusted: formatPaceValue(result.adjustedPaceSecPerMi),
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className={cardClass}
            >
              <div className="text-xs font-medium text-neutral-500">
                {item.label}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {item.adjusted}
                </span>
                {result.slowdownPct > 0 && (
                  <span className="text-sm text-neutral-400 line-through">
                    {item.original}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick reference table */}
      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Quick reference
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {TEMP_PRESETS_F.map((presetF, i) => {
            const pct = heatSlowdownPct(presetF);
            const displayTemp =
              tempUnit === "C"
                ? `${Math.round(fToC(presetF))} °C`
                : `${presetF} °F`;
            const adjustedSec = state.paceMinKm * (1 + pct);
            return (
              <motion.div
                key={presetF}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className={`${cardClass} cursor-pointer transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                  Math.round(tempF) === presetF
                    ? "ring-2 ring-orange-400 dark:ring-orange-500"
                    : ""
                }`}
                onClick={() =>
                  update({
                    temperature:
                      tempUnit === "C" ? Math.round(fToC(presetF)) : presetF,
                  })
                }
              >
                <div className="text-xs font-medium text-neutral-500">
                  {displayTemp}
                </div>
                <div className="mt-1 text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {formatPaceValue(adjustedSec)}
                </div>
                <div className="text-xs text-neutral-400">
                  +{(pct * 100).toFixed(1)}%
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function HeatPace() {
  return (
    <Suspense>
      <HeatPaceInner />
    </Suspense>
  );
}
