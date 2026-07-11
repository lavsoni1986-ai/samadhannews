/**
 * Homepage Loading Skeleton
 * Gray pulse blocks for hero, news grid, sidebar
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breaking News Skeleton */}
      <div className="bg-red-700 h-10 animate-pulse" />

      {/* Hero Section Skeleton */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-video bg-gray-200 rounded-lg" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-3 w-32 bg-gray-200 rounded mt-4" />
            </div>
            <aside className="space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Main Content Skeleton */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="h-7 w-40 bg-gray-200 rounded mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4 space-y-3">
                  <div className="aspect-video bg-gray-200 rounded" />
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-5 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-3 w-32 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-1 space-y-8">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3 py-3 border-b">
                <div className="w-24 h-16 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </div>
  );
}
