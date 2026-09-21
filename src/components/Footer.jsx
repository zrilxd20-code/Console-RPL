import React from 'react';
import { CodeIcon } from './Icons';

export default function Footer({ onOpenGuide, onOpenIdea, onOpenSubmit }) {
  return (
    <footer className="footer-clean-root">
      <div className="container">
        <div className="footer-inner-content">
          
          <div className="footer-brand-side">
            <div className="footer-brand-header">
              <div className="brand-logo-icon-sm">
                <CodeIcon size={16} />
              </div>
              <span className="footer-brand-title-text">Showcase X RPL</span>
            </div>
            <p className="footer-brand-description">
              Platform galeri karya dan portofolio koding siswa kelas 10 Rekayasa Perangkat Lunak. Tempat berbagi inspirasi, belajar bersama, dan memamerkan proyek yang sudah aktif online.
            </p>
          </div>

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

        <div className="footer-bottom-line">
          <p>© {new Date().getFullYear()} Kelas 10 Rekayasa Perangkat Lunak.</p>
          <p className="footer-note-text">Dibuat untuk mempermudah berbagi dan melihat karya koding siswa.</p>
        </div>
      </div>
    </footer>
  );
}
