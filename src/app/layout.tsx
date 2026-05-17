import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { AuthProvider } from "@/components/layout/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { PWAInstallBanner } from "@/components/layout/PWAInstallBanner";
import { PageTransition } from "@/components/layout/PageTransition";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TurfMacha — Book Sports Turf Near You",
    template: "%s | TurfMacha",
  },
  description:
    "Discover and book premium sports turfs near you. Football, cricket, badminton, basketball and more. Instant booking, best prices.",
  keywords: [
    "turf booking",
    "sports turf",
    "football turf",
    "cricket turf",
    "book turf online",
    "TurfMacha",
    "turf booking India",
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
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${inter.className} antialiased bg-[#0a0a0a] text-white min-h-screen`}
      >
        <AuthProvider>
          <Navbar />
          <PageTransition>
            <main className="pb-20 md:pb-0">{children}</main>
          </PageTransition>
          <BottomNav />
          <Toaster />
          <PWAInstallBanner />
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js'))}`,
          }}
        />
      </body>
    </html>
  );
}
