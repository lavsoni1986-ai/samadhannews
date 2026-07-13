import Link from 'next/link';
import { News } from '@/lib/mockData';
import { formatDateHindi, truncateText } from '@/lib/utils';

interface NewsCardProps {
  news: News;
  variant?: 'default' | 'compact' | 'featured';
}

export default function NewsCard({ news, variant = 'default' }: NewsCardProps) {
  const categoryColors: Record<string, string> = {
    rajneeti: 'bg-red-100 text-red-700',
    desh: 'bg-blue-100 text-blue-700',
    duniya: 'bg-green-100 text-green-700',
    rajya: 'bg-teal-100 text-teal-700',
    vyapar: 'bg-amber-100 text-amber-700',
    tech: 'bg-purple-100 text-purple-700',
    shiksha: 'bg-indigo-100 text-indigo-700',
    kheel: 'bg-orange-100 text-orange-700',
    manoranjan: 'bg-pink-100 text-pink-700',
    swasthya: 'bg-rose-100 text-rose-700',
    dharm: 'bg-yellow-100 text-yellow-700',
    jeevan: 'bg-emerald-100 text-emerald-700',
    sampadkiya: 'bg-slate-200 text-slate-700',
    raay: 'bg-cyan-100 text-cyan-700',
    cg: 'bg-lime-100 text-lime-700',
    'madhya-pradesh': 'bg-fuchsia-100 text-fuchsia-700',
  };

  if (variant === 'compact') {
    return (
      <Link href={`/news/${news.slug}`} className="group">
        <article className="flex gap-3 py-3 border-b last:border-0">
          <div className="relative w-20 h-14 flex-shrink-0 rounded overflow-hidden bg-gray-100">
            {news.youtubeId ? (
              <img
                src={`https://img.youtube.com/vi/${news.youtubeId}/mqdefault.jpg`}
                alt={news.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <img src={news.image} alt={news.title} className="object-cover w-full h-full" />
            )}
            {news.youtubeId && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-red-600 transition-colors">
              {truncateText(news.title, 60)}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{formatDateHindi(news.publishedAt)}</p>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/news/${news.slug}`} className="group">
        <article className="relative h-full">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-3">
            {news.youtubeId ? (
              <img
                src={`https://img.youtube.com/vi/${news.youtubeId}/maxresdefault.jpg`}
                alt={news.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <img src={news.image} alt={news.title} className="object-cover w-full h-full" />
            )}
            {news.youtubeId && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            )}
            <span className={`absolute top-3 left-3 px-2.5 py-1 rounded text-xs font-medium ${categoryColors[news.category] || 'bg-gray-100 text-gray-700'}`}>
              {news.category}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-tight line-clamp-3">
            {news.title}
          </h2>
          <p className="text-sm md:text-[15px] text-gray-600 mt-2 leading-relaxed line-clamp-2 md:line-clamp-3">{news.excerpt}</p>
          <p className="text-sm text-gray-500 mt-2">{formatDateHindi(news.publishedAt)}</p>
        </article>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/news/${news.slug}`} className="group">
      <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full">
        <div className="relative aspect-[16/9]">
          {news.youtubeId ? (
            <>
              <img
                src={`https://img.youtube.com/vi/${news.youtubeId}/mqdefault.jpg`}
                alt={news.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </>
          ) : (
            <img src={news.image} alt={news.title} className="object-cover w-full h-full" />
          )}
          {news.youtubeId && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              वीडियो
            </span>
          )}
        </div>
        <div className="p-4">
          <span className={`inline-block px-2.5 py-1 rounded text-xs font-medium mb-2 ${categoryColors[news.category] || 'bg-gray-100 text-gray-700'}`}>
            {news.category}
          </span>
          <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-3">
            {news.title}
          </h3>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-2 md:line-clamp-3">{news.excerpt}</p>
          <p className="text-sm text-gray-500 mt-3">{formatDateHindi(news.publishedAt)}</p>
        </div>
      </article>
    </Link>
  );
}
