"use client";

// Firebase client-side initialization — lazy, conditional on env vars.
// Only activates when NEXT_PUBLIC_FIREBASE_API_KEY is set.
// firebase package is in dependencies; dynamic imports prevent bundle bloat.

import type { FirebaseApp } from "firebase/app";
import type { Messaging } from "firebase/messaging";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  vapidKey: string;
}

function getFirebaseConfig(): FirebaseConfig | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey) return null;
  return {
    apiKey,
    authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        ?? "",
    projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID         ?? "",
    storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             ?? "",
    vapidKey:          process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY          ?? "",
  };
}

let _app: FirebaseApp | null = null;
let _messaging: Messaging | null = null;

async function getApp(): Promise<FirebaseApp | null> {
  if (_app) return _app;
  const config = getFirebaseConfig();
  if (!config) return null;

  const { initializeApp, getApps, getApp: getExisting } = await import("firebase/app");
  _app = getApps().length ? getExisting() : initializeApp({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
  });
  return _app;
}

/** Request notification permission and get FCM token. Returns null if Firebase not configured. */
export async function requestNotificationPermission(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const config = getFirebaseConfig();
  if (!config?.apiKey) return null;
  if (!("Notification" in window)) return null;

  try {
    const app = await getApp();
    if (!app) return null;

    const { getMessaging, getToken, isSupported } = await import("firebase/messaging");
    if (!(await isSupported())) return null;

    if (!_messaging) _messaging = getMessaging(app);

    // Register the FCM service worker with config passed as query param
    const swUrl =
      `/firebase-messaging-sw.js?firebaseConfig=` +
      encodeURIComponent(JSON.stringify({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId,
      }));

    const registration = await navigator.serviceWorker
      .register(swUrl, { scope: "/" })
      .catch(() => null);

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const token = await getToken(_messaging, {
      vapidKey: config.vapidKey,
      ...(registration ? { serviceWorkerRegistration: registration } : {}),
    });

    return token || null;
  } catch (err) {
    console.error("[FCM] Token request failed:", err);
    return null;
  }
}

/** Set up foreground message handler — shows in-app notification when app is open. */
export async function setupForegroundNotifications(
  callback: (title: string, body: string, data?: Record<string, string>) => void
): Promise<(() => void) | null> {
  if (typeof window === "undefined") return null;
  const config = getFirebaseConfig();
  if (!config) return null;

  try {
    const app = await getApp();
    if (!app) return null;

    const { getMessaging, onMessage, isSupported } = await import("firebase/messaging");
    if (!(await isSupported())) return null;

    if (!_messaging) _messaging = getMessaging(app);

    const unsubscribe = onMessage(_messaging, (payload) => {
      const title = payload.notification?.title ?? "TurfMacha";
      const body  = payload.notification?.body  ?? "";
      const data  = payload.data as Record<string, string> | undefined;
      callback(title, body, data);
    });

    return unsubscribe;
  } catch {
    return null;
  }
}
