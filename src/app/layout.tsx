import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { AuthProvider } from "@/components/layout/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { PageTransition } from "@/components/layout/PageTransition";
import { Footer } from "@/components/layout/Footer";
import { EmailVerificationBanner } from "@/components/layout/EmailVerificationBanner";
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
    "Discover and book premium sports turfs near you. Football, cricket, badminton, basketball and more. Instant booking, best prices in Kerala.",
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
    "Trivandrum turf booking",
    "sports booking",
  ],
  authors: [{ name: "TurfMacha" }],
  creator: "TurfMacha",
  formatDetection: { telephone: false },
  openGraph: {
    title: "TurfMacha — Book Sports Turf Near You",
    description:
      "Discover and book premium sports turfs near you. Instant booking. Best prices in Kerala.",
    type: "website",
    locale: "en_IN",
    siteName: "TurfMacha",
    images: [
      {
        url: "/logoofturfmacha.png",
        width: 1080,
        height: 1080,
        alt: "TurfMacha — Book Sports Turf Near You",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TurfMacha",
    description: "Discover and book premium sports turfs near you.",
    images: ["/logoofturfmacha.png"],
  },
  icons: {
    icon: [
      { url: "/logoofturfmacha.png", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/logoofturfmacha.png",
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#F4F1EB",
  colorScheme: "light",
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
    <html lang="en" className={`${jakarta.variable} ${bricolage.variable}`}>
      <body className={`${jakarta.className} antialiased min-h-screen`}>
        {/* Skip to main content — keyboard accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-[#0D4D36] focus:text-white focus:text-sm focus:font-semibold focus:shadow-lg"
        >
          Skip to content
        </a>

        <AuthProvider>
          <Suspense fallback={null}>
            <PostHogProvider>
              <Navbar />
              <EmailVerificationBanner />
              <PageTransition>
                <main id="main-content" className="pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
                  {children}
                </main>
              </PageTransition>
              <Footer />
              <BottomNav />
              <Toaster />
            </PostHogProvider>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
