import React from 'react';
import { 
  SparklesIcon, 
  PlusIcon, 
  BookOpenIcon, 
  SearchIcon, 
  UserIcon, 
  GraduationCapIcon 
} from './Icons';

export default function MobileBottomNav({
  onOpenSubmit,
  onOpenGuide,
  onOpenIdea,
  onOpenRoleSelect,
  userRole = 'guest',
  onFocusSearch
}) {
  const isStudent = userRole === 'student';

  return (
    <nav className="mobile-bottom-nav" aria-label="Navigasi Bawah">
      {/* 1. Katalog / Cari */}
      <button 
        id="btn-bottom-katalog"
        type="button" 
        className="bottom-nav-item"
        onClick={onFocusSearch}
        title="Jelajahi Katalog Proyek"
      >
        <div className="bottom-nav-icon">
          <SearchIcon size={19} />
        </div>
        <span className="bottom-nav-label">Katalog</span>
      </button>

      {/* 2. Inspirasi Ide */}
      <button 
        id="btn-bottom-ide"
        type="button" 
        className="bottom-nav-item"
        onClick={onOpenIdea}
        title="Inspirasi Ide Proyek"
      >
        <div className="bottom-nav-icon">
          <SparklesIcon size={19} />
        </div>
        <span className="bottom-nav-label">Ide</span>
      </button>

      {/* 3. Center Highlight Action: Daftarkan Proyek */}
      <button 
        id="btn-bottom-submit"
        type="button" 
        className="bottom-nav-item bottom-nav-center-action"
        onClick={onOpenSubmit}
        title="Daftarkan Proyek Baru"
      >
        <div className="bottom-nav-center-bubble">
          <PlusIcon size={20} />
        </div>
        <span className="bottom-nav-label">Daftarkan</span>
      </button>

      {/* 4. Panduan Hosting */}
      <button 
        id="btn-bottom-guide"
        type="button" 
        className="bottom-nav-item"
        onClick={onOpenGuide}
        title="Panduan Hosting Website"
      >
        <div className="bottom-nav-icon">
          <BookOpenIcon size={19} />
        </div>
        <span className="bottom-nav-label">Panduan</span>
      </button>

      {/* 5. Role / Akses */}
      <button 
        id="btn-bottom-role"
        type="button" 
        className={`bottom-nav-item ${isStudent ? 'is-student-active' : ''}`}
        onClick={onOpenRoleSelect}
        title={`Mode: ${isStudent ? 'Siswa RPL' : 'Tamu'}`}
      >
        <div className="bottom-nav-icon">
          {isStudent ? <GraduationCapIcon size={19} /> : <UserIcon size={19} />}
          <span className={`bottom-role-dot ${isStudent ? 'dot-student' : 'dot-guest'}`}></span>
        </div>
        <span className="bottom-nav-label">{isStudent ? 'Siswa' : 'Tamu'}</span>
      </button>
    </nav>
  );
}
