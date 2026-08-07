import { ImageLoaderProps } from 'next/image';

/**
 * Custom Cloudinary Loader for Next.js <Image /> component.
 * Automatically injects q_auto, f_auto, and responsive width parameters (w_{width})
 * for Cloudinary-hosted media URLs.
 */
export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!src) return '';
  
  // If it's a Cloudinary URL, apply Cloudinary transformations
  if (src.includes('res.cloudinary.com')) {
    const qParam = quality ? `q_${quality}` : 'q_auto';
    const params = `c_limit,w_${width},${qParam},f_auto`;

    if (src.includes('/upload/')) {
      return src.replace('/upload/', `/upload/${params}/`);
    }
  }

  // Return original src for non-Cloudinary images
  return src;
}
