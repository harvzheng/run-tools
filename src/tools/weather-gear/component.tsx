"use client";

import { Suspense } from "react";
import { useToolState } from "@/hooks/use-tool-state";
import { SegmentedControl } from "@/components/segmented-control";
import { AlertTriangle } from "lucide-react";
import { config, type WeatherGearState } from "./config";
import { useWeather } from "./use-weather";
import { LocationSearch } from "./location-search";
import { WeatherCard } from "./weather-card";
import { ClothingRecommendation } from "./clothing-recommendation";
import {
  getClothingRecommendation,
  weatherFromManualTemp,
  type WorkoutIntensity,
  type TemperatureUnit,
  type WindSpeedUnit,
} from "./logic";

const INTENSITY_OPTIONS: { value: WorkoutIntensity; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "hard", label: "Hard" },
];

function WeatherGearInner() {
  const [state, update] = useToolState<WeatherGearState>(
    config.slug,
    config.defaultInputs,
  );
  const {
    location,
    weather,
    loading,
    error,
    geocodingResults,
    geocodingLoading,
    detectLocation,
    searchLocation,
    selectLocation,
    refresh,
  } = useWeather();

  const intensity = state.intensity as WorkoutIntensity;
  const tempUnit = state.tempUnit as TemperatureUnit;
  const windUnit = state.windUnit as WindSpeedUnit;

  const activeWeather = state.useManualTemp
    ? weatherFromManualTemp(state.manualTemp)
    : weather;

  const recommendation = activeWeather
    ? getClothingRecommendation(activeWeather, intensity)
    : null;

  return (
    <div className="flex flex-col gap-6">
      <LocationSearch
        useManualTemp={state.useManualTemp}
        manualTemp={state.manualTemp}
        tempUnit={tempUnit}
        loading={loading}
        error={error}
        geocodingResults={geocodingResults}
        geocodingLoading={geocodingLoading}
        onDetectLocation={detectLocation}
        onSearchLocation={searchLocation}
        onSelectLocation={selectLocation}
        onToggleManualTemp={() =>
          update({ useManualTemp: !state.useManualTemp })
        }
        onManualTempChange={(v) => update({ manualTemp: v })}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Workout Intensity
        </label>
        <SegmentedControl
          value={intensity}
          onChange={(value) => update({ intensity: value })}
          options={INTENSITY_OPTIONS}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Temperature
          </label>
          <div className="flex gap-1 rounded-lg bg-neutral-100 p-0.5 dark:bg-neutral-800/50">
            {(["F", "C"] as const).map((u) => (
              <button
                key={u}
                onClick={() => update({ tempUnit: u })}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  tempUnit === u
                    ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100"
                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                °{u}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Wind Speed
          </label>
          <div className="flex gap-1 rounded-lg bg-neutral-100 p-0.5 dark:bg-neutral-800/50">
            {(["mph", "kmh"] as const).map((u) => (
              <button
                key={u}
                onClick={() => update({ windUnit: u })}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  windUnit === u
                    ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100"
                    : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                {u === "kmh" ? "km/h" : "mph"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!state.useManualTemp && weather && location && (
        <WeatherCard
          locationName={location.name}
          weather={weather}
          tempUnit={tempUnit}
          windUnit={windUnit}
          loading={loading}
          onRefresh={refresh}
        />
      )}

      {recommendation && (
        <ClothingRecommendation
          recommendation={recommendation}
          tempUnit={tempUnit}
        />
      )}

      {!activeWeather && !loading && !error && (
        <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
          <AlertTriangle className="mx-auto h-8 w-8 text-neutral-400" />
          <p className="mt-2 text-sm text-neutral-500">
            Use your location, search for a city, or enter a temperature manually
          </p>
        </div>
      )}
    </div>
  );
}

export default function WeatherGear() {
  return (
    <Suspense>
      <WeatherGearInner />
    </Suspense>
  );
}
