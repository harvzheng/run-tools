# System Design

## Guiding Principle: Adding a Tool Should Be One Directory

Adding a new tool to RunTools should require **only** creating a new folder under `src/tools/` with a standard set of files. No editing a central router, no updating a master component list. The tool registry auto-discovers tools at build time.

---

## Directory Structure

```
run-tools/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout (nav, theme, providers)
│   │   ├── page.tsx                # Home — tool catalog/grid
│   │   ├── about/
│   │   │   └── page.tsx            # About page
│   │   ├── changelog/
│   │   │   └── page.tsx            # Changelog page (timeline UI)
│   │   └── tools/
│   │       └── [slug]/
│   │           └── page.tsx        # Dynamic route — renders tool by slug
│   │
│   ├── tools/                      # ← Each tool lives here
│   │   ├── registry.ts             # Auto-generates tool catalog from tool configs
│   │   ├── hr-zones/
│   │   │   ├── config.ts           # Metadata: name, slug, description, icon, tags
│   │   │   ├── component.tsx       # The tool's UI (inputs + outputs)
│   │   │   ├── logic.ts            # Pure functions (zone calculation)
│   │   │   └── logic.test.ts       # Unit tests for the pure logic
│   │   └── pace-converter/
│   │       ├── config.ts
│   │       ├── component.tsx
│   │       ├── logic.ts
│   │       └── logic.test.ts
│   │
│   ├── components/                 # Shared UI components
│   │   ├── nav.tsx                 # Site-wide navigation bar
│   │   ├── tool-shell.tsx          # Shared wrapper: header, back link, layout
│   │   ├── tool-card.tsx           # Tool catalog card with icon badge
│   │   ├── number-input.tsx        # Styled numeric input with unit labels
│   │   └── zone-bar.tsx            # Reusable colored bar visualization
│   │
│   ├── data/
│   │   └── changelog.ts            # Structured changelog entries
│   │
│   ├── hooks/
│   │   ├── use-local-storage.ts    # Generic localStorage hook with SSR safety
│   │   └── use-tool-state.ts       # Per-tool state persistence (wraps useLocalStorage)
│   │
│   ├── lib/
│   │   ├── types.ts                # Shared types (ToolConfig, Zone, Pace, etc.)
│   │   └── utils.ts                # Shared utilities (formatPace, formatTime, etc.)
│   │
│   └── app/
│       └── globals.css             # Tailwind base + brand theme CSS variables
│
├── e2e/                            # Playwright end-to-end tests
├── .github/
│   └── workflows/
│       ├── ci.yml                  # PR checks: lint, type-check, test, build
│       └── deploy.yml              # Main branch: build + deploy
├── capacitor.config.ts             # Capacitor config (webDir: "out")
├── next.config.ts
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

---

## Tool Plugin Architecture

### Tool Config (each tool's `config.ts`)

```ts
// src/tools/hr-zones/config.ts
import type { ToolConfig } from "@/lib/types";

export const config: ToolConfig = {
  slug: "hr-zones",
  name: "Heart Rate Zones",
  description: "Calculate your training zones by heart rate",
  icon: "Heart",           // Lucide icon name
  tags: ["training", "heart rate"],
  defaultInputs: {         // Smart defaults for "zero friction" tenet
    age: 30,
    method: "max-hr",
  },
};
```

### Tool Registry (`registry.ts`)

```ts
// src/tools/registry.ts
// Statically imports all tool configs (tree-shaken — only metadata, not components)
// Components are lazily loaded via dynamic import in the [slug] page

import { config as hrZones } from "./hr-zones/config";
import { config as paceConverter } from "./pace-converter/config";

export const tools: ToolConfig[] = [hrZones, paceConverter];

export function getToolBySlug(slug: string) {
  return tools.find((t) => t.slug === slug);
}
```

### Dynamic Route (`app/tools/[slug]/page.tsx`)

```tsx
// Lazy-loads the correct tool component based on slug
// Each tool is its own code-split chunk

