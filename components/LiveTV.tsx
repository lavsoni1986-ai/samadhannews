import Link from 'next/link';
import { Radio, Play } from 'lucide-react';

export default function LiveTV() {
  return (
    <section className="relative overflow-hidden rounded-xl shadow-sm border border-border dark:border-slate-700 bg-secondary text-white">
      <div className="absolute inset-0 opacity-20 brand-gradient" />
      <div className="relative p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            LIVE
          </span>
          <h2 className="text-lg font-bold">लाइव टीवी</h2>
        </div>
        <Link
          href="/live"
          className="group block relative aspect-video rounded-lg overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center"
        >
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-7 h-7 text-white ml-0.5" fill="currentColor" />
          </div>
          <span className="absolute bottom-2 left-2 text-xs text-gray-200 bg-black/50 px-2 py-0.5 rounded">
            समाधान NEWS लाइव
          </span>
        </Link>
        <p className="text-xs text-gray-300 mt-3">24×7 हिंदी न्यूज़ लाइव स्ट्रीम जल्द आ रही है।</p>
      </div>
    </section>
  );
}
