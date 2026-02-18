export interface ChangelogEntry {
  date: string;
  version: string;
  title: string;
  changes: string[];
}

export const changelog: ChangelogEntry[] = [
  {
    date: "2026-02-18",
    version: "0.2.0",
    title: "Branding, about page, changelog",
    changes: [
      "Added RunTools branding with gradient hero and styled nav bar",
      "Added About page with project values",
      "Added Changelog page with structured entries",
      "Restyled tool cards, inputs, zone bars, and race time cards",
      "Added pre-commit hook to enforce changelog updates",
    ],
  },
  {
    date: "2026-02-17",
    version: "0.1.0",
    title: "Initial release",
    changes: [
      "Heart Rate Zones calculator with 3 methods (% Max HR, Karvonen, LTHR)",
      "Pace Converter with bidirectional conversion and race time estimates",
      "Tool plugin architecture with auto-registry and code-splitting",
      "localStorage persistence via useToolState hook",
      "CI/CD pipeline with GitHub Actions",
      "Capacitor configuration for future mobile builds",
    ],
  },
];
