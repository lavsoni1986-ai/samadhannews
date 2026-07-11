import type { Metadata } from 'next';
import { Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'विज्ञापन दें – समाधान NEWS',
  description: 'समाधान NEWS पर विज्ञापन देकर अपने ब्रांड तक लाखों पाठकों तक पहुंचें।',
  alternates: { canonical: 'https://samadhaannews.in/advertise' },
};

export default function AdvertisePage() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">विज्ञापन दें</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          समाधान NEWS पर विज्ञापन देकर भारत भर के लाखों हिंदी पाठकों तक पहुंचें। हमारी संपादकीय टीम
          ब्रांड की ज़रूरत के हिसाब से कस्टम समाधान देती है।
        </p>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-border dark:border-slate-700 p-8 space-y-4 text-gray-700 dark:text-gray-300">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">विज्ञापन विकल्प</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>डिस्प्ले बैनर (Header / Sidebar / In-article)</li>
            <li>स्पॉन्सर्ड स्टोरीज़ और ब्रांडेड कंटेंट</li>
            <li>वीडियो और लाइव टीवी इंटीग्रेशन</li>
            <li>न्यूज़लेटर स्पॉन्सरशिप</li>
          </ul>
          <div className="pt-4 border-t border-border dark:border-slate-700 space-y-2">
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> news@samadhaannews.in</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +91 97532 39303</p>
          </div>
        </div>
      </div>
    </main>
  );
}
