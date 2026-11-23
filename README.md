# Дом: счётчики и расходы

Небольшое веб-приложение для учёта электричества, холодной воды, масла в котле и Nebenkosten.
Работает на Cloudflare Workers: воркер отдаёт страницу из `public/` и хранит данные в Workers KV.

```
public/index.html   — приложение (одна страница)
src/index.js        — воркер: /api/state (GET/PUT) + раздача статики
wrangler.toml       — конфигурация воркера
```

## Развёртывание

### Вариант A — через дашборд Cloudflare (без терминала)

1. **KV:** Storage & Databases → KV → *Create namespace* → имя `STATE`. Скопируйте его ID.
2. Вставьте ID в `wrangler.toml` вместо `REPLACE_WITH_KV_NAMESPACE_ID` и закоммитьте.
3. **Воркер:** Workers & Pages → *Create* → *Import a repository* → выберите `expert-winner`.
   Build command оставьте пустым, deploy command — `npx wrangler deploy`.
4. **Токен:** в настройках воркера → Settings → Variables and Secrets → *Add* →
   тип **Secret**, имя `API_TOKEN`, значение — длинная случайная строка (это ваш пароль).
5. Откройте адрес воркера (`https://home-meters.<ваш-аккаунт>.workers.dev`), введите токен.

### Вариант B — из терминала

```bash
npm install
npx wrangler login
npx wrangler kv namespace create STATE     # вставить id в wrangler.toml
npx wrangler secret put API_TOKEN          # ввести пароль
npx wrangler deploy
```

Локальный запуск: создайте `.dev.vars` со строкой `API_TOKEN=test` и выполните `npm run dev`.

## Данные

- Хранятся в KV под ключом `state`: `{rev, updatedAt, data}`.
- Каждый день дополнительно пишется резервная копия `backup:YYYY-MM-DD` (живёт 90 дней).
- При первом входе на сервере пусто — приложение покажет начальные данные (уже внесённые
  показания электричества), первое сохранение запишет их в KV.
- Если сохранить с двух устройств одновременно, второе получит 409 и перезагрузит свежие данные —
  ничего не затрётся молча.

Без токена воркер не отдаёт и не принимает данные; если секрет `API_TOKEN` не задан, API закрыт полностью.
