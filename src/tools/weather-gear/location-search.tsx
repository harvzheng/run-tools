"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { NumberInput } from "@/components/number-input";
import {
  MapPin,
  Search,
  Thermometer,
  Loader2,
} from "lucide-react";
import type { TemperatureUnit, GeocodingResult } from "./logic";

interface LocationSearchProps {
  useManualTemp: boolean;
  manualTemp: number;
  tempUnit: TemperatureUnit;
  loading: boolean;
  error: string | null;
  geocodingResults: GeocodingResult[];
  geocodingLoading: boolean;
  onDetectLocation: () => void;
  onSearchLocation: (query: string) => void;
  onSelectLocation: (result: GeocodingResult) => void;
  onToggleManualTemp: () => void;
  onManualTempChange: (value: number) => void;
}

export function LocationSearch({
  useManualTemp,
  manualTemp,
  tempUnit,
  loading,
  error,
  geocodingResults,
  geocodingLoading,
  onDetectLocation,
  onSearchLocation,
  onSelectLocation,
  onToggleManualTemp,
  onManualTempChange,
}: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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
        onSearchLocation(query);
        setShowDropdown(true);
      }, 300);
    },
    [onSearchLocation],
  );

  return (
    <div className="flex flex-col gap-3">
      {!useManualTemp && (
        <div ref={searchRef} className="relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (geocodingResults.length > 0) {
                onSelectLocation(geocodingResults[0]);
                setSearchQuery("");
                setShowDropdown(false);
              }
            }}
            className="relative"
          >
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search city..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() =>
                geocodingResults.length > 0 && setShowDropdown(true)
              }
              className="focus:border-brand-400 focus:ring-brand-100 dark:focus:border-brand-500 dark:focus:ring-brand-500/20 h-11 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-3.5 text-sm transition-all outline-none focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900"
            />
            {geocodingLoading && (
              <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-neutral-400" />
            )}
          </form>

          {showDropdown && geocodingResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
              {geocodingResults.map((r, i) => (
                <button
                  key={`${r.latitude}-${r.longitude}-${i}`}
                  onClick={() => {
                    onSelectLocation(r);
                    setSearchQuery("");
                    setShowDropdown(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                  <span className="text-neutral-900 dark:text-neutral-100">{r.name}</span>
                  <span className="text-neutral-400">
                    {r.admin1 ? `${r.admin1}, ` : ""}
                    {r.country}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {useManualTemp && (
        <NumberInput
          label="Temperature"
          value={
            tempUnit === "C"
              ? Math.round(((manualTemp - 32) * 5) / 9)
              : manualTemp
          }
          onChange={(v) => {
            const f = tempUnit === "C" ? (v * 9) / 5 + 32 : v;
            onManualTempChange(Math.round(f));
          }}
          min={tempUnit === "C" ? -40 : -40}
          max={tempUnit === "C" ? 50 : 120}
          unit={`°${tempUnit}`}
        />
      )}

      <div className="flex gap-2">
        {!useManualTemp && (
          <button
            onClick={onDetectLocation}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-500 transition-colors hover:border-neutral-300 hover:text-neutral-700 disabled:opacity-50 dark:border-neutral-700 dark:hover:border-neutral-600 dark:hover:text-neutral-300"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            Use my location
          </button>
        )}
        <button
          onClick={onToggleManualTemp}
          className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
            useManualTemp
              ? "border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-900/20 dark:text-brand-300"
              : "border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 dark:border-neutral-700 dark:hover:border-neutral-600 dark:hover:text-neutral-300"
          }`}
        >
          <Thermometer className="h-4 w-4" />
          {useManualTemp ? "Search location" : "Enter temp manually"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}
