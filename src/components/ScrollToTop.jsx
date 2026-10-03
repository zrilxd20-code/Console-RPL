import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from './Icons';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 380) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      className="btn-scroll-top"
      onClick={scrollToTop}
      title="Kembali ke atas"
      aria-label="Scroll ke atas"
    >
      <ArrowUpIcon size={18} />
    </button>
  );
}
