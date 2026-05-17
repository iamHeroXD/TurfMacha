// TurfMacha Service Worker v2
// Bumped to v2 to force-evict all v1 caches for existing users.
const CACHE_NAME = "turfmacha-v2";
const OFFLINE_URL = "/offline";

const STATIC_ASSETS = [
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Never cache these — auth-sensitive or dynamic pages
const SKIP_CACHE_PATTERNS = [
  "/dashboard",
  "/admin",
  "/auth/",
  "/api/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

// Install: pre-cache only safe static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(STATIC_ASSETS).catch(() => {})
    )
  );
  // Don't skipWaiting — wait for page reload to avoid stale-page issues
  // self.skipWaiting(); -- removed intentionally
});

// Activate: delete ALL old caches (v1 and any others)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((names) =>
        Promise.all(
          names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
        )
      ),
      self.clients.claim(),
    ])
  );
});

// Fetch
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests from same origin
  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin && !url.hostname.includes(self.location.hostname)) {
    // Pass through cross-origin (Supabase API etc.)
    return;
  }

  // Skip Supabase API calls entirely
  if (url.hostname.includes("supabase.co")) return;

  // Skip protected / auth-sensitive routes — browser handles them fresh
  if (SKIP_CACHE_PATTERNS.some((p) => url.pathname.startsWith(p))) return;

  // Network-first for API routes with offline JSON fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ error: "Offline" }), {
          headers: { "Content-Type": "application/json" },
          status: 503,
        })
      )
    );
    return;
  }

  // Cache-first for versioned static assets (JS, CSS, fonts, images)
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|ico|woff|woff2|ttf)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          // Only cache successful, non-redirect responses
          if (response.ok && response.status === 200) {
            caches.open(CACHE_NAME).then((cache) =>
              cache.put(request, response.clone())
            );
          }
          return response;
        });
      })
    );
    return;
  }

  // Cache-first for Next.js static chunks (_next/static/)
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok && response.status === 200) {
            caches.open(CACHE_NAME).then((cache) =>
              cache.put(request, response.clone())
            );
          }
          return response;
        });
      })
    );
    return;
  }

  // Network-first for all other HTML pages (/, /turfs, /turfs/[id], etc.)
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Only cache successful 200 HTML responses — never cache redirects
        if (
          response.ok &&
          response.status === 200 &&
          response.headers.get("content-type")?.includes("text/html")
        ) {
          caches.open(CACHE_NAME).then((cache) =>
            cache.put(request, response.clone())
          );
        }
        return response;
      })
      .catch(async () => {
        // Offline fallback: try cache first, then show offline page
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.headers.get("accept")?.includes("text/html")) {
          const offlinePage = await caches.match(OFFLINE_URL);
          return offlinePage || new Response("Offline", { status: 503 });
        }
        return new Response("Offline", { status: 503 });
      })
  );
});

// Push notifications
self.addEventListener("push", (event) => {
  if (!event.data) return;
  let data = { title: "TurfMacha", body: "You have a new notification", url: "/" };
  try { data = { ...data, ...event.data.json() }; } catch {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-192x192.png",
      data: { url: data.url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
});
