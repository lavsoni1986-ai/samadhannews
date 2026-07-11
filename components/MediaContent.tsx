'use client';

import Image from 'next/image';

interface MediaContentProps {
  mediaType: 'image' | 'video';
  image?: string;
  youtubeId?: string;
  videoUrl?: string;
  title: string;
  priority?: boolean;
}

export default function MediaContent({
  mediaType,
  image,
  youtubeId,
  videoUrl,
  title,
  priority = false,
}: MediaContentProps) {
  if (mediaType === 'video' && youtubeId) {
    return (
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title={title}
          className="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (mediaType === 'video' && videoUrl) {
    return (
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
        <video
          controls
          className="absolute top-0 left-0 w-full h-full object-contain"
          poster={image}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Default: image
  return (
    <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={priority}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-gray-400">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
}
