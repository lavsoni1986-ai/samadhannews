import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { mapDbNewsToAppNews } from "@/lib/supabaseClient";
import NewsContent from "@/components/NewsContent";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface NewsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Return empty array to prevent ENAMETOOLONG errors on long Devanagari slugs.
  // dynamicParams = true ensures all pages render dynamically on-demand.
  return [];
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.from('news').select('*').eq('slug', slug).single();

  if (!data) {
    return { title: "पृष्ठ नहीं मिला | समाधान NEWS" };
  }

  const item = mapDbNewsToAppNews(data);

  return {
    title: `${item.title} | समाधान NEWS`,
    description: item.excerpt,
    alternates: { canonical: `https://samadhaannews.in/news/${slug}` },
    openGraph: {
      title: item.title,
      description: item.excerpt,
      type: "article",
      publishedTime: item.publishedAt,
      authors: [item.author],
      siteName: "समाधान NEWS",
      images: item.mediaType === 'image' ? [{ url: item.image, width: 800, height: 450, alt: item.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.excerpt,
      images: item.mediaType === 'image' ? [item.image] : [],
    },
  };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const supabaseServer = createClient(cookieStore);

  // 1. Fetch specific news by slug
  const { data: dbNewsItem } = await supabaseServer
    .from('news')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!dbNewsItem) {
    notFound();
  }

  const item = mapDbNewsToAppNews(dbNewsItem);

  // 2. Fetch categories
  const { data: cats } = await supabaseServer
    .from('categories')
    .select('slug, name, name_en');
  const categoriesList = cats || [];

  // 3. Fetch related news (same category, excluding current)
  const { data: relItems } = await supabaseServer
    .from('news')
    .select('*')
    .eq('category', item.category)
    .neq('id', item.id)
    .order('published_at', { ascending: false })
    .limit(4);
  const related = (relItems || []).map(r => mapDbNewsToAppNews(r));

  // 4. Fetch settings for ads
  const { data: setts } = await supabaseServer
    .from('settings')
    .select('adsense_client, adsense_slot_article, banner_link')
    .eq('id', 1)
    .single();
  
  const adSettings = setts ? {
    adsense_client: setts.adsense_client || undefined,
    adsense_slot_article: setts.adsense_slot_article || undefined,
    banner_link: setts.banner_link || undefined,
  } : {};

  return (
    <NewsContent 
      item={item} 
      categoriesList={categoriesList} 
      related={related} 
      adSettings={adSettings} 
    />
  );
}
