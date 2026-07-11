import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/lib/mockData";
import CategoryContent from "@/components/CategoryContent";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return { title: "पृष्ठ नहीं मिला | समाधान NEWS" };
  }

  return {
    title: `${category.name} समाचार – समाधान NEWS`,
    description: `ताज़ा ${category.name} (${category.nameEn}) समाचार, अपडेट और विश्लेषण। खबर वही जो सही।`,
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
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  return <CategoryContent slug={slug} />;
}
