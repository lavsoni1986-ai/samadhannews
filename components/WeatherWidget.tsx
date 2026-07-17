'use client';

import { CloudSun, Sun, CloudRain, MapPin } from 'lucide-react';

const forecast = [
  { day: 'आज', icon: CloudSun, temp: '24°', label: 'आंशिक बादल' },
  { day: 'कल', icon: Sun, temp: '27°', label: 'धूप' },
  { day: 'परसों', icon: CloudRain, temp: '21°', label: 'बारिश' },
];

export default function WeatherWidget() {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-border dark:border-slate-700 p-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b-2 border-primary pb-2 mb-3 flex items-center gap-2">
        <CloudSun className="w-5 h-5 text-primary" />
        मौसम
      </h2>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="w-4 h-4 text-primary" />
          शहडोल, म.प्र.
        </div>
        <span className="text-2xl font-bold text-gray-900 dark:text-white">24°</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {forecast.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.day} className="text-center bg-gray-50 dark:bg-slate-700/50 rounded-lg py-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">{f.day}</p>
              <Icon className="w-6 h-6 mx-auto my-1 text-primary" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{f.temp}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">{f.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
