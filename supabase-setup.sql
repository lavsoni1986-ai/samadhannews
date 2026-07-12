-- 1) UUID helper extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2) Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3) News Table
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT NOT NULL DEFAULT '/og-image.svg',
    media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    video_url TEXT,
    youtube_id TEXT,
    category TEXT REFERENCES public.categories(slug) ON UPDATE CASCADE ON DELETE SET NULL,
    author TEXT NOT NULL DEFAULT 'Admin',
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_breaking BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4) Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    adsense_client TEXT,
    adsense_slot_banner TEXT,
    adsense_slot_article TEXT,
    banner_link TEXT,
    youtube_live_id TEXT,
    cloudinary_cloud_name TEXT,
    cloudinary_upload_preset TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5) Performance Indexes
CREATE INDEX IF NOT EXISTS news_title_idx ON public.news (title);
CREATE INDEX IF NOT EXISTS news_breaking_idx ON public.news (is_breaking, published_at DESC);
CREATE INDEX IF NOT EXISTS news_category_idx ON public.news (category, published_at DESC);
CREATE INDEX IF NOT EXISTS news_slug_idx ON public.news (slug);

-- 6) Disable RLS temporarily for initial setup
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.news DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings DISABLE ROW LEVEL SECURITY;

-- 7) Seed Categories
INSERT INTO public.categories (slug, name, name_en) VALUES
('rajneeti', 'राजनीति', 'Politics'),
('desh', 'राष्ट्रीय', 'National'),
('duniya', 'अंतर्राष्ट्रीय', 'World'),
('rajya', 'राज्य', 'State'),
('vyapar', 'व्यापार', 'Business'),
('tech', 'तकनीक', 'Technology'),
('shiksha', 'शिक्षा', 'Education'),
('kheel', 'खेल', 'Sports'),
('manoranjan', 'मनोरंजन', 'Entertainment'),
('swasthya', 'स्वास्थ्य', 'Health'),
('dharm', 'धर्म', 'Religion'),
('jeevan', 'जीवनशैली', 'Lifestyle'),
('sampadkiya', 'संपादकीय', 'Editorial'),
('raay', 'राय', 'Opinion'),
('cg', 'छत्तीसगढ़', 'Chhattisgarh'),
('madhya-pradesh', 'मध्य प्रदेश', 'Madhya Pradesh')
ON CONFLICT (slug) DO NOTHING;

-- 8) Seed Default Settings
INSERT INTO public.settings (
    id,
    adsense_client,
    adsense_slot_banner,
    adsense_slot_article,
    banner_link,
    youtube_live_id,
    cloudinary_cloud_name,
    cloudinary_upload_preset
) VALUES (
    1,
    '',
    '',
    '',
    '',
    'dQw4w9WgXcQ',
    '',
    ''
)
ON CONFLICT (id) DO NOTHING;

-- 9) Seed Sample Breaking News
INSERT INTO public.news (
    slug,
    title,
    excerpt,
    content,
    image,
    media_type,
    category,
    author,
    is_breaking
) VALUES (
    'breaking-news-demo',
    'समाधान न्यूज का सुपाबेस डेटाबेस इंजन सफलतापूर्वक लाइव हो चुका है!',
    'यह खबर सीधे आपके नए Supabase क्लाउड डेटाबेस से रेंडर हो रही है।',
    'बधाई हो! समाधान न्यूज़ का आर्किटेक्चर अब पूरी तरह से स्केलेबल बन चुका है।',
    '/og-image.svg',
    'image',
    'desh',
    'Chief Architect',
    TRUE
)
ON CONFLICT (slug) DO NOTHING;