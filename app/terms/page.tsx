import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'नियम और शर्तें – समाधान NEWS',
  description: 'समाधान NEWS वेबसाइट के उपयोग के नियम और शर्तें।',
  alternates: { canonical: 'https://samadhaannews.in/terms' },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">नियम और शर्तें</h1>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-border dark:border-slate-700 p-8 prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
          <p className="mb-4">
            समाधान NEWS वेबसाइट का उपयोग करके आप हमारी शर्तों से सहमत होते हैं।
          </p>
          <p className="mb-4">
            हमारी सामग्री केवल सूचना हेतु है। किसी भी खबर के आधार पर लिए गए निर्णय की जिम्मेदारी उपयोगकर्ता की होगी।
          </p>
          <p className="mb-4">
            हम बिना सूचना वेबसाइट सामग्री में बदलाव का अधिकार रखते हैं।
          </p>
        </div>
      </div>
    </main>
  );
}
