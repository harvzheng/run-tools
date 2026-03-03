export interface ChangelogEntry {
  date: string;
  version: string;
  title: string;
  changes: string[];
}

export const changelog: ChangelogEntry[] = [
  {
    date: "2026-03-03",
    version: "0.1.1",
    title: "iOS / TestFlight prep",
    changes: [
      "Added @capacitor/ios package — enables generating the Xcode project with `npm run ios:add`",
      "Added ios:add, ios:open, and ios:sync npm scripts for iOS build workflow",
      "Updated capacitor.config.ts with iOS-specific settings (mobile viewport, domain limits)",
      "Switched build:mobile from cap copy to cap sync so native plugin changes stay in sync",
    ],
  },
  {
    date: "2026-02-26",
    version: "0.1.0",
    title: "VO2max estimator: time + distance input",
    changes: [
      "VO2max estimator now supports entering a total run time and distance (e.g. 20 min 5k) as an alternative to entering pace directly — includes quick-pick buttons for 5k, 10k, half marathon, and marathon",
    ],
  },
  {
    date: "2026-02-26",
    version: "0.0.9",
    title: "VO2max estimator",
    changes: [
      "Added VO2max estimator — estimate aerobic fitness from any training run using pace and heart rate (Daniels-Gilbert formula with Karvonen HR scaling)",
    ],
  },
  {
    date: "2026-02-26",
    version: "0.0.8",
    title: "Home page deduplication",
    changes: [
      "Tools shown in Recent no longer repeat in the All tools section",
    ],
  },
  {
    date: "2026-02-24",
    version: "0.0.7",
    title: "Recently used tools",
    changes: [
      "Home page now surfaces your 2 most recently visited tools in a Recent section",
    ],
  },
  {
    date: "2026-02-22",
    version: "0.0.6",
    title: "Weather gear improvements",
    changes: [
      "More specific layering recommendations — base, mid, and outer layer callouts",
      "Snow and blizzard condition alerts with appropriate gear advice",
      "Improved footwear suggestions based on conditions",
      "Sentence-case labels and consistent equal-height cards",
    ],
  },
  {
    date: "2026-02-19",
    version: "0.0.5",
    title: "New tools, SEO, and analytics",
    changes: [
      "Added Race time predictor — project finish times using the Riegel formula",
      "Added Split calculator — plan even, negative, or positive race splits",
      "Added Treadmill pace converter — convert treadmill speed and incline to equivalent outdoor pace",
      "Added per-tool metadata, Open Graph tags, and JSON-LD schema for search engine rich results",
      "Added robots.txt and auto-updating sitemap.xml",
      "Added Vercel Web Analytics",
    ],
  },
  {
    date: "2026-02-18",
    version: "0.0.4",
    title: "Weather gear tool",
    changes: [
      "Added Weather gear — clothing recommendations based on temperature, wind, and run intensity",
      "City weather search is now a submittable form with geolocation as a secondary option",
    ],
  },
  {
    date: "2026-02-18",
    version: "0.0.3",
    title: "Pace converter enhancements",
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
