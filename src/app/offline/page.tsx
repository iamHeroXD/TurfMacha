"use client";

import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0a]">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mx-auto mb-6">
          <WifiOff className="h-7 w-7 text-white/30" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">You&apos;re offline</h1>
        <p className="text-white/45 text-sm mb-8 leading-relaxed">
          No internet connection detected. Check your network and try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => window.location.reload()} className="gap-2">
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
