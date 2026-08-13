import React from 'react';
import { X, ExternalLink, Calendar, Clock, Newspaper, Globe } from 'lucide-react';

const estimateReadTime = (text = '') => Math.max(1, Math.round(text.split(' ').length / 200));

export const NewsDetailModal = ({ news, onClose }) => {
  if (!news) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ backgroundColor: 'rgba(6,13,26,0.8)', backdropFilter: 'blur(12px)', zIndex: 10001 }}>
      <div className="glass-card-static p-0 w-100 overflow-auto rounded-4"
        style={{ maxWidth: '720px', maxHeight: '85vh', border: '1px solid rgba(217,119,6,0.25)' }}>

        {/* Modal Header — same layout as medicine details */}
        <div className="p-4 pb-3 d-flex justify-content-between align-items-start"
          style={{ borderBottom: '1px solid var(--border-card)', background: 'linear-gradient(135deg,#d97706,#f59e0b)', borderRadius: '16px 16px 0 0' }}>
          <div>
            <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '3px 10px', borderRadius: '999px', fontWeight: 700, letterSpacing: '0.04em' }}>
              {news.category || 'Bulletin'}
            </span>
            <h3 className="fw-bold mt-2 mb-0" style={{ fontFamily: 'Outfit', color: '#fff', fontSize: '1.4rem', lineHeight: 1.3 }}>
              {news.title}
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', display: 'inline-flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
              <span className="d-inline-flex align-items-center gap-1"><Globe size={12} /> {news.source}</span>
              <span className="d-inline-flex align-items-center gap-1"><Calendar size={12} /> {news.date}</span>
              <span className="d-inline-flex align-items-center gap-1"><Clock size={12} /> {estimateReadTime(news.detail || news.summary)} min read</span>
            </span>
          </div>
          <button className="btn-glass rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: '38px', height: '38px', padding: 0, flexShrink: 0, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
            onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="p-4">
          {/* Summary */}
          <div className="mb-4">
            <h6 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '10px' }}>
              Bulletin Summary
            </h6>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.7, fontWeight: 500, marginBottom: 0 }}>
              {news.summary}
            </p>
          </div>

          {/* Full Article */}
          {news.detail && (
            <div className="mb-4">
              <h6 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '10px' }}>
                Full Details
              </h6>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.75 }}>
                {news.detail.split('\n\n').map((para, i) => (
                  <p key={i} style={{ marginBottom: '12px' }}>{para}</p>
                ))}
              </div>
            </div>
          )}

          {/* Verified source box */}
          <div className="p-4 rounded-3 mb-4" style={{ background: 'linear-gradient(135deg, rgba(217,119,6,0.06), rgba(245,158,11,0.04))', border: '1px solid rgba(217,119,6,0.2)' }}>
            <h6 className="gradient-text d-flex align-items-center gap-2 mb-2" style={{ fontFamily: 'Outfit', fontWeight: 700 }}>
              <Newspaper size={18} />
              Verified Bulletin Source
            </h6>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
              Published by <strong>{news.source}</strong>{news.urgent ? ' as an urgent public health alert.' : '.'} The official source link below opens the original publication in a new browser tab.
            </p>
          </div>

          {news.url && (
            <a href={news.url} target="_blank" rel="noreferrer"
              className="btn-gradient w-100 py-3 mb-3 d-flex align-items-center justify-content-center gap-2 text-decoration-none rounded-3"
              style={{ fontSize: '0.88rem', fontWeight: 700 }}>
              <ExternalLink size={16} /> Read Official Bulletin on Source Website
            </a>
          )}

          <button className="btn-glass w-100 py-3 d-flex align-items-center justify-content-center gap-2 rounded-3"
            onClick={onClose}>
            <X size={16} /> Close Details
          </button>
        </div>
      </div>
    </div>
  );
};