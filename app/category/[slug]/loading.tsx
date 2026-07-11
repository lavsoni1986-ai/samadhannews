/**
 * Category Page Loading Skeleton
 */
export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb Skeleton */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 bg-gray-200 rounded" />
            <div className="h-4 w-4 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </nav>

      {/* Header Skeleton */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full" />
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Nav Skeleton */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 w-16 bg-gray-200 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* News Grid Skeleton */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 space-y-3">
              <div className="aspect-video bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-5 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-3 w-24 bg-gray-200 rounded mt-2" />
            </div>
          ))}
        </div>

        {/* Load More Button Skeleton */}
        <div className="text-center mt-10">
          <div className="h-10 w-40 bg-gray-200 rounded mx-auto" />
        </div>
      </section>
    </main>
  );
}
