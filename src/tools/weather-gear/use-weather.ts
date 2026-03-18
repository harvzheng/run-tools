"use client";

import { useState, useCallback } from "react";
import {
  buildWeatherApiUrl,
  buildGeocodingUrl,
  parseWeatherResponse,
  type WeatherConditions,
  type GeocodingResult,
} from "./logic";
import { getCurrentPosition } from "@/lib/geolocation";

interface LocationInfo {
  name: string;
  latitude: number;
  longitude: number;
}

interface UseWeatherReturn {
  location: LocationInfo | null;
  weather: WeatherConditions | null;
  loading: boolean;
  error: string | null;
  geocodingResults: GeocodingResult[];
  geocodingLoading: boolean;
  detectLocation: () => void;
  searchLocation: (query: string) => void;
  selectLocation: (result: GeocodingResult) => void;
  refresh: () => void;
}

export function useWeather(): UseWeatherReturn {
  const [location, setLocation] = useState<LocationInfo | null>(null);
  const [weather, setWeather] = useState<WeatherConditions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geocodingResults, setGeocodingResults] = useState<GeocodingResult[]>(
    [],
  );
  const [geocodingLoading, setGeocodingLoading] = useState(false);

  const fetchWeather = useCallback(
    async (lat: number, lon: number, name: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(buildWeatherApiUrl(lat, lon));
        if (!res.ok) throw new Error("Failed to fetch weather data");
        const data = await res.json();
        setWeather(parseWeatherResponse(data));
        setLocation({ name, latitude: lat, longitude: lon });
      } catch {
        setError("Could not fetch weather. Try again or enter temperature manually.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const detectLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    getCurrentPosition()
      .then((pos) => {
        fetchWeather(pos.latitude, pos.longitude, "Current Location");
      })
      .catch((err) => {
        setLoading(false);
        if (err?.code === 1 /* PERMISSION_DENIED */) {
          setError(
            "Location access denied. Search for a city or enter temperature manually.",
          );
        } else {
          setError(
            "Could not detect location. Try searching for a city instead.",
          );
        }
      });
  }, [fetchWeather]);

  const searchLocation = useCallback(async (query: string) => {
    if (query.length < 2) {
      setGeocodingResults([]);
      return;
    }
    setGeocodingLoading(true);
    try {
      const res = await fetch(buildGeocodingUrl(query));
      if (!res.ok) throw new Error("Geocoding failed");
      const data = await res.json();
      setGeocodingResults(data.results ?? []);
    } catch {
      setGeocodingResults([]);
    } finally {
      setGeocodingLoading(false);
    }
  }, []);

  const selectLocation = useCallback(
    (result: GeocodingResult) => {
      const name = result.admin1
        ? `${result.name}, ${result.admin1}`
        : `${result.name}, ${result.country}`;
      setGeocodingResults([]);
      fetchWeather(result.latitude, result.longitude, name);
    },
    [fetchWeather],
  );

  const refresh = useCallback(() => {
    if (location) {
      fetchWeather(location.latitude, location.longitude, location.name);
    }
  }, [location, fetchWeather]);

  return {
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
  };
}
