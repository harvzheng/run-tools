# Implementation Plan

## Context

Greenfield project — `/Users/harvey/Development/sports/run-tools/` is an empty directory. We need to scaffold the entire project from scratch, then build out the two MVP tools.

Implementation is ordered so that each phase produces something runnable/verifiable before moving to the next.

---

## Phase 1: Project Scaffold & Tooling

**Goal:** Working Next.js app with all dev tooling configured. Can run `npm run dev` and see a blank page.

1. Write `docs/PRD.md` and `docs/SYSTEM_DESIGN.md` into the project
2. Initialize git repo
3. Scaffold Next.js 15 (App Router, TypeScript, Tailwind CSS v4, ESLint)
   ```
   npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
   ```
4. Install additional dependencies:
   - `framer-motion` — animations
   - `lucide-react` — icons
   - Magic UI components (installed via CLI as needed)
5. Install dev dependencies:
   - `vitest @testing-library/react @testing-library/jest-dom` — unit testing
   - `@playwright/test` — e2e testing
   - `prettier prettier-plugin-tailwindcss` — formatting
6. Configure:
   - `vitest.config.ts` — with path aliases matching tsconfig
   - `playwright.config.ts` — run against `next build && next start`
   - `.prettierrc` — with Tailwind plugin
   - Add scripts to `package.json`: `test`, `test:e2e`, `format`, `type-check`
7. Create `CLAUDE.md` with build/test/lint commands

**Verify:** `npm run dev`, `npm run build`, `npm run test`, `npm run lint` all pass.

---

## Phase 2: Shared Infrastructure

**Goal:** Core types, hooks, and shared components that all tools will use.

1. `src/lib/types.ts` — `ToolConfig` interface
2. `src/hooks/use-local-storage.ts` — SSR-safe localStorage hook
3. `src/hooks/use-tool-state.ts` — per-tool state persistence (URL params → localStorage → defaults)
4. `src/components/tool-shell.tsx` — shared tool wrapper (header, share/copy button, layout)
5. `src/tools/registry.ts` — tool catalog (empty array to start)
6. `src/app/tools/[slug]/page.tsx` — dynamic route with lazy loading
7. `src/app/page.tsx` — home page showing tool catalog grid
8. `src/app/layout.tsx` — root layout with nav, theme setup

**Verify:** Home page renders empty tool grid. Navigating to `/tools/nonexistent` returns 404.

---

## Phase 3: Heart Rate Zones Calculator

**Goal:** First tool fully functional with live results, persistence, and tests.

1. `src/tools/hr-zones/logic.ts` — pure functions:
   - `calculateMaxHR(age: number): number` — 220 - age
   - `calculateZonesMaxHR(maxHR: number): Zone[]`
   - `calculateZonesKarvonen(maxHR: number, restingHR: number): Zone[]`
   - `calculateZonesLTHR(lthr: number): Zone[]`
2. `src/tools/hr-zones/logic.test.ts` — unit tests for all three methods with known-good values
3. `src/tools/hr-zones/config.ts` — metadata + smart defaults (age: 30, method: max-hr)
4. `src/tools/hr-zones/component.tsx` — UI:
   - Age input (number, pre-filled from defaults/localStorage)
   - Method selector (tabs or segmented control)
   - Conditional inputs based on method (resting HR for Karvonen, LTHR for LT)
   - Zone output: colored horizontal bars with BPM ranges + zone names
   - Copy/share button
5. Register in `registry.ts` + add to `toolComponents` map in `[slug]/page.tsx`

**Verify:** Navigate to `/tools/hr-zones`. Change age → zones update instantly. Switch methods → correct inputs appear. Refresh page → last values restored. Copy button works.

---

## Phase 4: Pace Converter

**Goal:** Second tool fully functional, validating the plugin architecture works for a different tool shape.

1. `src/tools/pace-converter/logic.ts` — pure functions:
   - `paceToSeconds(pace: string): number` — parse "8:30" → 510
   - `secondsToPace(seconds: number): string` — 510 → "8:30"
   - `convertPace(value: number, from: PaceUnit, to: PaceUnit): number`
   - `calculateRaceTimes(pacePerKm: number): RaceTimes` — finish times for 5K/10K/HM/M
2. `src/tools/pace-converter/logic.test.ts` — unit tests for conversions + edge cases
3. `src/tools/pace-converter/config.ts` — metadata + defaults
4. `src/tools/pace-converter/component.tsx` — UI:
   - 4 input fields (min/mi, min/km, mph, km/h) — editing any one updates the others live
   - Race finish times table below
   - Unit preference saved to localStorage
5. Register in `registry.ts` + add to `toolComponents` map

**Verify:** Enter a pace in any field → all others update. Race times are correct. Refresh → values persist. Home page now shows 2 tool cards.

---

## Phase 5: CI/CD Pipeline

**Goal:** GitHub Actions running lint, type-check, test, build on every PR.

1. Initialize GitHub repo + push initial code
2. `.github/workflows/ci.yml`:
   - Trigger: push to any branch, PR to main
   - Jobs (parallel): `lint`, `type-check`, `unit-test`
   - Job (sequential after above): `build` → `e2e`
   - Cache: `node_modules` via actions/cache, Playwright browsers
3. `.github/workflows/deploy.yml`:
   - Trigger: push to main
   - Build + deploy (Vercel CLI or Docker build + push)
4. Add branch protection rules on main (require CI pass)

**Verify:** Push a branch, open a PR → all CI checks run and pass. Merge to main → deploy pipeline triggers.

---

## Phase 6: Capacitor Setup

**Goal:** Web app wrapped as a native mobile shell, buildable locally.

1. `npm install @capacitor/core @capacitor/cli`
2. `npx cap init RunTools com.runtools.app`
3. Configure `capacitor.config.ts` — set `webDir` to Next.js static export output
4. Update `next.config.ts` — add `output: 'export'` for static build
5. Add `npm run build:mobile` script: `next build && npx cap copy`
6. `npx cap add ios` and/or `npx cap add android`
7. Add `capacitor/` output directories to `.gitignore` as appropriate

**Verify:** `npm run build:mobile && npx cap open ios` — app opens in Xcode simulator showing the tool catalog.

---

## Phase 7: Polish & Finalize

**Goal:** Animations, responsive design, final UX pass.

1. Add Framer Motion entrance animations to tool cards on home page
2. Add animated transitions for zone bars and result updates
3. Responsive layout: side-by-side inputs/outputs on desktop, stacked on mobile
4. Dark/light mode support via Tailwind `dark:` classes
5. Add `<meta>` tags and `favicon` for SEO/sharing
6. Write e2e tests (Playwright): navigate to each tool, enter values, verify outputs
7. Final `CLAUDE.md` update with all commands and architecture notes

**Verify:** Full e2e test suite passes. Lighthouse score > 90 on all metrics. Manual check on mobile viewport.
