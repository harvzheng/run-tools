/** Check whether the app is running inside a Capacitor native shell. */
export function isCapacitor(): boolean {
  return (
    typeof window !== "undefined" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    !!(window as any).Capacitor
  );
}

/** Return the current native platform, or `"web"` when running in a browser. */
export function isNativePlatform(): "ios" | "android" | "web" {
  if (!isCapacitor()) return "web";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cap = (window as any).Capacitor;
  const platform: string | undefined = cap?.getPlatform?.();
  if (platform === "ios") return "ios";
  if (platform === "android") return "android";
  return "web";
}
