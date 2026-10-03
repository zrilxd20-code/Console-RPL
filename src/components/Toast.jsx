import React, { useEffect } from 'react';
import { CheckCircleIcon } from './Icons';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`toast-notification-root toast-${toast.type || 'success'}`} role="alert">
      <div className="toast-icon-wrapper">
        <CheckCircleIcon size={18} />
      </div>
      <div className="toast-message-content">
        {toast.message}
      </div>
      <button 
        type="button" 
        className="toast-btn-close" 
        onClick={onClose}
        aria-label="Tutup notifikasi"
      >
        ✕
      </button>
    </div>
  );
}
