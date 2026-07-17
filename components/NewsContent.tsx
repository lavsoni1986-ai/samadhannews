'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { formatDateTimeHindi } from '@/lib/utils';
import MediaContent from '@/components/MediaContent';
import Footer from '@/components/Footer';
import { News } from '@/lib/mockData';

interface Category {
  slug: string;
  name: string;
  name_en: string;
}

interface AdSettings {
  adsense_client?: string;
  adsense_slot_article?: string;
  banner_link?: string;
  // Feature Pack-1: Local Direct Ad Slots
  banner_top_url?: string;
  banner_top_link?: string;
  banner_article_url?: string;
  banner_article_link?: string;
}

interface NewsContentProps {
  item: News;
  categoriesList: Category[];
  related: News[];
  adSettings: AdSettings;
}

function AdSenseBanner({ client, slot, fallbackUrl }: { client?: string; slot?: string; fallbackUrl?: string }) {
  useEffect(() => {
    if (client && slot) {
      try {
        const win = window as unknown as { adsbygoogle?: Record<string, unknown>[] };
        win.adsbygoogle = win.adsbygoogle || [];
        win.adsbygoogle.push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [client, slot]);

  if (client && slot) {
    return (
      <div className="my-6 flex justify-center text-center w-full overflow-hidden">
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
      <div className="my-6 flex justify-center w-full">
        <a href={fallbackUrl} target="_blank" rel="noopener noreferrer" className="block max-w-full">
          <img src={fallbackUrl} alt="Advertisement" className="max-w-full h-auto rounded-xl shadow-sm border border-slate-200 dark:border-slate-700" />
        </a>
      </div>
    );
  }

  return null;
}

export default function NewsContent({ item, categoriesList, related, adSettings }: NewsContentProps) {

  // Get Hindi category name
  const catName = categoriesList.find(c => c.slug === item.category)?.name || item.category;

  // JSON-LD SEO Schemas
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'होम',
        'item': 'https://samadhaannews.in/',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': catName,
        'item': `https://samadhaannews.in/category/${item.category}`,
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': item.title,
        'item': `https://samadhaannews.in/news/${item.slug}`,
      },
    ],
  };

  const newsArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': item.title,
    'image': [item.image],
    'datePublished': item.publishedAt,
    'dateModified': item.publishedAt,
    'author': [
      {
        '@type': 'Person',
        'name': item.author,
      },
    ],
    'publisher': {
      '@type': 'Organization',
      'name': 'समाधान NEWS',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://samadhaannews.in/icon.svg',
      },
    },
    'description': item.excerpt,
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      
      {/* Dynamic SEO JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link href="/" className="hover:text-red-600">होम</Link></li>
            <li>/</li>
            <li><Link href={`/category/${item.category}`} className="hover:text-red-600">{catName}</Link></li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white truncate max-w-xs">{item.title}</li>
          </ol>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 py-8">
        {/* Local Ad SLOT 1: Top Banner */}
        {adSettings.banner_top_url && (
          <div className="mb-6 flex justify-center w-full">
            <a
              href={adSettings.banner_top_link || '#'}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="block w-full max-w-3xl rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={adSettings.banner_top_url}
                alt="विज्ञापन"
                className="w-full h-auto object-cover"
              />
            </a>
          </div>
        )}

        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Link href={`/category/${item.category}`} className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 px-3 py-1 rounded text-sm font-medium hover:bg-red-200 transition-colors">
              {catName}
            </Link>
            {item.youtubeId && (
              <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                वीडियो
              </span>
            )}
          </div>
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {item.title}
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{item.excerpt}</p>

          <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 font-bold text-lg">{item.author[0]}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.author}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateTimeHindi(item.publishedAt)}</p>
              </div>
            </div>
            
            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <button className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer" aria-label="Share on Facebook">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </button>
              <button className="p-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors cursor-pointer" aria-label="Share on Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </button>
              <button className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors cursor-pointer" aria-label="Share on WhatsApp">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </button>
            </div>
          </div>
        </header>

        {/* Media */}
        <div className="mb-8">
          <MediaContent
            mediaType={item.mediaType}
            image={item.image}
            youtubeId={item.youtubeId}
            videoUrl={item.videoUrl}
            title={item.title}
            priority={true}
          />
        </div>

        {/* YouTube Subscribe CTA */}
        {item.youtubeId && (
          <div className="mb-8 p-5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-lg">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg">इस वीडियो को पसंद किया?</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">हमारे YouTube चैनल को सब्सक्राइब करें और और भी Hindi news देखें!</p>
              </div>
              <a
                href="https://www.youtube.com/@SamadhaanNews"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                सब्सक्राइब करें
              </a>
            </div>
          </div>
        )}

        {/* Multi-Image Gallery Carousel — Feature Pack-1 */}
        {item.images && item.images.length > 1 && (
          <div className="mb-8">
            <h3 className="text-base font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-red-600 rounded-full inline-block" />
              फ़ोटो गैलरी
            </h3>
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide">
              {item.images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="snap-start shrink-0 w-64 h-44 md:w-80 md:h-52 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-sm bg-gray-100 dark:bg-slate-800"
                >
                  <img
                    src={imgUrl}
                    alt={`${item.title} - चित्र ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Local Ad SLOT 2: In-Article Banner */}
        {adSettings.banner_article_url ? (
          <div className="my-6 flex justify-center w-full">
            <a
              href={adSettings.banner_article_link || '#'}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="block w-full max-w-2xl rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={adSettings.banner_article_url}
                alt="विज्ञापन"
                className="w-full h-auto object-cover"
              />
            </a>
          </div>
        ) : (adSettings.adsense_client || adSettings.banner_link) && (
          <AdSenseBanner
            client={adSettings.adsense_client}
            slot={adSettings.adsense_slot_article}
            fallbackUrl={adSettings.banner_link}
          />
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-800 dark:text-gray-200"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />

        {/* Tags */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-2">
            <Link href={`/category/${item.category}`} className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-4 py-1.5 rounded text-sm hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
              #{catName}
            </Link>
            {item.youtubeId && (
              <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 px-4 py-1.5 rounded text-sm">#वीडियो</span>
            )}
          </div>
        </div>
      </article>

      {/* Related News */}
      {related.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 py-10 border-t border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white border-l-4 border-red-600 pl-3 mb-6">
            संबंधित खबरें
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {related.map((item) => (
              <Link key={item.id} href={`/news/${item.slug}`} className="flex gap-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 hover:shadow-md dark:border dark:border-slate-700 transition-shadow">
                <div className="w-32 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-slate-700">
                  {item.youtubeId ? (
                    <img
                      src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`}
                      alt={item.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-sm leading-snug">{item.title}</h3>
                  <div className="flex items-center gap-1.5 mt-2">
                    {item.youtubeId && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded flex items-center"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>}
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDateTimeHindi(item.publishedAt)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </main>
  );
}
