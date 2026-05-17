// Firebase Cloud Messaging Service Worker
// Handles background push notifications when the app is not in focus.
// This file is served from the root (/firebase-messaging-sw.js) and registered
// by the Firebase SDK automatically when initializeApp() is called.

importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// Firebase config is injected at runtime from query params or a self.FIREBASE_CONFIG
// global set by the registration script. Fall back gracefully if not available.
let firebaseConfig = {};
try {
  // Config passed via service worker registration script URL params
  const url = new URL(location.href);
  const cfgParam = url.searchParams.get("firebaseConfig");
  if (cfgParam) {
    firebaseConfig = JSON.parse(decodeURIComponent(cfgParam));
  } else if (self.FIREBASE_CONFIG) {
    firebaseConfig = self.FIREBASE_CONFIG;
  }
} catch {}

if (firebaseConfig.apiKey) {
  firebase.initializeApp(firebaseConfig);

  const messaging = firebase.messaging();

  // Handle background messages
  messaging.onBackgroundMessage((payload) => {
    const { title, body, icon, badge, data } = payload.notification ?? {};
    const click_action = data?.click_action ?? "/";

    self.registration.showNotification(title ?? "TurfMacha", {
      body: body ?? "",
      icon: icon ?? "/icons/icon-192x192.png",
      badge: badge ?? "/icons/icon-192x192.png",
      data: { url: click_action },
      vibrate: [200, 100, 200],
      requireInteraction: false,
      tag: data?.tag ?? "turfmacha-notification",
    });
  });

  // Handle notification click — navigate to the URL in the notification data
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const url = event.notification.data?.url ?? "/";
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          // Bring existing window to focus if open
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && "focus" in client) {
              client.navigate(url);
              return client.focus();
            }
          }
          // Otherwise open a new window
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
    );
  });
}
