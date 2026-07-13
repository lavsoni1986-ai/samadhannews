import type { Metadata, Viewport } from "next";
import { Noto_Sans_Devanagari } from "next/font/google";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import "./globals.css";
import { supabase } from "@/lib/supabaseClient";

const SITE_URL = "https://samadhaannews.in";

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "समाधान NEWS | खबर वही जो सही",
    template: "%s | समाधान NEWS",
  },
  description:
    "समाधान NEWS – भारत की प्रमुख हिंदी डिजिटल न्यूज़ प्लेटफ़ॉर्म। राजनीति, राष्ट्रीय, अंतर्राष्ट्रीय, राज्य, व्यापार, तकनीक, खेल, मनोरंजन, स्वास्थ्य और शिक्षा की ताज़ा खबरें। खबर वही जो सही।",
  keywords: [
    "समाधान न्यूज",
    "Samadhaan News",
    "हिंदी समाचार",
    "Breaking News",
    "भारत समाचार",
    "राजनीति",
    "राष्ट्रीय",
    "अंतर्राष्ट्रीय",
    "खेल",
    "मनोरंजन",
    "तकनीक",
    "व्यापार",
    "स्वास्थ्य",
    "शिक्षा",
    "ताज़ा खबर",
    "देश",
    "दुनिया",
  ],
  authors: [{ name: "समाधान NEWS संपादक मंडल" }],
  creator: "समाधान NEWS",
  publisher: "समाधान NEWS",
  applicationName: "समाधान NEWS",
  category: "news",
  alternates: {
    canonical: SITE_URL,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "hi_IN",
    url: SITE_URL,
    siteName: "समाधान NEWS",
    title: "समाधान NEWS | खबर वही जो सही",
    description:
      "भारत की प्रमुख हिंदी डिजिटल न्यूज़ प्लेटफ़ॉर्म – ताज़ा, निष्पक्ष और तेज़ खबरें। खबर वही जो सही।",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "समाधान NEWS – खबर वही जो सही",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "समाधान NEWS | खबर वही जो सही",
    description:
      "भारत की प्रमुख हिंदी डिजिटल न्यूज़ प्लेटफ़ॉर्म – ताज़ा, निष्पक्ष और तेज़ खबरें।",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/site.webmanifest",
  verification: {},
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#C1121F" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "समाधान NEWS",
      alternateName: "Samadhaan News",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.svg`,
        width: 512,
        height: 512,
      },
      sameAs: [
        "https://www.youtube.com/@SamadhaanNews",
        "https://www.facebook.com/samadhaannews",
        "https://twitter.com/samadhaannews",
        "https://www.instagram.com/samadhaannews",
      ],
      description:
        "समाधान NEWS – भारत की प्रमुख हिंदी डिजिटल न्यूज़ प्लेटफ़ॉर्म। खबर वही जो सही।",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "समाधान NEWS",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "hi-IN",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let adsenseClient = "";
  try {
    const { data } = await supabase
      .from('settings')
      .select('adsense_client')
      .eq('id', 1)
      .single();
    if (data) {
      adsenseClient = data.adsense_client || "";
    }
  } catch (err) {
    console.error("Error fetching adsense_client in RootLayout:", err);
  }

  return (
    <html lang="hi" className={`${notoSansDevanagari.variable} font-sans`} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#C1121F" />
        <link rel="alternate" type="application/rss+xml" href="/rss.xml" title="समाधान NEWS RSS" />
        {adsenseClient && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
          />
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('samadhaan-theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-sans antialiased">
        <Navbar />
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}
