-- =========================================================
-- SUPABASE SCHEMA UNTUK SHOWCASE X RPL (CONSOLE RPL)
-- Jalankan skrip ini di SQL Editor Supabase Anda:
-- Dashboard Supabase -> Menu SQL Editor -> New Query -> Run
-- =========================================================

-- 1. Buat Tabel Projects (Mendukung Privasi Siswa & Akses Tamu)
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,                -- Nama samaran / alias publik (dilihat oleh Tamu)
    real_name TEXT,                      -- Nama lengkap / asli siswa (hanya dilihat oleh Siswa RPL)
    edit_pin TEXT,                       -- PIN keamanan proyek untuk edit/hapus
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

-- Migrasi jika tabel lama sudah ada:
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS real_name TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS edit_pin TEXT;

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Izinkan siapa saja membaca data proyek (Public Read)
DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
CREATE POLICY "Public Read Projects" 
ON public.projects 
FOR SELECT 
USING (true);

-- 4. Policy: Izinkan siapa saja mendaftarkan proyek baru (Public Insert)
DROP POLICY IF EXISTS "Public Insert Projects" ON public.projects;
CREATE POLICY "Public Insert Projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (true);

-- 5. Policy: Izinkan pembaruan data HANYA untuk bintang (Update) - opsional jika pakai RPC
-- Lebih aman kita hapus akses UPDATE dan DELETE publik sepenuhnya.
-- Kita akan menggunakan fungsi RPC (Stored Procedure) di bawah ini.
-- DROP POLICY IF EXISTS "Public Update Projects" ON public.projects;
-- DROP POLICY IF EXISTS "Public Delete Projects" ON public.projects;

-- =========================================================
-- SETUP STORAGE BUCKET: 'thumbnails'
-- =========================================================
-- Buat bucket penyimpanan khusus thumbnail jika belum ada
INSERT INTO storage.buckets (id, name, public) 
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy Storage: Izinkan publik melihat file foto di bucket thumbnails
DROP POLICY IF EXISTS "Public Access Thumbnails" ON storage.objects;
CREATE POLICY "Public Access Thumbnails" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'thumbnails');

-- Policy Storage: Izinkan upload file ke bucket thumbnails
DROP POLICY IF EXISTS "Public Upload Thumbnails" ON storage.objects;
CREATE POLICY "Public Upload Thumbnails" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'thumbnails');

-- Policy Storage: Izinkan update file di bucket thumbnails
DROP POLICY IF EXISTS "Public Update Thumbnails" ON storage.objects;
CREATE POLICY "Public Update Thumbnails" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'thumbnails');

-- Policy Storage: Izinkan delete file di bucket thumbnails
DROP POLICY IF EXISTS "Public Delete Thumbnails" ON storage.objects;
CREATE POLICY "Public Delete Thumbnails" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'thumbnails');

-- =========================================================
-- FUNGSI RPC ATOMIC: PEMBERIAN BINTANG (ANTI RACE CONDITION)
-- =========================================================
CREATE OR REPLACE FUNCTION increment_stars(proj_id TEXT)
RETURNS INTEGER AS $$
DECLARE
    new_val INTEGER;
BEGIN
    UPDATE public.projects 
    SET stars = COALESCE(stars, 0) + 1 
    WHERE id = proj_id
    RETURNING stars INTO new_val;
    
    RETURN new_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================================
-- FUNGSI RPC: UPDATE PROYEK DENGAN VERIFIKASI PIN
-- =========================================================
CREATE OR REPLACE FUNCTION update_project_with_pin(p_id TEXT, p_pin TEXT, p_payload JSONB)
RETURNS JSONB AS $$
DECLARE
    v_project public.projects%ROWTYPE;
BEGIN
    SELECT * INTO v_project FROM public.projects WHERE id = p_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Proyek tidak ditemukan';
    END IF;

    IF v_project.edit_pin IS NOT NULL AND v_project.edit_pin != '' AND v_project.edit_pin != p_pin THEN
        RAISE EXCEPTION 'PIN pengaman salah';
    END IF;

    -- Update row
    UPDATE public.projects 
    SET 
        title = p_payload->>'title',
        author = p_payload->>'author',
        real_name = p_payload->>'real_name',
        student_class = p_payload->>'student_class',
        avatar = p_payload->>'avatar',
        category = p_payload->>'category',
        category_label = p_payload->>'category_label',
        status = p_payload->>'status',
        demo_url = p_payload->>'demo_url',
        github_url = p_payload->>'github_url',
        thumbnail_url = p_payload->>'thumbnail_url',
        tech_stack = (p_payload->>'tech_stack')::jsonb,
        description = p_payload->>'description',
        submission_date = p_payload->>'submission_date'
    WHERE id = p_id
    RETURNING * INTO v_project;

    RETURN row_to_json(v_project)::jsonb;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================================
-- FUNGSI RPC: DELETE PROYEK DENGAN VERIFIKASI PIN
-- =========================================================
CREATE OR REPLACE FUNCTION delete_project_with_pin(p_id TEXT, p_pin TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_project public.projects%ROWTYPE;
BEGIN
    SELECT * INTO v_project FROM public.projects WHERE id = p_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Proyek tidak ditemukan';
    END IF;

    IF v_project.edit_pin IS NOT NULL AND v_project.edit_pin != '' AND v_project.edit_pin != p_pin THEN
        RAISE EXCEPTION 'PIN pengaman salah';
    END IF;

    DELETE FROM public.projects WHERE id = p_id;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

