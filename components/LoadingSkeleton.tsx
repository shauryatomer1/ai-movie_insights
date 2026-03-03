import { Card } from "@/components/ui/Card";

export default function LoadingSkeleton() {
  return (
    <div className="w-full space-y-8">
      {/* Hero skeleton */}
      <div className="relative w-full min-h-[500px] bg-[var(--card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-start gap-8 md:gap-12">
            <div className="skeleton w-[220px] md:w-[280px] h-[330px] md:h-[420px] rounded-xl flex-shrink-0 mx-auto md:mx-0" />
            <div className="flex-1 space-y-4 w-full">
              <div className="skeleton h-12 w-3/4" />
              <div className="flex gap-3">
                <div className="skeleton h-8 w-20 rounded-lg" />
                <div className="skeleton h-8 w-16 rounded-lg" />
                <div className="skeleton h-8 w-24 rounded-lg" />
              </div>
              <div className="flex gap-2">
                <div className="skeleton h-6 w-16 rounded-full" />
                <div className="skeleton h-6 w-20 rounded-full" />
                <div className="skeleton h-6 w-14 rounded-full" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-5/6" />
                <div className="skeleton h-4 w-4/6" />
              </div>
              <div className="flex gap-6 pt-4">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-4 w-40" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="skeleton h-7 w-32 mb-6 ml-4" />
        <div className="flex gap-6 overflow-hidden pb-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3 flex-shrink-0">
              <div className="skeleton w-20 h-20 md:w-24 md:h-24 rounded-full" />
              <div className="skeleton h-3 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="skeleton h-7 w-48 mb-6 ml-4" />
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="skeleton w-10 h-10 rounded-xl" />
              <div className="skeleton h-4 w-32" />
            </div>
            <div className="skeleton h-8 w-28 rounded-full" />
          </div>
          <div className="skeleton h-1.5 w-full rounded-full mb-6" />
          <div className="bg-[#111] rounded-2xl p-5 md:p-8 border border-neutral-800 shadow-sm space-y-4 max-w-3xl">
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
            <div className="skeleton h-4 w-3/4" />
          </div>
        </Card>
      </div>
    </div>
  );
}
