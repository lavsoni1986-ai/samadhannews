import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 86400; // Revalidate daily

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://samadhaannews.in';

  // Static Pages
  const routes = [
    '',
    '/about',
    '/contact',
    '/advertise',
    '/disclaimer',
    '/editorial-team',
    '/privacy',
    '/terms',
    '/latest',
    '/live',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.7,
  }));

  // Dynamic Category Pages
  let categories: any[] = [];
  try {
    const { data } = await supabase.from('categories').select('slug');
    if (data) categories = data;
  } catch (err) {
    console.error('Error loading sitemap categories:', err);
  }

  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.8,
  }));

  // Dynamic News Stories
  let news: any[] = [];
  try {
    const { data } = await supabase
      .from('news')
      .select('slug, published_at')
      .order('published_at', { ascending: false })
      .limit(100);
    if (data) news = data;
  } catch (err) {
    console.error('Error loading sitemap news:', err);
  }

  const newsRoutes = news.map((item) => ({
    url: `${baseUrl}/news/${item.slug}`,
    lastModified: new Date(item.published_at),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...routes, ...categoryRoutes, ...newsRoutes];
}
