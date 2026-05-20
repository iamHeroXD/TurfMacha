function Pulse({ className }: { className: string }) {
  return <div className={`rounded-xl skeleton ${className}`} />;
}

export function TurfCardSkeleton() {
  return (
    <div className="bg-white border border-[#E7E2DA] rounded-2xl overflow-hidden">
      <div className="h-48 skeleton rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between gap-3">
          <Pulse className="h-4 flex-1" />
          <Pulse className="h-4 w-10" />
        </div>
        <Pulse className="h-3 w-3/4" />
        <div className="flex justify-between">
          <Pulse className="h-3 w-1/3" />
          <Pulse className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function TurfGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => <TurfCardSkeleton key={i} />)}
    </div>
  );
}
