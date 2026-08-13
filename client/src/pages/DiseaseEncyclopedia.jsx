import React, { useState, useEffect } from 'react';
import {
  BookOpen, Search, CheckCircle, XCircle,
  AlertTriangle, Pill, ChevronRight, X
} from 'lucide-react';

const BODY_SYSTEMS = [
  { id: 'all',            label: 'All Diseases',   color: '#0284c7', emoji: '💉' },
  { id: 'Infection',      label: 'Infections',     color: '#dc2626', emoji: '🦠' },
  { id: 'Metabolic',      label: 'Metabolic',      color: '#059669', emoji: '🦠' },
  { id: 'Cardiovascular', label: 'Cardiovascular', color: '#e11d48', emoji: '❤️' },
  { id: 'Neurological',   label: 'Neurological',   color: '#7c3aed', emoji: '🧠' },
  { id: 'Respiratory',    label: 'Respiratory',    color: '#0284c7', emoji: '🫁' },
  { id: 'Gastrointestinal',label: 'GI',            color: '#d97706', emoji: '💩' },
  { id: 'Autoimmune',     label: 'Autoimmune',     color: '#4f46e5', emoji: '🛡️' },
];

export const DiseaseEncyclopedia = ({ onSelectMedicine }) => {
  const [query, setQuery] = useState('');
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [diseaseDetails, setDiseaseDetails] = useState(null);
  const [activeSystem, setActiveSystem] = useState('all');

  const filteredDiseases = diseases.filter(d =>
    activeSystem === 'all' ||
    (d.category || '').toLowerCase().includes(activeSystem.toLowerCase())
  );

  const fetchDiseases = (q = '') => {
    fetch(`/api/diseases?q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => setDiseases(data || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => { fetchDiseases(''); }, []);

  const openDiseaseDetail = (id) => {
    fetch(`/api/diseases/${id}`)
      .then((res) => res.json())
      .then((data) => { setSelectedDisease(data.disease); setDiseaseDetails(data); })
      .catch((err) => console.error(err));
  };

  const getCategoryColor = (cat = '') => {
    const c = cat.toLowerCase();
    if (c.includes('infection') || c.includes('viral')) return { bg: '#dc262618', color: '#dc2626', border: 'rgba(220,38,38,0.25)' };
    if (c.includes('metabolic') || c.includes('diabetes')) return { bg: '#05966918', color: '#059669', border: 'rgba(5,150,105,0.25)' };
    if (c.includes('cardio') || c.includes('heart')) return { bg: '#e1184818', color: '#e11d48', border: 'rgba(225,29,72,0.25)' };
    if (c.includes('neuro') || c.includes('brain')) return { bg: '#7c3aed18', color: '#7c3aed', border: 'rgba(124,58,237,0.25)' };
    if (c.includes('respiratory')) return { bg: '#0284c718', color: '#0284c7', border: 'rgba(2,132,199,0.25)' };
    return { bg: '#d9770618', color: '#d97706', border: 'rgba(217,119,6,0.25)' };
  };

  return (
    <div className="container py-4 page-fade-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-icon" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
          <BookOpen size={24} />
        </div>
        <div>
          <h2 className="fw-bold m-0" style={{ fontFamily: 'Outfit', fontSize: '1.5rem', color: 'var(--text-main)' }}>
            Disease Encyclopedia
          </h2>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: 0 }}>
            ICD-10 disease profiles with symptoms, diet charts, precautions & linked therapies
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="glass-card-static p-4 mb-4">
        <div className="d-flex gap-2">
          <div className="position-relative flex-grow-1">
            <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3"
              style={{ color: 'var(--text-dim)', pointerEvents: 'none' }} />
            <input
              type="text"
              className="glass-input"
              style={{ paddingLeft: '44px' }}
              placeholder="Search by disease name (Dengue, Diabetes, Hypertension, Typhoid)..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); fetchDiseases(e.target.value); }}
            />
          </div>
          <button className="btn-gradient d-flex align-items-center gap-2" style={{ borderRadius: 'var(--radius-md)' }}
            onClick={() => fetchDiseases(query)}>
            <Search size={16} /> Filter
          </button>
        </div>
        {diseases.length > 0 && (
          <div className="mt-3">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                <strong style={{ color: 'var(--primary-cyan)' }}>{filteredDiseases.length}</strong> of {diseases.length} diseases
              </span>
            </div>
            {/* Body System Filters */}
            <div className="d-flex flex-wrap gap-2">
              {BODY_SYSTEMS.map(sys => (
                <button
                  key={sys.id}
                  type="button"
                  className="category-filter-pill"
                  style={{
                    background: activeSystem === sys.id ? `${sys.color}18` : undefined,
                    color: activeSystem === sys.id ? sys.color : undefined,
                    border: activeSystem === sys.id ? `1.5px solid ${sys.color}50` : undefined,
                  }}
                  onClick={() => setActiveSystem(sys.id)}
                >
                  {sys.emoji} {sys.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Disease Cards Grid */}
      <div className="row g-3 mb-4">
        {filteredDiseases.map((d, idx) => {
          const colors = getCategoryColor(d.category);
          return (
            <div key={d.id} className="col-md-6 col-lg-4 animate-fade-up" style={{ animationDelay: `${Math.min(idx * 0.04, 0.4)}s` }}>
              <div className="card-premium p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px',
                      borderRadius: '999px', background: colors.bg, color: colors.color,
                      border: `1px solid ${colors.border}`
                    }}>
                      {d.category}
                    </span>
                    <span style={{
                      fontSize: '0.68rem', fontWeight: 700, padding: '4px 8px', borderRadius: '6px',
                      background: 'var(--bg-input)', color: 'var(--text-dim)', fontFamily: 'Outfit'
                    }}>
                      ICD: {d.icd_code}
                    </span>
                  </div>
                  {d.emergency_signs && (
                    <div className="d-flex align-items-center gap-1 mb-2"
                      style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 700 }}>
                      <AlertTriangle size={12} /> Emergency signs present
                    </div>
                  )}
                  <h5 className="fw-bold mb-2" style={{ fontFamily: 'Outfit', fontSize: '1.05rem', color: 'var(--text-main)' }}>
                    {d.name}
                  </h5>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{d.overview}</p>
                </div>
                <button
                  className="btn-glass d-flex align-items-center justify-content-center gap-1 w-100 mt-3 py-2"
                  style={{ color: 'var(--primary-cyan)', borderColor: 'rgba(2,132,199,0.3)' }}
                  onClick={() => openDiseaseDetail(d.id)}>
                  <span>View Complete Profile</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disease Detail Modal */}
      {selectedDisease && diseaseDetails && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(6,13,26,0.82)', backdropFilter: 'blur(12px)', zIndex: 9999 }}>
          <div className="glass-card-static w-100 overflow-auto rounded-4"
            style={{ maxWidth: '820px', maxHeight: '90vh', border: '1px solid rgba(124,58,237,0.25)' }}>

            {/* Modal Header */}
            <div className="p-4 pb-3 d-flex justify-content-between align-items-start"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: '16px 16px 0 0' }}>
              <div>
                <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '3px 12px', borderRadius: '999px', fontWeight: 700 }}>
                  ICD-10: {selectedDisease.icd_code} · {selectedDisease.category}
                </span>
                <h3 className="fw-bold mt-2 mb-0" style={{ fontFamily: 'Outfit', color: '#fff', fontSize: '1.5rem' }}>
                  {selectedDisease.name}
                </h3>
              </div>
              <button className="d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: '38px', height: '38px', padding: 0, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', cursor: 'pointer', flexShrink: 0 }}
                onClick={() => setSelectedDisease(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="p-4">
              {/* Emergency Signs */}
              {selectedDisease.emergency_signs && (
                <div className="d-flex align-items-start gap-3 p-3 mb-4 rounded-3"
                  style={{ background: 'rgba(220,38,38,0.08)', border: '1.5px solid rgba(220,38,38,0.3)' }}>
                  <AlertTriangle size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#dc2626', fontSize: '0.88rem', display: 'block', marginBottom: '4px' }}>
                      EMERGENCY WARNING SIGNS
                    </strong>
                    <span style={{ fontSize: '0.83rem', color: '#dc2626' }}>{selectedDisease.emergency_signs}</span>
                  </div>
                </div>
              )}

              {/* Overview */}
              <div className="mb-4">
                <h6 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
                  Medical Definition & Etiology
                </h6>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '8px' }}>
                  {selectedDisease.definition}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                  <strong style={{ color: 'var(--text-main)' }}>Causes / Risk Factors: </strong>
                  {selectedDisease.causes}
                </p>
              </div>

              {/* Symptoms */}
              {diseaseDetails.symptoms?.length > 0 && (
                <div className="mb-4">
                  <h6 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
                    Characteristic Symptoms
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {diseaseDetails.symptoms.map((s) => (
                      <span key={s.id} className="badge-cyan">{s.name} ({s.body_region})</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Diet */}
              {diseaseDetails.diet?.length > 0 && (
                <div className="mb-4">
                  <h6 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                    Dietary Guidelines & Nutrition Plan
                  </h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="glass-card p-3 h-100" style={{ borderLeft: '3px solid #059669' }}>
                        <div className="d-flex align-items-center gap-2 mb-2" style={{ color: '#059669', fontWeight: 700, fontSize: '0.85rem' }}>
                          <CheckCircle size={16} /> Recommended Foods
                        </div>
                        <ul className="list-unstyled m-0 d-flex flex-column gap-1">
                          {diseaseDetails.diet.filter((x) => x.type === 'recommended').map((item) => (
                            <li key={item.id} style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                              <span style={{ color: '#059669', marginRight: '6px' }}>•</span>{item.diet_item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="glass-card p-3 h-100" style={{ borderLeft: '3px solid #dc2626' }}>
                        <div className="d-flex align-items-center gap-2 mb-2" style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.85rem' }}>
                          <XCircle size={16} /> Foods to Avoid
                        </div>
                        <ul className="list-unstyled m-0 d-flex flex-column gap-1">
                          {diseaseDetails.diet.filter((x) => x.type === 'avoid').map((item) => (
                            <li key={item.id} style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                              <span style={{ color: '#dc2626', marginRight: '6px' }}>•</span>{item.diet_item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Precautions */}
              {diseaseDetails.precautions?.length > 0 && (
                <div className="mb-4">
                  <h6 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-main)', marginBottom: '10px' }}>
                    Actionable Care & Precautions
                  </h6>
                  <ol className="m-0 ps-4 d-flex flex-column gap-2">
                    {diseaseDetails.precautions.map((p) => (
                      <li key={p.id} style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{p.precaution}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Linked Medicines */}
              {diseaseDetails.linkedMedicines?.length > 0 && (
                <div className="p-4 rounded-3 mb-4"
                  style={{ background: 'linear-gradient(135deg, rgba(2,132,199,0.06), rgba(13,148,136,0.04))', border: '1px solid rgba(2,132,199,0.2)' }}>
                  <h6 className="gradient-text d-flex align-items-center gap-2 mb-3" style={{ fontFamily: 'Outfit', fontWeight: 700 }}>
                    <Pill size={18} /> Commonly Prescribed Medicines
                  </h6>
                  <div className="d-flex flex-column gap-2">
                    {diseaseDetails.linkedMedicines.map((m) => (
                      <button key={m.id} type="button" className="glass-card p-3 d-flex align-items-center justify-content-between w-100 text-start border-0"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onSelectMedicine(m.id)}>
                        <div>
                          <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{m.name}</strong>
                          <div style={{ fontSize: '0.77rem', color: 'var(--text-muted)' }}>{m.usage_note}</div>
                        </div>
                        <span className="d-flex align-items-center gap-2">
                          <span className="badge-teal" style={{ fontSize: '0.78rem' }}>₹{m.mrp.toFixed(2)}</span>
                          <ChevronRight size={16} style={{ color: 'var(--text-dim)' }} />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button className="btn-glass w-100 py-3 d-flex align-items-center justify-content-center gap-2 rounded-3"
                onClick={() => setSelectedDisease(null)}>
                <X size={16} /> Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
