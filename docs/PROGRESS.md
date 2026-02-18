# Implementation Progress

## Phase 1: Project Scaffold & Tooling ✅
- [x] Write docs (PRD, System Design, Implementation Plan)
- [x] Initialize git repo
- [x] Scaffold Next.js 15 (App Router, TypeScript, Tailwind CSS v4, ESLint)
- [x] Install runtime deps (framer-motion, lucide-react)
- [x] Install dev deps (vitest, playwright, prettier)
- [x] Configure vitest, playwright, prettier
- [x] Add package.json scripts (test, test:e2e, format, type-check)
- [x] Create CLAUDE.md
- [x] Verify: dev, build, test, lint all pass

## Phase 2: Shared Infrastructure ✅
- [x] src/lib/types.ts — ToolConfig interface
- [x] src/hooks/use-local-storage.ts — SSR-safe localStorage hook
- [x] src/hooks/use-tool-state.ts — per-tool state persistence
- [x] src/components/tool-shell.tsx — shared tool wrapper
- [x] src/tools/registry.ts — tool catalog
- [x] src/app/tools/[slug]/page.tsx — dynamic route
- [x] src/app/page.tsx — home page with tool grid
- [x] src/app/layout.tsx — root layout
- [x] Verify: home renders, /tools/nonexistent → 404

## Phase 3: Heart Rate Zones Calculator ✅
- [x] src/tools/hr-zones/logic.ts — pure zone calculation functions
- [x] src/tools/hr-zones/logic.test.ts — unit tests (6 passing)
- [x] src/tools/hr-zones/config.ts — metadata + defaults
- [x] src/tools/hr-zones/component.tsx — UI with live updating
- [x] Register in registry.ts + toolComponents
- [x] Verify: build passes, tests pass

## Phase 4: Pace Converter ✅
- [x] src/tools/pace-converter/logic.ts — conversion functions
- [x] src/tools/pace-converter/logic.test.ts — unit tests (13 passing)
- [x] src/tools/pace-converter/config.ts — metadata + defaults
- [x] src/tools/pace-converter/component.tsx — bidirectional live UI
- [x] Register in registry.ts + toolComponents
- [x] Verify: build passes, 19 total tests passing

## Phase 5: CI/CD Pipeline ✅
- [x] .github/workflows/ci.yml — PR checks (lint, type-check, test, build, e2e)
- [x] .github/workflows/deploy.yml — deploy on main
- [ ] Verify: CI passes on push (needs GitHub remote)

## Phase 6: Capacitor Setup ✅
- [x] Install Capacitor core + CLI
- [x] Init Capacitor config (capacitor.config.ts)
- [x] Configure static export in next.config.ts (env-gated)
- [x] Add build:mobile script
- [ ] Add iOS/Android platforms (deferred — requires Xcode/Android SDK)
- [ ] Verify: builds and opens in simulator (deferred)

## Phase 7: Polish & Finalize ✅
- [x] Framer Motion entrance animations (tool cards, zone bars, race times)
- [x] Animated zone bars and result transitions
- [x] Responsive layout (desktop side-by-side, mobile stacked)
- [x] Dark/light mode (system preference via dark: classes)
- [x] Meta tags (OpenGraph, theme-color)
- [x] E2e tests (Playwright) — 5 test cases
- [x] Final CLAUDE.md update
- [x] Verify: build, test (19 passing), type-check, lint all pass
