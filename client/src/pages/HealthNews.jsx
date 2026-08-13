import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Award, Sparkles, Calendar, AlertTriangle, Filter, Globe, Zap, Search, RefreshCw, TrendingUp, BookOpen, Heart, Shield, FlaskConical, Pill, Clock, Bookmark } from 'lucide-react';

const CATEGORIES = [
  { id: 'all',              label: 'All News',       icon: Newspaper,      color: '#0284c7', bg: '#0284c718' },
  { id: 'Global Alert',     label: 'Global Alerts',  icon: Globe,          color: '#dc2626', bg: '#dc262618' },
  { id: 'Outbreak Alert',   label: 'Outbreaks',      icon: AlertTriangle,  color: '#ef4444', bg: '#ef444418' },
  { id: 'Pharma Policy',    label: 'Pharma',         icon: Pill,           color: '#0d9488', bg: '#0d948818' },
  { id: 'Clinical Guidelines', label: 'Guidelines',  icon: BookOpen,       color: '#7c3aed', bg: '#7c3aed18' },
  { id: 'Organ Donation',   label: 'Organ',          icon: Heart,          color: '#0d9488', bg: '#0d948818' },
  { id: 'Blood Donation',   label: 'Blood',          icon: Zap,            color: '#dc2626', bg: '#dc262618' },
  { id: 'Digital Health',   label: 'Digital',        icon: Sparkles,       color: '#0284c7', bg: '#0284c718' },
  { id: 'Vaccines',         label: 'Vaccines',       icon: FlaskConical,   color: '#059669', bg: '#05966918' },
  { id: 'Mental Health',    label: 'Mental Health',  icon: Heart,          color: '#7c3aed', bg: '#7c3aed18' },
  { id: 'Antimicrobial',    label: 'Antimicrobial',  icon: Shield,         color: '#d97706', bg: '#d9770618' },
  { id: 'Insurance Policy', label: 'Insurance',      icon: Shield,         color: '#059669', bg: '#05966918' },
];

const SOURCE_COLORS = {
  'WHO Official':             { bg: '#0284c718', color: '#0284c7', border: 'rgba(2,132,199,0.3)' },
  'MoHFW GOI':               { bg: '#05966918', color: '#059669', border: 'rgba(5,150,105,0.3)' },
  'ICMR':                    { bg: '#7c3aed18', color: '#7c3aed', border: 'rgba(124,58,237,0.3)' },
  'NOTTO GOI':               { bg: '#0d948818', color: '#0d9488', border: 'rgba(13,148,136,0.3)' },
  'Press Information Bureau':{ bg: '#d9770618', color: '#d97706', border: 'rgba(217,119,6,0.3)' },
  'AP Health Dept':          { bg: '#dc262618', color: '#dc2626', border: 'rgba(220,38,38,0.3)' },
  'CDSCO India':             { bg: '#4f46e518', color: '#4f46e5', border: 'rgba(79,70,229,0.3)' },
  'AIIMS Delhi':             { bg: '#0284c718', color: '#0284c7', border: 'rgba(2,132,199,0.3)' },
  'NIMHANS / MoHFW':         { bg: '#7c3aed18', color: '#7c3aed', border: 'rgba(124,58,237,0.3)' },
};

const getSourceStyle = (src) => SOURCE_COLORS[src] || { bg: '#d9770618', color: '#d97706', border: 'rgba(217,119,6,0.3)' };

const estimateReadTime = (text = '') => Math.max(1, Math.round(text.split(' ').length / 200));

