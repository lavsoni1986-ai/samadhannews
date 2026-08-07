import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 3600; // Revalidate RSS feed hourly

function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const siteUrl = 'https://samadhaannews.in';

  let newsItems: any[] = [];
  try {
    const { data } = await supabase
      .from('news')
      .select('title, slug, excerpt, published_at, category, author')
      .order('published_at', { ascending: false })
      .limit(30);
    if (data) newsItems = data;
  } catch (err) {
    console.error('Error generating RSS feed:', err);
  }

  const itemsXml = newsItems
    .map((item) => {
      const pubDate = new Date(item.published_at).toUTCString();
      const itemLink = `${siteUrl}/news/${item.slug}`;
      return `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${itemLink}</link>
      <guid isPermaLink="true">${itemLink}</guid>
      <description>${escapeXml(item.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(item.category)}</category>
      <author>${escapeXml(item.author || 'समाधान NEWS')}</author>
    </item>`;
    })
    .join('\n');

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>समाधान NEWS | खबर वही जो सही</title>
    <link>${siteUrl}</link>
    <description>भारत की प्रमुख हिंदी डिजिटल न्यूज़ प्लेटफ़ॉर्म। राजनीति, राष्ट्रीय, अंतर्राष्ट्रीय, खेल और व्यापार की ताज़ा ख़बरें।</description>
    <language>hi-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
