import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { AuthProvider } from "@/components/layout/AuthProvider";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { PWAInstallBanner } from "@/components/layout/PWAInstallBanner";
import { PWAUpdateBanner } from "@/components/layout/PWAUpdateBanner";
import { PageTransition } from "@/components/layout/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://turfmacha.vercel.app"
  ),
  title: {
    default: "TurfMacha — Book Sports Turf Near You",
    template: "%s | TurfMacha",
  },
  description:
    "Discover and book premium sports turfs near you. Football, cricket, badminton, basketball and more. Instant booking, best prices in India.",
  keywords: [
    "turf booking",
    "sports turf",
    "football turf",
    "cricket turf",
    "badminton court",
    "book turf online",
    "TurfMacha",
    "turf booking India",
    "Kerala turf booking",
    "turf booking Kerala",
    "sports booking app",
  ],
  authors: [{ name: "TurfMacha" }],
  creator: "TurfMacha",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TurfMacha",
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "TurfMacha — Book Sports Turf Near You",
    description:
      "Discover and book premium sports turfs near you. Instant booking. Best prices.",
    type: "website",
    locale: "en_IN",
    siteName: "TurfMacha",
  },
  twitter: {
    card: "summary_large_image",
    title: "TurfMacha",
    description: "Discover and book premium sports turfs near you.",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F1EB" },
    { media: "(prefers-color-scheme: dark)",  color: "#0a0a0a" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ThemeProvider adds "dark" or "light" class — suppressHydrationWarning prevents
    // mismatch between server-rendered class and client-resolved theme
    <html lang="en" className={`${jakarta.variable} ${bricolage.variable}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={`${jakarta.className} antialiased min-h-screen`}>
        <ThemeProvider>
          <AuthProvider>
            <Suspense fallback={null}>
              <PostHogProvider>
                <Navbar />
                <PageTransition>
                  <main className="pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
                    {children}
                  </main>
                </PageTransition>
                <Footer />
                <BottomNav />
                <Toaster />
                <PWAInstallBanner />
                <PWAUpdateBanner />
              </PostHogProvider>
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
