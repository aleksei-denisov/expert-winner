// Cloudflare Worker: serves the static app from ./public and stores its state in KV.
//
// API (all routes need header  Authorization: Bearer <API_TOKEN>):
//   GET  /api/state  -> 200 {rev, updatedAt, data} | 404 if nothing saved yet
//   PUT  /api/state  body {rev, data} -> 200 {rev, updatedAt}
//                    409 if rev does not match the stored one (edited on another device)
//
// Bindings (see wrangler.toml): STATE (KV namespace), ASSETS (static files)
// Secret: API_TOKEN  (wrangler secret put API_TOKEN)

const KEY = "state";
const MAX_BYTES = 1_000_000; // plenty for years of readings

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

// constant-time string compare
function safeEqual(a, b) {
  const enc = new TextEncoder();
  const x = enc.encode(a), y = enc.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

function authorized(request, env) {
  if (!env.API_TOKEN) return false; // refuse everything until the secret is set
  const h = request.headers.get("authorization") || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : "";
  return token.length > 0 && safeEqual(token, env.API_TOKEN);
}

async function handleApi(request, env, url) {
  if (url.pathname !== "/api/state") return json({ error: "not found" }, 404);
  if (!authorized(request, env)) return json({ error: "unauthorized" }, 401);

  if (request.method === "GET") {
    const stored = await env.STATE.get(KEY, "json");
    return stored ? json(stored) : json({ error: "empty" }, 404);
  }

  if (request.method === "PUT") {
    const text = await request.text();
    if (text.length > MAX_BYTES) return json({ error: "too large" }, 413);
    let body;
    try { body = JSON.parse(text); } catch { return json({ error: "invalid json" }, 400); }
    if (!body || typeof body.data !== "object" || body.data === null || !Number.isInteger(body.rev))
      return json({ error: "expected {rev:int, data:object}" }, 400);

    const current = await env.STATE.get(KEY, "json");
    const currentRev = current ? current.rev : 0;
    if (body.rev !== currentRev) return json({ error: "conflict", rev: currentRev }, 409);

    const next = { rev: currentRev + 1, updatedAt: new Date().toISOString(), data: body.data };
    await env.STATE.put(KEY, JSON.stringify(next));
    // keep a dated backup of each day's last version for 90 days
    await env.STATE.put(`backup:${next.updatedAt.slice(0, 10)}`, JSON.stringify(next), {
      expirationTtl: 90 * 24 * 3600,
    });
    return json({ rev: next.rev, updatedAt: next.updatedAt });
  }

  return json({ error: "method not allowed" }, 405);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return handleApi(request, env, url);
    return env.ASSETS.fetch(request);
  },
};
