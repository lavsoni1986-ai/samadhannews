import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'संपादक मंडल – समाधान NEWS',
  description: 'समाधान NEWS के संपादक मंडल और संपादकीय टीम से मिलें।',
  alternates: { canonical: 'https://samadhaannews.in/editorial-team' },
};

const team = [
  { name: 'राजेश कुमार', role: 'मुख्य संपादक', initials: 'रक' },
  { name: 'प्रियंका सिंह', role: 'राजनीति संपादक', initials: 'पस' },
  { name: 'विक्रम सक्सेना', role: 'अंतर्राष्ट्रीय संपादक', initials: 'वस' },
  { name: 'कविता शर्मा', role: 'मनोरंजन संपादक', initials: 'कश' },
  { name: 'दीपक वर्मा', role: 'राज्य संपादक', initials: 'दव' },
  { name: 'आनंद गुप्ता', role: 'तकनीक संपादक', initials: 'आग' },
];

export default function EditorialTeamPage() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">संपादक मंडल</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-10">
          समाधान NEWS की संपादकीय टीम तेज़, निष्पक्ष और प्रामाणिक पत्रकारिता के लिए प्रतिबद्ध है।
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {team.map((member) => (
            <div key={member.name} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-border dark:border-slate-700 p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full brand-gradient text-white flex items-center justify-center text-xl font-bold font-en">
                {member.initials}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
              <p className="text-sm text-primary mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
