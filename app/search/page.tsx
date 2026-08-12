'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search as SearchIcon, Loader2, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import { supabase, mapDbNewsToAppNews } from '@/lib/supabaseClient';
import { News } from '@/lib/mockData';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
    if (initialQuery.trim()) {
      performSearch(initialQuery.trim());
    }
  }, [initialQuery]);

  // Lightweight Search: queries ONLY title and excerpt (avoids heavy full body content text search)
  async function performSearch(searchTerm: string) {
    if (!searchTerm) return;
    setLoading(true);
    setSearched(true);

    try {
      // Query title OR excerpt matching search term
      const { data, error } = await supabase
        .from('news')
        .select('id, slug, title, excerpt, image, images, media_type, video_url, youtube_id, category, author, published_at, is_breaking, views, video_duration')
        .or(`title.ilike.%${searchTerm}%,excerpt.ilike.%${searchTerm}%`)
        .order('published_at', { ascending: false })
        .limit(40);

      if (error) throw error;
      if (data) {
        setResults(data.map(item => mapDbNewsToAppNews(item)));
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error('Error executing light search:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query.trim());
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Search Box */}
        <div className="max-w-2xl mx-auto mb-10 text-center">
          <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            मुख्य पृष्ठ पर वापस जाएं
          </Link>
          <h1 className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white">समाचार खोजें (Search News)</h1>
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="शीर्षक या मुख्य विषय से खोजें (उदा: राजनीति, तकनीक, खेल)..."
              className="w-full px-5 py-3.5 pr-14 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-600 text-base text-gray-900 dark:text-white placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              aria-label="खोजें"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <SearchIcon className="w-5 h-5" />}
            </button>
          </form>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            ⚡ केवल समाचार शीर्षक एवं संक्षिप्त सारांश में सुपरफ़ास्ट खोज (Title & Excerpt Only)
          </p>
        </div>

        {/* Results Section */}
        {searched && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b dark:border-slate-700 pb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                खोज परिणाम: <span className="text-red-600">"{initialQuery}"</span>
              </h2>
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {results.length} खबरें मिलीं
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.map((newsItem) => (
                  <NewsCard key={newsItem.id} news={newsItem} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border dark:border-slate-700 p-8">
                <SearchIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">कोई संबंधित खबर नहीं मिली</h3>
                <p className="text-sm text-gray-500 mt-1">कृपया कोई अन्य शब्द लिखकर पुनः प्रयास करें।</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
        </div>
      }>
        <SearchContent />
      </Suspense>
      <Footer />
    </>
  );
}
