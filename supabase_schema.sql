-- =========================================================
-- SUPABASE SCHEMA UNTUK SHOWCASE X RPL (CONSOLE RPL)
-- Jalankan skrip ini di SQL Editor Supabase Anda:
-- Dashboard Supabase -> Menu SQL Editor -> New Query -> Run
-- =========================================================

-- 1. Buat Tabel Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    student_class TEXT NOT NULL DEFAULT 'X RPL 1',
    avatar TEXT,
    category TEXT NOT NULL DEFAULT 'webapp',
    category_label TEXT DEFAULT 'Web App',
    status TEXT NOT NULL DEFAULT 'completed',
    demo_url TEXT,
    github_url TEXT,
    thumbnail_url TEXT,
    tech_stack JSONB DEFAULT '["Web"]'::jsonb,
    description TEXT,
    stars INTEGER DEFAULT 1,
    views INTEGER DEFAULT 1,
    submission_date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Izinkan siapa saja membaca data proyek (Public Read)
CREATE POLICY "Public Read Projects" 
ON public.projects 
FOR SELECT 
USING (true);

-- 4. Policy: Izinkan siapa saja mendaftarkan proyek baru (Public Insert)
CREATE POLICY "Public Insert Projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (true);

-- 5. Policy: Izinkan pembaruan data proyek / jumlah bintang (Public Update)
CREATE POLICY "Public Update Projects" 
ON public.projects 
FOR UPDATE 
USING (true);

-- 6. Policy: Izinkan penghapusan proyek (Public Delete)
CREATE POLICY "Public Delete Projects" 
ON public.projects 
FOR DELETE 
USING (true);

-- =========================================================
-- SETUP STORAGE BUCKET: 'thumbnails'
-- =========================================================
-- Buat bucket penyimpanan khusus thumbnail jika belum ada
INSERT INTO storage.buckets (id, name, public) 
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy Storage: Izinkan publik melihat file foto di bucket thumbnails
CREATE POLICY "Public Access Thumbnails" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'thumbnails');

-- Policy Storage: Izinkan upload file ke bucket thumbnails
CREATE POLICY "Public Upload Thumbnails" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'thumbnails');

-- Policy Storage: Izinkan update file di bucket thumbnails
CREATE POLICY "Public Update Thumbnails" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'thumbnails');

-- Policy Storage: Izinkan delete file di bucket thumbnails
CREATE POLICY "Public Delete Thumbnails" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'thumbnails');
