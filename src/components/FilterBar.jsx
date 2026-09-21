import React from 'react';
import { FilterIcon, XIcon } from './Icons';

export default function FilterBar({ 
  selectedCategory, 
  setSelectedCategory,
  selectedClass,
  setSelectedClass,
  sortBy,
  setSortBy,
  counts
}) {
  const categories = [
    { id: 'all', label: 'Semua', count: counts.all || 0 },
    { id: 'webapp', label: 'Web App', count: counts.webapp || 0 },
    { id: 'game', label: 'Game Web', count: counts.game || 0 },
    { id: 'portfolio', label: 'Portofolio', count: counts.portfolio || 0 },
    { id: 'landing', label: 'Landing Page', count: counts.landing || 0 },
    { id: 'utility', label: 'Tools / Utility', count: counts.utility || 0 },
  ];

  const hasActiveFilters = selectedCategory !== 'all' || selectedClass !== 'all';

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedClass('all');
  };

  return (
    <div className="filter-clean-root">
      
      {/* Category Pills */}
      <div className="filter-pills-row">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`filter-pill-item ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span>{cat.label}</span>
            <span className="pill-count-tag">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* Sub Filters & Sorter */}
      <div className="filter-controls-row">
        
        <div className="filter-selects-wrap">
          <FilterIcon size={14} className="filter-icon-muted" />
          
          <select 
            id="select-filter-class"
            className="clean-select"
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="all">Semua Kelas</option>
            <option value="X RPL 1">X RPL 1</option>
            <option value="X RPL 2">X RPL 2</option>
            <option value="X RPL 3">X RPL 3</option>
          </select>

          {hasActiveFilters && (
            <button 
              type="button"
              className="btn-reset-clean" 
              onClick={handleResetFilters}
            >
              <XIcon size={12} /> Reset Filter
            </button>
          )}
        </div>

        <div className="sort-select-wrap">
          <span className="sort-label-muted">Urutan:</span>
          <select 
            id="select-sort-by"
            className="clean-select"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="stars">⭐ Terpopuler</option>
            <option value="latest">✨ Terbaru</option>
            <option value="title">🔤 Abjad (A-Z)</option>
          </select>
        </div>

      </div>

    </div>
  );
}
