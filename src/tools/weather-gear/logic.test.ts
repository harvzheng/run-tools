import { describe, it, expect } from "vitest";
import {
  getWeatherDescription,
  isRainy,
  isSnowy,
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  mphToKmh,
  formatTemperature,
  formatWindSpeed,
  buildWeatherApiUrl,
  buildGeocodingUrl,
  parseWeatherResponse,
  calculateEffectiveTemperature,
  getClothingRecommendation,
  weatherFromManualTemp,
  type WeatherConditions,
  type OpenMeteoCurrentResponse,
} from "./logic";

function makeWeather(overrides: Partial<WeatherConditions> = {}): WeatherConditions {
  return {
    temperatureF: 50,
    apparentTemperatureF: 48,
    windSpeedMph: 5,
    windGustsMph: 10,
    precipitationMm: 0,
    rainMm: 0,
    humidityPercent: 50,
    weatherCode: 0,
    ...overrides,
  };
}

describe("getWeatherDescription", () => {
  it("returns description for known codes", () => {
    expect(getWeatherDescription(0)).toBe("Clear sky");
    expect(getWeatherDescription(63)).toBe("Moderate rain");
    expect(getWeatherDescription(75)).toBe("Heavy snow");
    expect(getWeatherDescription(95)).toBe("Thunderstorm");
  });

  it("returns Unknown for unknown codes", () => {
    expect(getWeatherDescription(999)).toBe("Unknown");
  });
});

describe("isRainy", () => {
  it("returns true for rain codes", () => {
    expect(isRainy(51)).toBe(true);
    expect(isRainy(63)).toBe(true);
    expect(isRainy(67)).toBe(true);
    expect(isRainy(80)).toBe(true);
    expect(isRainy(82)).toBe(true);
    expect(isRainy(95)).toBe(true);
  });

  it("returns false for non-rain codes", () => {
    expect(isRainy(0)).toBe(false);
    expect(isRainy(3)).toBe(false);
    expect(isRainy(71)).toBe(false);
  });
});

describe("isSnowy", () => {
  it("returns true for snow codes", () => {
    expect(isSnowy(71)).toBe(true);
    expect(isSnowy(77)).toBe(true);
    expect(isSnowy(85)).toBe(true);
    expect(isSnowy(86)).toBe(true);
  });

  it("returns false for non-snow codes", () => {
    expect(isSnowy(0)).toBe(false);
    expect(isSnowy(63)).toBe(false);
    expect(isSnowy(95)).toBe(false);
  });
});

describe("unit conversions", () => {
  it("converts F to C", () => {
    expect(fahrenheitToCelsius(32)).toBeCloseTo(0);
    expect(fahrenheitToCelsius(212)).toBeCloseTo(100);
    expect(fahrenheitToCelsius(68)).toBeCloseTo(20);
  });

  it("converts C to F", () => {
    expect(celsiusToFahrenheit(0)).toBeCloseTo(32);
    expect(celsiusToFahrenheit(100)).toBeCloseTo(212);
    expect(celsiusToFahrenheit(20)).toBeCloseTo(68);
  });

  it("converts mph to kmh", () => {
    expect(mphToKmh(10)).toBeCloseTo(16.0934);
    expect(mphToKmh(0)).toBe(0);
  });

  it("formats temperature", () => {
    expect(formatTemperature(68, "F")).toBe("68°F");
    expect(formatTemperature(68, "C")).toBe("20°C");
    expect(formatTemperature(33, "C")).toBe("1°C");
  });

  it("formats wind speed", () => {
    expect(formatWindSpeed(10, "mph")).toBe("10 mph");
    expect(formatWindSpeed(10, "kmh")).toBe("16 km/h");
  });
});

describe("API URL builders", () => {
  it("builds weather API URL with correct params", () => {
    const url = buildWeatherApiUrl(40.7, -74.0);
    expect(url).toContain("latitude=40.7");
    expect(url).toContain("longitude=-74");
    expect(url).toContain("temperature_unit=fahrenheit");
    expect(url).toContain("wind_speed_unit=mph");
    expect(url).toContain("current=");
  });

  it("builds geocoding URL with encoded query", () => {
    const url = buildGeocodingUrl("New York");
    expect(url).toContain("name=New%20York");
    expect(url).toContain("count=5");
  });
});

describe("parseWeatherResponse", () => {
  it("maps API fields correctly", () => {
    const data: OpenMeteoCurrentResponse = {
      current: {
        temperature_2m: 55,
        apparent_temperature: 52,
        precipitation: 0.5,
        rain: 0.3,
        weather_code: 61,
        wind_speed_10m: 12,
        wind_gusts_10m: 20,
        relative_humidity_2m: 75,
      },
    };
    const result = parseWeatherResponse(data);
    expect(result.temperatureF).toBe(55);
    expect(result.apparentTemperatureF).toBe(52);
    expect(result.windSpeedMph).toBe(12);
    expect(result.windGustsMph).toBe(20);
    expect(result.precipitationMm).toBe(0.5);
    expect(result.rainMm).toBe(0.3);
    expect(result.humidityPercent).toBe(75);
    expect(result.weatherCode).toBe(61);
  });
});

