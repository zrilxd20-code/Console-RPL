import React from 'react';
import { PlusIcon, BookOpenIcon, SparklesIcon } from './Icons';

export default function StatsHero({ 
  projects, 
  onOpenSubmit, 
  onOpenGuide, 
  onOpenIdea,
  isCloudConnected = false 
}) {
  const totalProjects = projects.length;
  const uniqueAuthors = new Set(projects.map(p => p.author)).size;
  const totalStars = projects.reduce((acc, curr) => acc + (curr.stars || 0), 0);

  return (
    <section className="hero-clean-section">
      <div className="container">
        
        {/* Simple Label */}
        <div className="hero-class-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span>Jurusan Rekayasa Perangkat Lunak • Kelas 10</span>
          <span style={{ opacity: 0.5 }}>•</span>
          <span style={{ 
            color: isCloudConnected ? '#10b981' : '#f59e0b',
            fontWeight: 700 
          }}>
            {isCloudConnected ? '☁️ Supabase Cloud Aktif' : '💾 Penyimpanan Lokal (Offline)'}
          </span>
        </div>

        {/* Heading */}
        <h1 className="hero-clean-title">
          Showcase Karya Koding Siswa
        </h1>

        {/* Subtitle */}
        <p className="hero-clean-subtitle">
          Koleksi proyek website, game, dan aplikasi yang dibuat dan di-hosting langsung oleh siswa kelas 10 RPL. Klik kartu proyek untuk langsung mengunjungi dan mencoba karyanya secara online.
        </p>

        {/* Action Buttons */}
        <div className="hero-actions-row">
          <button 
            id="hero-btn-submit" 
            type="button" 
            className="btn-hero-primary" 
            onClick={onOpenSubmit}
          >
            <PlusIcon size={16} />
            <span>Daftarkan Proyek Kamu</span>
          </button>

          <button 
            id="hero-btn-guide" 
            type="button" 
            className="btn-hero-secondary" 
            onClick={onOpenGuide}
          >
            <BookOpenIcon size={16} />
            <span>Panduan Hosting Web</span>
          </button>

          <button 
            id="hero-btn-idea" 
            type="button" 
            className="btn-hero-tertiary" 
            onClick={onOpenIdea}
          >
            <SparklesIcon size={15} />
            <span>Inspirasi Ide</span>
          </button>
        </div>

        {/* Minimal Clean Stats */}
        <div className="stats-clean-strip">
          <div className="stat-clean-item">
            <span className="stat-clean-number">{totalProjects}</span>
            <span className="stat-clean-label">Proyek Terdaftar</span>
          </div>

          <div className="stat-clean-divider"></div>

          <div className="stat-clean-item">
            <span className="stat-clean-number">{uniqueAuthors}</span>
            <span className="stat-clean-label">Siswa Kontributor</span>
          </div>

          <div className="stat-clean-divider"></div>

          <div className="stat-clean-item">
            <span className="stat-clean-number">{totalStars}</span>
            <span className="stat-clean-label">Total Apresiasi Bintang</span>
          </div>
        </div>

      </div>
    </section>
  );
}
