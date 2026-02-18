# RunTools — Product Requirements Document

## Overview

RunTools is a web application offering a collection of utility tools for runners. It launches as a web app (Next.js) with a clear path to native mobile via Capacitor. The UI uses Magic UI (Tailwind + Framer Motion) for a polished, animated look distinct from typical shadcn-based apps. CI/CD pipeline via GitHub Actions is a first-class concern.

---

## UX Tenets

1. **Zero friction to value** — Every tool should produce a result with the fewest possible inputs. Smart defaults (e.g. pre-filled age, auto-selected unit based on locale) mean users get answers immediately, not after filling out a form.
2. **Live results, no submit buttons** — Outputs update in real time as inputs change. No "Calculate" button standing between the user and their answer.
3. **One screen, no scrolling** — Each tool fits on a single viewport. Inputs and outputs are visible simultaneously so users never lose context.
4. **Remember me** — Returning users see their last-used values pre-filled. The app feels like it knows them without requiring an account.
5. **Shareable results** — One tap to copy results as formatted text or a link with parameters encoded in the URL, so coaches can share zone targets with athletes.
6. **Touch-first, keyboard-friendly** — Large tap targets and swipeable controls for mobile; full keyboard navigation and tabbing for desktop power users.
7. **Instant comprehension** — Use color, proportion, and animation to make numerical results intuitive at a glance (e.g. zone bars scaled by range width, pace highlighted relative to common benchmarks).

---

## Target Users

- Recreational and competitive runners who want quick answers (zone targets, pace math) without signing up for a full training platform
- Coaches who need a reference tool to share with athletes

## MVP Tools

### 1. Heart Rate Zones Calculator
**Purpose:** Calculate training zones from user inputs.

**Inputs:**
- Age (number)
- Resting heart rate (optional, for Karvonen method)
- Max heart rate (optional override — if not provided, estimate from age)
- Method selector: % of Max HR, Karvonen (HRR), Lactate Threshold

**Outputs:**
- 5 zones (Z1–Z5) with BPM ranges and descriptions (e.g. "Easy/Recovery", "Tempo", "VO2max")
- Visual bar/chart showing zones
- Option to copy/share results

**Zone Models:**
| Method | Formula |
|--------|---------|
| % Max HR | Zones as % of max HR (220 - age or user-supplied) |
| Karvonen (HRR) | Target = ((Max HR - Resting HR) x %) + Resting HR |
| Lactate Threshold | Zones based on % of LTHR (user-supplied threshold HR) |

### 2. Pace Converter
**Purpose:** Convert between common running pace/speed formats.

**Inputs:**
- Pace value (e.g. 8:30)
- Unit: min/mi, min/km, mph, km/h

**Outputs:**
- Converted values in all four formats simultaneously
- Common race finish times at that pace (5K, 10K, Half Marathon, Marathon)
- Bi-directional: changing any field updates all others in real time

---

## State & Persistence

- **No user accounts** — all computation is client-side
- **Local storage** for saving preferences:
  - Preferred units (mi/km)
  - Last-used inputs per tool (so returning users don't re-enter data)
  - Preferred HR zone method
- Local storage abstracted behind a hook so it can later be swapped for a backend

---

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Framework | Next.js 15 (App Router) |
| Mobile | Capacitor for iOS/Android shells |
| UI | Magic UI + Tailwind CSS v4 + Framer Motion |
| Hosting | Vercel (web), or Docker for self-hosted CI/CD practice |
| CI/CD | GitHub Actions — lint, type-check, test, build, deploy |
| Performance | Each tool page < 100KB JS (code-split per tool) |
| Accessibility | WCAG 2.1 AA — keyboard nav, screen reader labels, sufficient contrast |
| Browser support | Last 2 versions of Chrome, Safari, Firefox, Edge |
| Testing | Vitest for unit tests, Playwright for e2e |

---

## Out of Scope (for now)

- User accounts / authentication
- Server-side APIs (all tools are client-side calculators)
- Weather API integration (what-to-wear tool deferred to later)
- Push notifications
- App store deployment (Capacitor setup only, not submission)
