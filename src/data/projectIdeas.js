// projectIdeas.js - Koleksi ide project coding inspiratif untuk siswa Kelas 10 RPL

export const PROJECT_IDEAS = [
  {
    title: "Game Flappy Bird Versi Maskot RPL",
    category: "Game HTML5",
    tech: ["HTML5 Canvas", "JavaScript", "Audio Synth"],
    difficulty: "Beginner",
    summary: "Buat tiruan game legendaris Flappy Bird tapi burungnya diganti ikon logo RPL atau maskot sekolah, dengan sistem gravitasi dan pencatat skor tertinggi di LocalStorage.",
    benefits: "Melatih logika pergerakan fisika, looping requestAnimationFrame, dan deteksi collision rect-to-rect."
  },
  {
    title: "Sistem Manajemen Nilai Rapor Siswa CLI",
    category: "Console / CLI",
    tech: ["Python / C++", "File IO (.csv / .json)"],
    difficulty: "Beginner",
    summary: "Aplikasi terminal untuk guru/wali kelas menghitung nilai rata-rata tugas, UTS, UAS, konversi ke predikat huruf (A, B, C), dan ekspor hasil ke file teks.",
    benefits: "Melatih array/list, dictionary, percabangan if-else kompleks, serta fungsi manipulasi file."
  },
  {
    title: "Web Pemutar Musik Lo-Fi Belajar Koding",
    category: "Web App",
    tech: ["HTML5 Audio", "CSS Neumorphism", "JavaScript"],
    difficulty: "Intermediate",
    summary: "Pemutar audio bertema Lo-Fi Chill dengan timer Pomodoro (25 menit fokus, 5 menit istirahat) untuk menemani teman-teman sekelas koding di lab.",
    benefits: "Belajar kontrol HTML Audio API, interval timer, dan styling aesthetic modern."
  },
  {
    title: "Kalkulator Gizi & Kalori Kantin Sekolah",
    category: "Tools / Utility",
    tech: ["JavaScript", "CSS Flexbox", "JSON Data"],
    difficulty: "Beginner",
    summary: "Aplikasi web hitung kalori makanan khas kantin sekolah (bakso, mie ayam, es teh) serta perhitungan Indeks Massa Tubuh (BMI) siswa.",
    benefits: "Belajar input parsing, formula matematika, dan penyajian data ringkas ke pengguna."
  },
  {
    title: "Bot Kuis Discord / Telegram Asisten Kelas RPL",
    category: "Backend / Bot",
    tech: ["Python", "python-telegram-bot / Discord.py"],
    difficulty: "Intermediate",
    summary: "Bot obrolan otomatis yang bisa memberikan jadwal pelajaran esok hari, mengingatkan tugas PR koding, dan memberikan mini-kuis sintaks harian.",
    benefits: "Mengenal konsep API, bot listener event, asynchronous programming, dan integrasi webhook."
  },
  {
    title: "Web Katalog Buku & Peminjaman Perpustakaan Kelas",
    category: "Web App",
    tech: ["HTML5", "CSS Grid", "JavaScript LocalStorage"],
    difficulty: "Intermediate",
    summary: "Aplikasi pencatat buku fisik yang ada di pojok baca kelas RPL: status sedang dipinjam oleh siapa, tanggal pinjam, dan tombol kembalikan buku.",
    benefits: "Memahami operasi CRUD (Create, Read, Update, Delete) lengkap di browser."
  },
  {
    title: "Kalkulator Konversi Satuan Jaringan Komputer",
    category: "Tools / Utility",
    tech: ["JavaScript / Python", "Modern UI"],
    difficulty: "Beginner",
    summary: "Konversi otomatis Bit, Byte, Kilobyte, Megabyte, Gigabyte, serta penghitungan estimasi waktu download file berdasarkan kecepatan internet (Mbps).",
    benefits: "Memperdalam materi Dasar Komputer & Jaringan sekaligus latihan algoritma konversi rasio."
  },
  {
    title: "Game Tebak Kata Hangman Bertema RPL",
    category: "Game",
    tech: ["JavaScript", "HTML / Canvas"],
    difficulty: "Beginner",
    summary: "Game tebak kata misterius seputar istilah programming (Array, Variable, Function, Boolean) dengan visual gambar karakter yang digambar per kesalahan.",
    benefits: "Melatih manipulasi string, array matching, dan status game loop."
  }
];
