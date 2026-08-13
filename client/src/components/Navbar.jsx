import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Menu, X, Activity, Pill, BookOpen, Stethoscope,
  MapPin, Droplet, HeartHandshake, Newspaper,
  User, Sun, Moon, ShieldAlert, LogOut, Home,
  Scan, Globe, Volume2, VolumeX
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, userAllergies, theme, toggleTheme, logout } = useAuth();
  const { language, changeLanguage, t, LANGUAGES, speakAudio, stopAudio, isSpeaking } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const allModules = [
    { id: 'home',    label: t('navHome'),    icon: Home,           badge: 'Home',        color: '#0284c7' },
    { id: 'pharma',  label: t('navPharma'),  icon: Pill,           badge: '500+ Meds',   color: '#0d9488' },
    { id: 'disease', label: t('navDisease'), icon: BookOpen,       badge: 'ICD-10',      color: '#7c3aed' },
    { id: 'symptom', label: t('navSymptom'), icon: Stethoscope,   badge: 'Clinical',    color: '#0284c7' },
    { id: 'stores',  label: t('navStores'),  icon: MapPin,         badge: 'GPS Map',     color: '#059669' },
    { id: 'blood',   label: t('navBlood'),   icon: Droplet,        badge: 'Live Stock',  color: '#dc2626' },
    { id: 'organ',   label: t('navOrgan'),   icon: HeartHandshake, badge: 'NOTTO',       color: '#0d9488' },
    { id: 'news',    label: t('navNews'),    icon: Newspaper,      badge: 'WHO Feed',    color: '#d97706' },
    { id: 'ocr',     label: t('navOcr'),     icon: Scan,            badge: 'OCR Scan',    color: '#6366f1' },
    { id: 'profile', label: t('navProfile'), icon: User,           badge: 'Passport',    color: '#4f46e5' },
  ];

  const navQuickLinks = [
    { id: 'pharma',  label: t('navPharma'),  icon: Pill },
    { id: 'symptom', label: t('navSymptom'), icon: Stethoscope },
    { id: 'blood',   label: t('navBlood'),   icon: Droplet },
    { id: 'news',    label: t('navNews'),    icon: Newspaper },
  ];

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const handleReadPageAloud = () => {
    if (isSpeaking) {
      stopAudio();
    } else {
      const pageText = `NEXAMED Healthcare Portal. Current tab is ${t(`nav${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`) || activeTab}. ${t('heroDesc')}`;
      speakAudio(pageText);
    }
  };

  return (
    <>
      <nav className="nexamed-navbar">
        <div className="container-fluid d-flex align-items-center justify-content-between gap-2 px-3">

          {/* Left: Hamburger + Brand */}
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn p-2 btn-glass rounded-3"
              onClick={() => setSidebarOpen(true)}
              title="Open All Modules"
              aria-label="Open navigation menu"
              style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Menu size={21} color="var(--primary-cyan)" />
            </button>

            <div className="nexamed-brand d-flex align-items-center gap-2" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
              <div className="brand-logo-circle animate-heartbeat">
                <Activity size={20} />
              </div>
              <div className="d-none d-sm-block">
                <div className="fw-black gradient-text" style={{ fontFamily: 'Outfit', fontSize: '1.25rem', fontWeight: 900, lineHeight: 1.1 }}>
                  NEXAMED
                </div>
                <div style={{ fontSize: '0.58rem', letterSpacing: '2.5px', color: 'var(--text-dim)', fontWeight: 700 }}>
                  HEALTHCARE PORTAL
                </div>
              </div>
            </div>
          </div>

          {/* Center: Quick nav links — desktop only */}
          <div className="d-none d-lg-flex align-items-center gap-1" style={{ flex: 1, justifyContent: 'center' }}>
            {navQuickLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  className={`nav-tab-btn d-flex align-items-center gap-1 border-0 px-3 py-2 rounded-3 ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(link.id)}
                  style={{
                    fontSize: '0.82rem', fontWeight: 700,
                    background: isActive ? 'rgba(2,132,199,0.1)' : 'transparent',
                    color: isActive ? 'var(--primary-cyan)' : 'var(--text-muted)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    fontFamily: 'Plus Jakarta Sans'
                  }}
                >
                  <Icon size={14} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Language Selector + Audio + Controls */}
          <div className="d-flex align-items-center gap-1 gap-md-2">

            {/* Global Language Selector Dropdown */}
            <div className="position-relative">
              <button
                className="btn btn-sm btn-glass rounded-3 d-flex align-items-center gap-1 px-2 py-1"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                title="Change Language / భాషను మార్చండి"
                style={{ fontSize: '0.78rem', fontWeight: 700 }}
              >
                <Globe size={15} color="var(--primary-cyan)" />
                <span className="d-none d-md-inline">{currentLangObj.name}</span>
                <span className="d-md-none">{currentLangObj.code.toUpperCase()}</span>
              </button>

              {langDropdownOpen && (
                <div
                  className="position-absolute end-0 mt-2 p-2 rounded-3 shadow-lg glass-card"
                  style={{
                    zIndex: 1050, minWidth: '180px', background: 'var(--bg-card)',
                    border: '1px solid var(--border-glass)'
                  }}
                >
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--text-dim)', padding: '4px 8px', letterSpacing: '0.05em' }}>
                    {t('selectLanguage').toUpperCase()}
                  </div>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        changeLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-100 text-start border-0 rounded-2 p-2 d-flex align-items-center gap-2 mb-1 ${language === l.code ? 'fw-bold text-white' : ''}`}
                      style={{
                        fontSize: '0.82rem',
                        background: language === l.code ? 'var(--primary-gradient)' : 'transparent',
                        color: language === l.code ? '#fff' : 'var(--text-main)',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Global Audio Read Page Button */}
            <button
              className={`btn btn-sm ${isSpeaking ? 'btn-warning animate-pulse' : 'btn-glass'} rounded-3`}
              onClick={handleReadPageAloud}
              title={isSpeaking ? t('stopAudio') : t('readPage')}
              style={{ width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isSpeaking ? <VolumeX size={17} /> : <Volume2 size={17} color="var(--primary-cyan)" />}
            </button>

            {/* Patient Profile button */}
            <button
              className={`btn btn-sm d-flex align-items-center gap-1 ${activeTab === 'profile' ? 'btn-gradient' : 'btn-glass'}`}
              onClick={() => setActiveTab('profile')}
              style={{ fontSize: '0.82rem', padding: '7px 13px', borderRadius: 'var(--radius-sm)' }}
            >
              {user ? (
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 900
                }}>
                  {user.name.charAt(0)}
                </div>
              ) : (
                <User size={14} />
              )}
              <span className="d-none d-sm-inline">{user ? user.name.split(' ')[0] : 'Patient'}</span>
            </button>

            {/* Allergy Shield badge */}
            {user && userAllergies.length > 0 && (
              <div
                className="d-none d-xl-flex align-items-center gap-1 px-3 py-1 rounded-pill"
                onClick={() => setActiveTab('profile')}
                style={{
                  cursor: 'pointer', fontSize: '0.7rem', fontWeight: 800,
                  background: 'rgba(220,38,38,0.1)', color: '#dc2626',
                  border: '1px solid rgba(220,38,38,0.3)',
                  animation: 'allergyGlow 2s infinite alternate'
                }}
              >
                <ShieldAlert size={12} />
                <span>{userAllergies.length} Allergy{userAllergies.length > 1 ? 's' : ''}</span>
              </div>
            )}

            {/* Theme toggle */}
            <button
              className="btn btn-sm btn-glass rounded-3"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              style={{ width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {theme === 'dark'
                ? <Sun size={16} color="#f59e0b" />
                : <Moon size={16} color="#4f46e5" />}
            </button>

            {/* Auth logout */}
            {user && (
              <button
                className="btn btn-sm btn-glass rounded-3"
                onClick={logout}
                title="Logout"
                style={{ width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar Drawer */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}>
          <div className="sidebar-drawer" onClick={(e) => e.stopPropagation()}>
            {/* Sidebar Header */}
            <div className="d-flex align-items-center justify-content-between mb-4 pb-3" style={{ borderBottom: '1px solid var(--border-card)' }}>
              <div className="d-flex align-items-center gap-2">
                <div className="brand-logo-circle" style={{ width: '38px', height: '38px', borderRadius: '10px' }}>
                  <Activity size={18} />
                </div>
                <div>
                  <div className="fw-bold gradient-text" style={{ fontFamily: 'Outfit', fontSize: '1.05rem' }}>NEXAMED</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '1.5px', fontWeight: 700 }}>{t('allModules').toUpperCase()}</div>
                </div>
              </div>
              <button
                className="btn btn-glass rounded-3"
                onClick={() => setSidebarOpen(false)}
                style={{ width: '34px', height: '34px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Language Selection Bar in Sidebar */}
            <div className="mb-3 p-2 rounded-3" style={{ background: 'var(--bg-input)' }}>
              <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-cyan)' }}>
                <Globe size={14} />
                <span>{t('selectLanguage').toUpperCase()}</span>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => changeLanguage(l.code)}
                    className={`btn btn-sm ${language === l.code ? 'btn-primary' : 'btn-outline-secondary'}`}
                    style={{ fontSize: '0.72rem', borderRadius: '6px', padding: '3px 8px' }}
                  >
                    {l.flag} {l.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Module list */}
            <div className="d-flex flex-column gap-1 stagger-children animate-fade-up" style={{ overflowY: 'auto', flex: 1 }}>
              {allModules.map((m) => {
                const Icon = m.icon;
                const isActive = activeTab === m.id;
                return (
                  <button
                    key={m.id}
                    className={`sidebar-module-btn ${isActive ? 'active' : ''}`}
                    onClick={() => { setActiveTab(m.id); setSidebarOpen(false); }}
                  >
                    <div className="d-flex align-items-center gap-2" style={{ flex: 1 }}>
                      <div
                        className="sidebar-module-icon"
                        style={isActive ? {} : { background: `${m.color}18`, color: m.color }}
                      >
                        <Icon size={17} />
                      </div>
                      <span style={{ fontSize: '0.88rem' }}>{m.label}</span>
                    </div>
                    <span
                      className="rounded-pill px-2"
                      style={{
                        fontSize: '0.63rem', fontWeight: 700,
                        background: isActive ? 'rgba(255,255,255,0.22)' : 'var(--bg-input)',
                        color: isActive ? '#fff' : 'var(--text-dim)',
                        padding: '2px 8px', letterSpacing: '0.03em', whiteSpace: 'nowrap'
                      }}
                    >
                      {m.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sidebar footer */}
            <div className="pt-3 mt-2" style={{ borderTop: '1px solid var(--border-card)' }}>
              <button
                className="btn-glass d-flex align-items-center gap-1 w-100 mb-2"
                onClick={toggleTheme}
                style={{ fontSize: '0.8rem', justifyContent: 'center' }}
              >
                {theme === 'dark' ? <Sun size={14} color="#f59e0b" /> : <Moon size={14} color="#4f46e5" />}
                <span>{theme === 'dark' ? t('lightMode') : t('darkMode')}</span>
              </button>
              <p style={{ fontSize: '0.67rem', color: 'var(--text-dim)', textAlign: 'center', margin: 0 }}>
                {t('footerCredit')}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