export const HealthNews = () => {
  const [allNews, setAllNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [dailyTip, setDailyTip] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('nexamed_bookmarks') || '[]'));
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nexamed_bookmarks', JSON.stringify([...bookmarks]));
    } catch {
      // localStorage unavailable — bookmarks stay in-memory only
    }
  }, [bookmarks]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/news')
      .then((res) => res.json())
      .then((data) => {
        setAllNews(data.news || []);
        setFilteredNews(data.news || []);
        setDailyTip(data.dailyTip);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...allNews];
    if (activeCategory !== 'all') result = result.filter((n) => n.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q) || n.source.toLowerCase().includes(q)
      );
    }
    setFilteredNews(result);
  }, [activeCategory, searchQuery, allNews]);

  const urgentNews = allNews.filter((n) => n.urgent);
  const featuredNews = filteredNews[0];
  const restNews = filteredNews.slice(1);

  const toggleBookmark = (id) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const stats = [
    { label: 'Total Bulletins', value: allNews.length,        color: '#0284c7', bg: '#0284c718', icon: Newspaper },
    { label: 'Urgent Alerts',   value: urgentNews.length,     color: '#dc2626', bg: '#dc262618', icon: AlertTriangle },
    { label: 'Verified Sources',value: Object.keys(SOURCE_COLORS).length, color: '#059669', bg: '#05966918', icon: Shield },
    { label: 'Categories',      value: CATEGORIES.length - 1, color: '#7c3aed', bg: '#7c3aed18', icon: Filter },
  ];

  return (
    <div className="container py-4 page-fade-in">

      {/* PAGE HEADER */}
      <div className="page-header">
        <div className="page-header-icon" style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)' }}>
          <Newspaper size={24} />
        </div>
        <div>
          <h2 className="fw-bold m-0" style={{ fontFamily: 'Outfit', fontSize: '1.5rem', color: 'var(--text-main)' }}>
            Health News &amp; Outbreak Alerts
          </h2>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: 0 }}>
            Real-time WHO, MoHFW, ICMR &amp; NOTTO verified bulletins — India &amp; Global
          </p>
        </div>
      </div>

      {/* STAT ROW */}
      <div className="row g-3 mb-4 stagger-children">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="col-6 col-md-3 animate-fade-up">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
                  <Icon size={20} />
                </div>
                <div>
                  <div className="stat-number">{s.value}</div>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)', fontWeight: 600 }}>{s.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SCROLLING URGENT TICKER */}
      {urgentNews.length > 0 && (
        <div className="mb-4 d-flex align-items-stretch gap-0 rounded-3 overflow-hidden"
          style={{ border: '1px solid rgba(220,38,38,0.35)', boxShadow: '0 4px 20px rgba(220,38,38,0.15)' }}>
          <div className="d-flex align-items-center justify-content-center px-3 flex-shrink-0 fw-bold"
            style={{ background: 'linear-gradient(135deg,#ef4444,#b91c1c)', color: '#fff', fontSize: '0.7rem', letterSpacing: '0.07em', fontFamily: 'Outfit', gap: '6px', minWidth: '110px', padding: '10px' }}>
            <AlertTriangle size={13} />
            LIVE ALERTS
          </div>
          <div className="ticker-container" style={{ background: 'rgba(220,38,38,0.05)', padding: '10px 0' }}>
            {/* Duplicate items so the scroll is seamless */}
            <div className="ticker-track">
              {[...urgentNews, ...urgentNews].map((n, i) => (
                <span key={`${n.id}-${i}`} style={{ fontSize: '0.82rem', color: '#dc2626', fontWeight: 600, marginRight: '60px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: '#ef4444' }}>●</span>
                  {n.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DAILY WELLNESS TIP */}
      {dailyTip && (
        <div className="d-flex align-items-center gap-4 p-4 mb-4 rounded-4"
          style={{ background: 'linear-gradient(135deg, rgba(5,150,105,0.08), rgba(16,185,129,0.05))', border: '1px solid rgba(5,150,105,0.2)' }}>
          <div style={{
            width: '56px', height: '56px', flexShrink: 0, borderRadius: '16px',
            background: 'linear-gradient(135deg,#059669,#10b981)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(5,150,105,0.3)'
          }}>
            <Award size={26} color="#fff" />
          </div>
          <div>
            <div style={{
              fontSize: '0.67rem', fontWeight: 800, letterSpacing: '0.06em',
              background: 'rgba(5,150,105,0.12)', color: '#059669',
              padding: '3px 12px', borderRadius: '999px', display: 'inline-flex',
              alignItems: 'center', gap: '5px', border: '1px solid rgba(5,150,105,0.3)', marginBottom: '8px'
            }}>
              <Sparkles size={11} />
              TODAY'S WELLNESS TIP — {dailyTip.category?.toUpperCase()}
            </div>
            <p className="fw-semibold m-0" style={{ fontFamily: 'Outfit', fontSize: '1.05rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
              "{dailyTip.tip_text}"
            </p>
          </div>
        </div>
      )}

      {/* SEARCH + FILTER */}
      <div className="glass-card-static p-4 mb-4">
        <div className="position-relative mb-3">
          <Search size={17} className="position-absolute top-50 start-0 translate-middle-y ms-3"
            style={{ color: 'var(--text-dim)', pointerEvents: 'none' }} />
          <input
            type="text" className="glass-input" style={{ paddingLeft: '44px' }}
            placeholder="Search news by title, source, keyword (Dengue, WHO, Blood, Organ)..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}
              className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent p-0"
              style={{ color: 'var(--text-dim)', cursor: 'pointer' }}>
              <RefreshCw size={15} />
            </button>
          )}
        </div>

        {/* Category pills — horizontal scroll */}
        <div className="d-flex gap-2 pb-1" style={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="category-filter-pill flex-shrink-0"
                style={{
                  background: isActive ? cat.bg : undefined,
                  color: isActive ? cat.color : undefined,
                  border: isActive ? `1.5px solid ${cat.color}50` : undefined,
                  boxShadow: isActive ? `0 2px 10px ${cat.bg}` : undefined,
                }}
              >
                <Icon size={12} />
                <span>{cat.label}</span>
                {isActive && activeCategory !== 'all' && (
                  <span style={{
                    background: cat.color, color: '#fff', borderRadius: '50%',
                    width: '16px', height: '16px', fontSize: '0.6rem', fontWeight: 800,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {filteredNews.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-3 d-flex align-items-center justify-content-between">
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Showing <strong style={{ color: 'var(--primary-cyan)' }}>{filteredNews.length}</strong> of {allNews.length} bulletins
            {activeCategory !== 'all' && <> in <em>{activeCategory}</em></>}
            {searchQuery && <> matching "<em>{searchQuery}</em>"</>}
          </span>
          {(activeCategory !== 'all' || searchQuery) && (
            <button onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--primary-cyan)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <RefreshCw size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* NEWS GRID — MAGAZINE LAYOUT */}
      {loading ? (
        <div className="row g-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="col-md-6 col-lg-4">
              <div className="glass-card-static p-4" style={{ height: '240px' }}>
                <div className="shimmer-skeleton rounded mb-3" style={{ height: '18px', width: '40%' }} />
                <div className="shimmer-skeleton rounded mb-2" style={{ height: '28px', width: '90%' }} />
                <div className="shimmer-skeleton rounded mb-2" style={{ height: '16px', width: '100%' }} />
                <div className="shimmer-skeleton rounded mb-4" style={{ height: '16px', width: '75%' }} />
                <div className="shimmer-skeleton rounded" style={{ height: '36px', width: '100%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center py-5 glass-card-static rounded-4">
          <Newspaper size={52} style={{ color: 'var(--text-light)', marginBottom: '16px' }} />
          <h5 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-main)' }}>No bulletins found</h5>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px', margin: '0 auto 16px' }}>
            {searchQuery ? `No results for "${searchQuery}". Try a different keyword.` : 'No news in this category.'}
          </p>
          <button className="btn-glass" onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}>
            <RefreshCw size={15} /> Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Featured hero card */}
          {featuredNews && !searchQuery && activeCategory === 'all' && (
            <div className="news-featured-card mb-4">
              <div className="row g-0 align-items-stretch">
                <div className="col-md-3 d-flex align-items-center justify-content-center p-4"
                  style={{ background: 'linear-gradient(135deg, rgba(2,132,199,0.12), rgba(13,148,136,0.08))', minHeight: '180px' }}>
                  <div style={{
                    width: '100px', height: '100px', borderRadius: '24px',
                    background: 'var(--primary-gradient)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 30px rgba(2,132,199,0.3)'
                  }}>
                    <Newspaper size={44} color="#fff" />
                  </div>
                </div>
                <div className="col-md-9 p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 900, padding: '4px 14px', borderRadius: '999px',
                        background: 'linear-gradient(135deg,#0284c7,#0d9488)', color: '#fff', letterSpacing: '0.06em'
                      }}>
                        LATEST BULLETIN
                      </span>
                      {(() => {
                        const sc = getSourceStyle(featuredNews.source);
                        return (
                          <span style={{
                            fontSize: '0.68rem', fontWeight: 800, padding: '4px 12px', borderRadius: '999px',
                            background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`
                          }}>
                            {featuredNews.source}
                          </span>
                        );
                      })()}
                      {featuredNews.urgent && <span className="badge-urgent">🔴 URGENT</span>}
                    </div>
                    <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3, marginBottom: '10px', fontSize: '1.25rem' }}>
                      {featuredNews.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '12px' }} className="line-clamp-2">
                      {featuredNews.summary}
                    </p>
                  </div>
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-3">
                      <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        <Calendar size={12} /> {featuredNews.date}
                      </div>
                      <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        <Clock size={12} /> {estimateReadTime(featuredNews.summary)} min read
                      </div>
                    </div>
                    <a href={featuredNews.url} target="_blank" rel="noreferrer"
                      className="btn-gradient text-decoration-none"
                      style={{ fontSize: '0.82rem', borderRadius: 'var(--radius-md)', padding: '9px 18px' }}>
                      <ExternalLink size={14} /> Read Official Bulletin
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* News grid */}
          <div className="row g-4">
            {(featuredNews && !searchQuery && activeCategory === 'all' ? restNews : filteredNews).map((item, idx) => {
              const sc = getSourceStyle(item.source);
              const catInfo = CATEGORIES.find((c) => c.id === item.category);
              const isBookmarked = bookmarks.has(item.id);
              return (
                <div key={item.id} className="col-md-6 col-lg-4 animate-fade-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}>
                  <div className="card-premium h-100 d-flex flex-column justify-content-between"
                    style={item.urgent ? { boxShadow: '0 0 0 1px rgba(220,38,38,0.15), var(--shadow-md)' } : {}}>

                    {item.urgent && (
                      <div style={{ height: '3px', background: 'linear-gradient(90deg,#ef4444,#dc2626)', borderRadius: '16px 16px 0 0' }} />
                    )}

                    <div className="p-4 flex-grow-1 d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-1">
                        <span style={{
                          fontSize: '0.67rem', fontWeight: 800, padding: '4px 10px', borderRadius: '999px',
                          background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                          display: 'inline-flex', alignItems: 'center', gap: '5px'
                        }}>
                          {item.source}
                        </span>
                        <div className="d-flex align-items-center gap-2">
                          {item.urgent && <span className="badge-urgent">🔴 URGENT</span>}
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleBookmark(item.id); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: isBookmarked ? '#f59e0b' : 'var(--text-dim)', padding: 0 }}
                            title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                          >
                            <Bookmark size={15} fill={isBookmarked ? '#f59e0b' : 'none'} />
                          </button>
                        </div>
                      </div>

                      {catInfo && catInfo.id !== 'all' && (
                        <div className="d-inline-flex align-items-center gap-1 mb-2"
                          style={{ fontSize: '0.66rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px',
                            background: catInfo.bg, color: catInfo.color, width: 'fit-content' }}>
                          <catInfo.icon size={10} /> {item.category}
                        </div>
                      )}

                      <h5 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.96rem', lineHeight: 1.4,
                        color: 'var(--text-main)', marginBottom: '10px' }}>
                        {item.title}
                      </h5>

                      <p style={{ fontSize: '0.81rem', color: 'var(--text-muted)', lineHeight: 1.65, flexGrow: 1, marginBottom: '12px' }} className="line-clamp-3">
                        {item.summary}
                      </p>

                      <div className="d-flex align-items-center gap-3" style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        <div className="d-flex align-items-center gap-1">
                          <Calendar size={11} /> {item.date}
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <Clock size={11} /> {estimateReadTime(item.summary)} min
                        </div>
                      </div>
                    </div>

                    <div className="px-4 pb-4">
                      <a href={item.url} target="_blank" rel="noreferrer"
                        className="d-flex align-items-center justify-content-center gap-2 text-decoration-none w-100 py-2 rounded-3"
                        style={{
                          background: 'var(--bg-input)', border: `1px solid ${sc.border}`,
                          color: sc.color, fontSize: '0.82rem', fontWeight: 700, transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = sc.bg; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-input)'; }}>
                        <span>Read Official Bulletin</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* SOURCES LEGEND */}
      {!loading && allNews.length > 0 && (
        <div className="mt-4 p-4 rounded-3" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)' }}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <TrendingUp size={16} color="var(--primary-cyan)" />
            <span style={{ fontSize: '0.77rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
              VERIFIED DATA SOURCES — INDIA HEALTH ECOSYSTEM
            </span>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {Object.entries(SOURCE_COLORS).map(([src, sc]) => (
              <span key={src} style={{
                fontSize: '0.69rem', fontWeight: 700, padding: '4px 12px', borderRadius: '999px',
                background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`
              }}>
                {src}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