import dynamic from "next/dynamic";
import { getToolBySlug, tools } from "@/tools/registry";
import { notFound } from "next/navigation";

const toolComponents: Record<string, ReturnType<typeof dynamic>> = {
  "hr-zones": dynamic(() => import("@/tools/hr-zones/component")),
  "pace-converter": dynamic(() => import("@/tools/pace-converter/component")),
};

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  const Component = toolComponents[tool.slug];
  return <ToolShell tool={tool}><Component /></ToolShell>;
}
```

### Adding a New Tool (future developer workflow)

1. Create `src/tools/my-new-tool/` with `config.ts`, `component.tsx`, `logic.ts`
2. Add one import line in `registry.ts` + one entry in `toolComponents`
3. Done — routing, code-splitting, catalog display all handled automatically

> **Future improvement:** Could fully auto-discover via a build-time script or Next.js `generateStaticParams` reading the filesystem, eliminating step 2.

---

## Separation of Concerns

```
┌─────────────────────────────────────────────┐
│  component.tsx  (UI layer)                  │
│  - Renders inputs and outputs               │
│  - Calls logic functions on input change    │
│  - Uses useToolState for persistence        │
│  - Wrapped in <ToolShell> for shared chrome │
├─────────────────────────────────────────────┤
│  logic.ts  (pure computation)               │
│  - Zero dependencies on React or DOM        │
│  - Accepts plain data, returns plain data   │
│  - 100% unit-testable with Vitest           │
│  - Shared between web and Capacitor native  │
├─────────────────────────────────────────────┤
│  config.ts  (metadata)                      │
│  - Name, slug, description, icon, tags      │
│  - Default inputs for "zero friction" UX    │
│  - Used by registry + catalog page          │
└─────────────────────────────────────────────┘
```

This separation means:
- **Logic is portable** — the same `logic.ts` works in web, native, or even a CLI
- **Logic is testable** — pure functions, no mocking React
- **UI is swappable** — could rebuild component.tsx for React Native without touching logic

---

## Shared Components

### `<ToolShell>`
Wraps every tool with consistent chrome:
- Tool name + description header
- "Back to tools" link with arrow icon
- Animated entrance via Framer Motion

### `useToolState(slug, defaultInputs)`
Per-tool state hook that:
- Initializes from URL params (for shared links) → falls back to localStorage → falls back to `defaultInputs`
- Saves to localStorage on every change
- SSR-safe (returns defaults on server, hydrates on client)

---

## Capacitor Integration

```
Web-first approach:
  Next.js (SSG export) → static HTML/JS/CSS → Capacitor wraps as native app

Build flow:
  next build → next export → npx cap copy → npx cap open ios/android
```

- Capacitor reads from `out/` (Next.js static export)
- All tools are client-side, so static export works perfectly
- Native features (haptics, share sheet) added via Capacitor plugins as optional enhancements
- `capacitor.config.ts` points `webDir` to Next.js output

---

## CI/CD Pipeline (GitHub Actions)

### PR Pipeline (`ci.yml`)
```
push/PR → ┬─ lint (ESLint + Prettier check)
           ├─ type-check (tsc --noEmit)
           ├─ unit tests (vitest run)
           └─ build (next build)
                └─ e2e tests (playwright against build)
```
All lint/type-check/unit-test jobs run **in parallel**. E2e runs after build succeeds.

### Deploy Pipeline (`deploy.yml`)
```
merge to main → build → deploy to Vercel/Docker
                      → (optional) Capacitor build on release tag
```

---

## Data Flow (per tool interaction)

```
User types input
      │
      ▼
component.tsx captures change
      │
      ▼
Calls logic.ts pure function → returns computed result
      │
      ▼
component.tsx renders result (animated via Framer Motion)
      │
      ▼
useToolState persists inputs to localStorage + URL params
```

No API calls, no server round-trips, no loading states for computation.
