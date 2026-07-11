import type { Metadata } from "next";
import Link from "next/link";
import { Radio, Play } from "lucide-react";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "लाइव टीवी – समाधान NEWS",
  description: "समाधान NEWS लाइव – 24×7 हिंदी न्यूज़ लाइव स्ट्रीम। खबर वही जो सही।",
  alternates: { canonical: "https://samadhaannews.in/live" },
};

export default function LivePage() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full mb-4">
            <Radio className="w-4 h-4 animate-pulse" />
            LIVE
          </span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">समाधान NEWS लाइव</h1>
        </div>

        <div className="relative aspect-video rounded-2xl overflow-hidden bg-secondary text-white flex items-center justify-center mb-6">
          <div className="absolute inset-0 opacity-20 brand-gradient" />
          <div className="relative text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
              <Play className="w-10 h-10 text-white ml-1" fill="currentColor" />
            </div>
            <p className="text-lg font-medium">लाइव स्ट्रीम जल्द आ रही है</p>
            <p className="text-sm text-gray-300 mt-1">24×7 हिंदी न्यूज़ लाइव देखने के लिए बने रहें</p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/latest" className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors">
            ताज़ा खबरें पढ़ें
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
