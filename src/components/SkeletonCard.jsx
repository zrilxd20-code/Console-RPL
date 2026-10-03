import React from 'react';

export default function SkeletonCard() {
  return (
    <article className="project-card skeleton-card" aria-hidden="true">
      {/* 16:9 Thumbnail Area */}
      <div className="card-thumb-wrapper skeleton-thumb skeleton-shimmer"></div>

      {/* Card Content */}
      <div className="card-content">
        {/* Author Bar */}
        <div className="card-author-bar">
          <div className="skeleton-avatar skeleton-shimmer"></div>
          <div className="author-meta" style={{ gap: '6px' }}>
            <div className="skeleton-line skeleton-line-sm skeleton-shimmer" style={{ width: '90px' }}></div>
            <div className="skeleton-line skeleton-line-xs skeleton-shimmer" style={{ width: '60px' }}></div>
          </div>
          <div className="skeleton-star-box skeleton-shimmer"></div>
        </div>

        {/* Title */}
        <div className="skeleton-line skeleton-title-line skeleton-shimmer"></div>

        {/* Description Lines */}
        <div className="skeleton-line skeleton-desc-line skeleton-shimmer" style={{ width: '96%' }}></div>
        <div className="skeleton-line skeleton-desc-line skeleton-shimmer" style={{ width: '70%', marginBottom: '14px' }}></div>

        {/* Tech Stack Pills */}
        <div className="card-tags-row">
          <div className="skeleton-pill skeleton-shimmer" style={{ width: '50px' }}></div>
          <div className="skeleton-pill skeleton-shimmer" style={{ width: '65px' }}></div>
          <div className="skeleton-pill skeleton-shimmer" style={{ width: '45px' }}></div>
        </div>

        {/* Action Bar */}
        <div className="card-action-bar" style={{ marginTop: 'auto' }}>
          <div className="skeleton-line skeleton-shimmer" style={{ width: '45px', height: '14px' }}></div>
          <div className="skeleton-pill skeleton-shimmer" style={{ width: '95px', height: '26px' }}></div>
        </div>
      </div>
    </article>
  );
}
