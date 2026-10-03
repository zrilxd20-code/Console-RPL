# 🚀 RPL X Vault • Showcase & Perpustakaan Proyek Siswa

Perpustakaan digital dan showcase portofolio koding siswa kelas 10 Rekayasa Perangkat Lunak (RPL). Dibangun dengan arsitektur modern, proteksi PIN proyek, real-time cloud database via Supabase, serta tampilan glassmorphism responsif.

---

## ✨ Fitur Utama

- **Katalog Proyek Terkurasi**: Filter berdasarkan kategori (Web, Mobile, Game, CLI, AI) & kelas (X RPL 1 & X RPL 2).
- **Mode Tamu & Siswa**: Proteksi privasi nama asli siswa bagi pengunjung umum (Tamu), dengan hak akses penuh bagi siswa.
- **PIN Pengaman Proyek**: Siswa dapat mengedit atau menghapus proyeknya sendiri menggunakan 4-6 digit PIN rahasia.
- **Upload Thumbnail Otomatis**: Kompresi gambar sisi klien sebelum diunggah ke Supabase Storage.
- **Sistem Apresiasi (Stars)**: Pemberian bintang interaktif dengan efek confetti & stored procedure anti-race condition.
- **Generator Ide Proyek**: Bantuan inspirasi ide koding bagi siswa pemula beserta estimasi tingkat kesulitan.
- **Backup & Restore**: Ekspor dan impor data proyek dalam format JSON.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite 8](https://vite.dev/)
- **Backend / Database**: [Supabase](https://supabase.com/) (PostgreSQL, Storage, RPC functions, RLS)
- **Styling**: Vanilla CSS (Custom Design System, Dark Mode, Responsive Layout)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## ⚙️ Persiapan Lokal (Local Setup)

1. **Clone repositori**:
   ```bash
   git clone https://github.com/zrilxd20-code/Console-RPL.git
   cd "console rpl"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup Environment Variables**:
   Salin `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Isi konfigurasi Supabase Anda:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Setup Database Supabase**:
   Buka **SQL Editor** di Dashboard Supabase, lalu jalankan seluruh isi file [`supabase_schema.sql`](./supabase_schema.sql).

5. **Jalankan aplikasi**:
   ```bash
   npm run dev
   ```

---

## 🚀 Panduan Deployment (Hosting)

### Opsi A: Vercel (Rekomendasi)
1. Hubungkan repository GitHub ini ke Vercel.
2. Pada bagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Klik **Deploy**. File [`vercel.json`](./vercel.json) sudah dikonfigurasi untuk SPA routing.

### Opsi B: Netlify / Cloudflare Pages
- Konfigurasi file [`public/_redirects`](./public/_redirects) sudah disediakan secara otomatis untuk menangani SPA client-side routing.
- Jangan lupa menambahkan Environment Variables yang sama di pengaturan project dashboard.

