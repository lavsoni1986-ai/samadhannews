import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'अस्वीकरण – समाधान NEWS',
  description: 'समाधान NEWS की सामग्री और सेवाओं से संबंधित अस्वीकरण।',
  alternates: { canonical: 'https://samadhaannews.in/disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">अस्वीकरण</h1>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-border dark:border-slate-700 p-8 prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
          <p className="mb-4">
            समाधान NEWS पर प्रकाशित सामग्री केवल सामान्य जानकारी हेतु है। विभिन्न स्रोतों से प्राप्त
            समाचारों की सटीकता सुनिश्चित करने का प्रयास किया जाता है, किंतु हम किसी त्रुटि या चूक के लिए
            उत्तरदायी नहीं हैं।
          </p>
          <p className="mb-4">
            बाहरी लिंक्स (थर्ड-पार्टी वेबसाइट्स) के लिए समाधान NEWS उत्तरदायी नहीं है। पाठकों को स्वयं
            सत्यापन करने की सलाह दी जाती है।
          </p>
          <p className="mb-4">
            किसी भी निर्णय (निवेश, स्वास्थ्य, कानूनी) हेतु कृपया विशेषज्ञ से सलाह लें।
          </p>
        </div>
      </div>
    </main>
  );
}
