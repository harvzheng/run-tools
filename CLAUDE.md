# RunTools

Utility tools for runners — Next.js 15, Tailwind CSS v4, Framer Motion.

## Commands

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npm run type-check   # TypeScript type checking (tsc --noEmit)
npm run test         # Vitest unit tests
npm run test:watch   # Vitest in watch mode
npm run test:e2e     # Playwright e2e tests (builds first)
npm run format       # Prettier format all files
npm run format:check # Prettier check formatting
npm run build:mobile # Static export + Capacitor copy
```

## Architecture

- **Tool plugin pattern**: Each tool lives in `src/tools/<slug>/` with `config.ts`, `component.tsx`, `logic.ts`, `logic.test.ts`
- **logic.ts**: Pure functions, zero React deps, unit-testable
- **component.tsx**: React UI (`"use client"`), uses `useToolState` for persistence
- **config.ts**: Metadata (name, slug, description, icon, tags, defaultInputs)
- **Registry**: `src/tools/registry.ts` — imports all tool configs
- **Dynamic route**: `src/app/tools/[slug]/page.tsx` — lazy-loads tool component by slug

## Adding a New Tool

1. Create `src/tools/<slug>/` with `config.ts`, `component.tsx`, `logic.ts`, `logic.test.ts`
2. Add import in `src/tools/registry.ts` and push config into `tools` array
3. Add dynamic import entry in `src/app/tools/[slug]/page.tsx` `toolComponents` map
4. Done — routing, code-splitting, catalog display all handled

## Key Conventions

- All computation is client-side, no server APIs
- State persisted in localStorage via `useToolState` hook
- Live results — no submit buttons, outputs update on input change
- Path alias: `@/` maps to `src/`
- Dark mode via `dark:` Tailwind classes (system preference)
- Framer Motion for entrance animations

## Testing

- Unit tests: `src/tools/*/logic.test.ts` — pure function tests with Vitest
- E2e tests: `e2e/*.spec.ts` — Playwright against production build
