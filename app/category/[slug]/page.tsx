import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { mapDbNewsToAppNews } from "@/lib/supabaseClient";
import CategoryContent from "@/components/CategoryContent";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Return empty array to prevent build errors.
  // dynamicParams = true ensures all pages render dynamically on-demand.
  return [];
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.from('categories').select('*').eq('slug', decodedSlug).single();

  if (!data) {
    return { title: "पृष्ठ नहीं मिला | समाधान NEWS" };
  }

  const category = data;

  return {
    title: `${category.name} समाचार – समाधान NEWS`,
    description: `ताज़ा ${category.name} (${category.name_en || ''}) समाचार, अपडेट और विश्लेषण। खबर वही जो सही।`,
    alternates: { canonical: `https://samadhaannews.in/category/${slug}` },
    openGraph: {
      title: `${category.name} समाचार – समाधान NEWS`,
      description: `ताज़ा ${category.name} समाचार और अपडेट।`,
      type: "website",
      url: `https://samadhaannews.in/category/${slug}`,
      siteName: "समाधान NEWS",
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const cookieStore = await cookies();
  const supabaseServer = createClient(cookieStore);

  // 1. Fetch categories
  const { data: cats } = await supabaseServer.from('categories').select('slug, name, name_en');
  const categoriesList = cats || [];
  const category = categoriesList.find((c: { slug: string; name: string; name_en: string }) => c.slug === decodedSlug);

  if (!category) {
    notFound();
  }

  // 2. Fetch news items under this category
  const { data: newsItems } = await supabaseServer
    .from('news')
    .select('*')
    .eq('category', decodedSlug)
    .order('published_at', { ascending: false });
  
  const categoryNews = (newsItems || []).map(item => mapDbNewsToAppNews(item));

  return (
    <CategoryContent
      slug={decodedSlug}
      category={category}
      categoriesList={categoriesList}
      initialNews={categoryNews}
    />
  );
}
