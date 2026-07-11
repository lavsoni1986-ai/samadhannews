import Link from 'next/link';
import { News } from '@/lib/mockData';
import { formatDateHindi } from '@/lib/utils';

interface HeroProps {
  featured: News;
}

export default function Hero({ featured }: HeroProps) {
  const isVideo = featured.mediaType === 'video' && featured.youtubeId;

  return (
    <section className="relative">
      <Link href={`/news/${featured.slug}`} className="group">
        <article className="relative h-full">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
            {isVideo ? (
              <>
                <img
                  src={`https://img.youtube.com/vi/${featured.youtubeId}/maxresdefault.jpg`}
                  alt={featured.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-red-600 text-white text-sm px-3 py-1 rounded flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  वीडियो देखें
                </div>
              </>
            ) : (
              <img src={featured.image} alt={featured.title} className="object-cover w-full h-full" />
            )}
          </div>
          
          <div className="space-y-3">
            <span className="inline-block px-4 py-1.5 bg-red-600 text-white text-sm font-medium rounded">
              {featured.category}
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors">
              {featured.title}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed line-clamp-2">
              {featured.excerpt}
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="font-medium text-gray-700">{featured.author}</span>
              <span>•</span>
              <span>{formatDateHindi(featured.publishedAt)}</span>
            </div>
          </div>
        </article>
      </Link>
    </section>
  );
}
