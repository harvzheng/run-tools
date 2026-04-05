import { isCapacitor } from "./platform";

interface Position {
  latitude: number;
  longitude: number;
}

/**
 * Cross-platform geolocation wrapper.
 * Uses @capacitor/geolocation in native shells (WKWebView) and falls back
 * to the browser Geolocation API on the web.
 */
export async function getCurrentPosition(): Promise<Position> {
  if (isCapacitor()) {
    const { Geolocation } = await import("@capacitor/geolocation");
    const pos = await Geolocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 10000,
    });
    return {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
  }

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  });
}
