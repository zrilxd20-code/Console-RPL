import React, { useState, useEffect } from 'react';
import { XIcon } from './Icons';

export default function GuideModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('vercel');

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content modal-guide-clean" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="modal-header-simple">
          <div>
            <h2 className="modal-heading-text">Panduan Hosting Proyek Siswa</h2>
            <p className="modal-lead-text">
              Cara mudah mempublikasikan proyek koding kamu ke internet secara gratis agar bisa dimasukkan ke galeri ini.
            </p>
          </div>
          <button type="button" className="btn-close-clean" onClick={onClose}>
            <XIcon size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="form-tab-nav">
          <button 
            type="button"
            className={`form-tab-link ${activeTab === 'vercel' ? 'active' : ''}`}
            onClick={() => setActiveTab('vercel')}
          >
            1. Vercel (Paling Mudah)
          </button>
          <button 
            type="button"
            className={`form-tab-link ${activeTab === 'netlify' ? 'active' : ''}`}
            onClick={() => setActiveTab('netlify')}
          >
            2. Netlify (Drag & Drop)
          </button>
          <button 
            type="button"
            className={`form-tab-link ${activeTab === 'ghpages' ? 'active' : ''}`}
            onClick={() => setActiveTab('ghpages')}
          >
            3. GitHub Pages
          </button>
          <button 
            type="button"
            className={`form-tab-link ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => setActiveTab('submit')}
          >
            4. Cara Input ke Web Ini
          </button>
        </div>

        {/* Body Content */}
        <div className="guide-body-clean">
          
          {activeTab === 'vercel' && (
            <div className="guide-panel">
              <div className="guide-tagline">
                Cocok untuk: <strong>HTML/CSS/JS, React, Vite, Next.js</strong>
              </div>
              <ol className="clean-guide-steps">
                <li>
                  <strong>Buka Vercel:</strong> Kunjungi <a href="https://vercel.com" target="_blank" rel="noreferrer" className="clean-link">vercel.com</a> dan masuk menggunakan akun GitHub kamu.
                </li>
                <li>
                  <strong>Import Repositori:</strong> Klik tombol <strong>Add New...</strong> &gt; pilih <strong>Project</strong>, lalu pilih repositori kodinganmu.
                </li>
                <li>
                  <strong>Deploy:</strong> Klik <strong>Deploy</strong>. Dalam 30 detik website kamu sudah aktif online dengan link gratis (contoh: <code>https://karya-saya.vercel.app</code>).
                </li>
                <li>
                  <strong>Ambil Screenshot:</strong> Buka website kamu, ambil tangkapan layar (screenshot) untuk dijadikan thumbnail, lalu daftarkan linknya di web galeri ini!
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'netlify' && (
            <div className="guide-panel">
              <div className="guide-tagline">
                Cocok untuk: <strong>Siswa yang belum punya akun GitHub (Bisa Tarik Folder Langsung)</strong>
              </div>
              <ol className="clean-guide-steps">
                <li>
                  <strong>Buka Netlify Drop:</strong> Kunjungi <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="clean-link">app.netlify.com/drop</a>.
                </li>
                <li>
                  <strong>Drag & Drop Folder:</strong> Seret (drag) folder proyek kodingan kamu (folder yang berisi file <code>index.html</code>) langsung ke kotak di layar Netlify.
                </li>
                <li>
                  <strong>Dapatkan Link:</strong> Netlify akan langsung memberikan link website online aktif dalam hitungan detik.
                </li>
                <li>
                  <strong>Selesai:</strong> Salin link tersebut dan daftarkan ke galeri web kelas RPL ini.
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'ghpages' && (
            <div className="guide-panel">
              <div className="guide-tagline">
                Cocok untuk: <strong>Proyek HTML murni yang sudah di-upload ke GitHub</strong>
              </div>
              <ol className="clean-guide-steps">
                <li>
                  <strong>Buka Repositori di GitHub:</strong> Buka repositori proyek kamu di website GitHub.
                </li>
                <li>
                  <strong>Buka Settings:</strong> Klik tab <strong>Settings</strong> &gt; menu <strong>Pages</strong> di bilah kiri.
                </li>
                <li>
                  <strong>Pilih Branch:</strong> Pada bagian <em>Branch</em>, ubah dari <code>None</code> menjadi <code>main</code> (atau <code>master</code>) folder <code>/ (root)</code>, lalu klik <strong>Save</strong>.
                </li>
                <li>
                  <strong>Tunggu 1 Menit:</strong> Link website kamu akan muncul di bagian atas (contoh: <code>https://username.github.io/nama-projek/</code>).
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'submit' && (
            <div className="guide-panel">
              <div className="guide-tagline">
                Cara Memasukkan Karya ke Galeri Ini:
              </div>
              <ol className="clean-guide-steps">
                <li>
                  Tekan tombol <strong>+ Daftarkan Proyek</strong> di pojok kanan atas atau di tengah halaman.
                </li>
                <li>
                  Masukkan nama lengkapmu, kelas (X RPL 1, 2, atau 3), dan judul karyamu.
                </li>
                <li>
                  Tempelkan <strong>Link Website Hasil Hosting</strong> yang sudah aktif (dari Vercel/Netlify/GitHub Pages).
                </li>
                <li>
                  Pilih foto tangkapan layar (screenshot) website kamu agar tampil sebagai thumbnail di galeri.
                </li>
                <li>
                  Klik <strong>Simpan & Publikasikan</strong>. Karyamu akan langsung muncul di katalog dan bisa diklik oleh teman sekelas!
                </li>
              </ol>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="modal-footer-clean">
          <button type="button" className="btn-modal-done" onClick={onClose}>
            Tutup Panduan
          </button>
        </div>

      </div>
    </div>
  );
}
