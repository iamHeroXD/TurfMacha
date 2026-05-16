import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { AuthProvider } from "@/components/layout/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { PWAInstallBanner } from "@/components/layout/PWAInstallBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TurfBook — Book Sports Turf Near You",
    template: "%s | TurfBook",
  },
  description:
    "Discover and book premium sports turfs near you. Football, cricket, badminton, basketball and more. Instant booking, best prices.",
  keywords: ["turf booking", "sports turf", "football turf", "cricket turf", "book turf online"],
  authors: [{ name: "TurfBook" }],
  creator: "TurfBook",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TurfBook",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "TurfBook — Book Sports Turf Near You",
    description: "Discover and book premium sports turfs near you.",
    type: "website",
    locale: "en_IN",
    siteName: "TurfBook",
  },
  twitter: {
    card: "summary_large_image",
    title: "TurfBook",
    description: "Discover and book premium sports turfs near you.",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a1a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a1a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background min-h-screen`}
      >
        <AuthProvider>
          <Navbar />
          <main className="pb-24 md:pb-0">
            {children}
          </main>
          <BottomNav />
          <Toaster />
          <PWAInstallBanner />
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
