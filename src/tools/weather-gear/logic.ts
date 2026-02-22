// --- Types ---

export type TemperatureUnit = "F" | "C";
export type WindSpeedUnit = "mph" | "kmh";
export type WorkoutIntensity = "easy" | "moderate" | "hard";

export interface WeatherConditions {
  temperatureF: number;
  apparentTemperatureF: number;
  windSpeedMph: number;
  windGustsMph: number;
  precipitationMm: number;
  rainMm: number;
  humidityPercent: number;
  weatherCode: number;
}

export interface ClothingZone {
  zone: "head" | "torso" | "legs" | "hands" | "feet" | "accessories";
  label: string;
  items: string[];
  icon: string;
}

export interface WeatherAlert {
  type: "wind" | "rain" | "cold" | "heat" | "humidity";
  message: string;
}

export interface Recommendation {
  effectiveTemperatureF: number;
  zones: ClothingZone[];
  alerts: WeatherAlert[];
  summary: string;
}

export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface OpenMeteoCurrentResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    precipitation: number;
    rain: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_gusts_10m: number;
    relative_humidity_2m: number;
  };
}

// --- Weather descriptions (WMO codes) ---

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

export function getWeatherDescription(weatherCode: number): string {
  return WMO_DESCRIPTIONS[weatherCode] ?? "Unknown";
}

export function isRainy(weatherCode: number): boolean {
  return (
    (weatherCode >= 51 && weatherCode <= 67) ||
    (weatherCode >= 80 && weatherCode <= 82) ||
    weatherCode >= 95
  );
}

export function isSnowy(weatherCode: number): boolean {
  return (
    (weatherCode >= 71 && weatherCode <= 77) ||
    (weatherCode >= 85 && weatherCode <= 86)
  );
}

// --- Unit conversions ---

export function fahrenheitToCelsius(f: number): number {
  return ((f - 32) * 5) / 9;
}

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function mphToKmh(mph: number): number {
  return mph * 1.60934;
}

export function formatTemperature(f: number, unit: TemperatureUnit): string {
  if (unit === "C") {
    return `${Math.round(fahrenheitToCelsius(f))}°C`;
  }
  return `${Math.round(f)}°F`;
}

export function formatWindSpeed(mph: number, unit: WindSpeedUnit): string {
  if (unit === "kmh") {
    return `${Math.round(mphToKmh(mph))} km/h`;
  }
  return `${Math.round(mph)} mph`;
}

// --- API URL builders ---

export function buildWeatherApiUrl(lat: number, lon: number): string {
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_gusts_10m,relative_humidity_2m&temperature_unit=fahrenheit&wind_speed_unit=mph`;
}

export function buildGeocodingUrl(query: string): string {
  return `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
}

// --- Response parsing ---

export function parseWeatherResponse(
  data: OpenMeteoCurrentResponse,
): WeatherConditions {
  const c = data.current;
  return {
    temperatureF: c.temperature_2m,
    apparentTemperatureF: c.apparent_temperature,
    windSpeedMph: c.wind_speed_10m,
    windGustsMph: c.wind_gusts_10m,
    precipitationMm: c.precipitation,
    rainMm: c.rain,
    humidityPercent: c.relative_humidity_2m,
    weatherCode: c.weather_code,
  };
}

// --- Effective temperature ---

export function calculateEffectiveTemperature(
  weather: WeatherConditions,
  intensity: WorkoutIntensity,
): number {
  let temp = weather.apparentTemperatureF;

  // Wind penalty: above 15 mph, subtract up to 10F (linear scale up to 35 mph)
  if (weather.windSpeedMph > 15) {
    const windExcess = Math.min(weather.windSpeedMph - 15, 20);
    temp -= (windExcess / 20) * 10;
  }

  // Rain/precipitation penalty
  if (weather.precipitationMm > 0 || weather.rainMm > 0) {
    temp -= 7;
  }

  // Intensity bonus (harder effort = more body heat)
  if (intensity === "moderate") {
    temp += 10;
  } else if (intensity === "hard") {
    temp += 15;
  }

  return Math.round(temp);
}

// --- Clothing recommendation engine ---

interface BracketDef {
  minF: number;
  maxF: number;
  torso: string[];
  legs: string[];
  head: string[];
  hands: string[];
  feet: string[];
  accessories: string[];
}

