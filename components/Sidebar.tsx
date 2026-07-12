'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDateHindi } from '@/lib/utils';
import WeatherWidget from './WeatherWidget';
import LiveTV from './LiveTV';
import Newsletter from './Newsletter';
import { supabase } from '@/lib/supabaseClient';

interface News {
  id: string;
  slug: string;
  title: string;
  image: string;
  media_type: 'image' | 'video';
  video_url?: string;
  youtube_id?: string;
  category: string;
  author: string;
  published_at: string;
}

interface Category {
  slug: string;
  name: string;
}

interface SidebarAd {
  adsense_client?: string;
  adsense_slot_article?: string;
  banner_link?: string;
}

export default function Sidebar() {
  const [latest, setLatest] = useState<News[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [adSettings, setAdSettings] = useState<SidebarAd>({});

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch latest news
        const { data: newsItems } = await supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(10);
        if (newsItems) setLatest(newsItems);

        // 2. Fetch categories
        const { data: cats } = await supabase
          .from('categories')
          .select('slug, name');
        if (cats) setCategories(cats);

        // 3. Fetch Ad settings
        const { data: setts } = await supabase
          .from('settings')
          .select('adsense_client, adsense_slot_article, banner_link')
          .eq('id', 1)
          .single();
        if (setts) {
          setAdSettings({
            adsense_client: setts.adsense_client || undefined,
            adsense_slot_article: setts.adsense_slot_article || undefined,
            banner_link: setts.banner_link || undefined,
          });
        }
      } catch (err) {
        console.error('Error fetching Sidebar data:', err);
      }
    }
    fetchData();
  }, []);

  function getCategoryName(slug: string): string {
    return categories.find(c => c.slug === slug)?.name || slug;
  }

  // Handle sidebar Adsense push
  useEffect(() => {
    if (adSettings.adsense_client && adSettings.adsense_slot_article) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error('Sidebar AdSense error:', e);
      }
    }
  }, [adSettings]);

  return (
    <aside className="space-y-8">
      {/* Live TV */}
      <LiveTV />

      {/* Weather */}
      <WeatherWidget />

      {/* Latest News */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b-2 border-primary pb-2 mb-4">
          ताज़ा खबरें
        </h2>
        <div className="space-y-4">
          {latest.slice(0, 5).map((news: News) => (
            <div key={news.id} className="flex gap-3 py-3 border-b border-border dark:border-slate-700 last:border-b-0">
              <div className="w-24 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-slate-700">
                {news.youtube_id ? (
                  <img
                    src={`https://img.youtube.com/vi/${news.youtube_id}/mqdefault.jpg`}
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/news/${news.slug}`}>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm leading-snug line-clamp-2 hover:text-primary transition-colors">
                    {news.title}
                  </h4>
                </Link>
                <div className="flex items-center gap-1 mt-1.5">
                  {news.youtube_id && (
                    <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded flex items-center">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  )}
                  <time className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDateHindi(news.published_at)}
                  </time>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Link
          href="/latest"
          className="block text-center text-primary font-medium py-2 hover:underline mt-2"
        >
          सभी ताज़ा खबरें →
        </Link>
      </section>

      {/* Trending */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b-2 border-primary pb-2 mb-4">
          ट्रेंडिंग
        </h2>
        <ol className="space-y-3">
          {latest.slice(0, 5).map((news: News, index: number) => (
            <li key={news.id}>
              <Link
                href={`/news/${news.slug}`}
                className="flex items-start gap-3 group"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-primary font-bold rounded flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary line-clamp-2 text-sm leading-snug transition-colors">
                    {news.title}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                    {getCategoryName(news.category)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Newsletter */}
      <Newsletter variant="card" />

      {/* Dynamic Sidebar Ad banner */}
      <section className="bg-gray-100 dark:bg-slate-800 rounded-lg p-4 text-center border dark:border-slate-700">
        {adSettings.adsense_client && adSettings.adsense_slot_article ? (
          <div className="w-full overflow-hidden flex justify-center">
            <ins
              className="adsbygoogle"
              style={{ display: 'block', width: '300px', height: '250px' }}
              data-ad-client={adSettings.adsense_client}
              data-ad-slot={adSettings.adsense_slot_article}
            />
          </div>
        ) : adSettings.banner_link ? (
          <a href={adSettings.banner_link} target="_blank" rel="noopener noreferrer" className="block">
            <img src={adSettings.banner_link} alt="Ad Banner" className="w-full h-auto max-h-64 object-contain rounded-lg shadow-sm" />
          </a>
        ) : (
          <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded h-64 flex items-center justify-center">
            <div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">विज्ञापन स्थान</p>
              <p className="text-sm text-gray-400">300 × 250</p>
            </div>
          </div>
        )}
      </section>
    </aside>
  );
}
