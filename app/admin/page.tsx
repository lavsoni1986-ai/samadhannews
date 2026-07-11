'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { news as mockNews, categories, News, Category, getCategoryName } from '@/lib/mockData';
import { formatDateHindi } from '@/lib/utils';

const LOCALSTORAGE_KEY = 'samadhaan-news';
const ADMIN_AUTH_KEY = 'samadhaan-admin';
const ADMIN_PASSWORD = 'samadhaan123';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Login Component
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      onLogin();
    } else {
      setError('गलत पासवर्ड');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary mb-2">समाधान NEWS</h1>
          <p className="text-gray-600">Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">पासवर्ड</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="पासवर्ड दर्ज करें"
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            लॉगिन करें
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:underline">
            ← वेबसाइट पर जाएं
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check auth on load
  useEffect(() => {
    const auth = localStorage.getItem(ADMIN_AUTH_KEY);
    setIsAuthenticated(auth === 'true');
    setCheckingAuth(false);
  }, []);

  // Load initial state from localStorage or fallback to mockData
  const [newsList, setNewsList] = useState<News[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCALSTORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return mockNews;
        }
      }
    }
    return mockNews;
  });

  // Save to localStorage whenever newsList changes
  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(newsList));
  }, [newsList]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    mediaType: 'image' as 'image' | 'video',
    videoUrl: '',
    youtubeId: '',
    category: 'desh',
    author: 'Admin',
    publishedAt: new Date().toISOString().split('T')[0],
  });

  const [imagePreview, setImagePreview] = useState('');
  const [youtubePreview, setYoutubePreview] = useState('');

  const filteredNews = newsList.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    if (name === 'title') {
      if (!editingId) {
        setFormData((prev) => ({ ...prev, [name]: value, slug: generateSlug(value) }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === 'image') setImagePreview(value);
    if (name === 'youtubeId') setYoutubePreview(value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (editingId) {
      // Update existing news - updates localStorage via useEffect
      setNewsList((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...formData, id: editingId } : item
        )
      );
      setEditingId(null);
    } else {
      // Add new news - updates localStorage via useEffect
      const newNews: News = {
        ...formData,
        id: Date.now().toString(),
        slug: formData.slug || generateSlug(formData.title),
        publishedAt: new Date().toISOString(),
      };
      setNewsList((prev) => [newNews, ...prev]);
    }

    // Reset form
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image: '',
      mediaType: 'image',
      videoUrl: '',
      youtubeId: '',
      category: 'desh',
      author: 'Admin',
      publishedAt: new Date().toISOString().split('T')[0],
    });
    setImagePreview('');
    setYoutubePreview('');
  }

  function handleEdit(newsItem: News) {
    setEditingId(newsItem.id);
    setFormData({
      title: newsItem.title,
      slug: newsItem.slug,
      excerpt: newsItem.excerpt,
      content: newsItem.content,
      image: newsItem.image,
      mediaType: newsItem.mediaType,
      videoUrl: newsItem.videoUrl || '',
      youtubeId: newsItem.youtubeId || '',
      category: newsItem.category,
      author: newsItem.author,
      publishedAt: newsItem.publishedAt.split('T')[0],
    });
    setImagePreview(newsItem.image);
    setYoutubePreview(newsItem.youtubeId || '');
  }

  function handleDelete(id: string) {
    if (confirm('क्या आप इस खबर को हटाना चाहते हैं?')) {
      // Delete news - updates localStorage via useEffect
      setNewsList((prev) => prev.filter((item) => item.id !== id));
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image: '',
      mediaType: 'image',
      videoUrl: '',
      youtubeId: '',
      category: 'desh',
      author: 'Admin',
      publishedAt: new Date().toISOString().split('T')[0],
    });
    setImagePreview('');
    setYoutubePreview('');
  }

  function handleLogout() {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    window.location.reload();
  }

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">लोड हो रहा है...</div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">समाधान NEWS - Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm hover:underline">← वेबसाइट देखें</Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
            >
              लॉगआउट
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <section className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">
                {editingId ? 'खबर संपादित करें' : 'नई खबर जोड़ें'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">शीर्षक *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="खबर का शीर्षक"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50"
                    placeholder="news-slug"
                    disabled={!!editingId}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">श्रेणी *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {categories.map((cat: Category) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">मीडिया प्रकार *</label>
                  <select
                    name="mediaType"
                    value={formData.mediaType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="image">छवि (Image)</option>
                    <option value="video">वीडियो (Video)</option>
                  </select>
                </div>

                {formData.mediaType === 'image' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">छवि URL</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}

                {formData.mediaType === 'image' && imagePreview && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">छवि पूर्वावलोकन</label>
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="object-cover w-full h-full"
                        onError={() => setImagePreview('')}
                      />
                    </div>
                  </div>
                )}

                {formData.mediaType === 'video' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video ID</label>
                      <input
                        type="text"
                        name="youtubeId"
                        value={formData.youtubeId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="dQw4w9WgXcQ"
                      />
                      <p className="text-xs text-gray-500 mt-1">यूट्यूब वीडियो का ID (पूरा URL नहीं)</p>
                    </div>

                    {formData.youtubeId && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">YouTube पूर्वावलोकन</label>
                        <iframe
                          src={`https://www.youtube.com/embed/${formData.youtubeId}`}
                          className="w-full aspect-video rounded-lg"
                          allowFullScreen
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">या MP4 Video URL</label>
                      <input
                        type="url"
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="https://example.com/video.mp4"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">सारांश *</label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="खबर का संक्षिप्त विवरण"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">पूर्ण सामग्री *</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="खबर की पूर्ण सामग्री"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">प्रकाशन तिथि</label>
                  <input
                    type="date"
                    name="publishedAt"
                    value={formData.publishedAt}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    {editingId ? 'अपडेट करें' : 'जोड़ें'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                    >
                      रद्द करें
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>

          {/* Right Column - News List */}
          <section className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold mb-4">खबरें ({filteredNews.length})</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="खोजें..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="all">सभी श्रेणियां</option>
                    {categories.map((cat: Category) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="divide-y">
                {filteredNews.length > 0 ? (
                  filteredNews.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start gap-4">
                        <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                          {item.youtubeId ? (
                            <img
                              src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`}
                              alt={item.title}
                              className="object-cover w-full h-full"
                            />
                          ) : item.image ? (
                            <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-400">
                              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          {item.youtubeId && (
                            <div className="absolute top-1 left-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 line-clamp-1">{item.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {getCategoryName(item.category)}
                            </span>
                            <span className="text-xs text-gray-500">{formatDateHindi(item.publishedAt)}</span>
                            {item.youtubeId && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">YouTube</span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                          >
                            संपादित
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors"
                          >
                            हटाएं
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">कोई खबर नहीं मिली</div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
