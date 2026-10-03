import React, { useState } from 'react';
import { 
  XIcon, 
  GithubIcon, 
  ExternalLinkIcon, 
  StarIcon, 
  ShareIcon, 
  CheckIcon,
  EditIcon,
  TrashIcon,
  ShieldIcon,
  GraduationCapIcon
} from './Icons';
import { sanitizeUrl } from '../utils/security';

export default function ProjectDetailModal({ 
  project, 
  onClose, 
  onEdit, 
  onDelete, 
  onToggleStar, 
  isStarred,
  userRole = 'guest',
  onSwitchRole
}) {
  const [copied, setCopied] = useState(false);

  // Close modal on Escape key press
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const isWip = project?.status === 'development';
  const isStudent = userRole === 'student';
  const safeDemoUrl = sanitizeUrl(project?.demoUrl);
  const safeGithubUrl = project?.githubUrl ? sanitizeUrl(project.githubUrl) : null;

  if (!project) return null;

  const displayName = isStudent 
    ? (project.realName || project.author) 
    : project.author;

  const handleShare = () => {
    const shareText = (safeDemoUrl && safeDemoUrl !== '#')
      ? safeDemoUrl
      : `${project.title} karya ${displayName}`;
    
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareText);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenLive = () => {
    if (safeDemoUrl && safeDemoUrl !== '#') {
      window.open(safeDemoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDelete = () => {
    if (project.editPin) {
      const enteredPin = window.prompt(`Masukkan PIN Pengaman Proyek (4 digit) untuk menghapus "${project.title}":`);
      if (!enteredPin || enteredPin.trim() !== project.editPin.trim()) {
        alert("PIN Pengaman salah! Proyek tidak dapat dihapus.");
        return;
      }
    } else {
      if (!window.confirm(`Apakah Anda yakin ingin menghapus proyek "${project.title}" karya ${displayName}?`)) {
        return;
      }
    }

    if (onDelete) {
      onDelete(project.id);
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content modal-detail-clean" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="detail-modal-header">
          <div className="detail-header-text">
            <div className="detail-tags-top">
              <span className="clean-pill">{project.categoryLabel || project.category}</span>
              <span className={`clean-status-pill ${isWip ? 'pill-wip' : 'pill-live'}`}>
                {isWip ? '🟡 Tahap Pengembangan' : '🟢 Selesai / Live'}
              </span>
              <span className="clean-date">{project.submissionDate}</span>
            </div>
            <h2 className="detail-title">{project.title}</h2>
            
            <div className="detail-author-line">
              <img 
                src={project.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"} 
                alt={displayName} 
                className="author-avatar-sm"
              />
              <div className="detail-author-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="author-name-text">{displayName}</span>
                  {isStudent ? (
                    <span className="badge-role-tag student-badge">
                      <GraduationCapIcon size={11} /> Siswa Terverifikasi
                    </span>
                  ) : (
                    <span className="badge-role-tag guest-badge">
                      <ShieldIcon size={11} /> Nama Samaran (Privasi Aktif)
                    </span>
                  )}
                </div>
                <div className="author-class-sub">
                  <span>{project.studentClass}</span>
                  {isStudent && project.author && project.author !== project.realName && (
                    <span> • Alias: @{project.author}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Privacy notice for guest */}
            {!isStudent && (
              <div className="detail-guest-privacy-banner">
                <ShieldIcon size={14} className="text-emerald" />
                <span>
                  <b>Privasi Siswa:</b> Nama asli disembunyikan dalam Mode Tamu. {' '}
                  {onSwitchRole && (
                    <button type="button" className="btn-link-inline" onClick={onSwitchRole}>
                      Beralih ke Mode Siswa
                    </button>
                  )}
                </span>
              </div>
            )}
          </div>

          <div className="detail-header-actions">
            {isStudent && (
              <>
                <button 
                  type="button"
                  className="btn-icon-subtle"
                  onClick={() => {
                    onClose();
                    onEdit(project);
                  }}
                  title="Edit / Perbarui Proyek Ini"
                >
                  <EditIcon size={15} />
                </button>

                <button 
                  type="button"
                  className="btn-icon-subtle btn-icon-danger"
                  onClick={handleDelete}
                  title="Hapus Proyek Ini"
                >
                  <TrashIcon size={15} />
                </button>
              </>
            )}

            <button 
              type="button"
              className={`btn-star-subtle ${isStarred ? 'active' : ''}`}
              onClick={() => onToggleStar(project.id)}
            >
              <StarIcon size={15} fill={isStarred} />
              <span>{project.stars || 0}</span>
            </button>

            <button 
              type="button"
              className="btn-icon-subtle"
              onClick={handleShare}
              title="Salin link"
            >
              {copied ? <CheckIcon size={15} /> : <ShareIcon size={15} />}
            </button>

            <button type="button" className="btn-close-clean" onClick={onClose}>
              <XIcon size={18} />
            </button>
          </div>
        </div>

        {/* Big Visual Preview / Screenshot */}
        <div className="detail-preview-frame" onClick={handleOpenLive}>
          {project.thumbnailUrl ? (
            <img 
              src={project.thumbnailUrl} 
              alt={project.title}
              className="detail-preview-image"
            />
          ) : (
            <div className="detail-preview-placeholder">
              <span>Pratinjau Screenshot Tidak Tersedia</span>
            </div>
          )}

          <div className="detail-preview-overlay">
            {safeDemoUrl && safeDemoUrl !== '#' ? (
              <button type="button" className="btn-launch-big">
                Buka Website Proyek di Tab Baru <ExternalLinkIcon size={16} />
              </button>
            ) : (
              <span className="btn-launch-big" style={{ opacity: 0.8, cursor: 'default' }}>
                Link Website Belum Tersedia
              </span>
            )}
          </div>
        </div>

        {/* Content Info */}
        <div className="detail-body-info">
          
          <div className="detail-info-left">
            <h4 className="subheading-clean">Tentang Proyek</h4>
            <p className="detail-desc-paragraph">{project.description}</p>

            <h4 className="subheading-clean mt-4">Teknologi yang Digunakan</h4>
            <div className="tags-container">
              {project.techStack?.map((tech, idx) => (
                <span key={idx} className="tag-pill-clean">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="detail-info-right">
            <div className="detail-link-box">
              <span className="link-box-title">Tautan Resmi Proyek:</span>
              
              {safeDemoUrl && safeDemoUrl !== '#' && (
                <a 
                  href={safeDemoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-direct-link"
                >
                  <span>Kunjungi Website Proyek</span>
                  <ExternalLinkIcon size={14} />
                </a>
              )}

              {safeGithubUrl && safeGithubUrl !== '#' && (
                <a 
                  href={safeGithubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-github-link"
                >
                  <GithubIcon size={15} />
                  <span>Source Code (GitHub)</span>
                </a>
              )}

              <button 
                type="button" 
                className="btn-edit-secondary"
                onClick={() => {
                  onClose();
                  onEdit(project);
                }}
              >
                <EditIcon size={14} />
                <span>Edit / Timpa Link & Foto</span>
              </button>

              <button 
                type="button" 
                className="btn-delete-link"
                onClick={handleDelete}
                title="Hapus proyek ini dari perpustakaan"
              >
                <TrashIcon size={14} />
                <span>Hapus Proyek</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
