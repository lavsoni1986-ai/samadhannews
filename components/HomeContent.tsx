'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Image as ImageIcon, PenLine, TrendingUp, Newspaper } from 'lucide-react';
import HeroNews from '@/components/Hero';
import NewsCard from '@/components/NewsCard';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import { supabase, mapDbNewsToAppNews } from '@/lib/supabaseClient';
import { News } from '@/lib/mockData';

interface Category {
  slug: string;
  name: string;
  name_en: string;
}

interface AdSettings {
  adsense_client?: string;
  adsense_slot_banner?: string;
  banner_link?: string;
}

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

function AdSenseBanner({ client, slot, fallbackUrl }: { client?: string; slot?: string; fallbackUrl?: string }) {
  useEffect(() => {
    if (client && slot) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [client, slot]);

  if (client && slot) {
    return (
      <div className="my-8 flex justify-center text-center w-full overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  if (fallbackUrl) {
    return (
      <div className="my-8 flex justify-center w-full">
        <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" className="block max-w-full">
          <img src={fallbackUrl} alt="Advertisement" className="max-w-full h-auto rounded-xl shadow-sm border border-slate-200 dark:border-slate-700" />
        </a>
      </div>
    );
  }

  return null;
}

export default function HomeContent() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [adSettings, setAdSettings] = useState<AdSettings>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch Categories
        const { data: cats } = await supabase
          .from('categories')
          .select('slug, name, name_en');
        if (cats) setCategoriesList(cats);

        // 2. Fetch News
        const { data: newsItems } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false });
        if (newsItems) {
          const mapped = newsItems.map(item => mapDbNewsToAppNews(item));
          setNewsList(mapped);
        }

        // 3. Fetch Settings
        const { data: setts } = await supabase
          .from('settings')
          .select('adsense_client, adsense_slot_banner, banner_link')
          .eq('id', 1)
          .single();
        if (setts) {
          setAdSettings({
            adsense_client: setts.adsense_client || undefined,
            adsense_slot_banner: setts.adsense_slot_banner || undefined,
            banner_link: setts.banner_link || undefined,
          });
        }
      } catch (err) {
        console.error('Error fetching HomeContent data:', err);
      } finally {
        setMounted(true);
      }
    }

    fetchData();
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

  // Get breaking news from settings or fallback to the latest breaking news entries
  const breakingList = newsList.filter(n => (n as any).is_breaking);
  const heroNews = breakingList[0] || newsList[0];
  
  // Exclude heroNews from other feeds to avoid duplication
  const remainingNews = newsList.filter(n => n.id !== heroNews?.id);

  const featured = remainingNews.slice(0, 2);
  const latestGrid = remainingNews.slice(2, 11);
  const videos = newsList.filter((n) => n.youtubeId || n.videoUrl).slice(0, 4);
  const photoGallery = newsList.filter((n) => n.mediaType === 'image').slice(0, 6);
  const opinions = newsList
    .filter((n) => n.category === 'sampadkiya' || n.category === 'raay')
    .slice(0, 4);

  // Helper to map category slugs to Hindi names
  function getCategoryName(slug: string): string {
    return categoriesList.find(c => c.slug === slug)?.name || slug;
  }

  return (
    <main className="min-h-screen bg-surface">
      {/* Hero / Breaking News */}
      {heroNews && <HeroNews featured={heroNews} />}

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Top Advertisement Banner */}
            {(adSettings.adsense_client || adSettings.banner_link) && (
              <AdSenseBanner 
                client={adSettings.adsense_client} 
                slot={adSettings.adsense_slot_banner} 
                fallbackUrl={adSettings.banner_link} 
              />
            )}

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
            {categoriesList.map((cat) => {
              const items = newsList.filter((n) => n.category === cat.slug).slice(0, 3);
              if (items.length === 0) return null;
              return (
                <section key={cat.slug}>
                  <SectionHeader slug={cat.slug}>{cat.name}</SectionHeader>
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
