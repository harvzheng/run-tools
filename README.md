# RunTools

Quick utility tools for runners. No sign-up required — everything runs client-side in the browser.

## Tools

- **Heart Rate Zones** — Calculate training zones using % Max HR, Karvonen (HRR), or Lactate Threshold methods
- **Pace Converter** — Convert between min/km, min/mi, km/h, and mph with race finish time estimates

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

| File | Purpose |
|------|---------|
| `logic.ts` | Pure computation functions (no React) |
| `logic.test.ts` | Unit tests for the logic |
| `config.ts` | Metadata: name, slug, description, icon, tags, defaults |
| `component.tsx` | React UI using `useToolState` for persistence |

Then register it in `src/tools/registry.ts` and `src/app/tools/[slug]/page.tsx`.

## License

MIT
