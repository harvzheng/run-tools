export interface ChangelogEntry {
  date: string;
  version: string;
  title: string;
  changes: string[];
}

export const changelog: ChangelogEntry[] = [
  {
    date: "2026-02-18",
    version: "0.0.3",
    title: "Pace Converter enhancements",
    changes: [
      "Added custom distance field with km/mi selector",
      "Bidirectional time-to-pace conversion — edit any race or custom time to derive pace",
      "Added back-to-tools navigation on tool pages",
    ],
  },
  {
    date: "2026-02-18",
    version: "0.0.2",
    title: "Branding, about page, changelog",
    changes: [
      "Added RunTools branding with gradient hero and styled nav bar",
      "Added About page with project values",
      "Added Changelog page with structured entries",
      "Restyled tool cards, inputs, zone bars, and race time cards",
    ],
  },
  {
    date: "2026-02-17",
    version: "0.0.1",
    title: "Initial release",
    changes: [
      "Heart Rate Zones calculator with 3 methods (% Max HR, Karvonen, LTHR)",
      "Pace Converter with bidirectional conversion and race time estimates",
      "Capacitor configuration for future mobile builds",
    ],
  },
];
