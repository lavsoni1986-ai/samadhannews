'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, mapDbNewsToAppNews } from '@/lib/supabaseClient';
import { News } from '@/lib/mockData';
import Footer from '@/components/Footer';

interface Category {
  slug: string;
  name: string;
  name_en: string;
}

interface CategoryContentProps {
  slug: string;
}

const ITEMS_PER_PAGE = 6;

export default function CategoryContent({ slug }: CategoryContentProps) {
  const [categoryNews, setCategoryNews] = useState<News[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch categories
        const { data: cats } = await supabase.from('categories').select('slug, name, name_en');
        if (cats) setCategoriesList(cats);

        // 2. Fetch news items under this category
        const { data: newsItems } = await supabase
          .from('news')
          .select('*')
          .eq('category', slug)
          .order('published_at', { ascending: false });
        if (newsItems) {
          const mapped = newsItems.map(item => mapDbNewsToAppNews(item));
          setCategoryNews(mapped);
        }
      } catch (err) {
        console.error('Error fetching CategoryContent data:', err);
      } finally {
        setMounted(true);
      }
    }
    fetchData();
  }, [slug]);

  const category = categoriesList.find((c: Category) => c.slug === slug);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="h-12 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
        </div>
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow animate-pulse">
                <div className="aspect-video bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (!category) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">श्रेणी नहीं मिली</h1>
          <Link href="/" className="text-red-600 hover:underline">होम पर वापस जाएं</Link>
        </div>
      </main>
    );
  }

  const totalPages = Math.ceil(categoryNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNews = categoryNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      {/* Breadcrumb */}
      <nav className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link href="/" className="hover:text-red-600">होम</Link></li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white">{category.name}</li>
          </ol>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center">
              <span className="text-red-600 dark:text-red-400 text-3xl font-bold">{category.name[0]}</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{category.name}</h1>
              <p className="text-gray-500 dark:text-gray-400">{category.name_en} समाचार</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto">
            <button
              onClick={() => setCurrentPage(1)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${currentPage === 1 ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}
            >
              सभी
            </button>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {paginatedNews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedNews.map((item: News) => (
                <div key={item.id}>
                  <Link href={`/news/${item.slug}`}>
                    <article className="bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:shadow-md dark:border dark:border-slate-700 transition-shadow overflow-hidden h-full">
                      <div className="relative aspect-[16/9]">
                        {item.youtubeId ? (
                          <>
                            <img
                              src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`}
                              alt={item.title}
                              className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            </div>
                          </>
                        ) : (
                          <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 dark:text-white hover:text-red-600 transition-colors line-clamp-2 text-lg leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 line-clamp-2 leading-relaxed">{item.excerpt}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                          {new Date(item.publishedAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </article>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-350 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  पिछला
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded transition-colors cursor-pointer ${
                      pageNum === currentPage
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-350 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  अगला
                </button>
              </div>
            )}

            <p className="text-center text-sm text-gray-500 mt-4">
              पृष्ठ {currentPage} / {totalPages} • कुल {categoryNews.length} खबरें
            </p>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📰</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">कोई खबर नहीं मिली</h2>
            <p className="text-gray-500">इस श्रेणी में अभी कोई समाचार उपलब्ध नहीं है।</p>
            <Link href="/" className="inline-block mt-4 text-red-600 font-medium hover:underline">होम पेज पर जाएं</Link>
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
