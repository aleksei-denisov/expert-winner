# Design System — «Дом: счётчики и расходы» (v2, «Дом из цветных этажей»)

Replaces v1 (Swiss dashboard), which the client rejected as generic. Source: ui-ux-pro-max style
match **Bauhaus** (geometric, primary/signal colours, mechanical, tactile; "mobile-first apps needing
high personality") + google-fonts matches **Unbounded** and **Golos Text** (both full Cyrillic).
Refused from the Bauhaus row: hard offset shadows and ALL-CAPS headlines (costume, not information).

## Idea
The home is a house. Every cost is a floor of that house, painted in its own signal colour —
and every section of the app *is* that colour. You learn the colours once and the whole app
becomes readable at a glance: yellow is electricity, blue is water, rust is heating oil,
green is rent, graphite is Nebenkosten.

- **Дом (home screen):** a drawn house; floor heights = what each item costs in a typical month,
  the roof carries the total. Floors are links into their section. The only orchestrated motion:
  floors stack up from the foundation on first open (off under reduced motion).
- **Section screens:** the whole page is the section colour. The last reading sits on a mechanical
  counter, the facts sit on a "Typenschild" — the meter's type plate — as label/value rows.

## Colour
| Token | Value | On-colour | Use |
|---|---|---|---|
| `--concrete` | `#DCDEDF` | `#000` | Дом hero, login |
| `--power` | `#E8C547` | `#000` | Свет (12.5:1) |
| `--water` | `#2C5A8C` | `#FFF` | Вода (7.1:1) |
| `--oil` | `#9C4422` | `#FFF` | Масло (6.4:1) |
| `--rent` | `#2E6A54` | `#FFF` | Аренда (6.35:1) |
| `--nk` | `#46505E` | `#FFF` | Nebenkosten (8.2:1) |

v2.1 «quieter»: the section colour lives only in the hero band (top of the screen), on the house floors
and the nav swatch. Below the hero the page is a pale tint of that colour (`#F6F0DA`, `#E6ECF2`,
`#F3E9E4`, `#E5EEEA`, `#E8E9EC`, Дом `#EEEFF0`) with black text; chart bars use the section colour
(power uses `#7A6200`). Dark mode: hero is a deep shade (`#3B3212`, `#16293F`, `#3A1F14`, `#16302A`, `#23282F`),
page `#0E0F10`. Weights reduced: figures Unbounded 500, type-plate rules 1 px. Spacing scale 4/8/12/16/24/32/48.
| `--plate` | `#FFF` | `#000` | inputs, tables, settings |
| `--bad` | `#C1121F` | — | errors, over norm (always with text) |

Text on a coloured page always uses the full on-colour — hierarchy comes from size and weight,
never from a faded tint. Dark mode: page `#000`, the hero band keeps the section colour,
plates `#1A1A1A` with white text. Chart bars on black use lifted tints for ≥3:1: water `#4D8FE6`, oil `#F06A33`, rent `#2FB383`, Nebenkosten `#8FA0B8` (yellow as is).

## Type
- **Unbounded** 500–700 — screen titles, the house total, every big figure. Wide, round, Cyrillic-native.
- **Golos Text** 400–600 — labels, sentences, tables, inputs. All figures `tabular-nums`.
- Scale: 44 title · 28 big figure · 20 floor value · 17 section heading · 16 body/table · 14 caption · 13 floor (nav labels).

## Shape
- Plates: 6 px radius, no shadow, 2 px on-colour border only on the Typenschild.
- Inputs: 6 px radius, 2 px border, 52 px tall, 18 px text.
- Primary action: black pill (on yellow/concrete) or white pill (on dark colours), 56 px tall.
- House: square floors, triangular roof (clip-path), chimney.

## Navigation
Bottom bar (5 items ≤ 5 rule): Дом · Свет · Вода · Масло · Платежи. Black bar; every item carries its
colour square; the active item is filled with its colour. Платежи has a two-way switch
Аренда / Nebenkosten. Deep links: `#sum #power #water #oil #rent #nk`.

## Feedback
Status toast sits just above the bottom bar (thumb zone), `role=status`; black for success,
red for errors, may carry one action (Отменить / Повторить). Field errors inline under the field.
Offline saves are kept on the device and retried.

## Charts
Bars in the page's on-colour (light) or section colour (dark); current/forecast month outlined
and marked "*". Дом chart: stacked in the five signal colours. Every chart is followed by a table.

## Floor
Contrast ≥ 4.5:1 everywhere, touch ≥ 44 px, focus ring 3 px in on-colour, reduced motion respected,
safe areas respected, no emoji icons (Lucide SVG).
