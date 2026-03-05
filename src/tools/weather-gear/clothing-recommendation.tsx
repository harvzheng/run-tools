"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Wind,
  Droplets,
  Sun,
  CloudRain,
  Snowflake,
  Flame,
  ChevronUp,
  ChevronDown,
  Shirt,
  type LucideIcon,
} from "lucide-react";
import {
  formatTemperature,
  type TemperatureUnit,
  type ClothingZone,
  type WeatherAlert,
  type Recommendation,
} from "./logic";

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

interface ClothingRecommendationProps {
  recommendation: Recommendation;
  tempUnit: TemperatureUnit;
}

export function ClothingRecommendation({
  recommendation,
  tempUnit,
}: ClothingRecommendationProps) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
          Clothing Recommendation
        </h2>
        <p className="mt-0.5 text-sm text-neutral-500">
          {recommendation.summary} — dressing for{" "}
          {formatTemperature(recommendation.effectiveTemperatureF, tempUnit)}
        </p>
      </div>

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
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {zone.label}
                </span>
              </div>
              <ul className="mt-2 flex flex-col gap-1">
                {zone.items.map((item) => (
                  <li key={item} className="text-sm text-neutral-500">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
