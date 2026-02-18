# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript type checking (tsc --noEmit)
npm run test         # Vitest unit tests (all)
npx vitest run src/tools/hr-zones/logic.test.ts  # Run a single test file
npm run test:e2e     # Playwright e2e tests (builds + starts server first)
npm run format       # Prettier format
npm run build:mobile # Static export + Capacitor copy (sets STATIC_EXPORT=true)
```

## Architecture

Next.js 15 App Router with Tailwind CSS v4, Framer Motion, and Capacitor for mobile.

**Tool plugin system:** Each tool is a self-contained directory under `src/tools/<slug>/` with four files:
- `logic.ts` — Pure functions with zero React dependencies. All computation lives here.
- `logic.test.ts` — Vitest unit tests for the pure logic.
- `config.ts` — Metadata (`ToolConfig`): name, slug, description, icon, tags, defaultInputs.
- `component.tsx` — `"use client"` React UI that calls logic functions and uses `useToolState` for persistence.

**Adding a tool requires editing two files** beyond the new tool directory:
1. `src/tools/registry.ts` — import config and add to `tools` array
2. `src/app/tools/[slug]/page.tsx` — add dynamic import entry in `toolComponents` map

**Routing:** `src/app/tools/[slug]/page.tsx` is a dynamic route that uses `generateStaticParams` from the registry. Each tool component is loaded via `next/dynamic` for code-splitting.

**State persistence:** `useToolState(slug, defaultInputs)` initializes from URL params → localStorage (`run-tools:<slug>`) → defaults. All tool components must be wrapped in `<Suspense>` because `useToolState` calls `useSearchParams`.

**Shared UI:** `<ToolShell>` wraps every tool with header, back link, and share button. `<ZoneBar>` and `<NumberInput>` are reusable input/output components.

## Key Conventions

- All computation is client-side; no server APIs or data fetching.
- Live results: outputs update on every input change, no submit buttons.
- Path alias: `@/` maps to `src/`.
- Dark mode via Tailwind `dark:` classes (follows system preference).
- Framer Motion for entrance animations on tool cards, zone bars, and results.
- `next.config.ts` uses `output: "export"` only when `STATIC_EXPORT=true` (for Capacitor builds).
