# RunTools

Quick utility tools for runners. No sign-up required — everything runs client-side in the browser.

## Tools

- **Heart Rate Zones** — Calculate training zones using % Max HR, Karvonen (HRR), or Lactate Threshold methods
- **Pace Converter** — Convert between min/km, min/mi, km/h, and mph with race finish time estimates
- **Race Time Predictor** — Project finish times at other distances from a recent race
- **Split Calculator** — Plan even, negative, or positive splits for a target time
- **Treadmill Pace Converter** — Convert treadmill speed and incline to equivalent outdoor pace
- **Weather Gear** — What to wear for your run based on current weather conditions

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Development

```bash
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript check
npm run test         # Unit tests (Vitest)
npm run test:e2e     # E2e tests (Playwright)
npm run format       # Prettier
```

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router, Turbopack)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Vitest](https://vitest.dev) + [Playwright](https://playwright.dev)
- [Capacitor](https://capacitorjs.com) (mobile shell)

## Adding a Tool

Create `src/tools/<slug>/` with:

| File            | Purpose                                                 |
| --------------- | ------------------------------------------------------- |
| `logic.ts`      | Pure computation functions (no React)                   |
| `logic.test.ts` | Unit tests for the logic                                |
| `config.ts`     | Metadata: name, slug, description, icon, tags, defaults |
| `component.tsx` | React UI using `useToolState` for persistence           |

Then register it in `src/tools/registry.ts` and `src/app/tools/[slug]/page.tsx`.

## Roadmap

Future tool ideas (all based on public formulas / open data — no proprietary systems):

- **Age Grade Calculator** — Compare race times across ages using World Athletics age-grading standards
- **VO2max Estimator** — Estimate VO2max from a recent race time or Cooper test result
- **Elevation Adjusted Pace** — See how altitude affects your expected pace
- **Calorie Burn Estimator** — Estimate energy expenditure by pace, weight, and duration (MET-based)
- **Race Fueling Planner** — Carb and fluid intake targets based on race duration and intensity
- **Shoe Mileage Tracker** — Track cumulative miles on each pair of shoes

## License

MIT
