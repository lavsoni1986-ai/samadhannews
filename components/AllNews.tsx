'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { News } from '@/lib/mockData';
import { getStoredNews } from '@/lib/utils';
import NewsCard from './NewsCard';
import Footer from './Footer';

interface AllNewsProps {
  title: string;
  subtitle?: string;
}

export default function AllNews({ title, subtitle }: AllNewsProps) {
  const [latest, setLatest] = useState<News[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLatest(getStoredNews());
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-surface">
      <header className="bg-white dark:bg-slate-900 border-b border-border dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
          <nav className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <Link href="/" className="hover:text-primary">होम</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">{title}</span>
          </nav>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 py-8">
        {!mounted ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow animate-pulse">
                <div className="aspect-video bg-gray-200 dark:bg-slate-700 rounded mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((item: News) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
