import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'गोपनीयता नीति – समाधान NEWS',
  description: 'समाधान NEWS की गोपनीयता नीति। जानें कि हम आपकी व्यक्तिगत जानकारी कैसे सुरक्षित रखते हैं।',
  alternates: { canonical: 'https://samadhaannews.in/privacy' },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">गोपनीयता नीति</h1>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-border dark:border-slate-700 p-8 prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
          <p className="mb-4">
            समाधान NEWS आपकी गोपनीयता का सम्मान करता है। हम आपकी व्यक्तिगत जानकारी को सुरक्षित रखते हैं और
            बिना आपकी अनुमति किसी तीसरे पक्ष से साझा नहीं करते।
          </p>
          <p className="mb-4">
            हम कुकीज़ और एनालिटिक्स का उपयोग केवल वेबसाइट अनुभव बेहतर बनाने के लिए करते हैं।
          </p>
          <p className="mb-4">
            यदि आपको किसी भी प्रकार की जानकारी चाहिए, कृपया संपर्क करें:
          </p>
          <p className="font-medium text-gray-900 dark:text-white">
            📧 news@samadhaannews.in
          </p>
        </div>
      </div>
    </main>
  );
}
