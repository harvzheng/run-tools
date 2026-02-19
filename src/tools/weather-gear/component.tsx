"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useToolState } from "@/hooks/use-tool-state";
import { NumberInput } from "@/components/number-input";
import { motion } from "framer-motion";
import {
  MapPin,
  Search,
  RefreshCw,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  Loader2,
  Sun,
  CloudRain,
  Snowflake,
  Flame,
  ChevronUp,
  ChevronDown,
  Shirt,
  type LucideIcon,
} from "lucide-react";
import { config } from "./config";
import { useWeather } from "./use-weather";
import {
  getClothingRecommendation,
  weatherFromManualTemp,
  getWeatherDescription,
  formatTemperature,
  formatWindSpeed,
  isRainy,
  isSnowy,
  type WorkoutIntensity,
  type TemperatureUnit,
  type WindSpeedUnit,
  type ClothingZone,
  type WeatherAlert,
} from "./logic";

interface WeatherGearState {
  intensity: string;
  tempUnit: string;
  windUnit: string;
  manualTemp: number;
  useManualTemp: boolean;
}

const INTENSITY_OPTIONS: { value: WorkoutIntensity; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "hard", label: "Hard" },
];

const ZONE_ICONS: Record<ClothingZone["zone"], LucideIcon> = {
  head: ChevronUp,
  torso: Shirt,
  legs: ChevronDown,
  hands: Wind,
  feet: MapPin,
  accessories: Sun,
};

const ZONE_COLORS: Record<ClothingZone["zone"], string> = {
  head: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  torso: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  legs: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  hands: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  feet: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
  accessories:
    "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
};

const ALERT_STYLES: Record<
  WeatherAlert["type"],
  { icon: LucideIcon; bg: string }
> = {
  wind: {
    icon: Wind,
    bg: "bg-sky-50 border-sky-200 text-sky-800 dark:bg-sky-900/20 dark:border-sky-800 dark:text-sky-300",
  },
  rain: {
    icon: CloudRain,
    bg: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300",
  },
  cold: {
    icon: Snowflake,
    bg: "bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-300",
  },
  heat: {
    icon: Flame,
    bg: "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300",
  },
  humidity: {
    icon: Droplets,
    bg: "bg-teal-50 border-teal-200 text-teal-800 dark:bg-teal-900/20 dark:border-teal-800 dark:text-teal-300",
  },
};

