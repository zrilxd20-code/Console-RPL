import React, { useState } from 'react';
import { ExternalLinkIcon, StarIcon, EditIcon, ShieldIcon, GraduationCapIcon } from './Icons';
import { sanitizeUrl } from '../utils/security';

export default function ProjectCard({ 
  project, 
  index = 0,
  onSelect, 
  onEdit, 
  onToggleStar, 
  isStarred,
  userRole = 'guest'
}) {
  const [isPopping, setIsPopping] = useState(false);
  const safeDemoUrl = sanitizeUrl(project.demoUrl);

  const handleOpenLive = (e) => {
    e.stopPropagation();
    if (safeDemoUrl && safeDemoUrl !== '#') {
      window.open(safeDemoUrl, '_blank', 'noopener,noreferrer');
    } else {
      onSelect(project);
    }
  };

  const handleStarClick = (e) => {
    e.stopPropagation();
    setIsPopping(true);
    setTimeout(() => setIsPopping(false), 550);
    onToggleStar(project.id);
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'webapp': return 'Web App';
      case 'game': return 'Game Web';
      case 'portfolio': return 'Portofolio';
      case 'landing': return 'Landing Page';
      case 'utility': return 'Tools / Utility';
      default: return project.categoryLabel || 'Web';
    }
  };

  const isWip = project.status === 'development';
  const isStudent = userRole === 'student';

  // Privasi: Jika Siswa, tampilkan nama asli + alias. Jika Tamu, HANYA nama samaran/alias!
  const displayName = isStudent 
    ? (project.realName || project.author) 
    : project.author;

  return (
    <article 
      className="project-card" 
      onClick={() => onSelect(project)}
      style={{ animationDelay: `${Math.min(index * 60, 500)}ms` }}
    >
      
      {/* 16:9 Thumbnail Image */}
      <div className="card-thumb-wrapper" onClick={handleOpenLive} title="Klik untuk langsung buka website">
        {project.thumbnailUrl ? (
          <img 
            src={project.thumbnailUrl} 
            alt={project.title}
            className="card-thumb-img"
            loading="lazy"
          />
        ) : (
          <div className="card-thumb-fallback">
            <span className="fallback-category">{getCategoryLabel(project.category)}</span>
            <span className="fallback-title">{project.title}</span>
            <span className="fallback-hint">Klik untuk buka web ↗</span>
          </div>
        )}

        {/* Gradient Overlay for Text Readability & Cinematic Depth */}
        <div className="card-thumb-gradient" aria-hidden="true"></div>

        <div className="thumb-hover-overlay">
          <span className="btn-visit-badge">
            Buka Website <ExternalLinkIcon size={13} />
          </span>
        </div>

        {/* Category Tag (Top Left) */}
        <div className={`thumb-category-tag cat-${project.category || 'webapp'}`}>
          {getCategoryLabel(project.category)}
        </div>

        {/* Development Status Badge (Top Right) */}
        <div className={`thumb-status-tag ${isWip ? 'status-wip' : 'status-live'}`}>
          <span className="status-dot"></span>
          <span>{isWip ? 'Pengembangan' : 'Live'}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-content">
        
        {/* Author Header */}
        <div className="card-author-bar">
          <img 
            src={project.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"} 
            alt={displayName} 
            className="author-avatar-sm"
          />
          <div className="author-meta">
            <div className="author-name-row">
              <span className="author-name-text" title={isStudent ? `Nama Asli: ${project.realName || project.author}` : `Nama Samaran: ${project.author}`}>
                {displayName}
              </span>
              {isStudent ? (
                <span className="badge-role-tag student-badge" title="Terverifikasi Siswa X RPL">
                  <GraduationCapIcon size={11} /> Siswa
                </span>
              ) : (
                <span className="badge-role-tag guest-badge" title="Nama asli siswa dirahasiakan untuk tamu">
                  <ShieldIcon size={10} /> Alias
                </span>
              )}
            </div>
            <span className="author-class-sub">
              {project.studentClass} {isStudent && project.author && project.author !== project.realName ? `• @${project.author}` : ''}
            </span>
          </div>

          {/* Star Button with Pop Animation & Particle Burst */}
          <button 
            type="button"
            className={`btn-star-subtle ${isStarred ? 'active' : ''} ${isPopping ? 'popping' : ''}`}
            onClick={handleStarClick}
            title={isStarred ? "Batal menyukai" : "Apresiasi karya ini"}
          >
            <span className="star-icon-wrap">
              <StarIcon size={14} fill={isStarred} />
              {isPopping && (
                <span className="star-burst-particles" aria-hidden="true">
                  <span className="star-p star-p1"></span>
                  <span className="star-p star-p2"></span>
                  <span className="star-p star-p3"></span>
                  <span className="star-p star-p4"></span>
                  <span className="star-p star-p5"></span>
                  <span className="star-p star-p6"></span>
                </span>
              )}
            </span>
            <span>{project.stars || 0}</span>
          </button>
        </div>

        {/* Project Title */}
        <h3 className="card-heading" title={project.title} onClick={handleOpenLive}>
          {project.title}
        </h3>

        {/* Description */}
        <p className="card-desc-text">
          {project.description}
        </p>

        {/* Tech Badges */}
        <div className="card-tags-row">
          {project.techStack?.slice(0, 3).map((tech, idx) => (
            <span key={idx} className="tag-pill">
              {tech}
            </span>
          ))}
          {project.techStack?.length > 3 && (
            <span className="tag-pill-more">+{project.techStack.length - 3}</span>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="card-action-bar" onClick={(e) => e.stopPropagation()}>
          <div className="action-bar-left">
            <button 
              type="button" 
              className="btn-text-detail"
              onClick={() => onSelect(project)}
            >
              Detail
            </button>
            {isStudent && (
              <button 
                type="button" 
                className="btn-text-edit"
                onClick={() => onEdit(project)}
                title="Edit atau perbarui link/foto proyek ini"
              >
                <EditIcon size={13} /> Edit
              </button>
            )}
          </div>

          <a 
            href={safeDemoUrl && safeDemoUrl !== '#' ? safeDemoUrl : "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-launch"
            onClick={(e) => {
              if (!safeDemoUrl || safeDemoUrl === '#') {
                e.preventDefault();
                onSelect(project);
              }
            }}
          >
            <span>Kunjungi Web</span>
            <ExternalLinkIcon size={13} />
          </a>
        </div>

      </div>

    </article>
  );
}
