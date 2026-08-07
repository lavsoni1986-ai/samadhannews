import Link from 'next/link';
import Image from 'next/image';
import cloudinaryLoader from '@/lib/imageLoader';
import { News } from '@/lib/mockData';
import { formatDateHindi } from '@/lib/utils';

interface HeroProps {
  featured: News;
}

export default function Hero({ featured }: HeroProps) {
  const isVideo = featured.mediaType === 'video' || !!featured.youtubeId || !!featured.videoUrl;
  const thumbUrl = featured.youtubeId
    ? `https://img.youtube.com/vi/${featured.youtubeId}/maxresdefault.jpg`
    : featured.image;
  const durationLabel = featured.videoDuration ? `▶ ${featured.videoDuration}` : 'वीडियो देखें';

  return (
    <section className="relative">
      <Link href={`/news/${featured.slug}`} className="group">
        <article className="relative h-full">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
            {isVideo ? (
              <>
                <Image
                  loader={cloudinaryLoader}
                  src={thumbUrl}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-md flex items-center gap-2 shadow-md">
                  {durationLabel}
                </div>
              </>
            ) : (
              <Image
                loader={cloudinaryLoader}
                src={featured.image}
                alt={featured.title}
                fill
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
                className="object-cover w-full h-full"
              />
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
