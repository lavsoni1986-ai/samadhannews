import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "संपर्क करें – समाधान NEWS",
  description: "समाधान NEWS से जुड़ें। सुझाव, शिकायत या साझेदारी के लिए हमसे संपर्क करें। खबर वही जो सही।",
  alternates: { canonical: "https://samadhaannews.in/contact" },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <Logo size="lg" className="justify-center mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">हमसे जुड़ें</h1>
          <p className="text-gray-600 dark:text-gray-300">
            &ldquo;समाधान NEWS – जहाँ खबर नहीं, सच्चाई दिखाई जाती है&rdquo;
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-border dark:border-slate-700 p-6 text-center">
            <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">पता</h3>
            <p className="text-gray-600 dark:text-gray-300">शहडोल, मध्य प्रदेश, भारत</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-border dark:border-slate-700 p-6 text-center">
            <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Email</h3>
            <p className="text-gray-600 dark:text-gray-300">news@samadhaannews.in</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-border dark:border-slate-700 p-6 text-center">
            <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">फोन</h3>
            <p className="text-gray-600 dark:text-gray-300">+91 97532 39303</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-border dark:border-slate-700 p-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            संदेश भेजें
          </h2>
          <form className="grid md:grid-cols-2 gap-4">
            <input placeholder="आपका नाम" className="border border-border dark:border-slate-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" />
            <input placeholder="ईमेल पता" type="email" className="border border-border dark:border-slate-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" />
            <input placeholder="फ़ोन नंबर" className="border border-border dark:border-slate-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" />
            <input placeholder="विषय" className="border border-border dark:border-slate-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" />
            <textarea placeholder="अपना संदेश लिखें" className="border border-border dark:border-slate-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-white md:col-span-2 focus:outline-none focus:ring-2 focus:ring-primary" rows={4} />
            <button type="button" className="bg-primary hover:bg-primary-dark text-white py-3 rounded-lg md:col-span-2 font-medium transition-colors">
              संदेश भेजें
            </button>
          </form>
        </div>

        <p className="text-center mt-10 font-semibold text-gray-700 dark:text-gray-200">
          &ldquo;समाधान NEWS सिर्फ हमारी नहीं, आपकी भी आवाज़ है।&rdquo;
        </p>
      </div>
    </main>
  );
}
