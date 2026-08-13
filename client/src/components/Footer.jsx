import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AlertTriangle, PhoneCall, HeartHandshake, ShieldCheck, Activity, Heart } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="mt-5" style={{ borderTop: '1px solid var(--border-card)' }}>
      {/* Top gradient bar */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #0284c7 0%, #0d9488 50%, #10b981 100%)' }} />

      <div style={{ background: 'var(--bg-card)', padding: '40px 0 0' }}>
        <div className="container">

          {/* Disclaimer */}
          <div className="disclaimer-banner mb-4">
            <AlertTriangle size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>{t('footerDisclaimer')}</strong>
              {t('footerDisclaimerBody')}
            </div>
          </div>

          <div className="row g-4 pb-4" style={{ borderBottom: '1px solid var(--border-card)' }}>

            {/* Brand column */}
            <div className="col-md-5">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(2,132,199,0.3)' }}>
                  <Activity size={20} color="#fff" />
                </div>
                <div>
                  <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.1rem' }} className="gradient-text">NEXAMED</div>
                  <div style={{ fontSize: '0.6rem', letterSpacing: '2px', color: 'var(--text-dim)', fontWeight: 600 }}>HEALTHCARE PORTAL</div>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '340px' }}>
                {t('heroDesc')}
              </p>

              <div className="d-flex align-items-center gap-2 mt-3" style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
                <ShieldCheck size={15} />
                <span>India MoHFW &amp; e-RaktKosh Data Standard Compatible</span>
              </div>

              <div className="d-inline-flex align-items-center gap-2 mt-3 px-3 py-2 rounded-3"
                style={{ background: 'linear-gradient(135deg, rgba(2,132,199,0.08), rgba(13,148,136,0.06))', border: '1px solid rgba(2,132,199,0.15)', fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                🎓 Final Year Project — React + Node.js + SQLite
              </div>
            </div>

            {/* Emergency helplines */}
            <div className="col-md-3">
              <h6 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '16px' }}>
                {t('emergencyHelplines')}
              </h6>
              <div className="d-flex flex-column gap-3">
                {[
                  { number: '108',          label: 'National Ambulance',     color: '#dc2626' },
                  { number: '1800-11-4770', label: 'NOTTO Organ Helpline',   color: '#0d9488' },
                  { number: '1075',         label: 'National Health Helpline', color: '#0284c7' },
                  { number: '112',          label: 'National Emergency',     color: '#7c3aed' },
                ].map((h) => (
                  <a key={h.number} href={`tel:${h.number}`}
                    className="d-flex align-items-center gap-2 text-decoration-none"
                    style={{ fontSize: '0.82rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0, background: `${h.color}18`, color: h.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PhoneCall size={14} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: h.color, fontFamily: 'Outfit' }}>{h.number}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{h.label}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Organ donation */}
            <div className="col-md-4">
              <h6 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '16px' }}>
                {t('organBloodDonation')}
              </h6>
              <div className="p-3 rounded-3" style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.08), rgba(5,150,105,0.05))', border: '1px solid rgba(13,148,136,0.2)' }}>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Heart size={16} color="#0d9488" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0d9488' }}>{t('saveLives')}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '12px' }}>
                  {t('donationText')}
                </p>
                <a href="https://notto.mohfw.gov.in" target="_blank" rel="noreferrer"
                  className="btn-glass d-inline-flex align-items-center gap-2"
                  style={{ fontSize: '0.8rem', color: '#0d9488', textDecoration: 'none', padding: '8px 14px', borderRadius: 'var(--radius-sm)', borderColor: 'rgba(13,148,136,0.3)' }}>
                  <HeartHandshake size={15} />
                  <span>{t('nottoPortal')}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 py-3"
            style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            <span>{t('footerRights').replace('©', `© ${new Date().getFullYear()}`)}</span>
            <span>{t('footerStack')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
