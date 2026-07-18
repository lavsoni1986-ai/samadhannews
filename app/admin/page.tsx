'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabaseClient';
import { formatDateHindi } from '@/lib/utils';
import Logo from '@/components/Logo';
import {
  LayoutDashboard,
  Newspaper,
  FolderTree,
  Image as ImageIcon,
  Settings as SettingsIcon,
  DatabaseBackup,
  Upload,
  Trash2,
  Edit3,
  Plus,
  LogOut,
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertTriangle,
  X,
  Link as LinkIcon,
  Eye,
} from 'lucide-react';

// Dynamic import for Tiptap (avoids SSR issues)
const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), { ssr: false });

interface Category {
  slug: string;
  name: string;
  name_en: string;
  created_at?: string;
}

interface News {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  images: string[];
  media_type: 'image' | 'video';
  video_url?: string;
  youtube_id?: string;
  category: string;
  author: string;
  published_at: string;
  is_breaking: boolean;
  views?: number;
}

interface Settings {
  adsense_client: string;
  adsense_slot_banner: string;
  adsense_slot_article: string;
  banner_link: string;
  youtube_live_id: string;
  cloudinary_cloud_name: string;
  cloudinary_upload_preset: string;
  // Feature Pack-1: Local Direct Ad Slots
  banner_top_url: string;
  banner_top_link: string;
  banner_article_url: string;
  banner_article_link: string;
}

// Helper: Extract YouTube video ID from full URL or raw ID
function extractYoutubeId(input: string): string {
  const trimmed = input.trim();
  // Already a raw ID (11 chars, no slashes)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  // youtube.com/watch?v=XXXX or youtu.be/XXXX or embed/XXXX
  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : trimmed;
}

// -------------------------------------------------------------
// Admin Login Component
// -------------------------------------------------------------
function AdminLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authErr) {
        throw authErr;
      }

      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'लॉगिन करने में असमर्थ। विवरण जांचें।');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-slate-700">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="mb-4">
            <Logo size="lg" showTagline forceDark />
          </div>
          <p className="text-slate-500 dark:text-slate-400">एडमिन लॉगिन पैनल</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              ईमेल एड्रेस
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
              placeholder="admin@samadhaannews.in"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              पासवर्ड
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-red-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                प्रमाणित किया जा रहा है...
              </>
            ) : (
              'लॉगिन करें'
            )}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-200 dark:border-slate-700 pt-4">
          <Link href="/" className="text-sm text-slate-500 hover:text-red-500 transition-colors">
            ← मुख्य वेबसाइट पर जाएं
          </Link>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Admin Dashboard Component
