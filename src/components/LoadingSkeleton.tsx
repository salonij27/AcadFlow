interface LoadingSkeletonProps {
  count?: number;
}

export default function LoadingSkeleton({ count = 5 }: LoadingSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 border border-slate-100 animate-pulse">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-slate-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-100 rounded w-2/3" />
              <div className="h-3 bg-slate-50 rounded w-1/3" />
            </div>
            <div className="w-20 h-6 rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
