"use client";

import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#FAF7F0]">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-6">
          <WifiOff className="h-7 w-7 text-[#9CA3AF]" />
        </div>
        <h1 className="text-2xl font-display font-bold text-[#1F2937] mb-2">You&apos;re offline</h1>
        <p className="text-[#6B7280] text-sm mb-8 leading-relaxed">
          No internet connection detected. Check your network and try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => window.location.reload()}
            className="gap-2 bg-[#0B3D2E] hover:bg-[#0B3D2E]/90"
          >
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
