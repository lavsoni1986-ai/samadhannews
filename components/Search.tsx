'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { News } from '@/lib/mockData';
import { getStoredNews } from '@/lib/utils';

export default function Search() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<News[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [news, setNews] = useState<News[]>([]);

  // Load news from localStorage on mount
  useEffect(() => {
    setNews(getStoredNews());
  }, []);

  // Filter news by title (case-insensitive Hindi support)
  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const filtered = news.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered.slice(0, 5));
  }, [query, news]);

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
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
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
          className="bg-transparent border-none outline-none text-sm ml-2 w-24 sm:w-48 placeholder-gray-500 text-gray-900"
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto">
          <div className="py-2">
            {results.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 hover:bg-gray-50 border-b last:border-b-0"
              >
                <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{item.category}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {isOpen && query.trim().length > 0 && results.length === 0 && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border z-50 p-4">
          <p className="text-sm text-gray-500 text-center">कोई परिणाम नहीं मिला</p>
        </div>
      )}
    </div>
  );
}
