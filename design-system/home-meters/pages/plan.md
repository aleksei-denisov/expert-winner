# Design plan — public/index.html (all pages)

Works inside `../MASTER.md`. This file records page-level decisions.

## Brief check
Mobile-first (iPhone), Russian, one person, numbers must read instantly, small text must stay readable.
Primary job: type today's number in seconds, then see "am I OK?" without hunting.

## Palette (from MASTER, named)
- Slate page `#F4F6FA` / `#0F172A`
- Paper card `#FFFFFF` / `#192134`
- Ink `#0F172A` / `#F1F5F9`
- Ledger blue `#1E40AF` / `#60A5FA` — the only interactive colour
- Counter black `#111827` — odometer drums (both modes)
- Counter red `#B91C1C` — decimal drums of the water meter (like the real meter)

## Type
Fira Sans for everything readable (body 16, captions 14, floor 13, KPI 28 tabular).
Fira Code only inside the odometer drums — the single place a fixed-width face earns its keep.

## The one bold thing: the meter itself
Each meter page opens with the last reading drawn as a **mechanical counter** — dark drums,
white Fira Code digits, water decimals on red drums — exactly what the user sees in the cellar
before typing. The rest of the page is quiet Swiss layout.

Other pages get a hero native to their subject, not a big-number tile:
- **Масло** — a tank gauge (fill level) next to litres and days left.
- **Аренда / Nebenkosten** — a strip of the last 6 months, each paid or not, with a check mark.
- **Итого** — a sentence ("Обычный месяц обходится в 1 012 €") over one segmented bar
  showing what that month is made of, with a value legend.

## Layout
```
[ title ................ Выйти ]
[ chips: Итого Свет Вода Масло Аренда Nebenkosten ]   sticky, icon + label
[ status line ]
[ HERO (subject-specific) ]
[ entry form: labels above fields, full-width button ]
[ figures: one card, 2×2 cells split by hairlines ]   (not four floating cards)
[ chart ]
[ table with same numbers ]
[ history list ]
[ settings (collapsed) ]
```
Left-aligned text, right-aligned numbers. Max width 760 px; KPI cells 4-across ≥ 720 px.

## Review against generic defaults — what changed
- First draft had four separate shadowed KPI cards (SaaS kit). Changed to one card with hairline
  cells — flatter, and figures line up in a grid.
- First draft opened every page with a big total number. Replaced by subject heroes (counter,
  tank, payment strip, composition bar).
- Removed middle-dot meta strings ("A · B") from the old copy; sub-lines are full short phrases.
- No ALL-CAPS labels, no eyebrow labels, no emoji icons (inline Lucide SVG instead).
- Monospace only on the drums, never for small labels.

## Copy rules
Buttons say the action ("Добавить показание", "Записать заправку", "Отметить оплату").
Empty states tell what to do ("Внесите ещё одно показание — появится расход").
Errors say what happened and what to do.
