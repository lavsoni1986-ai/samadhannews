import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import CategoryContent from "@/components/CategoryContent";

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
  const { data } = await supabase.from('categories').select('*').eq('slug', slug).single();

  if (!data) {
    return { title: "पृष्ठ नहीं मिला | समाधान NEWS" };
  }

  const category = data;

  return {
    title: `${category.name} समाचार – समाधान NEWS`,
    description: `ताज़ा ${category.name} (${category.name_en || category.nameEn || ''}) समाचार, अपडेट और विश्लेषण। खबर वही जो सही।`,
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
  const { data } = await supabase.from('categories').select('slug').eq('slug', slug).single();

  if (!data) {
    notFound();
  }

  return <CategoryContent slug={slug} />;
}