function WeatherGearInner() {
  const [state, update] = useToolState<WeatherGearState>(
    config.slug,
    config.defaultInputs as WeatherGearState,
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

  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const intensity = state.intensity as WorkoutIntensity;
  const tempUnit = state.tempUnit as TemperatureUnit;
  const windUnit = state.windUnit as WindSpeedUnit;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (query.length < 2) {
        setShowDropdown(false);
        return;
      }
      debounceRef.current = setTimeout(() => {
        searchLocation(query);
        setShowDropdown(true);
      }, 300);
    },
    [searchLocation],
  );

  // Determine active weather source
  const activeWeather = state.useManualTemp
    ? weatherFromManualTemp(state.manualTemp)
    : weather;

  const recommendation = activeWeather
    ? getClothingRecommendation(activeWeather, intensity)
    : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Location section */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <button
            onClick={detectLocation}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            Use my location
          </button>
          <button
            onClick={() => update({ useManualTemp: !state.useManualTemp })}
            className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
              state.useManualTemp
                ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-900/20 dark:text-brand-300"
                : "border-neutral-200 text-secondary hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600"
            }`}
          >
            <Thermometer className="mr-1.5 inline h-4 w-4" />
            Manual
          </button>
        </div>

        {!state.useManualTemp && (
          <div ref={searchRef} className="relative">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-tertiary" />
              <input
                type="text"
                placeholder="Search city..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => geocodingResults.length > 0 && setShowDropdown(true)}
                className="focus:border-brand-400 focus:ring-brand-100 dark:focus:border-brand-500 dark:focus:ring-brand-500/20 h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-3.5 text-sm transition-all outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900"
              />
              {geocodingLoading && (
                <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-tertiary" />
              )}
            </div>

            {showDropdown && geocodingResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
                {geocodingResults.map((r, i) => (
                  <button
                    key={`${r.latitude}-${r.longitude}-${i}`}
                    onClick={() => {
                      selectLocation(r);
                      setSearchQuery("");
                      setShowDropdown(false);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-tertiary" />
                    <span className="text-primary">{r.name}</span>
                    <span className="text-tertiary">
                      {r.admin1 ? `${r.admin1}, ` : ""}
                      {r.country}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {state.useManualTemp && (
          <NumberInput
            label="Temperature"
            value={
              tempUnit === "C"
                ? Math.round(((state.manualTemp - 32) * 5) / 9)
                : state.manualTemp
            }
            onChange={(v) => {
              const f = tempUnit === "C" ? (v * 9) / 5 + 32 : v;
              update({ manualTemp: Math.round(f) });
            }}
            min={tempUnit === "C" ? -40 : -40}
            max={tempUnit === "C" ? 50 : 120}
            unit={`°${tempUnit}`}
          />
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}
      </div>

      {/* Intensity selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-label">Workout Intensity</label>
        <div className="flex gap-1 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800/50">
          {INTENSITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update({ intensity: opt.value })}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                intensity === opt.value
                  ? "bg-white text-primary shadow-sm dark:bg-neutral-700"
                  : "text-secondary hover:text-neutral-700 dark:hover:text-neutral-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Unit toggles */}
      <div className="flex gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-label">Temperature</label>
          <div className="flex gap-1 rounded-lg bg-neutral-100 p-0.5 dark:bg-neutral-800/50">
            {(["F", "C"] as const).map((u) => (
              <button
                key={u}
                onClick={() => update({ tempUnit: u })}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  tempUnit === u
                    ? "bg-white text-primary shadow-sm dark:bg-neutral-700"
                    : "text-secondary hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                °{u}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-label">Wind Speed</label>
          <div className="flex gap-1 rounded-lg bg-neutral-100 p-0.5 dark:bg-neutral-800/50">
            {(["mph", "kmh"] as const).map((u) => (
              <button
                key={u}
                onClick={() => update({ windUnit: u })}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  windUnit === u
                    ? "bg-white text-primary shadow-sm dark:bg-neutral-700"
                    : "text-secondary hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                {u === "kmh" ? "km/h" : "mph"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Weather card */}
      {!state.useManualTemp && weather && location && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-sm text-secondary">
                <MapPin className="h-3.5 w-3.5" />
                {location.name}
              </div>
              <div className="mt-1 text-3xl font-bold text-primary">
                {formatTemperature(weather.temperatureF, tempUnit)}
              </div>
              <div className="text-sm text-secondary">
                Feels like{" "}
                {formatTemperature(weather.apparentTemperatureF, tempUnit)}
              </div>
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              className="rounded-lg p-2 text-secondary transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
              aria-label="Refresh weather"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-secondary">
            <span className="flex items-center gap-1">
              <Wind className="h-3.5 w-3.5" />
              {formatWindSpeed(weather.windSpeedMph, windUnit)}
            </span>
            <span className="flex items-center gap-1">
              <Droplets className="h-3.5 w-3.5" />
              {weather.humidityPercent}%
            </span>
            <span>
              {isRainy(weather.weatherCode)
                ? "🌧"
                : isSnowy(weather.weatherCode)
                  ? "🌨"
                  : weather.weatherCode <= 1
                    ? "☀️"
                    : "☁️"}{" "}
              {getWeatherDescription(weather.weatherCode)}
            </span>
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      {recommendation && (
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="text-section">Clothing Recommendation</h2>
            <p className="mt-0.5 text-sm text-secondary">
              {recommendation.summary} — dressing for{" "}
              {formatTemperature(recommendation.effectiveTemperatureF, tempUnit)}
            </p>
          </div>

          {/* Alerts */}
          {recommendation.alerts.length > 0 && (
            <div className="flex flex-col gap-2">
              {recommendation.alerts.map((alert) => {
                const style = ALERT_STYLES[alert.type];
                const AlertIcon = style.icon;
                return (
                  <motion.div
                    key={alert.type}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${style.bg}`}
                  >
                    <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
                    {alert.message}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Body zone cards */}
          <div className="grid gap-2 sm:grid-cols-2">
            {recommendation.zones.map((zone, i) => {
              const ZoneIcon = ZONE_ICONS[zone.zone];
              const colorClass = ZONE_COLORS[zone.zone];
              return (
                <motion.div
                  key={zone.zone}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="rounded-xl bg-neutral-50 p-3.5 dark:bg-neutral-900"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-lg ${colorClass}`}
                    >
                      <ZoneIcon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {zone.label}
                    </span>
                  </div>
                  <ul className="mt-2 flex flex-col gap-1">
                    {zone.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-secondary"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!activeWeather && !loading && !error && (
        <div className="rounded-xl border border-dashed border-neutral-300 py-12 text-center dark:border-neutral-700">
          <AlertTriangle className="mx-auto h-8 w-8 text-tertiary" />
          <p className="mt-2 text-sm text-secondary">
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
