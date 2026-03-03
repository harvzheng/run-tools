import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.runtools.app",
  appName: "RunTools",
  webDir: "out",
  ios: {
    // Use the mobile viewport (not desktop zoom) inside WKWebView
    preferredContentMode: "mobile",
    // Restrict navigation to the app's own domain — required for some
    // App Store capabilities (e.g. StorageAccessAPI, App Clips)
    limitsNavigationsToAppBoundDomains: true,
  },
};

export default config;
