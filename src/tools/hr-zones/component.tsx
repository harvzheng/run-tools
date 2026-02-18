"use client";

import { Suspense } from "react";
import { useToolState } from "@/hooks/use-tool-state";
import { NumberInput } from "@/components/number-input";
import { ZoneBar } from "@/components/zone-bar";
import {
  calculateMaxHR,
  calculateZones,
  formatZonesAsText,
  type HRMethod,
} from "./logic";
import { config } from "./config";
import { Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";

const METHOD_OPTIONS: { value: HRMethod; label: string }[] = [
  { value: "max-hr", label: "% Max HR" },
  { value: "karvonen", label: "Karvonen" },
  { value: "lthr", label: "LTHR" },
];

interface HRZonesState {
  age: number;
  restingHR: number;
  maxHR: number;
  lthr: number;
  method: string;
}

function HRZonesInner() {
  const [state, update] = useToolState<HRZonesState>(
    config.slug,
    config.defaultInputs as HRZonesState,
  );
  const [copied, setCopied] = useState(false);

  const method = state.method as HRMethod;
  const estimatedMax = calculateMaxHR(state.age);
  const effectiveMax = state.maxHR || estimatedMax;

  const zones = calculateZones(method, effectiveMax, state.restingHR, state.lthr);
  const maxBpm = zones[zones.length - 1]?.max ?? 200;

  const handleCopy = useCallback(async () => {
    const methodLabel =
      METHOD_OPTIONS.find((m) => m.value === method)?.label ?? method;
    const text = formatZonesAsText(zones, methodLabel);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable
    }
  }, [zones, method]);

  return (
    <div className="flex flex-col gap-6">
      {/* Method selector */}
      <div className="flex gap-1 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800/50">
        {METHOD_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => update({ method: opt.value })}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              method === opt.value
                ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100"
                : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberInput
          label="Age"
          value={state.age}
          onChange={(age) => {
            const newMax = calculateMaxHR(age);
            update({ age, maxHR: newMax });
          }}
          min={10}
          max={100}
          unit="years"
        />

        {method !== "lthr" && (
          <NumberInput
            label="Max Heart Rate"
            value={effectiveMax}
            onChange={(maxHR) => update({ maxHR })}
            min={100}
            max={230}
            unit="bpm"
          />
        )}

        {method === "karvonen" && (
          <NumberInput
            label="Resting Heart Rate"
            value={state.restingHR}
            onChange={(restingHR) => update({ restingHR })}
            min={30}
            max={120}
            unit="bpm"
          />
        )}

        {method === "lthr" && (
          <NumberInput
            label="Lactate Threshold HR"
            value={state.lthr}
            onChange={(lthr) => update({ lthr })}
            min={100}
            max={220}
            unit="bpm"
          />
        )}
      </div>

      {/* Zone output */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            Training Zones
          </h2>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
            aria-label="Copy zones as text"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {zones.map((zone, i) => (
            <ZoneBar key={zone.name} zone={zone} index={i} maxBpm={maxBpm} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HRZones() {
  return (
    <Suspense>
      <HRZonesInner />
    </Suspense>
  );
}
