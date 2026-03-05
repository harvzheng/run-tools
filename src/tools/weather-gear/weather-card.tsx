"use client";

import { motion } from "framer-motion";
import { MapPin, RefreshCw, Wind, Droplets } from "lucide-react";
import {
  formatTemperature,
  formatWindSpeed,
  getWeatherDescription,
  isRainy,
  isSnowy,
  type TemperatureUnit,
  type WindSpeedUnit,
  type WeatherConditions,
} from "./logic";

interface WeatherCardProps {
  locationName: string;
  weather: WeatherConditions;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
  loading: boolean;
  onRefresh: () => void;
}

export function WeatherCard({
  locationName,
  weather,
  tempUnit,
  windUnit,
  loading,
  onRefresh,
}: WeatherCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-neutral-500">
            <MapPin className="h-3.5 w-3.5" />
            {locationName}
          </div>
          <div className="mt-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            {formatTemperature(weather.temperatureF, tempUnit)}
          </div>
          <div className="text-sm text-neutral-500">
            Feels like{" "}
            {formatTemperature(weather.apparentTemperatureF, tempUnit)}
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800"
          aria-label="Refresh weather"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-500">
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
  );
}
