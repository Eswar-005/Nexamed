import React, { useState, useEffect } from 'react';
import { useSOS } from '../context/SOSContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Search, Pill, Stethoscope,
  MapPin, Droplet, HeartHandshake, ShieldAlert,
  Newspaper, ChevronRight, Sparkles, PhoneCall,
  Flame, Clock, Zap, Building2, Activity, ArrowRight,
  CheckCircle2, Mic
} from 'lucide-react';

export const Home = ({ setActiveTab, onSelectMedicine, onSearchMedicine, onSelectNews }) => {
  const { triggerSOS } = useSOS();
  const { t, language } = useLanguage();
  const [quickQuery, setQuickQuery] = useState('');
  const [newsFeed, setNewsFeed] = useState([]);
  const [dailyTip, setDailyTip] = useState(null);
  const [bestsellerMeds, setBestsellerMeds] = useState([]);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    fetch('/api/news')
      .then((res) => res.json())
      .then((data) => { setNewsFeed(data.news || []); setDailyTip(data.dailyTip); })
      .catch(() => {});

    fetch('/api/medicines')
      .then((res) => res.json())
      .then((data) => setBestsellerMeds(data || []))
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (quickQuery.trim()) onSearchMedicine(quickQuery.trim());
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition not supported on this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    const langCodeMap = { en: 'en-US', te: 'te-IN', hi: 'hi-IN', ta: 'ta-IN', kn: 'kn-IN' };
    recognition.lang = langCodeMap[language] || 'en-US';
    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setQuickQuery(speechResult);
      setIsListening(false);
      onSearchMedicine(speechResult);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };

  const hospitalServices = [
    { id: 'symptom', title: 'OPD Symptom Checker',     desc: 'Select symptoms across body regions for clinical match & specialist referral', icon: Stethoscope,   iconBg: '#0284c718', iconColor: '#0284c7', badge: 'AI Clinical' },
    { id: 'pharma',  title: 'Generic Medicines Savings', desc: 'Compare 500+ brand formulations against generics — save up to 70%',            icon: Pill,           iconBg: '#0d948818', iconColor: '#0d9488', badge: '70% Off' },
    { id: 'stores',  title: 'Pharmacy Map Locator',      desc: 'GPS-powered 24×7 medical store finder with live directions & contact',          icon: MapPin,         iconBg: '#05966918', iconColor: '#059669', badge: 'GPS Live' },
    { id: 'blood',   title: 'Blood Bank Directory',       desc: 'Live e-RaktKosh unit availability by blood group — A+, O−, AB+...',            icon: Droplet,        iconBg: '#dc262618', iconColor: '#dc2626', badge: 'Live Stock' },
    { id: 'organ',   title: 'NOTTO Organ Registry',       desc: 'Govt-registered transplant centers & voluntary organ donor pledge form',        icon: HeartHandshake, iconBg: '#0d948818', iconColor: '#0d9488', badge: 'NOTTO GOI' },
    { id: 'news',    title: 'Health News & Alerts',       desc: 'WHO, MoHFW & national disease outbreak bulletins updated daily',               icon: Newspaper,      iconBg: '#d9770618', iconColor: '#d97706', badge: 'WHO Feed' },
  ];

  const recentSearchTags = [
    { text: 'Dolo 650', bg: 'linear-gradient(135deg,#2563eb,#3b82f6)', tab: 'pharma' },
    { text: 'Paracetamol', bg: 'linear-gradient(135deg,#059669,#10b981)', tab: 'pharma' },
    { text: 'Pantocid 40', bg: 'linear-gradient(135deg,#d97706,#f59e0b)', tab: 'pharma' },
    { text: 'Azithral 500', bg: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', tab: 'pharma' },
    { text: 'Dengue Fever', bg: 'linear-gradient(135deg,#e11d48,#f43f5e)', tab: 'disease' },
  ];

  return (
    <div className="container py-4">

      {/* ── TODAY'S WELLNESS TIP (FIRST AID ALERT BANNER) ── */}
      <div className="p-3 p-md-4 rounded-4 mb-4 d-flex align-items-center gap-3 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, rgba(2,132,199,0.08) 0%, rgba(220,38,38,0.08) 100%)',
          border: '1px solid rgba(2,132,199,0.25)',
          borderLeft: '5px solid #dc2626'
        }}>
        <div style={{
          width: '46px', height: '46px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          boxShadow: '0 4px 12px rgba(220,38,38,0.3)'
        }}>
          <ShieldAlert size={22} color="#fff" />
        </div>
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge" style={{
              background: 'rgba(220,38,38,0.12)', color: '#dc2626',
              fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.05em',
              padding: '4px 10px', borderRadius: '6px'
            }}>
              TODAY'S WELLNESS TIP — {dailyTip?.category || 'First Aid'}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>• Critical First Aid Advisory</span>
          </div>
          <p className="fw-semibold m-0" style={{ color: 'var(--text-main)', fontSize: '0.94rem', lineHeight: 1.5 }}>
            "{dailyTip?.tip_text || 'In case of severe Dengue fever, never take Ibuprofen or Aspirin as they significantly increase mucosal bleeding risks.'}"
          </p>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <div className="hero-section p-4 p-lg-5 mb-4">
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
              style={{ background: 'rgba(2,132,199,0.12)', border: '1px solid rgba(2,132,199,0.25)' }}>
              <Sparkles size={13} color="#0284c7" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', letterSpacing: '0.04em' }}>
                HOSPITAL PORTAL & DIGITAL HEALTH ENGINE
              </span>
            </div>

            <h1 className="fw-black mb-3" style={{ fontFamily: 'Outfit', fontSize: 'clamp(1.7rem, 4vw, 2.5rem)', lineHeight: 1.1 }}>
              {t('heroTitle')}
            </h1>

            <p className="text-muted mb-4" style={{ fontSize: '1rem', maxWidth: '520px' }}>
              {t('heroDesc')}
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearchSubmit} className="mb-3">
              <div className="d-flex gap-2">
                <div className="position-relative flex-grow-1">
                  <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3"
                    style={{ color: 'var(--text-dim)', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    className="glass-input"
                    style={{ paddingLeft: '44px', paddingRight: '50px', borderRadius: '12px', height: '50px' }}
                    placeholder={t('searchPlaceholder')}
                    value={quickQuery}
                    onChange={(e) => setQuickQuery(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={startVoiceSearch}
                    className="position-absolute top-50 end-0 translate-middle-y me-2 border-0 bg-transparent"
                    title={t('voiceSearch')}
                    style={{ color: isListening ? '#dc2626' : 'var(--primary-cyan)', cursor: 'pointer', padding: '6px' }}
                  >
                    <Mic size={20} className={isListening ? 'animate-pulse' : ''} />
                  </button>
                </div>
                <button type="submit" className="btn-gradient d-flex align-items-center gap-2 px-4"
                  style={{ borderRadius: '12px', height: '50px', whiteSpace: 'nowrap', fontFamily: 'Outfit', fontSize: '0.9rem' }}>
                  <Search size={16} />
                  <span>{t('searchBtn')}</span>
                </button>
              </div>
            </form>

            {/* Recent searches */}
            <div className="d-flex flex-wrap align-items-center gap-2">
              <div className="d-flex align-items-center gap-1" style={{ color: 'var(--text-dim)', fontSize: '0.78rem', fontWeight: 600 }}>
                <Clock size={13} /> RECENT:
              </div>
              {recentSearchTags.map((tag, idx) => (
                <button key={idx}
                  onClick={() => setActiveTab(tag.tab)}
                  className="border-0 text-white rounded-pill px-3 py-1"
                  style={{
                    background: tag.bg, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'; }}
                >
                  {tag.text}
                </button>
              ))}
            </div>
          </div>

          {/* SOS card */}
          <div className="col-lg-4">
            <div className="glass-card p-4 text-center" style={{ border: '1px solid rgba(220,38,38,0.2)', background: 'rgba(255,255,255,0.95)' }}>
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2" style={{ color: '#dc2626' }}>
                <ShieldAlert size={20} />
                <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.05em' }}>
                  1-TAP EMERGENCY SOS
                </span>
              </div>
              <p className="mb-3" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Broadcasts live GPS pin to emergency contacts + calls 108 ambulance instantly.
              </p>
              <button
                className="w-100 fw-bold border-0 text-white rounded-3 d-flex align-items-center justify-content-center gap-2"
                onClick={triggerSOS}
                style={{
                  background: 'linear-gradient(135deg,#ef4444,#b91c1c)',
                  padding: '14px', fontSize: '0.9rem', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(220,38,38,0.35)', transition: 'all 0.2s',
                  fontFamily: 'Outfit'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(220,38,38,0.5)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(220,38,38,0.35)'; }}
              >
                <PhoneCall size={18} />
                <span>TRIGGER EMERGENCY SOS</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOP PRESCRIBED MEDICINES CAROUSEL ── */}
      {bestsellerMeds.length > 0 && (
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="section-title">
              <div className="section-title-icon" style={{ background: '#d9770618', color: '#d97706' }}>
                <Flame size={18} />
              </div>
              <div>
                <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem' }}>Top Prescribed Formulations</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>Nexamed Express Showcase</div>
              </div>
            </div>
            <button className="btn-glass d-flex align-items-center gap-1" onClick={() => setActiveTab('pharma')}
              style={{ fontSize: '0.82rem' }}>
              <span>View All ({bestsellerMeds.length})</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="d-flex gap-3 pb-3 custom-horizontal-scroll" style={{ overflowX: 'auto', scrollSnapType: 'x mandatory' }}>
            {bestsellerMeds.map((med) => (
              <div key={med.id} className="glass-card p-3 flex-shrink-0 d-flex flex-column justify-content-between"
                style={{ width: '230px', scrollSnapAlign: 'start', minHeight: '180px', cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                onClick={() => onSelectMedicine(med.id)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(2,132,199,0.18)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div>
                  {med.image_url && (
                    <div className="d-flex align-items-center justify-content-center mb-2 rounded-3"
                      style={{ height: '110px', background: 'rgba(255,255,255,0.95)', border: '1px solid var(--border-glass)', overflow: 'hidden' }}>
                      <img src={med.image_url} alt={med.name} loading="lazy"
                        style={{ height: '100%', objectFit: 'contain', maxWidth: '100%' }} />
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge-warning" style={{ fontSize: '0.64rem' }}>MOST PRESCRIBED</span>
                    <span className="badge-teal" style={{ fontSize: '0.64rem' }}>Generic ✓</span>
                  </div>
                  <h6 className="fw-bold mb-1 text-truncate" style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{med.name}</h6>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '4px' }} className="text-truncate">
                    {med.composition_summary || med.generic_name}
                  </p>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>{med.pack_size}</p>
                </div>
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>MRP:</span>
                    <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.1rem', color: '#059669' }}>
                      ₹{med.mrp.toFixed(2)}
                    </span>
                  </div>
                  <button type="button" className="btn-gradient w-100 d-flex align-items-center justify-content-center gap-1 py-2"
                    style={{ fontSize: '0.78rem', borderRadius: 'var(--radius-sm)' }}
                    onClick={(e) => { e.stopPropagation(); onSelectMedicine(med.id); }}>
                    <Pill size={13} /><span>View Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── OPD SERVICES GRID ── */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="section-title">
            <div className="section-title-icon" style={{ background: '#0284c718', color: '#0284c7' }}>
              <Building2 size={18} />
            </div>
            <div>
              <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem' }}>OPD & Clinical Services</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>Nexamed Hospital Portal</div>
            </div>
          </div>
        </div>

        <div className="row g-3">
          {hospitalServices.map((service) => {
            const Icon = service.icon;
            return (
              <div key={service.id} className="col-md-6 col-lg-4">
                <div className="service-card" onClick={() => setActiveTab(service.id)}>
                  <div>
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div className="service-card-icon"
                        style={{ background: service.iconBg, color: service.iconColor }}>
                        <Icon size={22} />
                      </div>
                      <span className="badge-cyan" style={{ fontSize: '0.65rem' }}>{service.badge}</span>
                    </div>
                    <h5 className="fw-bold mb-2" style={{ fontFamily: 'Outfit', fontSize: '1rem', color: 'var(--text-main)' }}>
                      {service.title}
                    </h5>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 0 }}>
                      {service.desc}
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-1 mt-3" style={{ color: 'var(--primary-cyan)', fontWeight: 700, fontSize: '0.82rem' }}>
                    <span>Access Service</span>
                    <ChevronRight size={15} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── FORMULATION CATEGORIES ── */}
      <div className="glass-card-static p-4 mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="section-title">
            <div className="section-title-icon" style={{ background: '#0d948818', color: '#0d9488' }}>
              <Pill size={18} />
            </div>
            <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem' }}>Essential Formulation Categories</span>
          </div>
          <button className="btn-glass" style={{ fontSize: '0.8rem' }} onClick={() => setActiveTab('pharma')}>
            Browse Catalog
          </button>
        </div>

        <div className="row g-3">
          {[
            { label: 'Fever & Analgesics',    desc: 'Dolo 650, Crocin, Paracip',     icon: Zap,          bg: '#0284c718', color: '#0284c7' },
            { label: 'Acidity & PPI',          desc: 'Pantocid 40, Pan-D, Gelusil',   icon: Activity,     bg: '#d9770618', color: '#d97706' },
            { label: 'Antibiotics',            desc: 'Azithral 500, Azee, Ciplox',    icon: ShieldAlert,  bg: '#7c3aed18', color: '#7c3aed' },
            { label: 'Diabetes & BP',          desc: 'Glycomet 500, Telma 40',        icon: CheckCircle2, bg: '#05966918', color: '#059669' },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.label} className="col-6 col-md-3">
                <div className="glass-card p-3 text-center h-100" onClick={() => setActiveTab('pharma')} style={{ cursor: 'pointer' }}>
                  <div className="d-inline-flex p-3 rounded-circle mb-2"
                    style={{ background: cat.bg, color: cat.color }}>
                    <Icon size={24} />
                  </div>
                  <h6 className="fw-bold mb-1" style={{ fontFamily: 'Outfit', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    {cat.label}
                  </h6>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 0 }}>{cat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── NEXAMED PULSE NEWS ── */}
      {newsFeed.length > 0 && (
        <div className="glass-card-static p-4 mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="section-title">
              <div className="section-title-icon" style={{ background: '#d9770618', color: '#d97706' }}>
                <Newspaper size={18} />
              </div>
              <div>
                <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.1rem' }}>Nexamed Pulse</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>WHO & GOI Verified Bulletins</div>
              </div>
            </div>
            <button className="btn-glass" style={{ fontSize: '0.8rem' }} onClick={() => setActiveTab('news')}>
              <span>All News</span> <ChevronRight size={13} />
            </button>
          </div>

          <div className="row g-3">
            {newsFeed.slice(0, 3).map((news) => (
              <div key={news.id} className="col-md-4">
                <div className="glass-card p-4 h-100 d-flex flex-column justify-content-between">
                  {news.image_url && (
                    <div className="d-flex align-items-center justify-content-center mb-3 rounded-3"
                      style={{ height: '120px', background: 'rgba(255,255,255,0.95)', border: '1px solid var(--border-glass)', overflow: 'hidden' }}>
                      <img src={news.image_url} alt={news.title} loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge-cyan" style={{ fontSize: '0.65rem' }}>NEXAMED PULSE</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{news.date}</span>
                    </div>
                    <h6 className="fw-bold mb-2" style={{ fontFamily: 'Outfit', fontSize: '0.95rem', lineHeight: 1.4, color: 'var(--text-main)' }}>
                      {news.title}
                    </h6>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{news.summary}</p>
                  </div>
                  <div className="d-flex align-items-center justify-content-between pt-2"
                    style={{ borderTop: '1px solid var(--border-card)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      Source: <strong>{news.source}</strong>
                    </span>
                    <button onClick={() => onSelectNews(news)}
                      className="btn-glass d-flex align-items-center gap-1 border-0"
                      style={{ padding: '4px 10px', fontSize: '0.75rem', color: 'var(--primary-cyan)', cursor: 'pointer' }}>
                      <span>Read</span><ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
