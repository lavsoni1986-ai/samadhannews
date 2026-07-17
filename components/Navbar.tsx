'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sun, Moon, Radio } from 'lucide-react';
import Search from './Search';
import Logo from './Logo';
import BreakingNews from './Breaking';
import { YoutubeIcon } from './icons';
import { supabase } from '@/lib/supabaseClient';

interface Category {
  slug: string;
  name: string;
  name_en: string;
}

function getHindiDate(): string {
  try {
    return new Date().toLocaleDateString('hi-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const isDark = document.documentElement.classList.toggle('dark');
    try {
      localStorage.setItem('samadhaan-theme', isDark ? 'dark' : 'light');
    } catch {}
    setDark(isDark);
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'लाइट मोड चालू करें' : 'डार्क मोड चालू करें'}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-700 dark:text-gray-200"
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [date, setDate] = useState('');
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);

  useEffect(() => {
    setDate(getHindiDate());
    
    // Fetch categories dynamically from Supabase
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('slug, name, name_en')
          .order('name');
        if (error) throw error;
        if (data) setCategoriesList(data);
      } catch (err) {
        console.error('Error loading navbar categories:', err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* Breaking News Bar */}
      <BreakingNews />

      {/* Top Utility Bar */}
      <div className="bg-secondary text-gray-200 text-sm">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center gap-3">
          <span className="hidden sm:block truncate">{date}</span>
          <div className="flex items-center gap-4 ml-auto">
            <Link href="/live" className="hidden sm:flex items-center gap-1.5 text-red-400 font-semibold hover:text-red-300 transition-colors">
              <Radio className="w-4 h-4 animate-pulse" />
              LIVE TV
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">हमारे बारे में</Link>
            <Link href="/contact" className="hover:text-white transition-colors">संपर्क</Link>
            <a
              href="https://www.youtube.com/@SamadhaanNews"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 bg-red-600 hover:bg-red-500 px-3 py-1 rounded-full transition-colors text-white font-medium"
            >
              <YoutubeIcon className="w-4 h-4" />
              सब्सक्राइब
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white dark:bg-slate-900 border-b border-border dark:border-slate-700 overflow-visible">
        <div className="max-w-7xl mx-auto px-4 overflow-visible">
          <div className="flex justify-between items-center h-16 gap-3 overflow-visible">
            {/* Mobile: centered logo, desktop: normal brand block */}
            <div className="md:hidden w-10" />
            <div className="flex-1 flex justify-center md:justify-start md:flex-none h-16 items-center overflow-visible">
              <Logo size="lg" className="h-12 md:h-20 md:translate-y-2 transition-all hover:scale-105 duration-200 overflow-visible" />
            </div>

            {/* Search - Desktop */}
            <div className="hidden md:flex flex-1 justify-center max-w-md">
              <Search />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hidden md:block">
                <DarkModeToggle />
              </div>
              <Link
                href="/admin"
                className="hidden sm:inline-flex px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                एडमिन
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-700 dark:text-gray-200"
                aria-label={mobileMenuOpen ? 'मेन्यू बंद करें' : 'मेन्यू खोलें'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3 pt-1">
          <Search />
        </div>

        {/* Category Navigation */}
        <div className="hidden lg:block border-t border-border dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex items-center gap-1 py-2 overflow-x-auto no-scrollbar" aria-label="श्रेणियां">
              {categoriesList.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  {category.name}
                </Link>
              ))}
              <Link
                href="/live"
                className="px-3 py-2 text-sm font-semibold text-red-600 flex items-center gap-1 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
              >
                <Radio className="w-4 h-4 animate-pulse" />
                LIVE TV
              </Link>
            </nav>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`lg:hidden bg-white dark:bg-slate-900 border-b border-border dark:border-slate-700 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
          <Link href="/live" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-red-600 font-semibold rounded-lg hover:bg-red-50">
            <Radio className="w-4 h-4 animate-pulse" />
            LIVE TV
          </Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800">संपर्क</Link>
          {categoriesList.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              {category.name}
            </Link>
          ))}
          <a
            href="https://www.youtube.com/@SamadhaanNews"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2.5 bg-red-600 text-white rounded-lg mt-2 font-medium"
          >
            <YoutubeIcon className="w-5 h-5" />
            YouTube पर सब्सक्राइब करें
          </a>
        </div>
      </div>
    </header>
  );
}
