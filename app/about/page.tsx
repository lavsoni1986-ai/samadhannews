import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "हमारे बारे में – समाधान NEWS",
  description: "समाधान NEWS एक स्वतंत्र हिंदी डिजिटल न्यूज़ प्लेटफ़ॉर्म है जो तेज़, निष्पक्ष और प्रामाणिक पत्रकारिता के लिए समर्पित है। खबर वही जो सही।",
  alternates: { canonical: "https://samadhaannews.in/about" },
};

const values = [
  { title: "सत्यनिष्ठा", desc: "हम तथ्यों को सत्यापित करके ही समाचार प्रकाशित करते हैं।" },
  { title: "निष्पक्षता", desc: "हम किसी राजनीतिक दल या विचारधारा का समर्थन नहीं करते।" },
  { title: "गति", desc: "ताज़ा खबरें आप तक सबसे पहले पहुंचाना हमारा धर्म है।" },
  { title: "गहराई", desc: "सिर्फ खबरें नहीं, बल्कि विश्लेषण और संदर्भ भी।" },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Header */}
      <header className="brand-gradient text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Logo size="lg" className="justify-center mb-4" />
          <p className="text-xl opacity-95 font-devanagari">खबर वही जो सही</p>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="bg-white dark:bg-slate-900 border-b border-border dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <li><Link href="/" className="hover:text-primary">होम</Link></li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white">हमारे बारे में</li>
          </ol>
        </div>
      </nav>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-border dark:border-slate-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">हमारे बारे में</h2>

          <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 space-y-6">
            <p>
              <strong>समाधान NEWS</strong> एक स्वतंत्र हिंदी डिजिटल न्यूज़ प्लेटफ़ॉर्म है जो तेज़, निष्पक्ष
              और प्रामाणिक पत्रकारिता के लिए समर्पित है। हमारा उद्देश्य भारत और दुनिया की ताज़ा खबरों को
              तथ्यपरक और संतुलित तरीके से आप तक पहुंचाना है।
            </p>

            <p>
              हम मानते हैं कि समाचारों का सही और त्वरित प्रसार लोकतंत्र की नींव है। इसी विश्वास के साथ
              हम अपने पाठकों को हर महत्वपूर्ण घटना की जानकारी देने का प्रयास करते हैं।
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">हमारी प्राथमिकताएं</h3>
            <ul className="grid sm:grid-cols-2 gap-4 list-none">
              {values.map((v) => (
                <li key={v.title} className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4 border-l-4 border-primary">
                  <strong className="text-gray-900 dark:text-white block mb-1">{v.title}</strong>
                  <span className="text-sm">{v.desc}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">हम कवर करते हैं</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>राजनीति:</strong> संसद, विधानसभा और चुनावी राजनीति</li>
              <li><strong>राष्ट्रीय:</strong> देश भर की महत्वपूर्ण घटनाएं और विकास</li>
              <li><strong>अंतर्राष्ट्रीय:</strong> दुनिया के प्रमुख समाचार और घटनाक्रम</li>
              <li><strong>राज्य:</strong> मध्य प्रदेश, छत्तीसगढ़ और अन्य राज्यों की खबरें</li>
              <li><strong>खेल:</strong> क्रिकेट और अन्य खेलों की ताज़ा सूचनाएं</li>
              <li><strong>मनोरंजन:</strong> बॉलीवुड और टेलीविजन की खबरें</li>
              <li><strong>तकनीक:</strong> तकनीकी जगत की नई खोजें और गैजेट्स</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">संपर्क करें</h3>
            <p>
              आप हमें ईमेल पर <strong>news@samadhaannews.in</strong> पर संपर्क कर सकते हैं।
              यदि आपके पास कोई समाचार सुझाव, शिकायत या फीडबैक है, तो हमसे संपर्क करने में संकोच न करें।
            </p>

            <p className="mt-8 pt-6 border-t border-border dark:border-slate-700">
              हम सदैव अपने पाठकों की सेवा में समर्पित रहेंगे और सच्चाई की राह पर अडिग रहेंगे।
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
