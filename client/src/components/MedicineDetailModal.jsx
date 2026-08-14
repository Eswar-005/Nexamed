import React from 'react';
import { useAuth } from '../context/AuthContext';
import { X, ShieldAlert, TrendingDown } from 'lucide-react';

const checkAllergyWarning = (userAllergies, medCompositions) => {
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

export const MedicineDetailModal = ({ selectedMed, medDetails, onClose }) => {
  const { userAllergies } = useAuth();

  if (!selectedMed || !medDetails) return null;

  const allergyWarning = checkAllergyWarning(userAllergies, medDetails.compositions);

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ backgroundColor: 'rgba(6,13,26,0.8)', backdropFilter: 'blur(12px)', zIndex: 10000 }}>
      <div className="glass-card-static p-0 w-100 overflow-auto rounded-4"
        style={{ maxWidth: '720px', maxHeight: '85vh', border: '1px solid rgba(2,132,199,0.25)' }}>

        {/* Modal Header */}
        <div className="p-4 pb-3 d-flex justify-content-between align-items-start"
          style={{ borderBottom: '1px solid var(--border-card)', background: 'var(--primary-gradient)', borderRadius: '16px 16px 0 0' }}>
          <div className="d-flex align-items-center gap-3">
            {selectedMed.image_url && (
              <div style={{
                width: '64px', height: '64px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0,
                background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(255,255,255,0.4)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <img src={selectedMed.image_url} alt={selectedMed.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
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
          </div>
          <button className="btn-glass rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '38px', height: '38px', padding: 0, flexShrink: 0, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
            onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="p-4">
          {/* Allergy Warning */}
          {allergyWarning && (
            <div className="allergy-alert-shield mb-4">
              <ShieldAlert size={28} style={{ flexShrink: 0 }} />
              <div>
                <strong className="d-block mb-1" style={{ fontSize: '0.95rem' }}>
                  ⚠️ ALLERGY WARNING — CONTAINS {allergyWarning.matchedChemical.toUpperCase()}
                </strong>
                <span style={{ fontSize: '0.82rem' }}>
                  You recorded an allergy to <strong>{allergyWarning.allergen}</strong>. Reaction: {allergyWarning.reaction || 'Severe sensitivity'}.
                </span>
              </div>
            </div>
          )}

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
            onClick={onClose}>
            <X size={16} /> Close Details
          </button>
        </div>
      </div>
    </div>
  );
};