'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Image as ImageIcon, PenLine, TrendingUp, Newspaper } from 'lucide-react';
import HeroNews from '@/components/Hero';
import NewsCard from '@/components/NewsCard';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import { News, getLatestVideos, getCategoryName } from '@/lib/mockData';
import { getStoredNews } from '@/lib/utils';

const HOME_SECTIONS = [
  'rajneeti',
  'desh',
  'duniya',
  'rajya',
  'vyapar',
  'tech',
  'shiksha',
  'kheel',
  'manoranjan',
  'swasthya',
  'dharm',
  'jeevan',
];

function SectionHeader({ children, slug }: { children: React.ReactNode; slug?: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-l-4 border-primary pl-3 flex items-center gap-2">
        {children}
      </h2>
      <div className="flex-1 h-px bg-border dark:bg-slate-700" />
      {slug && (
        <Link href={`/category/${slug}`} className="text-primary text-sm font-medium hover:underline whitespace-nowrap">
          सभी देखें →
        </Link>
      )}
    </div>
  );
}

export default function HomeContent() {
  const [latest, setLatest] = useState<News[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLatest(getStoredNews());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-surface">
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse mb-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow animate-pulse">
                    <div className="aspect-video bg-gray-200 dark:bg-slate-700 rounded mb-4" />
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
                  </div>
                ))}
              </div>
            </div>
            <aside className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded mb-4" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-3 py-3 border-b border-border dark:border-slate-700">
                    <div className="w-24 h-16 bg-gray-200 dark:bg-slate-700 rounded" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2" />
                      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>
    );
  }

  const heroNews = latest[0];
  const featured = latest.slice(1, 3);
  const latestGrid = latest.slice(3, 12);
  const videos = getLatestVideos(4);
  const photoGallery = latest.filter((n) => n.mediaType === 'image').slice(0, 6);
  const opinions = latest
    .filter((n) => n.category === 'sampadkiya' || n.category === 'raay')
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-surface">
      {/* Hero / Breaking News */}
      {heroNews && <HeroNews featured={heroNews} />}

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Featured Stories */}
            {featured.length > 0 && (
              <section>
                <SectionHeader>
                  <PenLine className="w-6 h-6 text-primary" />
                  फीचर स्टोरीज़
                </SectionHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featured.map((item: News) => (
                    <NewsCard key={item.id} news={item} variant="featured" />
                  ))}
                </div>
              </section>
            )}

            {/* Latest News */}
            <section>
              <SectionHeader>
                <Newspaper className="w-6 h-6 text-primary" />
                ताज़ा खबरें
              </SectionHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {latestGrid.map((item: News) => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href="/latest"
                  className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  और खबरें लोड करें
                </Link>
              </div>
            </section>

            {/* Category Sections */}
            {HOME_SECTIONS.map((slug) => {
              const items = latest.filter((n) => n.category === slug).slice(0, 3);
              if (items.length === 0) return null;
              return (
                <section key={slug}>
                  <SectionHeader slug={slug}>{getCategoryName(slug)}</SectionHeader>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {items.map((item: News) => (
                      <NewsCard key={item.id} news={item} />
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Video News */}
            {videos.length > 0 && (
              <section>
                <SectionHeader>
                  <Play className="w-6 h-6 text-primary" fill="currentColor" />
                  वीडियो न्यूज़
                </SectionHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videos.map((item: News) => (
                    <NewsCard key={item.id} news={item} />
                  ))}
                </div>
              </section>
            )}

            {/* Photo Gallery */}
            {photoGallery.length > 0 && (
              <section>
                <SectionHeader>
                  <ImageIcon className="w-6 h-6 text-primary" />
                  फोटो गैलरी
                </SectionHeader>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {photoGallery.map((item: News) => (
                    <Link
                      key={item.id}
                      href={`/news/${item.slug}`}
                      className="group relative aspect-square rounded-lg overflow-hidden"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                        <p className="text-white text-xs font-medium line-clamp-2">{item.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Editorial & Opinion */}
            {opinions.length > 0 && (
              <section>
                <SectionHeader>
                  <TrendingUp className="w-6 h-6 text-primary" />
                  संपादकीय और राय
                </SectionHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {opinions.map((item: News) => (
                    <NewsCard key={item.id} news={item} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Sidebar />
          </aside>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <Newsletter variant="full" />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
