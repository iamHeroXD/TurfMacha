export function TurfCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#111111] overflow-hidden">
      <div className="h-44 bg-white/[0.04] animate-pulse" />
      <div className="p-4 space-y-2.5">
        <div className="flex justify-between gap-3">
          <div className="h-4 bg-white/[0.06] rounded animate-pulse flex-1" />
          <div className="h-4 bg-white/[0.06] rounded animate-pulse w-12" />
        </div>
        <div className="h-3 bg-white/[0.04] rounded animate-pulse w-3/4" />
        <div className="flex justify-between">
          <div className="h-3 bg-white/[0.04] rounded animate-pulse w-1/3" />
          <div className="h-3 bg-white/[0.04] rounded animate-pulse w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function TurfGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => <TurfCardSkeleton key={i} />)}
    </div>
  );
}
