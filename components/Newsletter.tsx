'use client';

import { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

interface NewsletterProps {
  variant?: 'card' | 'full';
}

export default function Newsletter({ variant = 'card' }: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim().length > 3) {
      setDone(true);
      setEmail('');
    }
  }

  if (variant === 'full') {
    return (
      <section className="brand-gradient rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">न्यूज़लेटर सब्सक्राइब करें</h2>
        <p className="text-white/90 mb-6 max-w-xl mx-auto">
          हर सुबह ताज़ा खबरें, विश्लेषण और राय आपके ईमेल पर पाएं – बिल्कुल मुफ़्त।
        </p>
        {done ? (
          <p className="flex items-center justify-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5" /> धन्यवाद! आपका सब्सक्रिप्शन पूरा हुआ।
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="flex items-center flex-1 bg-white/95 rounded-lg px-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="आपका ईमेल पता"
                className="w-full px-3 py-3 bg-transparent outline-none text-gray-900 placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              className="bg-secondary hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
            >
              सब्सक्राइब
            </button>
          </form>
        )}
      </section>
    );
  }

  return (
    <section className="bg-red-50 dark:bg-slate-800 rounded-xl p-5 border border-red-100 dark:border-slate-700">
      <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg flex items-center gap-2">
        <Mail className="w-5 h-5 text-primary" />
        न्यूज़लेटर
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        हर सुबह ताज़ा खबरें अपने ईमेल पर पाएं
      </p>
      {done ? (
        <p className="text-sm text-primary flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="w-4 h-4" /> सब्सक्राइब धन्यवाद!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="आपका ईमेल"
            className="w-full px-3 py-2 border border-border dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          />
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 rounded-lg transition-colors text-sm"
          >
            सब्सक्राइब
          </button>
        </form>
      )}
    </section>
  );
}
