"use client";

import { Suspense } from "react";
import { useToolState } from "@/hooks/use-tool-state";
import { NumberInput } from "@/components/number-input";
import { inputClass, selectClass } from "@/lib/styles";
import { motion } from "framer-motion";
import { RecentChips } from "@/components/recent-chips";
import { useRecentValues } from "@/hooks/use-recent-values";
import { config, type TreadmillState } from "./config";
import { equivalentFlatSpeed, formatPaceValue, type SpeedUnit } from "./logic";

function TreadmillPaceInner() {
  const [state, update] = useToolState<TreadmillState>(
    config.slug,
    config.defaultInputs,
  );

  const recentSpeed = useRecentValues("treadmill:speed");
  const speedUnit = (state.speedUnit ?? "km/h") as SpeedUnit;
  const result = equivalentFlatSpeed(state.speed, speedUnit, state.incline);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="treadmill-speed"
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            Treadmill Speed
          </label>
          <div className="flex items-center gap-2">
            <input
              id="treadmill-speed"
              type="number"
              min={3}
              step={0.1}
              value={state.speed}
              onChange={(e) => update({ speed: Number(e.target.value) })}
              onBlur={() => recentSpeed.record(state.speed)}
              className={inputClass}
            />
            <select
              value={speedUnit}
              onChange={(e) =>
                update({ speedUnit: e.target.value as SpeedUnit })
              }
              className={selectClass}
            >
              <option value="km/h">km/h</option>
              <option value="mph">mph</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <NumberInput
            label="Incline"
            value={state.incline}
            onChange={(incline) => update({ incline })}
            min={-3}
            max={15}
            step={0.5}
            unit="%"
          />
          <RecentChips
            values={recentSpeed.values}
            currentValue={state.speed}
            onChange={(v) => update({ speed: v })}
            format={(v) => `${v} ${speedUnit}`}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Equivalent outdoor pace
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            {
              label: "min/km",
              value: formatPaceValue(result.paceSecondsPerKm),
            },
            {
              label: "min/mi",
              value: formatPaceValue(result.paceSecondsPerMi),
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="rounded-xl bg-neutral-50 p-3.5 dark:bg-neutral-900"
            >
              <div className="text-xs font-medium text-neutral-500">
                {item.label}
              </div>
              <div className="mt-1 text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {item.value}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Equivalent flat speed
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { label: "km/h", value: result.flatSpeedKmh.toFixed(1) },
            { label: "mph", value: result.flatSpeedMph.toFixed(1) },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="rounded-xl bg-neutral-50 p-3.5 dark:bg-neutral-900"
            >
              <div className="text-xs font-medium text-neutral-500">
                {item.label}
              </div>
              <div className="mt-1 text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {item.value}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TreadmillPace() {
  return (
    <Suspense>
      <TreadmillPaceInner />
    </Suspense>
  );
}
