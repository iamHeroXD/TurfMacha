"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Download, Smartphone, Share, Plus, Globe, CheckCircle2, ArrowRight,
} from "lucide-react";
import Link from "next/link";

type Platform = "android" | "ios" | "desktop" | "unknown";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window { __pwaInstallPrompt?: BeforeInstallPromptEvent; }
}

const ANDROID_STEPS = [
  { icon: Globe,        title: "Open in Chrome",     desc: "Make sure you're using Google Chrome on Android." },
  { icon: Download,     title: "Tap Install",         desc: "Tap the \"Install\" button below, or the install banner that appears." },
  { icon: CheckCircle2, title: "Done!",               desc: "TurfMacha is now on your home screen like a native app." },
];

const IOS_STEPS = [
  { icon: Globe,      title: "Open in Safari",       desc: "Open TurfMacha in Safari (not Chrome) on your iPhone or iPad." },
  { icon: Share,      title: "Tap the Share button", desc: "Tap the share icon (□↑) at the bottom of Safari." },
  { icon: Plus,       title: "Add to Home Screen",   desc: "Scroll down and tap \"Add to Home Screen\", then tap \"Add\"." },
  { icon: CheckCircle2, title: "Done!",              desc: "TurfMacha now lives on your home screen, just like an app." },
];

const DESKTOP_STEPS = [
  { icon: Globe,      title: "Open in Chrome or Edge", desc: "Make sure you're using Chrome or Edge browser." },
  { icon: Download,   title: "Click Install",           desc: "Look for the install icon (⊕) in the address bar, or click the button below." },
  { icon: CheckCircle2, title: "Done!",                 desc: "TurfMacha opens as a standalone window — no browser needed." },
];

export default function DownloadPage() {
  const [platform,   setPlatform]   = useState<Platform>("unknown");
  const [installed,  setInstalled]  = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());

    // Check if already running as installed PWA
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
    }

    // Check if deferred install prompt is available (Android/Desktop Chrome)
    if (window.__pwaInstallPrompt) setCanInstall(true);

    const handler = (e: Event) => {
      e.preventDefault();
      window.__pwaInstallPrompt = e as BeforeInstallPromptEvent;
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    const prompt = window.__pwaInstallPrompt;
    if (!prompt) return;
    setInstalling(true);
    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === "accepted") {
        setInstalled(true);
        window.__pwaInstallPrompt = undefined;
        setCanInstall(false);
      }
    } finally {
      setInstalling(false);
    }
  };

  const steps = platform === "ios" ? IOS_STEPS
              : platform === "android" ? ANDROID_STEPS
              : DESKTOP_STEPS;

  const platformLabel = platform === "ios" ? "iPhone / iPad"
                      : platform === "android" ? "Android"
                      : "Desktop";

  return (
    <div className="min-h-screen bg-[#FAF7F0] pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="text-center mb-14">
          <div className="w-20 h-20 bg-[#0B3D2E] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#0B3D2E]/30 transform -rotate-6">
            <Smartphone className="w-10 h-10 text-[#A3E635]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-[#0B3D2E] mb-4">
            Get TurfMacha on your phone
          </h1>
          <p className="text-xl text-[#6B7280] leading-relaxed max-w-lg mx-auto">
            Install TurfMacha as an app — no App Store needed. Fast, offline-capable, and feels native.
          </p>
        </div>

        {/* Already installed */}
        {installed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0B3D2E] rounded-3xl p-10 text-center mb-10"
          >
            <CheckCircle2 className="w-12 h-12 text-[#A3E635] mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl text-white mb-2">You&apos;re all set!</h2>
            <p className="text-white/65 mb-6">TurfMacha is already installed on this device.</p>
            <Link href="/turfs">
              <button className="bg-[#A3E635] text-[#0B3D2E] font-display font-bold px-8 py-3 rounded-full hover:bg-[#B8E872] transition-colors inline-flex items-center gap-2">
                Browse Turfs <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Install CTA for Android/Desktop */}
            {(canInstall || platform === "android" || platform === "desktop") && (
              <div className="bg-[#0B3D2E] rounded-2xl p-6 flex items-center gap-4 mb-10 shadow-lg">
                <div className="w-12 h-12 bg-[#A3E635] rounded-2xl flex items-center justify-center shrink-0">
                  <Download className="w-6 h-6 text-[#0B3D2E]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-white">Install TurfMacha</p>
                  <p className="text-white/60 text-sm">Add to home screen in one tap</p>
                </div>
                {canInstall ? (
                  <button
                    onClick={handleInstall}
                    disabled={installing}
                    className="bg-[#A3E635] text-[#0B3D2E] font-display font-bold px-5 py-2.5 rounded-full hover:bg-[#B8E872] transition-colors shrink-0 disabled:opacity-60"
                  >
                    {installing ? "Installing…" : "Install"}
                  </button>
                ) : (
                  <span className="text-white/40 text-sm shrink-0">
                    {platform === "android" ? "Open in Chrome" : "Use Chrome/Edge"}
                  </span>
                )}
              </div>
            )}

            {/* Platform-specific steps */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-8">
                <p className="font-display font-bold text-xl text-[#1F2937]">
                  Installing on {platformLabel}
                </p>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#0B3D2E]/8 text-[#0B3D2E] font-semibold">
                  {steps.length} steps
                </span>
              </div>

              <div className="space-y-6">
                {steps.map(({ icon: Icon, title, desc }, i) => (
                  <div key={title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-[#0B3D2E] rounded-2xl flex items-center justify-center shrink-0 relative shadow-sm">
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#A3E635] rounded-full flex items-center justify-center font-display font-bold text-[#0B3D2E] text-[10px] border-2 border-white">
                          {i + 1}
                        </div>
                        <Icon className="w-4 h-4 text-[#A3E635]" />
                      </div>
                      {i < steps.length - 1 && (
                        <div className="w-0.5 flex-1 bg-gray-100 my-2" />
                      )}
                    </div>
                    <div className="pb-6">
                      <h3 className="font-display font-bold text-[#1F2937] mb-1">{title}</h3>
                      <p className="text-[#6B7280] text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform switch */}
            <div className="mt-6 text-center">
              <p className="text-sm text-[#9CA3AF]">Not on {platformLabel}?</p>
              <div className="flex justify-center gap-3 mt-2">
                {["android", "ios", "desktop"].filter((p) => p !== platform).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p as Platform)}
                    className="text-sm font-semibold text-[#0B3D2E] hover:underline capitalize"
                  >
                    {p === "ios" ? "iPhone / iPad" : p}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* App store badges */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#9CA3AF] mb-4 font-medium">Coming to app stores soon</p>
          <div className="flex justify-center flex-wrap gap-4 opacity-40 pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-10" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              alt="Google Play"
              className="h-14 -my-2"
              style={{ marginTop: "-8px", marginBottom: "-8px" }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
