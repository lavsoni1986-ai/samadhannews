'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { News } from '@/lib/mockData';
import { getStoredNews } from '@/lib/utils';

interface BreakingNewsItemProps {
  news: News;
}

function BreakingNewsItem({ news }: BreakingNewsItemProps) {
  return (
    <Link 
      href={`/news/${news.slug}`}
      className="flex items-center gap-3 px-4 py-2 hover:bg-red-800 transition-colors whitespace-nowrap"
    >
      <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded flex-shrink-0">
        ब्रेकिंग
      </span>
      <span className="text-sm font-medium truncate">{news.title}</span>
    </Link>
  );
}

export default function BreakingNews() {
  const [breaking, setBreaking] = useState<News[]>([]);

  useEffect(() => {
    // Get latest news from localStorage with fallback
    const allNews = getStoredNews();
    const sorted = [...allNews].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    setBreaking(sorted.slice(0, 3));
  }, []);

  if (breaking.length === 0) {
    return null;
  }

  return (
    <section className="bg-red-700 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row">
          <div className="bg-red-900 px-4 py-2 flex items-center justify-center sm:w-40 font-bold">
            ⚡ ब्रेकिंग न्यूज़
          </div>
          <div className="flex-1 overflow-x-auto">
            <div className="flex items-center gap-8 py-2 px-4">
              {breaking.map((item) => (
                <BreakingNewsItem key={item.id} news={item} />
              ))}
              {breaking.map((item) => (
                <BreakingNewsItem key={`${item.id}-dup`} news={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
