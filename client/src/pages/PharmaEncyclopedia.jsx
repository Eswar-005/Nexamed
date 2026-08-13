import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { TabletCard } from '../components/TabletCard';
import { Search, Pill, ShieldAlert, TrendingDown, X } from 'lucide-react';

export const PharmaEncyclopedia = ({ preselectedMedId, initialQuery }) => {
  const { userAllergies } = useAuth();
  const [query, setQuery] = useState(initialQuery || '');
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);
  const [medDetails, setMedDetails] = useState(null);

  const fetchMedicines = (searchQuery = '') => {
    setLoading(true);
    fetch(`/api/medicines?q=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((data) => { setMedicines(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchMedicines(initialQuery || ''); }, [initialQuery]);

  const handleSearch = (e) => { e.preventDefault(); fetchMedicines(query); };

  const openMedicineDetail = (id) => {
    fetch(`/api/medicines/${id}`)
      .then((res) => res.json())
      .then((data) => { setSelectedMed(data.medicine); setMedDetails(data); })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (preselectedMedId) openMedicineDetail(preselectedMedId);
  }, [preselectedMedId]);

  const checkAllergyWarning = (medCompositions) => {
    if (!userAllergies?.length || !medCompositions) return null;
    for (const allergy of userAllergies) {
      const allergenClean = (allergy.allergen || '').toLowerCase();
      for (const comp of medCompositions) {
        const compClean = (comp.chemical_name || '').toLowerCase();
        if (compClean.includes(allergenClean) || allergenClean.includes(compClean)) {
          return { allergen: allergy.allergen, severity: allergy.severity, reaction: allergy.reaction, matchedChemical: comp.chemical_name };
        }
      }
    }
    return null;
  };

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
              <TabletCard med={med} onSelect={openMedicineDetail} />
            </div>
          ))}
        </div>
      )}


      {/* Medicine Detail Modal */}
      {selectedMed && medDetails && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(6,13,26,0.8)', backdropFilter: 'blur(12px)', zIndex: 9999 }}>
          <div className="glass-card-static p-0 w-100 overflow-auto rounded-4"
            style={{ maxWidth: '720px', maxHeight: '90vh', border: '1px solid rgba(2,132,199,0.25)' }}>

            {/* Modal Header */}
            <div className="p-4 pb-3 d-flex justify-content-between align-items-start"
              style={{ borderBottom: '1px solid var(--border-card)', background: 'var(--primary-gradient)', borderRadius: '16px 16px 0 0' }}>
              <div>
                <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '3px 10px', borderRadius: '999px', fontWeight: 700, letterSpacing: '0.04em' }}>
                  {selectedMed.category}
                </span>
                <h3 className="fw-bold mt-2 mb-0" style={{ fontFamily: 'Outfit', color: '#fff', fontSize: '1.4rem' }}>
                  {selectedMed.name}
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>
                  {selectedMed.manufacturer} · {selectedMed.pack_size}
                </span>
              </div>
              <button className="btn-glass rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '38px', height: '38px', padding: 0, flexShrink: 0, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
                onClick={() => setSelectedMed(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="p-4">
              {/* Allergy Warning */}
              {(() => {
                const w = checkAllergyWarning(medDetails.compositions);
                if (!w) return null;
                return (
                  <div className="allergy-alert-shield mb-4">
                    <ShieldAlert size={28} style={{ flexShrink: 0 }} />
                    <div>
                      <strong className="d-block mb-1" style={{ fontSize: '0.95rem' }}>
                        ⚠️ ALLERGY WARNING — CONTAINS {w.matchedChemical.toUpperCase()}
                      </strong>
                      <span style={{ fontSize: '0.82rem' }}>
                        You recorded an allergy to <strong>{w.allergen}</strong>. Reaction: {w.reaction || 'Severe sensitivity'}.
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Price + Rx row */}
              <div className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-4"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>INDICATIVE MRP</div>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.6rem', color: '#059669', lineHeight: 1 }}>
                    ₹{selectedMed.mrp.toFixed(2)}
                  </div>
                </div>
                {selectedMed.prescription_required ? (
                  <span className="badge-danger" style={{ fontSize: '0.78rem' }}>Rx Required — Schedule H</span>
                ) : (
                  <span className="badge-success" style={{ fontSize: '0.78rem' }}>OTC Formulation</span>
                )}
              </div>

              {/* Composition */}
              <div className="mb-4">
                <h6 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '10px' }}>
                  Chemical Composition & Salts
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {medDetails.compositions.map((c) => (
                    <span key={c.id} className="badge-cyan" style={{ fontSize: '0.78rem' }}>
                      {c.chemical_name} ({c.strength})
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h6 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '10px' }}>
                  Medical Uses & Clinical Profile
                </h6>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{selectedMed.description}</p>
              </div>

              {/* Side Effects */}
              {medDetails.sideEffects?.length > 0 && (
                <div className="mb-4">
                  <h6 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '10px' }}>
                    Reported Side Effects & Precautions
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {medDetails.sideEffects.map((se) => {
                      const sev = (se.severity || 'mild').toLowerCase();
                      const color = sev === 'severe' ? '#dc2626' : sev === 'moderate' ? '#d97706' : '#0284c7';
                      const bg = sev === 'severe' ? 'rgba(220,38,38,0.1)' : sev === 'moderate' ? 'rgba(217,119,6,0.1)' : 'rgba(2,132,199,0.1)';
                      return (
                        <span key={se.id} style={{
                          fontSize: '0.78rem', fontWeight: 700, padding: '4px 12px', borderRadius: '999px',
                          background: bg, color: color, border: `1px solid ${color}40`,
                          display: 'inline-flex', alignItems: 'center', gap: '5px'
                        }}>
                          <span>• {se.effect}</span>
                          <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>({se.severity})</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Generic Substitutes */}
              <div className="p-4 rounded-3 mb-4" style={{ background: 'linear-gradient(135deg, rgba(2,132,199,0.06), rgba(13,148,136,0.04))', border: '1px solid rgba(2,132,199,0.2)' }}>
                <h6 className="gradient-text d-flex align-items-center gap-2 mb-3" style={{ fontFamily: 'Outfit', fontWeight: 700 }}>
                  <TrendingDown size={18} />
                  Generic Substitutes — Cost Savings Calculator
                </h6>
                {medDetails.substitutes?.length > 0 ? (
                  <div className="d-flex flex-column gap-2">
                    {medDetails.substitutes.map((sub) => (
                      <div key={sub.id} className="glass-card p-3 d-flex align-items-center justify-content-between">
                        <div>
                          <div className="fw-bold" style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{sub.substitute_name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {sub.manufacturer} · ₹{sub.substitute_mrp.toFixed(2)}
                          </div>
                        </div>
                        <span className="badge-success" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                          Save ₹{sub.saving_amount.toFixed(2)} ({sub.saving_percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                    No registered generic substitutes found for this formulation.
                  </p>
                )}
              </div>

              <button className="btn-glass w-100 py-3 d-flex align-items-center justify-content-center gap-2 rounded-3"
                onClick={() => setSelectedMed(null)}>
                <X size={16} /> Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
