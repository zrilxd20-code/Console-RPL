import React from 'react';
import { 
  CodeIcon, 
  SparklesIcon, 
  PlusIcon, 
  BookOpenIcon, 
  SearchIcon, 
  XIcon, 
  MoonIcon, 
  SunIcon 
} from './Icons';

export default function Navbar({ 
  searchQuery, 
  setSearchQuery, 
  onOpenSubmit, 
  onOpenGuide, 
  onOpenIdea, 
  theme, 
  toggleTheme,
  totalProjects 
}) {
  return (
    <header className="navbar-root">
      <div className="container">
        <div className="navbar-inner">
          
          {/* Brand Logo */}
          <div className="navbar-brand" onClick={() => setSearchQuery('')}>
            <div className="brand-logo-icon">
              <CodeIcon size={18} />
            </div>
            <div className="brand-titles">
              <span className="brand-main-name">Showcase X RPL</span>
              <span className="brand-sub-badge">{totalProjects} Proyek</span>
            </div>
          </div>

          {/* Search Box */}
          <div className="navbar-search-box">
            <SearchIcon size={15} className="search-input-icon" />
            <input 
              id="navbar-search-input"
              type="text"
              placeholder="Cari karya siswa, judul, atau teknologi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                type="button"
                className="btn-clear-search" 
                onClick={() => setSearchQuery('')}
                title="Hapus pencarian"
              >
                <XIcon size={14} />
              </button>
            )}
          </div>

          {/* Nav Actions */}
          <div className="navbar-actions-group">
            <button 
              id="btn-nav-ide"
              type="button"
              className="btn-nav-link" 
              onClick={onOpenIdea}
              title="Inspirasi ide project"
            >
              <SparklesIcon size={15} />
              <span className="hide-on-small">Inspirasi Ide</span>
            </button>

            <button 
              id="btn-nav-guide"
              type="button"
              className="btn-nav-link" 
              onClick={onOpenGuide}
              title="Panduan cara hosting web"
            >
              <BookOpenIcon size={15} />
              <span className="hide-on-small">Panduan</span>
            </button>

            <button 
              id="btn-nav-submit"
              type="button"
              className="btn-nav-action" 
              onClick={onOpenSubmit}
            >
              <PlusIcon size={15} />
              <span>Daftarkan Proyek</span>
            </button>

            {/* Theme Switcher */}
            <button 
              id="btn-theme-toggle"
              type="button"
              className="btn-theme-clean" 
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            >
              {theme === 'dark' ? <SunIcon size={16} /> : <MoonIcon size={16} />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