const BRACKETS: BracketDef[] = [
  {
    minF: -Infinity,
    maxF: 20,
    torso: ["3 layers"],
    legs: ["Insulated tights", "Wind-resistant over-tights"],
    head: ["Balaclava or thick winter hat"],
    hands: ["Heavy mittens or lobster gloves"],
    feet: ["Thick wool socks", "Waterproof shoes"],
    accessories: ["Neck gaiter", "Hand warmers"],
  },
  {
    minF: 20,
    maxF: 25,
    torso: ["3 layers"],
    legs: ["Fleece-lined tights"],
    head: ["Thick winter hat"],
    hands: ["Double gloves or heavy mittens"],
    feet: ["Thick wool socks"],
    accessories: ["Neck gaiter"],
  },
  {
    minF: 25,
    maxF: 30,
    torso: ["3 layers"],
    legs: ["Fleece-lined tights"],
    head: ["Winter hat"],
    hands: ["Mittens or thick gloves"],
    feet: ["Midweight wool socks"],
    accessories: [],
  },
  {
    minF: 30,
    maxF: 35,
    torso: ["2 layers + vest"],
    legs: ["Thicker tights"],
    head: ["Fleece headband or light hat"],
    hands: ["Thick gloves"],
    feet: ["Midweight socks"],
    accessories: [],
  },
  {
    minF: 35,
    maxF: 40,
    torso: ["2 layers"],
    legs: ["Full tights"],
    head: ["Light headband"],
    hands: ["Thin gloves"],
    feet: ["Regular running socks"],
    accessories: [],
  },
  {
    minF: 40,
    maxF: 45,
    torso: ["Long sleeve + vest"],
    legs: ["Capris or half-tights"],
    head: ["Light headband"],
    hands: ["Thin gloves"],
    feet: ["Regular running socks"],
    accessories: [],
  },
  {
    minF: 45,
    maxF: 50,
    torso: ["Long sleeve"],
    legs: ["Longer shorts or capris"],
    head: ["Light hat optional"],
    hands: [],
    feet: ["Regular running socks"],
    accessories: [],
  },
  {
    minF: 50,
    maxF: 60,
    torso: ["Long sleeve"],
    legs: ["Shorts"],
    head: ["Optional headband"],
    hands: [],
    feet: ["Light running socks"],
    accessories: [],
  },
  {
    minF: 60,
    maxF: Infinity,
    torso: ["Short sleeve"],
    legs: ["Shorts"],
    head: ["Sun hat or visor"],
    hands: [],
    feet: ["Light running socks"],
    accessories: ["Sunglasses", "Sunscreen"],
  },
];

function getBracket(effectiveF: number): BracketDef {
  return (
    BRACKETS.find((b) => effectiveF >= b.minF && effectiveF < b.maxF) ??
    BRACKETS[BRACKETS.length - 1]
  );
}

function buildAlerts(
  weather: WeatherConditions,
  effectiveF: number,
): WeatherAlert[] {
  const alerts: WeatherAlert[] = [];

  if (weather.windSpeedMph >= 20) {
    alerts.push({
      type: "wind",
      message: `High winds at ${Math.round(weather.windSpeedMph)} mph — wear a wind-resistant outer layer`,
    });
  }

  if (isRainy(weather.weatherCode) || weather.rainMm > 0) {
    alerts.push({
      type: "rain",
      message: "Rain expected — wear water-resistant outer layer and a brimmed hat",
    });
  }

  if (effectiveF < 20) {
    alerts.push({
      type: "cold",
      message: "Extreme cold — cover all exposed skin and consider shortening your run",
    });
  }

  if (effectiveF > 80) {
    alerts.push({
      type: "heat",
      message: "High heat — stay hydrated, slow your pace, and consider running early or late",
    });
  }

  if (weather.humidityPercent >= 80 && weather.temperatureF > 65) {
    alerts.push({
      type: "humidity",
      message: `Humidity at ${weather.humidityPercent}% — sweat won't evaporate as easily, take it easy`,
    });
  }

  return alerts;
}

function buildSummary(effectiveF: number): string {
  if (effectiveF < 20) return "Bundle up — extreme cold conditions";
  if (effectiveF < 30) return "Heavy layers needed — dress warmly";
  if (effectiveF < 40) return "Cold conditions — layer up well";
  if (effectiveF < 50) return "Cool weather — moderate layers";
  if (effectiveF < 60) return "Mild conditions — light layers";
  if (effectiveF < 75) return "Comfortable weather — dress light";
  return "Warm conditions — stay cool and hydrated";
}

const ZONE_ICONS: Record<ClothingZone["zone"], string> = {
  head: "hat",
  torso: "shirt",
  legs: "pants",
  hands: "gloves",
  feet: "shoe",
  accessories: "star",
};

const ZONE_LABELS: Record<ClothingZone["zone"], string> = {
  head: "Head",
  torso: "Torso",
  legs: "Legs",
  hands: "Hands",
  feet: "Feet",
  accessories: "Accessories",
};

export function getClothingRecommendation(
  weather: WeatherConditions,
  intensity: WorkoutIntensity,
): Recommendation {
  const effectiveF = calculateEffectiveTemperature(weather, intensity);
  const bracket = getBracket(effectiveF);
  const alerts = buildAlerts(weather, effectiveF);

  const zoneKeys: ClothingZone["zone"][] = [
    "head",
    "torso",
    "hands",
    "legs",
    "feet",
    "accessories",
  ];

  const zones: ClothingZone[] = zoneKeys
    .filter((zone) => bracket[zone].length > 0)
    .map((zone) => ({
      zone,
      label: ZONE_LABELS[zone],
      items: bracket[zone],
      icon: ZONE_ICONS[zone],
    }));

  return {
    effectiveTemperatureF: effectiveF,
    zones,
    alerts,
    summary: buildSummary(effectiveF),
  };
}

// --- Manual mode helper ---

export function weatherFromManualTemp(tempF: number): WeatherConditions {
  return {
    temperatureF: tempF,
    apparentTemperatureF: tempF,
    windSpeedMph: 0,
    windGustsMph: 0,
    precipitationMm: 0,
    rainMm: 0,
    humidityPercent: 50,
    weatherCode: 0,
  };
}