describe("calculateEffectiveTemperature", () => {
  it("returns apparent temp with no adjustments on calm clear day", () => {
    const weather = makeWeather({ apparentTemperatureF: 50, windSpeedMph: 5 });
    expect(calculateEffectiveTemperature(weather, "easy")).toBe(50);
  });

  it("applies wind penalty above 15 mph", () => {
    const weather = makeWeather({ apparentTemperatureF: 50, windSpeedMph: 25 });
    // Wind excess = 10, penalty = (10/20)*10 = 5
    expect(calculateEffectiveTemperature(weather, "easy")).toBe(45);
  });

  it("caps wind penalty at 10F", () => {
    const weather = makeWeather({ apparentTemperatureF: 50, windSpeedMph: 50 });
    // Wind excess capped at 20, penalty = 10
    expect(calculateEffectiveTemperature(weather, "easy")).toBe(40);
  });

  it("applies rain penalty", () => {
    const weather = makeWeather({
      apparentTemperatureF: 50,
      windSpeedMph: 5,
      precipitationMm: 2,
    });
    expect(calculateEffectiveTemperature(weather, "easy")).toBe(43);
  });

  it("applies moderate intensity bonus", () => {
    const weather = makeWeather({ apparentTemperatureF: 40, windSpeedMph: 5 });
    expect(calculateEffectiveTemperature(weather, "moderate")).toBe(50);
  });

  it("applies hard intensity bonus", () => {
    const weather = makeWeather({ apparentTemperatureF: 40, windSpeedMph: 5 });
    expect(calculateEffectiveTemperature(weather, "hard")).toBe(55);
  });

  it("combines wind, rain, and intensity", () => {
    const weather = makeWeather({
      apparentTemperatureF: 50,
      windSpeedMph: 25,
      rainMm: 1,
    });
    // Base 50 - 5 (wind) - 7 (rain) + 10 (moderate) = 48
    expect(calculateEffectiveTemperature(weather, "moderate")).toBe(48);
  });
});

describe("getClothingRecommendation", () => {
  it("recommends light gear for warm weather", () => {
    const weather = makeWeather({ apparentTemperatureF: 70, windSpeedMph: 3 });
    const rec = getClothingRecommendation(weather, "easy");
    expect(rec.effectiveTemperatureF).toBe(70);
    expect(rec.summary).toContain("light");
    const torso = rec.zones.find((z) => z.zone === "torso");
    expect(torso?.items.some((i) => i.toLowerCase().includes("tank") || i.toLowerCase().includes("singlet"))).toBe(true);
  });

  it("recommends heavy layers for cold weather", () => {
    const weather = makeWeather({ apparentTemperatureF: 10, windSpeedMph: 5 });
    const rec = getClothingRecommendation(weather, "easy");
    expect(rec.effectiveTemperatureF).toBe(10);
    const torso = rec.zones.find((z) => z.zone === "torso");
    expect(torso?.items.some((i) => i.toLowerCase().includes("thermal") || i.toLowerCase().includes("fleece"))).toBe(true);
    // Should have cold alert
    expect(rec.alerts.some((a) => a.type === "cold")).toBe(true);
  });

  it("generates wind alert for high winds", () => {
    const weather = makeWeather({ apparentTemperatureF: 50, windSpeedMph: 25 });
    const rec = getClothingRecommendation(weather, "easy");
    expect(rec.alerts.some((a) => a.type === "wind")).toBe(true);
  });

  it("generates rain alert for rainy weather", () => {
    const weather = makeWeather({
      apparentTemperatureF: 50,
      windSpeedMph: 5,
      weatherCode: 63,
      rainMm: 2,
    });
    const rec = getClothingRecommendation(weather, "easy");
    expect(rec.alerts.some((a) => a.type === "rain")).toBe(true);
  });

  it("generates heat alert for hot weather", () => {
    const weather = makeWeather({ apparentTemperatureF: 90, windSpeedMph: 3 });
    const rec = getClothingRecommendation(weather, "easy");
    expect(rec.alerts.some((a) => a.type === "heat")).toBe(true);
  });

  it("generates humidity alert for hot humid conditions", () => {
    const weather = makeWeather({
      temperatureF: 75,
      apparentTemperatureF: 75,
      humidityPercent: 85,
    });
    const rec = getClothingRecommendation(weather, "easy");
    expect(rec.alerts.some((a) => a.type === "humidity")).toBe(true);
  });

  it("shifts recommendations lighter with hard intensity", () => {
    const weather = makeWeather({ apparentTemperatureF: 40, windSpeedMph: 5 });
    const easyRec = getClothingRecommendation(weather, "easy");
    const hardRec = getClothingRecommendation(weather, "hard");
    // Hard adds 15F so effective goes from 40 to 55, fewer layers
    expect(hardRec.effectiveTemperatureF).toBeGreaterThan(easyRec.effectiveTemperatureF);
  });

  it("excludes empty zones (e.g. no hands in warm weather)", () => {
    const weather = makeWeather({ apparentTemperatureF: 65, windSpeedMph: 3 });
    const rec = getClothingRecommendation(weather, "easy");
    expect(rec.zones.find((z) => z.zone === "hands")).toBeUndefined();
  });
});

describe("weatherFromManualTemp", () => {
  it("creates weather with temp and neutral conditions", () => {
    const weather = weatherFromManualTemp(45);
    expect(weather.temperatureF).toBe(45);
    expect(weather.apparentTemperatureF).toBe(45);
    expect(weather.windSpeedMph).toBe(0);
    expect(weather.precipitationMm).toBe(0);
    expect(weather.weatherCode).toBe(0);
  });
});
