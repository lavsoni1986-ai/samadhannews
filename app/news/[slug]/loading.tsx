/**
 * News Article Loading Skeleton
 */
export default function Loading() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Breadcrumb Skeleton */}
      <nav className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 bg-gray-200 rounded" />
            <div className="h-4 w-4 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-4 bg-gray-200 rounded" />
            <div className="h-4 w-48 bg-gray-200 rounded" />
          </div>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <header className="mb-8 space-y-4">
          <div className="h-6 w-24 bg-gray-200 rounded" />
          <div className="h-8 md:h-10 bg-gray-200 rounded w-3/4" />
          <div className="h-5 bg-gray-200 rounded w-full" />
          <div className="h-5 bg-gray-200 rounded w-2/3" />

          <div className="flex items-center gap-3 pt-4 border-b border-gray-200 pb-6">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-200 rounded" />
            </div>
          </div>
        </header>

        {/* Image Skeleton */}
        <div className="aspect-video bg-gray-200 rounded-lg mb-8" />

        {/* Content Skeleton */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: `${100 - (i * 5)}%` }} />
          ))}
        </div>

        {/* Related News Skeleton */}
        <section className="mt-12 pt-8 border-t">
          <div className="h-7 w-40 bg-gray-200 rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 bg-white rounded-lg shadow p-4">
                <div className="w-32 h-20 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
