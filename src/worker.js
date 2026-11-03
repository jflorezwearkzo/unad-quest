// UNAD Quest — API de sincronización (Cloudflare Worker + D1)
// Todo /api/* pasa por aquí; el resto lo sirven los assets estáticos.
// Cloudflare Access protege el hostname; además validamos su JWT aquí
// para que la API nunca responda sin una identidad verificada.

const MAX_INK_BYTES = 1_800_000; // D1 admite filas de hasta ~2 MB

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(request);

    let email;
    try {
      email = await verifyAccess(request, env);
    } catch (err) {
      return json({ error: "unauthorized", detail: String(err.message || err) }, 401);
    }

    try {
      if (url.pathname === "/api/me") return json({ email });
      if (url.pathname === "/api/sync" && request.method === "POST") return await sync(request, env, email);
      return json({ error: "not_found" }, 404);
    } catch (err) {
      return json({ error: "server_error", detail: String(err.message || err) }, 500);
    }
  },
};

/* ---------- Sync (last-write-wins por updated_at) ---------- */
async function sync(request, env, email) {
  const body = await request.json().catch(() => ({}));
  const since = Number(body.since) || 0;
  const now = Date.now();
  const db = env.DB;
  const stmts = [];

  // Progreso de la malla (un solo documento por usuario)
  if (body.progress && body.progress.data) {
    stmts.push(
      db.prepare(
        `INSERT INTO progress (email, data, updated_at) VALUES (?1, ?2, ?3)
         ON CONFLICT(email) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at
         WHERE excluded.updated_at > progress.updated_at`
      ).bind(email, JSON.stringify(body.progress.data), clampTs(body.progress.updated_at, now))
    );
  }

  for (const t of (body.tasks || []).slice(0, 500)) {
    if (!validId(t.id) || typeof t.title !== "string") continue;
    stmts.push(
      db.prepare(
        `INSERT INTO tasks (id, email, course_id, title, details, due, priority, done, deleted, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
         ON CONFLICT(id) DO UPDATE SET course_id=excluded.course_id, title=excluded.title, details=excluded.details,
           due=excluded.due, priority=excluded.priority, done=excluded.done, deleted=excluded.deleted, updated_at=excluded.updated_at
         WHERE excluded.updated_at > tasks.updated_at AND tasks.email = excluded.email`
      ).bind(
        t.id, email, str(t.course_id, 40), str(t.title, 300), str(t.details, 4000), str(t.due, 20),
        int(t.priority), t.done ? 1 : 0, t.deleted ? 1 : 0, clampTs(t.created_at, now), clampTs(t.updated_at, now)
      )
    );
  }

  const rejected = [];
  for (const n of (body.notes || []).slice(0, 200)) {
    if (!validId(n.id)) continue;
    const ink = n.ink ? JSON.stringify(n.ink) : null;
    if (ink && ink.length > MAX_INK_BYTES) { rejected.push({ id: n.id, reason: "ink_too_large" }); continue; }
    stmts.push(
      db.prepare(
        `INSERT INTO notes (id, email, course_id, title, body, ink, deleted, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
         ON CONFLICT(id) DO UPDATE SET course_id=excluded.course_id, title=excluded.title, body=excluded.body,
           ink=excluded.ink, deleted=excluded.deleted, updated_at=excluded.updated_at
         WHERE excluded.updated_at > notes.updated_at AND notes.email = excluded.email`
      ).bind(n.id, email, str(n.course_id, 40), str(n.title, 300), str(n.body, 200_000), ink,
             n.deleted ? 1 : 0, clampTs(n.created_at, now), clampTs(n.updated_at, now))
    );
  }

  if (stmts.length) await db.batch(stmts);

  // Devolver lo que cambió desde `since`
  const [p, tasks, notes] = await Promise.all([
    db.prepare(`SELECT data, updated_at FROM progress WHERE email = ?1 AND updated_at > ?2`).bind(email, since).first(),
    db.prepare(`SELECT * FROM tasks WHERE email = ?1 AND updated_at > ?2 ORDER BY updated_at`).bind(email, since).all(),
    db.prepare(`SELECT * FROM notes WHERE email = ?1 AND updated_at > ?2 ORDER BY updated_at`).bind(email, since).all(),
  ]);

  return json({
    server_time: now,
    progress: p ? { data: JSON.parse(p.data), updated_at: p.updated_at } : null,
    tasks: tasks.results.map(({ email: _e, ...t }) => ({ ...t, done: !!t.done, deleted: !!t.deleted })),
    notes: notes.results.map(({ email: _e, ink, ...n }) => ({ ...n, ink: ink ? JSON.parse(ink) : null, deleted: !!n.deleted })),
    rejected,
  });
}

/* ---------- Cloudflare Access JWT ---------- */
let certCache = { keys: null, at: 0 };

async function verifyAccess(request, env) {
  // Solo para `wrangler dev` en local (.dev.vars nunca se despliega)
  const host = new URL(request.url).hostname;
  if (env.DEV_EMAIL && (host === "localhost" || host === "127.0.0.1")) return env.DEV_EMAIL;
  const token = request.headers.get("Cf-Access-Jwt-Assertion") || cookie(request, "CF_Authorization");
  if (!token) throw new Error("missing access token");
  const [h64, p64, s64] = token.split(".");
  if (!s64) throw new Error("malformed token");
  const header = JSON.parse(b64urlText(h64));
  const payload = JSON.parse(b64urlText(p64));

  const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!aud.includes(env.ACCESS_AUD)) throw new Error("bad audience");
  if (payload.iss !== `https://${env.ACCESS_TEAM_DOMAIN}`) throw new Error("bad issuer");
  const nowS = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < nowS) throw new Error("expired");

  const keys = await getCerts(env);
  const jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) throw new Error("unknown key");
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64urlBytes(s64), new TextEncoder().encode(`${h64}.${p64}`));
  if (!ok) throw new Error("bad signature");

  const email = (payload.email || "").toLowerCase();
  const allowed = (env.ALLOWED_EMAILS || "").toLowerCase().split(",").map((s) => s.trim()).filter(Boolean);
  if (!email || (allowed.length && !allowed.includes(email))) throw new Error("email not allowed");
  return email;
}

async function getCerts(env) {
  if (certCache.keys && Date.now() - certCache.at < 3600_000) return certCache.keys;
  const res = await fetch(`https://${env.ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error("certs fetch failed");
  certCache = { keys: (await res.json()).keys, at: Date.now() };
  return certCache.keys;
}

/* ---------- utilidades ---------- */
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}
function cookie(req, name) {
  const m = (req.headers.get("cookie") || "").match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return m ? m[1] : null;
}
function b64urlBytes(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(s + "===".slice((s.length + 3) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}
function b64urlText(s) { return new TextDecoder().decode(b64urlBytes(s)); }
const validId = (id) => typeof id === "string" && /^[A-Za-z0-9_-]{6,64}$/.test(id);
const str = (v, max) => (v == null ? null : String(v).slice(0, max));
const int = (v) => (Number.isFinite(+v) ? Math.max(0, Math.min(3, Math.trunc(+v))) : 0);
const clampTs = (v, now) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? Math.min(n, now + 60_000) : now; };
