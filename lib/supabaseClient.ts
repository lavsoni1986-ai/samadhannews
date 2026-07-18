import { createClient } from '@supabase/supabase-js';
import { News } from './mockData';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  if (typeof window !== 'undefined') {
    console.warn('Supabase URL or key environment variables are missing. Falling back to placeholder strings.');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function mapDbNewsToAppNews(dbItem: any): News {
  return {
    id: dbItem.id?.toString() || '',
    slug: dbItem.slug || '',
    title: dbItem.title || '',
    excerpt: dbItem.excerpt || '',
    content: dbItem.content || '',
    image: dbItem.image || '',
    images: Array.isArray(dbItem.images) ? dbItem.images.filter((u: any) => typeof u === 'string' && u.length > 0) : [],
    mediaType: dbItem.media_type || 'image',
    videoUrl: dbItem.video_url || undefined,
    youtubeId: dbItem.youtube_id || undefined,
    category: dbItem.category || '',
    author: dbItem.author || '',
    publishedAt: dbItem.published_at || new Date().toISOString(),
    views: dbItem.views || 0,
  };
}

