import React, { useState, useEffect } from 'react';
import { PlusIcon, BookOpenIcon, SparklesIcon } from './Icons';

/**
 * Custom lightweight hook for smooth count-up animation
 */
function useCountUp(targetNumber, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const end = parseInt(targetNumber, 10) || 0;
    if (end === 0) {
      const id = requestAnimationFrame(() => setCount(0));
      return () => cancelAnimationFrame(id);
    }

    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo curve for smooth deceleration
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easeProgress * end);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    const animFrame = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animFrame);
  }, [targetNumber, duration]);

  return count;
}

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

  // Animated numbers
  const animatedProjects = useCountUp(totalProjects);
  const animatedAuthors = useCountUp(uniqueAuthors);
  const animatedStars = useCountUp(totalStars);

  return (
    <section className="hero-clean-section">
      {/* Decorative Floating Code Elements */}
      <div className="hero-float-decor decor-top-left" aria-hidden="true">
        <span className="decor-tag">&lt;code&gt;</span>
        <span className="decor-code">const rpl = "innovative";</span>
      </div>

      <div className="hero-float-decor decor-top-right" aria-hidden="true">
        <span className="decor-sparkle">✦</span>
        <span className="decor-status">deploy: <strong>live</strong></span>
      </div>

      <div className="hero-float-decor decor-bottom-left" aria-hidden="true">
        <span className="decor-comment">// karya koding generasi muda</span>
      </div>

      <div className="hero-float-decor decor-bottom-right" aria-hidden="true">
        <span className="decor-chip">&#123; git: "push" &#125;</span>
      </div>

      <div className="container hero-container-rel">
        
        {/* Simple Label & Cloud Status */}
        <div className="hero-class-tag">
          <span className="hero-badge-pill">Jurusan Rekayasa Perangkat Lunak</span>
          <span className="hero-badge-dot">•</span>
          <span>Kelas 10 RPL</span>
          <span className="hero-badge-dot">•</span>
          <span className={`hero-cloud-status ${isCloudConnected ? 'status-cloud-active' : 'status-cloud-offline'}`}>
            <span className="status-live-indicator"></span>
            {isCloudConnected ? 'Supabase Cloud Aktif' : 'Penyimpanan Lokal'}
          </span>
        </div>

        {/* Heading with Gradient Text */}
        <h1 className="hero-clean-title">
          Showcase Karya <span className="hero-title-gradient">Koding Siswa</span>
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

        {/* Premium Stats Strip with Count-up */}
        <div className="stats-clean-strip">
          <div className="stat-clean-item">
            <div className="stat-icon-wrap stat-icon-blue">
              💻
            </div>
            <div className="stat-text-wrap">
              <span className="stat-clean-number">{animatedProjects}</span>
              <span className="stat-clean-label">Proyek Terdaftar</span>
            </div>
          </div>

          <div className="stat-clean-divider"></div>

          <div className="stat-clean-item">
            <div className="stat-icon-wrap stat-icon-purple">
              👥
            </div>
            <div className="stat-text-wrap">
              <span className="stat-clean-number">{animatedAuthors}</span>
              <span className="stat-clean-label">Siswa Kontributor</span>
            </div>
          </div>

          <div className="stat-clean-divider"></div>

          <div className="stat-clean-item">
            <div className="stat-icon-wrap stat-icon-amber">
              ⭐
            </div>
            <div className="stat-text-wrap">
              <span className="stat-clean-number">{animatedStars}</span>
              <span className="stat-clean-label">Total Apresiasi Bintang</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