// -------------------------------------------------------------
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'news' | 'categories' | 'media' | 'settings' | 'backup'>('dashboard');

  // Database lists
  const [newsList, setNewsList] = useState<News[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Settings>({
    adsense_client: '',
    adsense_slot_banner: '',
    adsense_slot_article: '',
    banner_link: '',
    youtube_live_id: '',
    cloudinary_cloud_name: '',
    cloudinary_upload_preset: '',
    // Feature Pack-1: Local Direct Ad Slots
    banner_top_url: '',
    banner_top_link: '',
    banner_article_url: '',
    banner_article_link: '',
  });

  // Loading and notifications
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '' as 'success' | 'error' | '', text: '' });

  // News CRUD form state
  const [newsForm, setNewsForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    images: [] as string[],
    media_type: 'image' as 'image' | 'video',
    video_url: '',
    youtube_id: '',
    category: '',
    author: 'संपादक',
    published_at: new Date().toISOString().substring(0, 16),
    is_breaking: false,
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsSearch, setNewsSearch] = useState('');
  const [newsFilterCat, setNewsFilterCat] = useState('all');

  // Categories CRUD form state
  const [catForm, setCatForm] = useState({
    slug: '',
    name: '',
    name_en: '',
  });
  const [editingCatSlug, setEditingCatSlug] = useState<string | null>(null);

  // Cloudinary media upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [sessionUploadedUrls, setSessionUploadedUrls] = useState<string[]>([]);

  // Backup file state
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authenticate user on load
  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        fetchAllData();
      } else {
        setIsAuthenticated(false);
      }
      setCheckingAuth(false);
    }
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        fetchAllData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch all necessary tables
  async function fetchAllData() {
    setLoading(true);
    try {
      // 1. Fetch categories
      const { data: cats, error: catErr } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (catErr) throw catErr;
      setCategoriesList(cats || []);

      // Set default category slug if list is loaded
      if (cats && cats.length > 0 && !newsForm.category) {
        setNewsForm(prev => ({ ...prev, category: cats[0].slug }));
      }

      // 2. Fetch news
      const { data: newsItems, error: newsErr } = await supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false });
      if (newsErr) throw newsErr;
      setNewsList(newsItems || []);

      // 3. Fetch settings
      const { data: setts, error: settErr } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (settErr && settErr.code !== 'PGRST116') {
        throw settErr;
      }
      
      if (setts) {
        setSettings({
          adsense_client: setts.adsense_client || '',
          adsense_slot_banner: setts.adsense_slot_banner || '',
          adsense_slot_article: setts.adsense_slot_article || '',
          banner_link: setts.banner_link || '',
          youtube_live_id: setts.youtube_live_id || '',
          cloudinary_cloud_name: setts.cloudinary_cloud_name || '',
          cloudinary_upload_preset: setts.cloudinary_upload_preset || '',
          banner_top_url: setts.banner_top_url || '',
          banner_top_link: setts.banner_top_link || '',
          banner_article_url: setts.banner_article_url || '',
          banner_article_link: setts.banner_article_link || '',
        });
      }
    } catch (err: any) {
      console.error('Error fetching tables:', err.message);
      showNotification('error', 'डेटा लोड करने में असमर्थ: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  // Display status notification
  function showNotification(type: 'success' | 'error', text: string) {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 5000);
  }

  // Auto-generate URL slug from Hindi/English text
  function generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      // Replace spaces and special characters with dash
      .replace(/[^a-zA-Z0-9\u0900-\u097F]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Handle Logout
  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  }

  // -------------------------------------------------------------
  // CRUD Actions: News
  // -------------------------------------------------------------
  async function saveNews(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const slugToUse = newsForm.slug ? generateSlug(newsForm.slug) : generateSlug(newsForm.title);
    const validImages = Array.isArray(newsForm.images) ? newsForm.images.filter(img => typeof img === 'string') : [];
    const primaryImage = validImages.length > 0 ? validImages[0] : (typeof newsForm.image === 'string' && newsForm.image ? newsForm.image : 'https://picsum.photos/seed/news/800/450');
    
    const dbPayload = {
      title: newsForm.title,
      slug: slugToUse,
      excerpt: newsForm.excerpt,
      content: newsForm.content,
      image: String(primaryImage),
      images: validImages,
      media_type: newsForm.media_type,
      video_url: newsForm.media_type === 'video' ? newsForm.video_url : null,
      youtube_id: newsForm.media_type === 'video' ? newsForm.youtube_id : null,
      category: newsForm.category,
      author: newsForm.author,
      published_at: new Date(newsForm.published_at).toISOString(),
      is_breaking: newsForm.is_breaking,
    };

    try {
      if (editingNewsId) {
        const { error } = await supabase
          .from('news')
          .update(dbPayload)
          .eq('id', editingNewsId);
        if (error) throw error;
        showNotification('success', 'समाचार सफलतापूर्वक अपडेट किया गया।');
      } else {
        const { error } = await supabase
          .from('news')
          .insert([dbPayload]);
        if (error) throw error;
        showNotification('success', 'नया समाचार सफलतापूर्वक जोड़ा गया।');
      }

      // Reset form
      setNewsForm({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        image: '',
        images: [],
        media_type: 'image',
        video_url: '',
        youtube_id: '',
        category: categoriesList[0]?.slug || '',
        author: 'संपादक',
        published_at: new Date().toISOString().substring(0, 16),
        is_breaking: false,
      });
      setEditingNewsId(null);
      fetchAllData();
    } catch (err: any) {
      showNotification('error', 'समाचार सहेजने में विफल: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleEditNews(item: News) {
    setEditingNewsId(item.id);
    setNewsForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      image: item.image,
      images: Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []),
      media_type: item.media_type,
      video_url: item.video_url || '',
      youtube_id: item.youtube_id || '',
      category: item.category,
      author: item.author,
      published_at: new Date(item.published_at).toISOString().substring(0, 16),
      is_breaking: item.is_breaking,
    });
    setActiveTab('news');
  }

  async function handleDeleteNews(id: string) {
    if (!confirm('क्या आप सचमुच इस खबर को डिलीट करना चाहते हैं?')) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);
      if (error) throw error;
      showNotification('success', 'समाचार डिलीट कर दिया गया।');
      fetchAllData();
    } catch (err: any) {
      showNotification('error', 'समाचार हटाने में असमर्थ: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------------------------------------
  // CRUD Actions: Categories
  // -------------------------------------------------------------
  async function saveCategory(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const targetSlug = catForm.slug ? generateSlug(catForm.slug) : generateSlug(catForm.name_en);
    const dbPayload = {
      slug: targetSlug,
      name: catForm.name,
      name_en: catForm.name_en,
    };

    try {
      if (editingCatSlug) {
        const { error } = await supabase
          .from('categories')
          .update(dbPayload)
          .eq('slug', editingCatSlug);
        if (error) throw error;
        showNotification('success', 'श्रेणी अपडेट की गई।');
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([dbPayload]);
        if (error) throw error;
        showNotification('success', 'नई श्रेणी जोड़ी गई।');
      }

      setCatForm({ slug: '', name: '', name_en: '' });
      setEditingCatSlug(null);
      fetchAllData();
    } catch (err: any) {
      showNotification('error', 'श्रेणी सहेजने में त्रुटि: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleEditCategory(item: Category) {
    setEditingCatSlug(item.slug);
    setCatForm({
      slug: item.slug,
      name: item.name,
      name_en: item.name_en,
    });
  }

  async function handleDeleteCategory(slug: string) {
    if (!confirm('सावधानी: इस श्रेणी को हटाने से इससे जुड़े समाचारों का लिंक टूट सकता है। क्या आप हटाना चाहते हैं?')) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('slug', slug);
      if (error) throw error;
      showNotification('success', 'श्रेणी हटा दी गई।');
      fetchAllData();
    } catch (err: any) {
      showNotification('error', 'श्रेणी हटाने में त्रुटि: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------------------------------------
  // Cloudinary Media Upload (single file - Media tab)
  // -------------------------------------------------------------
  async function handleCloudinaryUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadFile) {
      showNotification('error', 'कृपया अपलोड करने के लिए एक फ़ाइल चुनें।');
      return;
    }

    const cloudName = settings.cloudinary_cloud_name;
    const preset = settings.cloudinary_upload_preset;

    if (!cloudName || !preset) {
      showNotification('error', 'कृपया पहले "Settings & Ads" टैब में Cloudinary Cloud Name और Preset सेट करें।');
      return;
    }

    setUploadingMedia(true);
    setUploadedUrl('');

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('upload_preset', preset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP error ${res.status}`);
      }

      const json = await res.json();
      const absoluteUrl = json.secure_url;
      setUploadedUrl(absoluteUrl);
      setSessionUploadedUrls(prev => [absoluteUrl, ...prev]);
      showNotification('success', 'फ़ाइल सफलतापूर्वक क्लाउड पर अपलोड की गई।');

      // Auto-set image field in news CRUD form to this uploaded URL
      setNewsForm(prev => ({ ...prev, image: absoluteUrl, images: [absoluteUrl, ...prev.images] }));
    } catch (err: any) {
      showNotification('error', 'अपलोड विफल: ' + err.message);
    } finally {
      setUploadingMedia(false);
    }
  }

  // Multi-image upload for News form (sequential Cloudinary uploads)
  async function handleMultiImageUpload(files: FileList) {
    const cloudName = settings.cloudinary_cloud_name;
    const preset = settings.cloudinary_upload_preset;

    if (!cloudName || !preset) {
      showNotification('error', 'क्लाउडिनरी क्रेडेंशियल सेटिंग्स टैब में सेट नहीं हैं।');
      return;
    }

    setUploadingImages(true);
    const uploaded: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        formData.append('upload_preset', preset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          throw new Error(errJson.error?.message || `HTTP error ${res.status}`);
        }

        const json = await res.json();
        uploaded.push(json.secure_url);
      }

      // Merge with existing images; first uploaded becomes primary if image is empty
      setNewsForm(prev => {
        const merged = [...prev.images, ...uploaded];
        return {
          ...prev,
          images: merged,
          image: prev.image || merged[0] || prev.image,
        };
      });
      showNotification('success', `${uploaded.length} छवियाँ सफलतापूर्वक अपलोड हो गईं।`);
    } catch (err: any) {
      showNotification('error', 'मल्टी-इमेज अपलोड विफल: ' + err.message);
    } finally {
      setUploadingImages(false);
    }
  }

  // -------------------------------------------------------------
  // Save Settings & Ads
  // -------------------------------------------------------------
  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const dbPayload = {
      id: 1, // Single settings row constraint
      adsense_client: settings.adsense_client,
      adsense_slot_banner: settings.adsense_slot_banner,
      adsense_slot_article: settings.adsense_slot_article,
      banner_link: settings.banner_link,
      youtube_live_id: settings.youtube_live_id,
      cloudinary_cloud_name: settings.cloudinary_cloud_name,
      cloudinary_upload_preset: settings.cloudinary_upload_preset,
      // Feature Pack-1: Local Direct Ad Slots
      banner_top_url: settings.banner_top_url,
      banner_top_link: settings.banner_top_link,
      banner_article_url: settings.banner_article_url,
      banner_article_link: settings.banner_article_link,
    };

    try {
      const { error } = await supabase
        .from('settings')
        .upsert([dbPayload]);
      if (error) throw error;
      showNotification('success', 'कन्फ़िगरेशन सेटिंग्स सहेजी गईं।');
      fetchAllData();
    } catch (err: any) {
      showNotification('error', 'सेटिंग्स अपडेट करने में विफलता: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------------------------------------
  // Backup & Restore
  // -------------------------------------------------------------
  function exportDatabaseBackup() {
    const backupData = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      news: newsList,
      categories: categoriesList,
      settings: settings,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `samadhaan_news_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('success', 'डेटाबेस बैकअप फ़ाइल सफलतापूर्वक डाउनलोड की गई।');
  }

  async function handleImportBackup(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      if (!event.target?.result) return;
      
      try {
        const parsed = JSON.parse(event.target.result as string);
        if (!parsed.news || !parsed.categories) {
          throw new Error('अमान्य बैकअप फ़ाइल प्रारूप। "news" और "categories" टेबल होना आवश्यक है।');
        }

        if (!confirm(`चेतावनी: यह आयात आपके वर्तमान डेटाबेस रिकॉर्ड्स को अधिलेखित (overwrite) कर देगा। क्या आप जारी रखना चाहते हैं?`)) {
          return;
        }

        setLoading(true);

        // 1. Delete and insert categories
        if (parsed.categories.length > 0) {
          const catPayloads = parsed.categories.map((c: any) => ({
            slug: c.slug,
            name: c.name,
            name_en: c.name_en,
          }));
          const { error: delCatErr } = await supabase.from('categories').delete().neq('slug', 'temp-bypass-non-empty');
          if (delCatErr) throw delCatErr;
          const { error: insCatErr } = await supabase.from('categories').insert(catPayloads);
          if (insCatErr) throw insCatErr;
        }

        // 2. Delete and insert news
        if (parsed.news.length > 0) {
          const newsPayloads = parsed.news.map((n: any) => ({
            id: n.id,
            slug: n.slug,
            title: n.title,
            excerpt: n.excerpt,
            content: n.content,
            image: n.image,
            media_type: n.media_type,
            video_url: n.video_url,
            youtube_id: n.youtube_id,
            category: n.category,
            author: n.author,
            published_at: n.published_at,
            is_breaking: n.is_breaking || false,
          }));
          const { error: delNewsErr } = await supabase.from('news').delete().neq('slug', 'temp-bypass-non-empty');
          if (delNewsErr) throw delNewsErr;
          const { error: insNewsErr } = await supabase.from('news').insert(newsPayloads);
          if (insNewsErr) throw insNewsErr;
        }

        // 3. Update settings
        if (parsed.settings) {
          const settPayload = {
            id: 1,
            adsense_client: parsed.settings.adsense_client || '',
            adsense_slot_banner: parsed.settings.adsense_slot_banner || '',
            adsense_slot_article: parsed.settings.adsense_slot_article || '',
            banner_link: parsed.settings.banner_link || '',
            youtube_live_id: parsed.settings.youtube_live_id || '',
            cloudinary_cloud_name: parsed.settings.cloudinary_cloud_name || '',
            cloudinary_upload_preset: parsed.settings.cloudinary_upload_preset || '',
          };
          const { error: settErr } = await supabase.from('settings').upsert([settPayload]);
          if (settErr) throw settErr;
        }

        showNotification('success', 'डेटाबेस बैकअप सफलतापूर्वक बहाल (restore) किया गया।');
        fetchAllData();
      } catch (err: any) {
        showNotification('error', 'बैकअप आयात करने में विफल: ' + err.message);
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  }

  // Filter local news representation for CRUD manager
  const filteredNews = newsList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(newsSearch.toLowerCase()) || 
                          item.excerpt.toLowerCase().includes(newsSearch.toLowerCase());
    const matchesCategory = newsFilterCat === 'all' || item.category === newsFilterCat;
    return matchesSearch && matchesCategory;
  });

  // Calculate statistics metrics
  const totalNews = newsList.length;
  const breakingNewsCount = newsList.filter(n => n.is_breaking).length;
  const videoNewsCount = newsList.filter(n => n.media_type === 'video').length;

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">प्रमाणिकता जांची जा रही है...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col">
      {/* Admin Navbar */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-red-500" />
            <h1 className="text-xl font-bold tracking-tight">समाधान NEWS <span className="text-sm font-normal text-slate-400 ml-2">(सिस्टम कंसोल)</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              target="_blank"
              className="text-sm text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              वेबसाइट देखें <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> लॉगआउट
            </button>
          </div>
        </div>
      </header>

      {/* Main Console */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
        {/* Navigation Sidebar Tabs */}
        <aside className="lg:col-span-1 flex flex-col gap-2">
          {[
            { id: 'dashboard', label: 'डैशबोर्ड सांख्यिकी', icon: LayoutDashboard },
            { id: 'news', label: 'समाचार CRUD पैनल', icon: Newspaper },
            { id: 'categories', label: 'कैटेगरी प्रबंधन', icon: FolderTree },
            { id: 'media', label: 'क्लाउड मीडिया अपलोड', icon: ImageIcon },
            { id: 'settings', label: 'विज्ञापन और सेटिंग्स', icon: SettingsIcon },
            { id: 'backup', label: 'डेटा बैकअप / रीस्टोर', icon: DatabaseBackup },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setStatusMsg({ type: '', text: '' });
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {loading && (
            <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center gap-3 justify-center text-sm font-medium text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
              <span>सिंक हो रहा है...</span>
            </div>
          )}
        </aside>

        {/* Tab Viewport */}
        <main className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 min-h-[600px] flex flex-col">
          {/* Notifications */}
          {statusMsg.text && (
            <div className={`mb-6 p-4 rounded-xl border flex items-start gap-2.5 text-sm transition-all animate-fadeIn ${
              statusMsg.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {statusMsg.type === 'success' ? (
                <CheckCircle className="w-5 h-5 shrink-0 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* VIEW: Dashboard Stats */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 flex-1">
              <div>
                <h2 className="text-2xl font-bold mb-1">सिस्टम कंसोल डैशबोर्ड</h2>
                <p className="text-slate-500 dark:text-slate-400">वेबसाइट पर प्रकाशित लाइव मेट्रिक्स की सारांश सूची।</p>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-6 shadow-md">
                  <p className="text-red-100 text-sm font-semibold uppercase tracking-wider">कुल समाचार पोस्ट</p>
                  <h3 className="text-4xl font-extrabold mt-2">{totalNews}</h3>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-md">
                  <p className="text-blue-100 text-sm font-semibold uppercase tracking-wider">ब्रेकिंग टिकर समाचार</p>
                  <h3 className="text-4xl font-extrabold mt-2">{breakingNewsCount}</h3>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl p-6 shadow-md">
                  <p className="text-indigo-100 text-sm font-semibold uppercase tracking-wider">वीडियो रिपोर्ट्स</p>
                  <h3 className="text-4xl font-extrabold mt-2">{videoNewsCount}</h3>
                </div>
              </div>

              {/* Category distribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FolderTree className="w-5 h-5 text-red-500" /> श्रेणियों के आधार पर पोस्ट वितरण
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 divide-y divide-slate-200 dark:divide-slate-700 max-h-80 overflow-y-auto border dark:border-slate-700">
                    {categoriesList.map(cat => {
                      const count = newsList.filter(n => n.category === cat.slug).length;
                      return (
                        <div key={cat.slug} className="flex justify-between items-center py-2 text-sm">
                          <span className="font-semibold">{cat.name} ({cat.name_en})</span>
                          <span className="bg-slate-200 dark:bg-slate-600 px-2 py-0.5 rounded-full font-bold text-xs">
                            {count} पोस्ट्स
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-red-500" /> नवीनतम समाचार अपडेट
                  </h3>
                  <div className="space-y-3">
                    {newsList.slice(0, 5).map(item => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border dark:border-slate-700">
                        <img 
                          src={item.image} 
                          alt="" 
                          className="w-12 h-12 object-cover rounded-lg shrink-0 bg-slate-200"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-sm truncate">{item.title}</h4>
                          <span className="text-xs text-slate-500">{formatDateHindi(item.published_at)}</span>
                        </div>
                      </div>
                    ))}
                    {newsList.length === 0 && (
                      <div className="text-center py-8 text-slate-500">कोई खबर उपलब्ध नहीं है।</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: News CRUD */}
          {activeTab === 'news' && (
            <div className="space-y-8 flex-1 flex flex-col">
              <div className="flex justify-between items-center flex-wrap gap-4 border-b pb-4">
                <div>
                  <h2 className="text-2xl font-bold">{editingNewsId ? 'खबर संपादित करें' : 'समाचार CRUD प्रबंधन'}</h2>
                  <p className="text-slate-500">समाचार डेटा जोड़ें, संपादित करें या मिटाएं।</p>
                </div>
                {editingNewsId && (
                  <button 
                    onClick={() => {
                      setEditingNewsId(null);
                      setNewsForm({
                        title: '',
                        slug: '',
                        excerpt: '',
                        content: '',
                        image: '',
                        images: [],
                        media_type: 'image',
                        video_url: '',
                        youtube_id: '',
                        category: categoriesList[0]?.slug || '',
                        author: 'संपादक',
                        published_at: new Date().toISOString().substring(0, 16),
                        is_breaking: false,
                      });
                    }}
                    className="bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-300 transition-all cursor-pointer"
                  >
                    नया जोड़ने पर जाएं
                  </button>
                )}
              </div>

              {/* CRUD FORM */}
              <form onSubmit={saveNews} className="bg-slate-50 dark:bg-slate-700/30 border dark:border-slate-700 p-6 rounded-2xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold mb-1.5">शीर्षक *</label>
                    <input 
                      type="text" 
                      required
                      value={newsForm.title}
                      onChange={(e) => {
                        setNewsForm(prev => {
                          const updated = { ...prev, title: e.target.value };
                          if (!editingNewsId) {
                            updated.slug = generateSlug(e.target.value);
                          }
                          return updated;
                        });
                      }}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                      placeholder="समाचार का मुख्य शीर्षक"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1.5">URL Slug (यूनिक आईडी) *</label>
                    <input 
                      type="text" 
                      required
                      value={newsForm.slug}
                      onChange={(e) => setNewsForm(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                      placeholder="slug-url-here"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1.5">कैटेगरी *</label>
                    <select
                      value={newsForm.category}
                      onChange={(e) => setNewsForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                    >
                      {categoriesList.map(cat => (
                        <option key={cat.slug} value={cat.slug}>{cat.name} ({cat.name_en})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1.5">मीडिया टाइप *</label>
                    <select
                      value={newsForm.media_type}
                      onChange={(e) => setNewsForm(prev => ({ ...prev, media_type: e.target.value as any }))}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                    >
                      <option value="image">छवि (Image)</option>
                      <option value="video">वीडियो (Video)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-1.5">छवि URL *</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        required
                        value={newsForm.image}
                        onChange={(e) => setNewsForm(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                        placeholder="https://res.cloudinary.com/... or https://picsum.photos/..."
                      />
                      <button
                        type="button"
                        onClick={() => setActiveTab('media')}
                        className="bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-300 whitespace-nowrap cursor-pointer"
                      >
                        क्लाउड अपलोड
                      </button>
                    </div>
                  </div>

                  {newsForm.media_type === 'video' && (
                    <>
                      <div>
                        <label className="block text-sm font-bold mb-1.5">यूट्यूब वीडियो ID या पूरा URL</label>
                        <input
                          type="text"
                          value={newsForm.youtube_id}
                          onChange={(e) => {
                            const parsed = extractYoutubeId(e.target.value);
                            setNewsForm(prev => ({ ...prev, youtube_id: parsed }));
                          }}
                          className="w-full px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                          placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ या dQw4w9WgXcQ"
                        />
                        {newsForm.youtube_id && (
                          <p className="text-xs text-green-600 mt-1">✓ ID: {newsForm.youtube_id}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold mb-1.5">या सीधे वीडियो फ़ाइल URL (MP4)</label>
                        <input 
                          type="text" 
                          value={newsForm.video_url}
                          onChange={(e) => setNewsForm(prev => ({ ...prev, video_url: e.target.value }))}
                          className="w-full px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                          placeholder="https://example.com/video.mp4"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-bold mb-1.5">लेखक (Author)</label>
                    <input 
                      type="text" 
                      value={newsForm.author}
                      onChange={(e) => setNewsForm(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1.5">प्रकाशन समय</label>
                    <input 
                      type="datetime-local" 
                      value={newsForm.published_at}
                      onChange={(e) => setNewsForm(prev => ({ ...prev, published_at: e.target.value }))}
                      className="w-full px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1.5">संक्षिप्त सारांश (Excerpt) *</label>
                  <textarea 
                    required
                    rows={2}
                    value={newsForm.excerpt}
                    onChange={(e) => setNewsForm(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                    placeholder="समाचार का छोटा सारांश (मुख्य पृष्ठ के लिए)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1.5">पूरी सामग्री (Full Content) *</label>
                  <TiptapEditor
                    value={newsForm.content}
                    onChange={(html) => setNewsForm(prev => ({ ...prev, content: html }))}
                    placeholder="पूरी समाचार रिपोर्ट विस्तार में लिखें..."
                  />
                </div>

                {/* Multi-Image Gallery Upload */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-red-500" />
                    <h4 className="font-bold text-sm">इमेज गैलरी (Multi-Image Upload)</h4>
                    {uploadingImages && <Loader2 className="w-4 h-4 animate-spin text-red-500" />}
                  </div>

                  {/* Thumbnail Previews */}
                  {newsForm.images.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {newsForm.images.map((url, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={url}
                            alt={`image-${idx + 1}`}
                            className="w-20 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-600 shadow-sm"
                          />
                          {idx === 0 && (
                            <span className="absolute -top-1.5 -left-1.5 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">PRIMARY</span>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setNewsForm(prev => {
                                const updated = prev.images.filter((_, i) => i !== idx);
                                return { ...prev, images: updated, image: updated[0] || '' };
                              })
                            }
                            className="absolute -top-1.5 -right-1.5 bg-slate-800 text-white rounded-full w-5 h-5 hidden group-hover:flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Input */}
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-center hover:border-red-400 transition-colors">
                        <span className="text-sm text-slate-500">
                          {uploadingImages ? 'अपलोड हो रहा है...' : '📁 छवियाँ चुनें (एक साथ कई)'}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={uploadingImages}
                        className="sr-only"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleMultiImageUpload(e.target.files);
                            e.target.value = '';
                          }
                        }}
                      />
                    </label>
                    {newsForm.images.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setNewsForm(prev => ({ ...prev, images: [], image: '' }))}
                        className="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        सभी हटाएं
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">पहली छवि Primary Image बनती है। Cloudinary क्रेडेंशियल Settings टैब में दर्ज करें।</p>
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="is_breaking"
                    checked={newsForm.is_breaking}
                    onChange={(e) => setNewsForm(prev => ({ ...prev, is_breaking: e.target.checked }))}
                    className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                  />
                  <label htmlFor="is_breaking" className="text-sm font-bold cursor-pointer">
                    इसे ब्रेकिंग न्यूज़ टिकर में दिखाएं (is_breaking)
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingNewsId ? 'समाचार अपडेट करें' : 'नया समाचार प्रकाशित करें'}
                </button>
              </form>

              {/* LIST / SEARCH */}
              <div className="space-y-4 border-t pt-8 flex-1">
                <h3 className="text-xl font-bold">समाचार सूची ({filteredNews.length})</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="खबर खोजें..."
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                  />
                  <select
                    value={newsFilterCat}
                    onChange={(e) => setNewsFilterCat(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                  >
                    <option value="all">सभी कैटेगरी</option>
                    {categoriesList.map(cat => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="border rounded-2xl overflow-hidden bg-white dark:bg-slate-800 divide-y dark:divide-slate-700 max-h-96 overflow-y-auto">
                  {filteredNews.map(item => (
                    <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={item.image} 
                          alt="" 
                          className="w-16 h-10 object-cover rounded-lg bg-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">{item.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 px-2 py-0.5 rounded font-medium">
                              {categoriesList.find(c => c.slug === item.category)?.name || item.category}
                            </span>
                            <span className="text-xs text-slate-500">{formatDateHindi(item.published_at)}</span>
                            {item.is_breaking && (
                              <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded font-medium">Breaking</span>
                            )}
                            <span className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                              <Eye className="w-3 h-3" /> {item.views || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleEditNews(item)}
                          className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-lg transition-colors cursor-pointer"
                          title="संपादित करें"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNews(item.id)}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg transition-colors cursor-pointer"
                          title="हटाएं"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {filteredNews.length === 0 && (
                    <div className="p-8 text-center text-slate-500">कोई समाचार रिकॉर्ड नहीं मिला।</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Categories CRUD */}
          {activeTab === 'categories' && (
            <div className="space-y-8 flex-1">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h2 className="text-2xl font-bold">कैटेगरी प्रबंधन (Categories)</h2>
                  <p className="text-slate-500">समाचार श्रेणियों को परिभाषित और संपादित करें।</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* CATEGORY FORM */}
                <div className="md:col-span-1">
                  <form onSubmit={saveCategory} className="bg-slate-50 dark:bg-slate-700/30 border dark:border-slate-700 p-5 rounded-2xl space-y-4">
                    <h3 className="font-bold text-lg">{editingCatSlug ? 'श्रेणी संपादित करें' : 'नई श्रेणी जोड़ें'}</h3>
                    
                    <div>
                      <label className="block text-xs font-bold mb-1">श्रेणी नाम (Hindi) *</label>
                      <input 
                        type="text" 
                        required
                        value={catForm.name}
                        onChange={(e) => setCatForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg focus:outline-none text-sm text-slate-900 dark:text-white"
                        placeholder="राजनीति"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">श्रेणी नाम (English) *</label>
                      <input 
                        type="text" 
                        required
                        value={catForm.name_en}
                        onChange={(e) => {
                          setCatForm(prev => {
                            const updated = { ...prev, name_en: e.target.value };
                            if (!editingCatSlug) {
                              updated.slug = generateSlug(e.target.value);
                            }
                            return updated;
                          });
                        }}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg focus:outline-none text-sm text-slate-900 dark:text-white"
                        placeholder="Politics"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1">URL Slug *</label>
                      <input 
                        type="text" 
                        required
                        value={catForm.slug}
                        onChange={(e) => setCatForm(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg focus:outline-none text-sm text-slate-900 dark:text-white"
                        placeholder="politics"
                        disabled={!!editingCatSlug}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold text-sm cursor-pointer"
                      >
                        {editingCatSlug ? 'अपडेट' : 'जोड़ें'}
                      </button>
                      {editingCatSlug && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCatSlug(null);
                            setCatForm({ slug: '', name: '', name_en: '' });
                          }}
                          className="bg-slate-300 text-slate-800 px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer"
                        >
                          रद्द
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* CATEGORIES TABLE */}
                <div className="md:col-span-2">
                  <div className="border rounded-2xl overflow-hidden bg-white dark:bg-slate-800 max-h-[450px] overflow-y-auto">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead className="bg-slate-100 dark:bg-slate-700 font-semibold text-slate-600 dark:text-slate-200">
                        <tr>
                          <th className="p-3">नाम (Hindi)</th>
                          <th className="p-3">English Name</th>
                          <th className="p-3">Slug</th>
                          <th className="p-3 text-right">कार्रवाई</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-slate-700">
                        {categoriesList.map(cat => (
                          <tr key={cat.slug} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <td className="p-3 font-semibold">{cat.name}</td>
                            <td className="p-3">{cat.name_en}</td>
                            <td className="p-3 text-slate-500 font-mono text-xs">{cat.slug}</td>
                            <td className="p-3 text-right flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleEditCategory(cat)}
                                className="p-1.5 bg-blue-50 text-blue-600 rounded dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(cat.slug)}
                                className="p-1.5 bg-red-50 text-red-600 rounded dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Cloud Media Upload */}
          {activeTab === 'media' && (
            <div className="space-y-8 flex-1">
              <div>
                <h2 className="text-2xl font-bold">क्लाउड मीडिया अपलोडर</h2>
                <p className="text-slate-500">Unsigned Upload के ज़रिये फ़ाइलों को सीधे Cloudinary होस्ट पर भेजें।</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* UPLOADER */}
                <div className="bg-slate-50 dark:bg-slate-700/30 border dark:border-slate-700 p-6 rounded-2xl space-y-4">
                  <h3 className="font-bold text-lg">फ़ाइल अपलोड करें</h3>
                  <form onSubmit={handleCloudinaryUpload} className="space-y-4">
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:bg-slate-100 dark:hover:bg-slate-700/40 transition-colors relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Upload className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {uploadFile ? uploadFile.name : 'ड्रैग करें या फाइल चुनने के लिए क्लिक करें'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">JPEG, PNG, WEBP (अधिकतम 10MB)</p>
                    </div>

                    <button
                      type="submit"
                      disabled={uploadingMedia || !uploadFile}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      {uploadingMedia ? <Loader2 className="w-5 h-5 animate-spin" /> : 'क्लाउड पर भेजें (Upload)'}
                    </button>
                  </form>

                  {uploadedUrl && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs break-all">
                      <p className="font-bold mb-1">सफलतापूर्वक अपलोड किया गया यूआरएल:</p>
                      <a href={uploadedUrl} target="_blank" className="underline font-mono">{uploadedUrl}</a>
                      <p className="text-slate-500 mt-2">नोट: यह URL आपके समाचार CRUD फॉर्म के इमेज फ़ील्ड में आटोमैटिक सेट हो गया है।</p>
                    </div>
                  )}
                </div>

                {/* HISTORY */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">इस सत्र में अपलोड की गई मीडिया</h3>
                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {sessionUploadedUrls.map((url, index) => (
                      <div key={index} className="relative aspect-video rounded-xl overflow-hidden border bg-slate-100 group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(url);
                            showNotification('success', 'यूआरएल क्लिपबोर्ड में कॉपी किया गया!');
                          }}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold cursor-pointer"
                        >
                          कॉपी यूआरएल
                        </button>
                      </div>
                    ))}
                    {sessionUploadedUrls.length === 0 && (
                      <div className="col-span-2 text-center py-12 text-slate-500 border border-dashed rounded-xl">
                        कोई मीडिया अभी अपलोड नहीं की गई।
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Settings & Ads */}
          {activeTab === 'settings' && (
            <div className="space-y-8 flex-1">
              <div>
                <h2 className="text-2xl font-bold">वैश्विक विन्यास और विज्ञापन प्रबंधन</h2>
                <p className="text-slate-500">AdSense कोड्स, यूट्यूब लाइव आईडी और क्लाउड क्रेडेंशियल अपडेट करें।</p>
              </div>

              <form onSubmit={saveSettings} className="bg-slate-50 dark:bg-slate-700/30 border dark:border-slate-700 p-6 rounded-2xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* AdSense Settings */}
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="font-bold text-lg border-b pb-1 text-slate-700 dark:text-slate-300">Google AdSense कॉन्फ़िगरेशन</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold mb-1">AdSense Client Publisher ID (उदा: ca-pub-XXXXX)</label>
                        <input 
                          type="text" 
                          value={settings.adsense_client}
                          onChange={(e) => setSettings(prev => ({ ...prev, adsense_client: e.target.value }))}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg focus:outline-none text-sm text-slate-900 dark:text-white"
                          placeholder="ca-pub-1234567890"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">विज्ञापन स्लॉट: मुख्य बैनर (Header Banner Slot)</label>
                        <input 
                          type="text" 
                          value={settings.adsense_slot_banner}
                          onChange={(e) => setSettings(prev => ({ ...prev, adsense_slot_banner: e.target.value }))}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg focus:outline-none text-sm text-slate-900 dark:text-white"
                          placeholder="9876543210"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">विज्ञापन स्लॉट: लेख बैनर (Article Page Banner Slot)</label>
                        <input 
                          type="text" 
                          value={settings.adsense_slot_article}
                          onChange={(e) => setSettings(prev => ({ ...prev, adsense_slot_article: e.target.value }))}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg focus:outline-none text-sm text-slate-900 dark:text-white"
                          placeholder="1234567890"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">कस्टम फॉलबैक बैनर लिंक (Custom Advert Banner URL)</label>
                        <input 
                          type="text" 
                          value={settings.banner_link}
                          onChange={(e) => setSettings(prev => ({ ...prev, banner_link: e.target.value }))}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg focus:outline-none text-sm text-slate-900 dark:text-white"
                          placeholder="https://example.com/banner.jpg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* YouTube Live ID */}
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="font-bold text-lg border-b pb-1 text-slate-700 dark:text-slate-300">यूट्यूब लाइव स्ट्रीम विन्यास</h3>
                    <div>
                      <label className="block text-xs font-bold mb-1">यूट्यूब लाइव वीडियो ID (उदा: dQw4w9WgXcQ)</label>
                      <input 
                        type="text" 
                        value={settings.youtube_live_id}
                        onChange={(e) => setSettings(prev => ({ ...prev, youtube_live_id: e.target.value }))}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg focus:outline-none text-sm text-slate-900 dark:text-white"
                        placeholder="dQw4w9WgXcQ"
                      />
                    </div>
                  </div>

                  {/* Cloudinary credentials config */}
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="font-bold text-lg border-b pb-1 text-slate-700 dark:text-slate-300">Cloudinary क्लाउड अपलोड सेटिंग्स</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold mb-1">Cloud Name *</label>
                        <input 
                          type="text" 
                          value={settings.cloudinary_cloud_name}
                          onChange={(e) => setSettings(prev => ({ ...prev, cloudinary_cloud_name: e.target.value }))}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg focus:outline-none text-sm text-slate-900 dark:text-white"
                          placeholder="your-cloud-name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">Upload Preset (Unsigned) *</label>
                        <input 
                          type="text" 
                          value={settings.cloudinary_upload_preset}
                          onChange={(e) => setSettings(prev => ({ ...prev, cloudinary_upload_preset: e.target.value }))}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg focus:outline-none text-sm text-slate-900 dark:text-white"
                          placeholder="unsigned-preset-name"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feature Pack-1: Local Direct Ad Slots Manager */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="font-bold text-lg border-b pb-2 text-red-600 dark:text-red-400 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5" />
                    स्थानीय डायरेक्ट विज्ञापन स्लॉट्स (Local Direct Ad Manager)
                  </h3>
                  <p className="text-xs text-slate-500 -mt-2">ये स्लॉट्स Google AdSense की जगह आपके बैनर दिखाते हैं। खाली छोड़ने पर AdSense फॉलबैक होगा।</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* SLOT 1: Top Banner */}
                    <div className="bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-900/30 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 text-xs font-bold px-2 py-0.5 rounded-full">SLOT 1</span>
                        <span className="font-bold text-sm">टॉप बैनर (लेख पृष्ठ शीर्ष)</span>
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">बैनर इमेज URL (banner_top_url)</label>
                        <input
                          type="text"
                          value={settings.banner_top_url}
                          onChange={(e) => setSettings(prev => ({ ...prev, banner_top_url: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-slate-900 dark:text-white"
                          placeholder="https://res.cloudinary.com/.../banner.jpg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">क्लिक रीडायरेक्ट URL (banner_top_link)</label>
                        <input
                          type="text"
                          value={settings.banner_top_link}
                          onChange={(e) => setSettings(prev => ({ ...prev, banner_top_link: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-slate-900 dark:text-white"
                          placeholder="https://bharatosai.academy"
                        />
                      </div>
                      {settings.banner_top_url && (
                        <img
                          src={settings.banner_top_url}
                          alt="Top Banner Preview"
                          className="w-full h-16 object-cover rounded-lg border border-orange-200"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      )}
                    </div>

                    {/* SLOT 2: In-Article Banner */}
                    <div className="bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-900/30 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 text-xs font-bold px-2 py-0.5 rounded-full">SLOT 2</span>
                        <span className="font-bold text-sm">मध्य-लेख बैनर (In-Article)</span>
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">बैनर इमेज URL (banner_article_url)</label>
                        <input
                          type="text"
                          value={settings.banner_article_url}
                          onChange={(e) => setSettings(prev => ({ ...prev, banner_article_url: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-slate-900 dark:text-white"
                          placeholder="https://res.cloudinary.com/.../article-banner.jpg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">क्लिक रीडायरेक्ट URL (banner_article_link)</label>
                        <input
                          type="text"
                          value={settings.banner_article_link}
                          onChange={(e) => setSettings(prev => ({ ...prev, banner_article_link: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-slate-900 dark:text-white"
                          placeholder="https://bharatosai.academy"
                        />
                      </div>
                      {settings.banner_article_url && (
                        <img
                          src={settings.banner_article_url}
                          alt="Article Banner Preview"
                          className="w-full h-16 object-cover rounded-lg border border-purple-200"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold shadow transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'विन्यास सेटिंग्स सहेजें'}
                </button>
              </form>
            </div>
          )}

          {/* VIEW: Backup & Restore */}
          {activeTab === 'backup' && (
            <div className="space-y-8 flex-1">
              <div>
                <h2 className="text-2xl font-bold">डेटाबेस बैकअप और रिस्टोरेशन</h2>
                <p className="text-slate-500">सभी तालिका डेटा (समाचार, श्रेणियां, सेटिंग्स) को JSON के रूप में बैकअप लें या आयात करें।</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* EXPORT BACKUP */}
                <div className="bg-slate-50 dark:bg-slate-700/30 border dark:border-slate-700 p-6 rounded-2xl space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <DatabaseBackup className="w-5 h-5 text-green-600" /> डेटा बैकअप (Export JSON)
                  </h3>
                  <p className="text-sm text-slate-500">
                    यह क्रिया आपके डेटाबेस की सभी श्रेणियों, पोस्ट्स और कॉन्फ़िगरेशन को एक .json फाइल में निर्यात कर देगी।
                  </p>
                  <button
                    onClick={exportDatabaseBackup}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-bold cursor-pointer transition-all shadow hover:shadow-green-500/20 active:scale-95"
                  >
                    बैकअप फाइल डाउनलोड करें
                  </button>
                </div>

                {/* IMPORT BACKUP */}
                <div className="bg-slate-50 dark:bg-slate-700/30 border dark:border-slate-700 p-6 rounded-2xl space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Upload className="w-5 h-5 text-red-600" /> डेटा पुनर्स्थापना (Restore JSON)
                  </h3>
                  <p className="text-sm text-slate-500 text-red-600 font-semibold">
                    सावधानी: बैकअप फाइल अपलोड करने से वर्तमान डेटाबेस खाली होकर रिस्टोर हो जाएगा!
                  </p>

                  <div className="space-y-2">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      accept=".json"
                      onChange={handleImportBackup}
                      className="hidden" 
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold cursor-pointer transition-all shadow hover:shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          बहाल हो रहा है...
                        </>
                      ) : (
                        'बैकअप फ़ाइल आयात करें (Upload JSON)'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
