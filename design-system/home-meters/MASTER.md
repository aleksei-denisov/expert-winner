# Design System — «Дом: счётчики и расходы»

Global source of truth for `public/index.html`. Page overrides, if any, go to `pages/<page>.md`.

Derived with ui-ux-pro-max (`--design-system --density 8 --variance 3 --motion 2` + domain searches
for typography, color and charts). Deviations from the raw tool output are listed at the end.

## 1. Product & context
- Personal household tracker: electricity, cold water, heating-oil dipstick, rent, Nebenkosten, monthly summary.
- One user, Russian UI, mostly iPhone (375–430 px), sometimes desktop. Light + dark (follows OS).
- Job of the UI: enter a number in seconds, then read a few figures at a glance. Numbers are the product.

## 2. Style
**Minimalism & Swiss Style** — clean, functional, grid-based, high contrast, essential.
- Flat surfaces, 1px hairline borders, no gradients, no glass, no decorative shadows.
- Hierarchy comes from type size/weight and spacing, not from colour.
- Icons: inline SVG, Lucide style (24 grid, 1.75 stroke, round caps). **No emoji as icons.**

## 3. Color tokens
Base palette: "Personal Finance Tracker" (trust blue + profit green). Light mode derived for the same hues.
Status colours are never the only signal — always paired with text ("оплачено", "+12 €", "94 % от нормы").

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#F4F6FA` | `#0F172A` | page |
| `--surface` | `#FFFFFF` | `#192134` | cards, tiles |
| `--surface-2` | `#EEF2F7` | `#101A34` | inputs, table zebra, chips |
| `--text` | `#0F172A` | `#F1F5F9` | primary text & numbers |
| `--text-2` | `#475569` | `#94A3B8` | labels, captions (≥4.5:1 on surface) |
| `--border` | `#E2E8F0` | `rgba(255,255,255,.08)` | hairlines |
| `--primary` | `#1E40AF` | `#60A5FA` | buttons, active tab, links, focus |
| `--on-primary` | `#FFFFFF` | `#0F172A` | text on primary |
| `--good` | `#047857` | `#34D399` | within norm, paid, overpaid |
| `--bad` | `#B91C1C` | `#F87171` | over norm, unpaid, underpaid |
| `--warn` | `#B45309` | `#FBBF24` | soon (oil < 45 days) |
| `--ring` | `#1E40AF` | `#FFFFFF` | focus outline |

Chart series (fixed per category, same in every view; light / dark):
rent `#6D28D9`/`#A78BFA` · nebenkosten `#0E7490`/`#22D3EE` · power `#1D4ED8`/`#60A5FA` · water `#0891B2`/`#67E8F9` · oil `#C2410C`/`#FB923C` · norm/average line = `--text-2`, dashed.

## 4. Typography
Pairing **"Dashboard Data"**: **Fira Sans** (UI + figures) with **Fira Code** for meter readings only.
Both have full Cyrillic. Load 400/500/600/700 from Google Fonts, `display=swap`, system-ui fallback.

All numbers: `font-variant-numeric: tabular-nums lining-nums;` right-aligned in tables.

| Role | Size / line | Weight | Notes |
|---|---|---|---|
| KPI value | 28 / 32 | 600 | `--text`, tabular |
| Page title | 22 / 28 | 700 | |
| Section title | 17 / 24 | 600 | |
| Body, inputs, table cells | 16 / 24 | 400 | inputs ≥16px (prevents iOS zoom) |
| Label / caption | 14 / 20 | 500 | `--text-2`, never smaller |
| Micro (units, chart ticks) | 13 / 18 | 500 | the floor — nothing below 13 px |

## 5. Spacing, shape, layout (density 8 — dashboard)
- Spacing scale: 4 · 8 · 12 · 16 · 24 · 32 px.
- Radius: 12 px cards/tiles, 10 px inputs/buttons, 999 px chips/tabs.
- Content max-width 760 px, side padding 16 px, respects `env(safe-area-inset-*)`.
- KPI grid: 2 columns on mobile, 4 on ≥ 720 px. Cards stack with 16 px gap.

## 6. Components
- **Tab bar** — horizontal scrollable chips at the top (6 sections), sticky; active = primary fill. Each chip has icon + text label, ≥44 px tall.
- **Entry card** — visible labels above fields (no placeholder-only labels), date + value + primary button; on mobile button full-width.
- **KPI tile** — label (caption) → value (KPI) → sub-line (caption). Optional progress bar 8 px, value in text too.
- **Data table** — 16 px cells, 12 px vertical padding, right-aligned tabular numbers, units in header, sticky first column only if it scrolls.
- **Delete** — icon button with `aria-label`, 44×44 hit area, two-step confirm ("Удалить?").
- **Status line** — `role="status"` live region under the tabs.
- **Details/settings** — collapsible card at the bottom of each page.

## 7. Charts (Chart.js)
- Monthly values → vertical bars; summary → stacked bars + dashed average line.
- Gridlines `--border`, ticks 13 px `--text-2`, no chart borders. Rounded bar tops 4 px.
- Forecast month: same colour at 45 % opacity **and** "*" in label.
- Every chart is followed by a table with the same numbers (a11y fallback).

## 8. Motion (2 — subtle)
- 150–200 ms colour/opacity transitions on press/hover only. No scroll reveals.
- Respect `prefers-reduced-motion` (disable chart animation).

## 9. Accessibility & interaction
- Contrast ≥ 4.5:1 for all text incl. captions; ≥ 3:1 for borders of inputs.
- Visible focus ring 2 px `--ring`, offset 2 px. Touch targets ≥ 44×44.
- `inputmode="decimal"` for numbers; labels bound to inputs.
- Never colour-only status.

## Deviations from raw tool output
- Tool's `--design-system` suggested Caveat + Quicksand (handwritten). Rejected: unreadable for figures.
  Replaced with the tool's own typography-domain match "Dashboard Data" (Fira Code + Fira Sans).
- Tool's landing "Product Demo" pattern ignored — this is an app, not a landing page.
- GSAP scroll reveal ignored (motion 2, no GSAP dependency needed).
- "Avoid pure white backgrounds": page bg is `#F4F6FA`; only cards are white.
