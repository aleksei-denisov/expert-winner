# Design plan v2 — «Дом из цветных этажей»

## Palette
Concrete `#E3E5E6` · Signal yellow `#FFCC00` · Water blue `#0047AB` · Oil rust `#B23A0A` ·
Rent green `#0B6E4F` · Graphite `#3D4A5C` · black/white as ink.

## Type
Unbounded (titles, figures, house total) + Golos Text (everything read in sentences and tables).

## Layout
```
Дом                              Свет (whole page #FFCC00)
┌──────────────────────┐         Свет                 28,11 ct
│ Дом стоит 1 566 € в  │         [0][0][5][2][2][9] кВт·ч
│ месяц                │         23 ноября, +177 за 23 дня
│        /\  ▮         │         ┌ plate: date | value ┐
│       /  \           │         └ [ Добавить показание ]┘
│      /1566\          │         ╔ Typenschild ════════╗
│     ┌──────┐ Масло   │         ║ За год    3 302 кВт·ч║
│     ├──────┤ Свет    │         ║ В день    9,0 кВт·ч  ║
│     ├──────┤ NK      │         ║ Год стоит 1 118 €    ║
│     │      │ Аренда  │         ╚═════════════════════╝
│     └──────┘         │         bars in black on yellow
│ chart · table        │         plate: months, readings
└──────────────────────┘
[■Дом ■Свет ■Вода ■Масло ■Платежи]  bottom bar, thumb zone
```
Left-aligned text, right-aligned numbers.

## Review against generic defaults
- v1 was the SaaS-card kit on slate. Now: no grid of tiles anywhere; facts are rows on a type plate.
- Not cream+serif, not black+acid accent, not broadsheet: five signal colours, each owning a screen.
- The "big number + label" hero is replaced by a house whose floors are the numbers.
- Bauhaus database row suggested hard offset shadows and caps headlines — refused as costume.
- Monospace removed entirely; figures are Unbounded/Golos tabular.
