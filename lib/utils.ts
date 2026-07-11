/**
 * Utility functions for date formatting in Hindi
 */
import { news as mockNews, News } from './mockData';

const LOCALSTORAGE_KEY = 'samadhaan-news';

export function formatDateHindi(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTimeHindi(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getYouTubeThumbnail(youtubeId: string, quality: 'default' | 'mqdefault' | 'hqdefault' | 'maxresdefault' = 'mqdefault'): string {
  return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
}

export function formatViewsHindi(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`;
  }
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
}

/**
 * Get news from localStorage with fallback to mockData
 * This enables the admin panel changes to persist on the frontend
 */
export function getStoredNews(): News[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(LOCALSTORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        // Fallback to mockData if parsing fails
        return mockNews;
      }
    }
  }
  return mockNews;
}

/**
 * Helper to check if stored news exists
 */
export function hasStoredNews(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(LOCALSTORAGE_KEY) !== null;
  }
  return false;
}
