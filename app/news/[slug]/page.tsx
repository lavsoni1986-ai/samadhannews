import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase, mapDbNewsToAppNews } from "@/lib/supabaseClient";
import NewsContent from "@/components/NewsContent";

export const dynamicParams = true;

interface NewsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { data, error } = await supabase
    .from('news')
    .select('slug')
    .order('published_at', { ascending: false })
    .limit(1000);

  if (error || !data) return [];

  return data.map((row: any) => ({ slug: row.slug }));
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;
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
  const { data } = await supabase.from('news').select('slug').eq('slug', slug).single();

  if (!data) {
    notFound();
  }

  return <NewsContent slug={slug} />;
}
