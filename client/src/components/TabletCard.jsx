import React, { useState } from 'react';
import { Pill, Building2, ChevronRight, Leaf, Tag } from 'lucide-react';

export const TabletCard = ({ med, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const getCategoryStyle = (cat = '') => {
    const c = cat.toLowerCase();
    if (c.includes('analgesic') || c.includes('antipyretic')) return { bg: '#0284c718', color: '#0284c7', border: '#0284c730', label: 'Pain & Fever' };
    if (c.includes('antacid') || c.includes('proton'))        return { bg: '#d9770618', color: '#d97706', border: '#d9770630', label: 'GI Care' };
    if (c.includes('antibiotic') || c.includes('macrolide'))  return { bg: '#7c3aed18', color: '#7c3aed', border: '#7c3aed30', label: 'Antibiotic' };
    if (c.includes('antidiabetic'))  return { bg: '#05966918', color: '#059669', border: '#05966930', label: 'Diabetic' };
    if (c.includes('antihypertensive')) return { bg: '#dc262618', color: '#dc2626', border: '#dc262630', label: 'Cardiac' };
    if (c.includes('vitamin') || c.includes('supplement')) return { bg: '#10b98118', color: '#10b981', border: '#10b98130', label: 'Supplement' };
    if (c.includes('antihistamine') || c.includes('allerg')) return { bg: '#f59e0b18', color: '#f59e0b', border: '#f59e0b30', label: 'Allergy' };
    return { bg: '#0284c718', color: '#0284c7', border: '#0284c730', label: 'General' };
  };

  const catStyle = getCategoryStyle(med.category);

  const hasGeneric = med.generic_name && med.generic_name.toLowerCase() !== med.name.toLowerCase();

  // Real generic savings from the substitutes table (null when no substitute registered)
  const savingsPct = med.generic_savings_pct
    ? Math.round(Number(med.generic_savings_pct))
    : null;

  return (
    <div
      className="card-premium p-4 h-100 d-flex flex-column justify-content-between"
      style={{ cursor: 'pointer' }}
      onClick={() => onSelect(med.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header row */}
      <div className="d-flex align-items-center justify-content-between mb-3 pb-3"
        style={{ borderBottom: '1px solid var(--border-card)' }}>
        <div className="d-flex align-items-center gap-2">
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: catStyle.bg, color: catStyle.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, overflow: 'hidden', transition: 'transform 0.25s ease',
            transform: hovered ? 'scale(1.12) rotate(-5deg)' : 'scale(1)'
          }}>
            {med.image_url && !imgError ? (
              <img src={med.image_url} alt={med.name} loading="lazy"
                onError={() => setImgError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Pill size={19} />
            )}
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>FORMULATION</div>
            <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', fontWeight: 500 }}>{med.pack_size || 'Strip of 10'}</div>
          </div>
        </div>

        <div className="d-flex flex-column align-items-end gap-1">
          {med.prescription_required ? (
            <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: '1px solid rgba(220,38,38,0.25)' }}>
              Rx Sch H
            </span>
          ) : (
            <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', background: 'rgba(5,150,105,0.1)', color: '#059669', border: '1px solid rgba(5,150,105,0.25)' }}>
              OTC
            </span>
          )}
          {savingsPct && (
            <span style={{
              fontSize: '0.6rem', fontWeight: 900, padding: '2px 7px', borderRadius: '6px',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))',
              color: '#059669', border: '1px solid rgba(5,150,105,0.25)',
              display: 'flex', alignItems: 'center', gap: '3px'
            }}>
              <Leaf size={9} />
              ~{savingsPct}% Generic Savings
            </span>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 mb-3">
        <span style={{
          fontSize: '0.68rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px',
          background: catStyle.bg, color: catStyle.color, border: `1px solid ${catStyle.border}`,
          display: 'inline-block', marginBottom: '10px'
        }}>
          {med.category || 'General'}
        </span>

        <h4 className="fw-bold mb-1 text-truncate" style={{ fontFamily: 'Outfit', fontSize: '1.1rem', color: 'var(--text-main)' }}>
          {med.name}
        </h4>

        <div className="d-flex align-items-center gap-1 mb-2"
          style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <Building2 size={13} style={{ color: catStyle.color, flexShrink: 0 }} />
          <span className="text-truncate">
            <strong style={{ color: 'var(--text-main)' }}>{med.manufacturer}</strong>
          </span>
        </div>

        {hasGeneric && (
          <div className="d-flex align-items-center gap-1 mb-2" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            <Tag size={12} />
            <span>Generic: <strong style={{ color: 'var(--primary-teal)' }}>{med.generic_name}</strong></span>
          </div>
        )}

        <div className="p-2 rounded-2" style={{ background: 'var(--bg-input)', fontSize: '0.77rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          <strong style={{ color: catStyle.color }}>Composition: </strong>
          <span className="line-clamp-2">{med.composition_summary || med.generic_name}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="d-flex align-items-center justify-content-between pt-3"
        style={{ borderTop: '1px solid var(--border-card)' }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', fontWeight: 700 }}>INDICATIVE MRP</div>
          <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.3rem', color: '#059669', lineHeight: 1 }}>
            ₹{med.mrp.toFixed(2)}
          </div>
        </div>
        <div
          className="d-flex align-items-center gap-1"
          style={{
            background: hovered ? 'var(--primary-gradient)' : 'var(--bg-input)',
            color: hovered ? '#fff' : 'var(--primary-cyan)',
            border: hovered ? 'none' : '1.5px solid rgba(2,132,199,0.3)',
            padding: '9px 16px', borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Outfit',
            boxShadow: hovered ? '0 4px 14px rgba(2,132,199,0.35)' : 'none',
            transition: 'all 0.25s ease'
          }}>
          <span>Details</span>
          <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
};
