// UNAD Quest service worker — red primero para la app, caché como respaldo sin conexión.
// Nunca cachea /api/* ni respuestas de login de Cloudflare Access.
const CACHE = "uq-shell-v3";
const SHELL = ["/", "/index.html", "/app.js", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.all(SHELL.map((u) => fetch(u, { credentials: "include", redirect: "manual" })
        .then((r) => (r.ok && r.type === "basic" ? c.put(u, r) : null)).catch(() => null)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (url.origin !== location.origin) return;              // fuentes, login de Access, etc.
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/cdn-cgi/")) return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Solo cachea respuestas propias y completas (no redirecciones al login)
        if (res.ok && res.type === "basic" && !res.redirected) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request.mode === "navigate" ? "/" : e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request.mode === "navigate" ? "/" : e.request).then((r) => r || caches.match("/")))
  );
});
