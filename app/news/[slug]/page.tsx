import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { news, getCategoryName } from "@/lib/mockData";
import NewsContent from "@/components/NewsContent";

interface NewsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return news.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = news.find((n) => n.slug === slug);

  if (!item) {
    return { title: "पृष्ठ नहीं मिला | समाधान NEWS" };
  }

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
  const item = news.find((n) => n.slug === slug);

  if (!item) {
    notFound();
  }

  return <NewsContent slug={slug} />;
}
