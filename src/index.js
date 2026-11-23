// Cloudflare Worker: serves the static app from ./public and stores its state in KV.
//
// Login is by password. A successful login sets an HttpOnly session cookie (90 days).
//   POST /api/login   body {password}  -> 200 + cookie | 401
//   POST /api/logout                   -> 200, cookie cleared
//   GET  /api/state   -> 200 {rev, updatedAt, data} | 404 if nothing saved yet | 401
//   PUT  /api/state   body {rev, data} -> 200 {rev, updatedAt}
//                     409 if rev does not match the stored one (edited on another device)
//
// Bindings (see wrangler.toml): STATE (KV namespace), ASSETS (static files)
// Secret: APP_PASSWORD  (wrangler secret put APP_PASSWORD)
// Changing APP_PASSWORD logs out every device.

const KEY = "state";
const MAX_BYTES = 1_000_000;
const SESSION_DAYS = 90;
const COOKIE = "session";

const enc = new TextEncoder();

const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });

function safeEqual(a, b) {
  const x = enc.encode(a), y = enc.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

async function hmac(secret, msg) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// cookie value: "<expiresMs>.<hmac(expiresMs)>"
async function makeSession(env) {
  const exp = Date.now() + SESSION_DAYS * 864e5;
  return `${exp}.${await hmac(env.APP_PASSWORD, "session:" + exp)}`;
}

async function validSession(request, env) {
  if (!env.APP_PASSWORD) return false;
  const m = (request.headers.get("cookie") || "").match(/(?:^|;\s*)session=([^;]+)/);
  if (!m) return false;
  const [exp, sig] = m[1].split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, await hmac(env.APP_PASSWORD, "session:" + exp));
}

const cookieHeader = (value, maxAge) =>
  `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;

async function handleApi(request, env, url) {
  const { pathname } = url, method = request.method;

  if (pathname === "/api/login" && method === "POST") {
    if (!env.APP_PASSWORD) return json({ error: "APP_PASSWORD is not set" }, 503);
    let body = {};
    try { body = await request.json(); } catch {}
    const ok = typeof body.password === "string" && safeEqual(body.password, env.APP_PASSWORD);
    if (!ok) {
      await new Promise((r) => setTimeout(r, 1000)); // slow down guessing
      return json({ error: "wrong password" }, 401);
    }
    return json({ ok: true }, 200, { "set-cookie": cookieHeader(await makeSession(env), SESSION_DAYS * 86400) });
  }

  if (pathname === "/api/logout" && method === "POST")
    return json({ ok: true }, 200, { "set-cookie": cookieHeader("", 0) });

  if (pathname !== "/api/state") return json({ error: "not found" }, 404);
  if (!(await validSession(request, env))) return json({ error: "unauthorized" }, 401);

  if (method === "GET") {
    const stored = await env.STATE.get(KEY, "json");
    return stored ? json(stored) : json({ error: "empty" }, 404);
  }

  if (method === "PUT") {
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
