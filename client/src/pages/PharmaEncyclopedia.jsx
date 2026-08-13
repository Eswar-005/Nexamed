import React, { useState, useEffect } from 'react';
import { TabletCard } from '../components/TabletCard';
import { Search, Pill, X } from 'lucide-react';

export const PharmaEncyclopedia = ({ initialQuery, onSelectMedicine }) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMedicines = (searchQuery = '') => {
    setLoading(true);
    fetch(`/api/medicines?q=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((data) => { setMedicines(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchMedicines(initialQuery || ''); }, [initialQuery]);

  const handleSearch = (e) => { e.preventDefault(); fetchMedicines(query); };

  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const PHARMA_CATEGORIES = [
    { id: 'all',             label: 'All Medicines', color: '#0284c7' },
    { id: 'Analgesic',       label: '🌡️ Fever & Pain',   color: '#0284c7' },
    { id: 'Antacid',         label: '💊 Antacids',        color: '#d97706' },
    { id: 'Antibiotic',      label: '🔬 Antibiotics',     color: '#7c3aed' },
    { id: 'Antidiabetic',    label: '🩸 Diabetes',        color: '#059669' },
    { id: 'Antihypertensive',label: '❤️ Cardiac',         color: '#dc2626' },
    { id: 'Antihistamine',   label: '🌿 Allergy',         color: '#f59e0b' },
    { id: 'Vitamin',         label: '✨ Vitamins',         color: '#10b981' },
  ];

  const filteredMedicines = medicines
    .filter(m => activeCategory === 'all' || (m.category || '').toLowerCase().includes(activeCategory.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.mrp - b.mrp;
      if (sortBy === 'price_desc') return b.mrp - a.mrp;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="container py-4 page-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-icon">
          <Pill size={24} />
        </div>
        <div>
          <h2 className="fw-bold m-0" style={{ fontFamily: 'Outfit', fontSize: '1.5rem', color: 'var(--text-main)' }}>
            Pharma Encyclopedia
          </h2>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: 0 }}>
            Search 500+ Indian medicines by name, company, salt, category, or price
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-card-static p-4 mb-4">
        <form onSubmit={handleSearch}>
          <div className="d-flex gap-2">
            <div className="position-relative flex-grow-1">
              <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: 'var(--text-dim)', pointerEvents: 'none' }} />
              <input
                type="text"
                className="glass-input"
                style={{ paddingLeft: '44px' }}
                placeholder="Search tablet name (Dolo 650), company (Cipla), salt (Paracetamol), category (Antacid)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-gradient d-flex align-items-center gap-2"
              style={{ whiteSpace: 'nowrap', borderRadius: 'var(--radius-md)' }}>
              <Search size={16} /> Search
            </button>
            {query && (
              <button type="button" className="btn-glass d-flex align-items-center gap-1"
                style={{ borderRadius: 'var(--radius-md)' }}
                onClick={() => { setQuery(''); fetchMedicines(''); }}>
                <X size={16} /> Clear
              </button>
            )}
          </div>
        </form>
          {medicines.length > 0 && (
            <div className="mt-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                <strong style={{ color: 'var(--primary-cyan)' }}>{filteredMedicines.length}</strong> of {medicines.length} medicines
              </span>
              <select
                className="glass-input"
                style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort: A–Z</option>
                <option value="price_asc">Sort: Price ↑</option>
                <option value="price_desc">Sort: Price ↓</option>
              </select>
            </div>
          )}

          {/* Category Quick Filter */}
          <div className="d-flex flex-wrap gap-2 mt-3">
            {PHARMA_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                className="category-filter-pill"
                style={{
                  background: activeCategory === cat.id ? `${cat.color}18` : undefined,
                  color: activeCategory === cat.id ? cat.color : undefined,
                  border: activeCategory === cat.id ? `1.5px solid ${cat.color}50` : undefined,
                  boxShadow: activeCategory === cat.id ? `0 2px 8px ${cat.color}30` : undefined,
                }}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        {medicines.length > 0 && query && (
          <div className="mt-2" style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Showing results for "<em>{query}</em>"
          </div>
        )}
      </div>

      {/* Medicine Cards Grid */}
      {loading ? (
        <div className="row g-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="col-md-6 col-lg-4">
              <div className="glass-card-static p-4" style={{ height: '220px' }}>
                <div className="shimmer-skeleton rounded mb-3" style={{ height: '20px', width: '60%' }} />
                <div className="shimmer-skeleton rounded mb-2" style={{ height: '30px', width: '85%' }} />
                <div className="shimmer-skeleton rounded mb-2" style={{ height: '16px', width: '70%' }} />
                <div className="shimmer-skeleton rounded" style={{ height: '14px', width: '50%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : filteredMedicines.length === 0 ? (
        <div className="text-center py-5 glass-card-static">
          <Pill size={48} style={{ color: 'var(--text-light)', marginBottom: '12px' }} />
          <h5 style={{ fontFamily: 'Outfit', color: 'var(--text-main)' }}>No medicines found</h5>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Try a different search term or category</p>
        </div>
      ) : (
        <div className="row g-3 mb-4">
          {filteredMedicines.map((med, idx) => (
            <div key={med.id} className="col-md-6 col-lg-4 animate-fade-up" style={{ animationDelay: `${Math.min(idx * 0.04, 0.4)}s` }}>
              <TabletCard med={med} onSelect={onSelectMedicine} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
