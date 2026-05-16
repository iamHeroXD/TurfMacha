"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-hero-gradient">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">📶</div>
        <h1 className="text-3xl font-bold text-white mb-3">You're Offline</h1>
        <p className="text-white/50 mb-8">
          No internet connection. Please check your network and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary px-8 py-3 rounded-xl text-black font-semibold"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
