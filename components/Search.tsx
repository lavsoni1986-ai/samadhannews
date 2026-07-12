'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  category: string;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter news by title using Supabase ilike query (debounced)
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    setLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('id, slug, title, category')
          .ilike('title', `%${query}%`)
          .order('published_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setResults(data || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce to prevent heavy backend load

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center bg-gray-100 dark:bg-slate-800 border dark:border-slate-700 rounded-lg px-3 py-2">
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="समाचार खोजें..."
          className="bg-transparent border-none outline-none text-sm ml-2 w-24 sm:w-48 placeholder-gray-500 text-gray-900 dark:text-white"
        />
        {loading && (
          <div className="w-4.5 h-4.5 rounded-full border-2 border-red-500 border-t-transparent animate-spin ml-1" />
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute right-0 top-full mt-1 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700 z-50 max-h-96 overflow-y-auto">
          <div className="py-2">
            {results.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-750 border-b dark:border-slate-700 last:border-b-0"
              >
                <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">{item.category}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {isOpen && query.trim().length > 0 && results.length === 0 && !loading && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700 z-50 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">कोई परिणाम नहीं मिला</p>
        </div>
      )}
    </div>
  );
}
