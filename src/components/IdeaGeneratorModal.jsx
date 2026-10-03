import React, { useState, useEffect } from 'react';
import { XIcon, RefreshCwIcon, CheckIcon, PlusIcon, ShareIcon } from './Icons';
import { PROJECT_IDEAS } from '../data/projectIdeas';

export default function IdeaGeneratorModal({ onClose, onUseIdea }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const currentIdea = PROJECT_IDEAS[currentIndex] || PROJECT_IDEAS[0];

  const handleRandomize = () => {
    setIsSpinning(true);
    let counter = 0;
    const interval = setInterval(() => {
      setCurrentIndex(Math.floor(Math.random() * PROJECT_IDEAS.length));
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 60);
  };

  const handleCopy = () => {
    const text = `${currentIdea.title} (${currentIdea.category}) - ${currentIdea.summary}\nTeknologi: ${currentIdea.tech.join(', ')}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content modal-idea-clean" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="modal-header-simple">
          <div>
            <div className="detail-tags-top">
              <span className="clean-pill">🎲 Ide Project</span>
              <span className="clean-date">Tugas & Portofolio Siswa X RPL</span>
            </div>
            <h2 className="modal-heading-text">Inspirasi Ide Karya Koding</h2>
            <p className="modal-lead-text">
              Bingung mau bikin karya koding apa? Tekan tombol acak untuk mendapatkan ide tugas akhir atau portofolio yang cocok untuk level kelas 10!
            </p>
          </div>
          <button type="button" className="btn-close-clean" onClick={onClose} title="Tutup Modal">
            <XIcon size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="idea-body-clean">
          <div className={`idea-card-clean ${isSpinning ? 'spinning' : ''}`}>
            
            {/* Top Badges */}
            <div className="idea-top-badges">
              <span className="idea-category-pill">{currentIdea.category}</span>
              <span className={`idea-diff-pill ${currentIdea.difficulty?.toLowerCase() === 'intermediate' ? 'intermediate' : ''}`}>
                Level: {currentIdea.difficulty}
              </span>
            </div>

            {/* Title */}
            <h3 className="idea-heading-title">{currentIdea.title}</h3>
            
            {/* Summary */}
            <p className="idea-summary-text">{currentIdea.summary}</p>

            {/* Tech & Benefits Container */}
            <div className="idea-details-box">
              <div className="idea-box-label">🛠️ Rekomendasi Teknologi:</div>
              <div className="idea-tech-chips-wrap">
                {currentIdea.tech.map((t, idx) => (
                  <span key={idx} className="idea-tech-chip">{t}</span>
                ))}
              </div>

              <div className="idea-benefit-alert">
                <strong>💡 Manfaat Pembelajaran:</strong> {currentIdea.benefits}
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="idea-footer-actions">
          <button 
            id="btn-spin-idea"
            type="button"
            className="btn-hero-primary"
            onClick={handleRandomize}
            disabled={isSpinning}
          >
            <RefreshCwIcon size={15} className={isSpinning ? 'spin-animation' : ''} />
            <span>{isSpinning ? 'Mengacak Ide...' : 'Acak Ide Lain'}</span>
          </button>

          <div className="idea-footer-right">
            <button 
              type="button"
              className="btn-hero-secondary"
              onClick={handleCopy}
              title="Salin rincian ide ke clipboard"
            >
              {copied ? <CheckIcon size={15} /> : <ShareIcon size={15} />}
              <span>{copied ? 'Ide Disalin!' : 'Salin Ide'}</span>
            </button>

            <button 
              type="button"
              className="btn-submit-main"
              onClick={() => {
                onUseIdea(currentIdea);
                onClose();
              }}
              title="Buka form pendaftaran proyek dengan judul & teknologi ide ini"
            >
              <PlusIcon size={15} />
              <span>Gunakan Ide Ini</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
