import React from 'react';
import { CodeIcon } from './Icons';

export default function Footer({ onOpenGuide, onOpenIdea, onOpenSubmit }) {
  return (
    <footer className="footer-clean-root">
      <div className="container">
        
        {/* Main 2-Column Content */}
        <div className="footer-inner-content">
          
          {/* Brand Column */}
          <div className="footer-brand-side">
            <div className="footer-brand-header">
              <div className="brand-logo-icon-sm">
                <CodeIcon size={16} />
              </div>
              <span className="footer-brand-title-text">RPL X Vault</span>
              <span className="footer-edition-badge">2026/2027</span>
            </div>
            <p className="footer-brand-description">
              Platform perpustakaan digital dan showcase karya koding siswa kelas 10 Rekayasa Perangkat Lunak. Tempat berbagi inspirasi, belajar bersama, dan memamerkan proyek web yang sudah aktif online.
            </p>
          </div>

          {/* Links Column */}
          <div className="footer-links-side">
            <div className="footer-link-group">
              <span className="footer-group-title">Menu Utama</span>
              <ul>
                <li><button type="button" onClick={onOpenSubmit}>+ Daftarkan Proyek</button></li>
                <li><button type="button" onClick={onOpenGuide}>Panduan Hosting</button></li>
                <li><button type="button" onClick={onOpenIdea}>Inspirasi Ide</button></li>
              </ul>
            </div>

            <div className="footer-link-group">
              <span className="footer-group-title">Kelas RPL</span>
              <ul>
                <li><span>X RPL 1</span></li>
                <li><span>X RPL 2</span></li>
                <li><span>X RPL 3</span></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Social Proof & Tech Stack Section */}
        <div className="footer-social-proof">
          <div className="proof-text-wrap">
            <span>Dibangun dengan</span>
            <span className="heart-icon-pulse" aria-label="cinta">❤️</span>
            <span>oleh siswa X RPL</span>
          </div>

          <div className="proof-tech-badges">
            <span className="tech-badge badge-react">
              <span className="tech-badge-dot dot-react"></span>
              React 19
            </span>
            <span className="tech-badge badge-vite">
              <span className="tech-badge-dot dot-vite"></span>
              Vite
            </span>
            <span className="tech-badge badge-supabase">
              <span className="tech-badge-dot dot-supabase"></span>
              Supabase
            </span>
          </div>
        </div>

        {/* Bottom Line & Copyright */}
        <div className="footer-bottom-line">
          <p>© {new Date().getFullYear()} Jurusan Rekayasa Perangkat Lunak. All rights reserved.</p>
          <p className="footer-note-text">Dibuat untuk mempermudah berbagi dan mengeksplorasi karya koding siswa.</p>
        </div>

      </div>
    </footer>
  );
}
