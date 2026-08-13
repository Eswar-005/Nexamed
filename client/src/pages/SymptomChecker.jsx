import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Stethoscope, Activity, CheckSquare, Square,
  AlertTriangle, RefreshCw,
  Heart, Zap, X,
  Info, TrendingUp, Award, Shield,
  Mic, Volume2, PhoneCall, MessageSquare,
  Users, MapPin, Sparkles, VolumeX, Phone
} from 'lucide-react';

// Body region emoji icons
const REGION_ICONS = {
  'Head': '🧠', 'Chest': '🫁', 'Abdomen': '🫃',
  'Limbs': '💪', 'Skin': '🩹', 'Eyes': '👁️',
  'Throat': '🗣️', 'Back': '🦴', 'General': '🌡️',
};

// Pictorial quick-tap symptoms (icon keys map to translation keys)
const PICTORIAL_SYMPTOMS = [
  { id: 'fever',    icon: '🌡️', matchQuery: 'Fever',     labelKey: 'picFever' },
  { id: 'headache', icon: '🧠', matchQuery: 'Headache',  labelKey: 'picHeadache' },
  { id: 'cough',    icon: '🗣️', matchQuery: 'Cough',     labelKey: 'picCough' },
  { id: 'vomit',    icon: '🤮', matchQuery: 'Vomiting',  labelKey: 'picVomit' },
  { id: 'stomach',  icon: '🫃', matchQuery: 'Abdominal', labelKey: 'picStomach' },
  { id: 'bodypain', icon: '🦴', matchQuery: 'Fatigue',   labelKey: 'picBodypain' },
  { id: 'rash',     icon: '🩹', matchQuery: 'Rash',      labelKey: 'picRash' },
  { id: 'diarrhea', icon: '🚽', matchQuery: 'Diarrhea',  labelKey: 'picDiarrhea' },
];

const SPECIALTY_ICONS = {
  'General Physician': '👨‍⚕️', 'Neurologist': '🧠', 'Cardiologist': '❤️',
  'Pulmonologist': '🫁', 'Gastroenterologist': '🫃', 'Dermatologist': '🩹',
  'Orthopedist': '🦴', 'Ophthalmologist': '👁️', 'ENT Specialist': '👂',
  'Infectious Disease': '🦠', 'Endocrinologist': '⚕️',
};

const getMatchColors = (level) => {
  if (level === 'High')   return { bg: 'rgba(5,150,105,0.1)',   border: '#059669', badge: '#059669', barColor: '#059669' };
  if (level === 'Medium') return { bg: 'rgba(217,119,6,0.1)',   border: '#d97706', badge: '#d97706', barColor: '#d97706' };
  return                          { bg: 'rgba(100,116,139,0.08)', border: '#64748b', badge: '#64748b', barColor: '#94a3b8' };
};

export const SymptomChecker = () => {
  // ── All language-related state comes from global context ──
  const { t, language, speakAudio, stopAudio, isSpeaking, LANG_SPEECH_CODE } = useLanguage();

  const [groupedSymptoms,    setGroupedSymptoms]    = useState({});
  const [selectedBodyRegion, setSelectedBodyRegion] = useState('');
  const [selectedSymptomIds, setSelectedSymptomIds] = useState([]);
  const [analysisResults,    setAnalysisResults]    = useState(null);
  const [loading,            setLoading]            = useState(false);
  const [errorMsg,           setErrorMsg]           = useState('');
  const [symptomSearch,      setSymptomSearch]      = useState('');
  const [isListening,        setIsListening]        = useState(false);
  const [showDoctorHelpModal, setShowDoctorHelpModal] = useState(false);
  const [customText,         setCustomText]         = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/symptoms')
      .then((res) => res.json())
      .then((data) => {
        setGroupedSymptoms(data || {});
        const regions = Object.keys(data || {});
        if (regions.length > 0) setSelectedBodyRegion(regions[0]);
      })
      .catch((err) => console.error(err));
  }, []);

  const toggleSymptom = (id) => {
    setSelectedSymptomIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setErrorMsg('');
  };

  const removeSymptom = (id) => setSelectedSymptomIds((prev) => prev.filter((x) => x !== id));

  const handleAnalyze = () => {
    if (selectedSymptomIds.length < 2 && (!customText || customText.trim().length < 4)) {
      setErrorMsg(t('scMinSymptomError'));
      return;
    }
    setLoading(true);
    setErrorMsg('');
    fetch('http://localhost:5000/api/symptom-checker/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptomIds: selectedSymptomIds, customText })
    })
      .then((res) => res.json())
      .then((data) => {
        setAnalysisResults(data.results || []);
        setLoading(false);
        if (data.results && data.results.length > 0) {
          const top = data.results[0];
          speakAudio(`${t('scStep3')}. ${top.disease.name}. ${top.confidenceScore}%. ${t('scRecommendedDoc')}: ${top.doctorSpecialty}.`);
        }
      })
      .catch(() => setLoading(false));
  };

  const resetChecker = () => {
    setSelectedSymptomIds([]);
    setAnalysisResults(null);
    setErrorMsg('');
    setSymptomSearch('');
    setCustomText('');
    stopAudio();
  };

  // ── Voice Recognition — uses language from global context ──
  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert(t('voiceNotSupported')); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = LANG_SPEECH_CODE[language] || 'en-US';
    recognition.interimResults = false;
    setIsListening(true);
    recognition.start();
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript.toLowerCase();
      setIsListening(false);
      const matchedIds = [];
      Object.values(groupedSymptoms).forEach((list) => {
        list.forEach((sym) => {
          const nameLower = sym.name.toLowerCase();
          if (speechResult.includes(nameLower) || nameLower.split(' ').some(w => speechResult.includes(w))) {
            matchedIds.push(sym.id);
          }
        });
      });
      if (matchedIds.length > 0) {
        setSelectedSymptomIds((prev) => Array.from(new Set([...prev, ...matchedIds])));
        setErrorMsg('');
      } else {
        setSymptomSearch(speechResult);
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend   = () => setIsListening(false);
  };

  // ── Voice dictate for free-text box ──
  const startDictate = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert(t('voiceNotSupported')); return; }
    const r = new SpeechRecognition();
    r.lang = LANG_SPEECH_CODE[language] || 'en-US';
    setIsListening(true);
    r.start();
    r.onresult = (e) => {
      setCustomText((prev) => (prev ? prev + ' ' : '') + e.results[0][0].transcript);
      setIsListening(false);
    };
    r.onerror = () => setIsListening(false);
    r.onend   = () => setIsListening(false);
  };

  const handlePictorialClick = (pictorial) => {
    let foundId = null;
    Object.values(groupedSymptoms).forEach((list) => {
      list.forEach((s) => {
        if (s.name.toLowerCase().includes(pictorial.matchQuery.toLowerCase())) foundId = s.id;
      });
    });
    if (foundId) toggleSymptom(foundId);
    else setSymptomSearch(pictorial.matchQuery);
  };

  const bodyRegions = Object.keys(groupedSymptoms);
  const selectedSymptomNames = selectedSymptomIds.map((id) => {
    for (const region of Object.values(groupedSymptoms)) {
      const found = region.find((s) => s.id === id);
      if (found) return { id, name: found.name };
    }
    return null;
  }).filter(Boolean);

  const filteredSymptoms = (groupedSymptoms[selectedBodyRegion] || []).filter(
    (s) => !symptomSearch || s.name.toLowerCase().includes(symptomSearch.toLowerCase())
  );

  const progressPct = Math.min((selectedSymptomIds.length / 5) * 100, 100);

  return (
    <div className="container py-4 page-fade-in">

      {/* ── PAGE HEADER ── */}
      <div className="page-header mb-3">
        <div className="page-header-icon" style={{ background: 'linear-gradient(135deg, #0284c7, #06b6d4)' }}>
          <Stethoscope size={26} />
        </div>
        <div>
          <h2 className="fw-bold m-0" style={{ fontFamily: 'Outfit', fontSize: '1.5rem', color: 'var(--text-main)' }}>
            {t('scTitle')}
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
            {t('scSubtitle')}
          </p>
        </div>
      </div>

      {/* ── VOICE & AUDIO TOOLBAR ── */}
      <div className="p-3 mb-4 rounded-4 text-white d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 shadow-sm"
        style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)' }}>
        <div className="d-flex align-items-center gap-3">
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.92rem', fontFamily: 'Outfit' }}>
              🎤 {t('voiceAssistantTitle')}
            </div>
            <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>
              {t('voiceAssistantHint')}
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button
            onClick={startVoiceRecognition}
            disabled={isListening}
            className="btn text-white d-flex align-items-center gap-2 px-3 py-2"
            style={{
              background: isListening ? '#dc2626' : 'rgba(255,255,255,0.25)',
              border: '1px solid rgba(255,255,255,0.4)', borderRadius: '10px',
              fontWeight: 700, fontSize: '0.84rem', backdropFilter: 'blur(4px)'
            }}
          >
            <Mic size={18} className={isListening ? 'animate-pulse' : ''} />
            <span>{isListening ? t('scListeningMsg') : t('scVoiceBtn')}</span>
          </button>

          {isSpeaking ? (
            <button onClick={stopAudio}
              className="btn btn-warning d-flex align-items-center gap-2 px-3 py-2"
              style={{ borderRadius: '10px', fontWeight: 800, fontSize: '0.82rem' }}>
              <VolumeX size={18} /><span>{t('scStopAudio')}</span>
            </button>
          ) : (
            <button onClick={() => speakAudio(`${t('scTitle')}. ${t('scSubtitle')}. ${t('scDisclaimerText')}`)}
              className="btn text-white d-flex align-items-center gap-2 px-3 py-2"
              style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', fontWeight: 700, fontSize: '0.82rem' }}>
              <Volume2 size={18} /><span>{t('scListenResults')}</span>
            </button>
          )}

          <button
            className="btn text-white d-flex align-items-center gap-2 px-3 py-2"
            onClick={() => setShowDoctorHelpModal(true)}
            style={{ background: 'rgba(220,38,38,0.5)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '10px', fontWeight: 700, fontSize: '0.84rem' }}>
            <PhoneCall size={18} /><span>{t('scCallDocBtn')}</span>
          </button>
        </div>
      </div>

      {/* ── QUICK PICTORIAL SYMPTOM PICKER ── */}
      <div className="mb-4 p-3 rounded-4 glass-card-static" style={{ border: '1px solid rgba(2,132,199,0.2)', background: 'var(--bg-card)' }}>
        <div className="d-flex align-items-center gap-2 mb-2">
          <Zap size={16} color="var(--primary-cyan)" />
          <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '0.83rem', color: 'var(--text-main)', letterSpacing: '0.04em' }}>
            {t('scQuickPictorial')}
          </span>
        </div>
        <div className="row g-2">
          {PICTORIAL_SYMPTOMS.map((pic) => (
            <div key={pic.id} className="col-6 col-sm-4 col-md-3">
              <button
                onClick={() => handlePictorialClick(pic)}
                className="w-100 p-2 d-flex align-items-center gap-2 rounded-3 border-0 text-start"
                style={{ background: 'var(--bg-input)', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(2,132,199,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-input)'}
              >
                <span style={{ fontSize: '1.4rem' }}>{pic.icon}</span>
                <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-main)' }}>
                  {t(pic.labelKey)}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── FREE-TEXT DICTATION BOX ── */}
      <div className="mb-4 p-4 rounded-4 glass-card-static" style={{ border: '2px dashed #0284c7', background: 'rgba(2,132,199,0.04)' }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
          <div className="d-flex align-items-center gap-2">
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
              <MessageSquare size={18} />
            </div>
            <div>
              <h6 className="fw-bold m-0" style={{ fontFamily: 'Outfit', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                {t('scDictateTitle')}
              </h6>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {t('scDictateSubtitle')}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={startDictate}
            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
            style={{ borderRadius: '8px', fontWeight: 700, fontSize: '0.78rem' }}
          >
            <Mic size={15} className={isListening ? 'animate-pulse text-danger' : ''} />
            <span>{isListening ? t('scDictateListening') : t('scDictateBtn')}</span>
          </button>
        </div>

        <textarea
          className="glass-input w-100 p-3 mb-2"
          rows={3}
          style={{ borderRadius: '12px', fontSize: '0.88rem', resize: 'vertical' }}
          placeholder={t('scDictatePlaceholder')}
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
        />

        {customText.trim() && (
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
              ✓ {customText.trim().length} chars
            </span>
            <button type="button" onClick={() => setCustomText('')}
              className="btn btn-sm text-danger p-0 border-0 bg-transparent fw-bold"
              style={{ fontSize: '0.75rem' }}>
              {t('clearBtn')}
            </button>
          </div>
        )}
      </div>

      {/* ── 3-STEP INDICATOR ── */}
      <div className="step-indicator mb-4">
        {[{ n: 1, label: t('scStep1') }, { n: 2, label: t('scStep2') }, { n: 3, label: t('scStep3') }].map((s, idx) => (
          <React.Fragment key={s.n}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <div className={`step-dot ${selectedSymptomIds.length === 0 && idx === 0 ? 'active' : selectedSymptomIds.length > 0 && idx === 1 && !analysisResults ? 'active' : analysisResults && idx === 2 ? 'active' : selectedSymptomIds.length > 0 && idx === 0 ? 'done' : analysisResults && idx < 2 ? 'done' : ''}`}>
                {s.n}
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{s.label}</div>
            </div>
            {idx < 2 && (
              <div className="step-line" style={{ marginBottom: '18px' }}>
                <div className="step-line-fill" style={{ width: idx === 0 && selectedSymptomIds.length > 0 ? '100%' : idx === 1 && analysisResults ? '100%' : '0%' }} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── DISCLAIMER ── */}
      <div className="disclaimer-banner mb-4">
        <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>{t('scDisclaimerTitle')}</strong>
          {t('scDisclaimerText')}
        </div>
      </div>

      {!analysisResults ? (
        <>
          {/* ── SELECTED SYMPTOMS CHIPS ── */}
          {selectedSymptomNames.length > 0 && (
            <div className="mb-4 p-3 rounded-3"
              style={{ background: 'rgba(2,132,199,0.06)', border: '1px solid rgba(2,132,199,0.2)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '10px', letterSpacing: '0.05em' }}>
                {t('scSelectedCount')} ({selectedSymptomNames.length})
              </div>
              <div className="d-flex flex-wrap gap-2">
                {selectedSymptomNames.map((s) => (
                  <div key={s.id}
                    className="d-flex align-items-center gap-1 rounded-pill"
                    style={{ background: 'var(--primary-gradient)', color: '#fff', padding: '5px 12px', fontSize: '0.78rem', fontWeight: 700 }}>
                    <span>{s.name}</span>
                    <button onClick={() => removeSymptom(s.id)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', padding: 0, lineHeight: 1, marginLeft: '2px' }}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <div className="d-flex justify-content-between mb-1">
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                    {selectedSymptomIds.length < 3 ? `${t('clearBtn')} — ${3 - selectedSymptomIds.length} ${t('scAddMore')}` : t('scReady')}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--primary-cyan)', fontWeight: 700 }}>
                    {selectedSymptomIds.length}/5+ symptoms
                  </span>
                </div>
                <div className="confidence-bar-track">
                  <div className="confidence-bar-fill"
                    style={{ width: `${progressPct}%`, background: progressPct >= 60 ? '#059669' : 'var(--primary-cyan)', transition: 'width 0.4s ease' }} />
                </div>
              </div>
            </div>
          )}

          <div className="row g-4">
            {/* STEP 1: Region Selector */}
            <div className="col-md-4">
              <div className="glass-card-static p-4">
                <h6 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-dim)', letterSpacing: '0.07em', marginBottom: '16px' }}>
                  {t('scStep1').toUpperCase()}
                </h6>
                <div className="d-flex flex-column gap-2">
                  {bodyRegions.map((region) => {
                    const isActive = selectedBodyRegion === region;
                    const count = groupedSymptoms[region]?.length || 0;
                    const selectedInRegion = groupedSymptoms[region]?.filter((s) => selectedSymptomIds.includes(s.id)).length || 0;
                    return (
                      <button key={region}
                        onClick={() => setSelectedBodyRegion(region)}
                        className="d-flex align-items-center justify-content-between text-start w-100"
                        style={{
                          padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                          border: `1px solid ${isActive ? 'transparent' : 'var(--border-glass)'}`,
                          background: isActive ? 'var(--primary-gradient)' : 'var(--bg-input)',
                          color: isActive ? '#fff' : 'var(--text-main)',
                          fontWeight: 600, fontSize: '0.86rem', cursor: 'pointer', transition: 'all 0.2s',
                          boxShadow: isActive ? '0 4px 12px rgba(2,132,199,0.28)' : 'none'
                        }}>
                        <div className="d-flex align-items-center gap-2">
                          <span style={{ fontSize: '1.1rem' }}>{REGION_ICONS[region] || '🩺'}</span>
                          <span>{t(region) || region}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          {selectedInRegion > 0 && (
                            <span style={{ width: '18px', height: '18px', borderRadius: '50%', fontSize: '0.65rem', background: isActive ? 'rgba(255,255,255,0.3)' : '#059669', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                              {selectedInRegion}
                            </span>
                          )}
                          <span style={{ fontSize: '0.67rem', fontWeight: 700, padding: '2px 7px', borderRadius: '999px', background: isActive ? 'rgba(255,255,255,0.22)' : 'var(--bg-card)', color: isActive ? '#fff' : 'var(--text-dim)' }}>
                            {count}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Analyze CTA */}
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-card)' }}>
                  <div className="d-flex justify-content-between align-items-center p-3 rounded-3 mb-3" style={{ background: 'var(--bg-input)' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.04em' }}>{t('scSelectedCount')}</div>
                      <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.8rem', color: 'var(--text-main)', lineHeight: 1 }}>
                        {selectedSymptomIds.length}
                        <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-dim)', marginLeft: '4px' }}>symptoms</span>
                      </div>
                    </div>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: selectedSymptomIds.length >= 3 ? '#05966920' : 'var(--bg-input)', border: `2px solid ${selectedSymptomIds.length >= 3 ? '#059669' : 'var(--border-glass)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
                      <TrendingUp size={20} color={selectedSymptomIds.length >= 3 ? '#059669' : 'var(--text-dim)'} />
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="d-flex align-items-center gap-2 p-2 rounded-2 mb-3"
                      style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', fontSize: '0.78rem', color: '#dc2626' }}>
                      <AlertTriangle size={13} /> {errorMsg}
                    </div>
                  )}

                  <button
                    className="btn-gradient w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                    style={{ borderRadius: 'var(--radius-md)', fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.95rem' }}
                    onClick={handleAnalyze}
                    disabled={loading}>
                    {loading
                      ? <><div className="spinner-border spinner-border-sm" style={{ width: '18px', height: '18px' }} /> {t('scAnalyzingBtn')}</>
                      : <><Activity size={18} /> {t('scAnalyzeBtn')}</>}
                  </button>

                  {selectedSymptomIds.length > 0 && (
                    <button onClick={resetChecker}
                      className="btn-glass w-100 py-2 mt-2 d-flex align-items-center justify-content-center gap-1"
                      style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                      <RefreshCw size={14} /> {t('scClearAll')}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* STEP 2: Symptom Checkboxes */}
            <div className="col-md-8">
              <div className="glass-card-static p-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h6 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-dim)', letterSpacing: '0.07em', margin: 0 }}>
                    {t('scStep2').toUpperCase()} —{' '}
                    <span style={{ color: 'var(--primary-cyan)' }}>{(t(selectedBodyRegion) || selectedBodyRegion).toUpperCase()}</span>
                  </h6>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{filteredSymptoms.length} symptoms</span>
                </div>

                {/* Search / Voice */}
                <div className="position-relative mb-4">
                  <span className="position-absolute top-50 start-0 translate-middle-y ms-3"
                    style={{ fontSize: '13px', color: 'var(--text-dim)', pointerEvents: 'none' }}>🔍</span>
                  <input
                    type="text"
                    className="glass-input"
                    style={{ paddingLeft: '36px', paddingRight: '45px', fontSize: '0.85rem' }}
                    placeholder={t('scSearchPlaceholder')}
                    value={symptomSearch}
                    onChange={(e) => setSymptomSearch(e.target.value)}
                  />
                  <button
                    onClick={startVoiceRecognition}
                    className="position-absolute top-50 end-0 translate-middle-y me-2 border-0 bg-transparent"
                    title={t('scVoiceBtn')}
                    style={{ color: isListening ? '#dc2626' : 'var(--primary-cyan)', cursor: 'pointer', padding: '4px' }}>
                    <Mic size={18} className={isListening ? 'animate-pulse' : ''} />
                  </button>
                </div>

                <div className="row g-2">
                  {filteredSymptoms.map((sym) => {
                    const isChecked = selectedSymptomIds.includes(sym.id);
                    return (
                      <div key={sym.id} className="col-md-6">
                        <div
                          onClick={() => toggleSymptom(sym.id)}
                          style={{
                            padding: '12px 14px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                            border: `1.5px solid ${isChecked ? 'var(--primary-cyan)' : 'var(--border-glass)'}`,
                            background: isChecked ? 'rgba(2,132,199,0.08)' : 'var(--bg-input)',
                            display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.18s',
                            transform: isChecked ? 'scale(1.01)' : 'scale(1)',
                          }}>
                          <div style={{ flexShrink: 0, color: isChecked ? 'var(--primary-cyan)' : 'var(--text-dim)', transition: 'color 0.18s' }}>
                            {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.86rem', fontWeight: isChecked ? 700 : 600, color: 'var(--text-main)' }}>{sym.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{sym.category}</div>
                          </div>
                          {isChecked && (
                            <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-cyan)' }} />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {filteredSymptoms.length === 0 && (
                    <div className="col-12 text-center py-4" style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                      {t('scNoMatch')} "{symptomSearch}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ── RESULTS VIEW ── */
        <div className="animate-fade-up">
          <div className="d-flex justify-content-between align-items-center mb-4 p-4 rounded-4 flex-wrap gap-3"
            style={{ background: 'linear-gradient(135deg, rgba(2,132,199,0.08), rgba(13,148,136,0.05))', border: '1px solid rgba(2,132,199,0.2)' }}>
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <Award size={18} color="#0284c7" />
                <h4 style={{ fontFamily: 'Outfit', fontWeight: 800, color: 'var(--text-main)', margin: 0, fontSize: '1.2rem' }}>
                  {t('scStep3')}
                </h4>
              </div>
              <span style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>
                {selectedSymptomIds.length} symptoms → <strong style={{ color: 'var(--primary-cyan)' }}>{analysisResults.length}</strong> conditions
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                onClick={() => {
                  const summaryText = analysisResults.map((r, i) => `#${i+1} ${r.disease.name}. ${r.confidenceScore}%. ${t('scRecommendedDoc')}: ${r.doctorSpecialty}.`).join(' ');
                  speakAudio(`${t('scStep3')}. ${summaryText}`);
                }}
                style={{ fontSize: '0.8rem', borderRadius: '8px' }}>
                <Volume2 size={16} /><span>{t('scListenResults')}</span>
              </button>
              <button className="btn-glass d-flex align-items-center gap-2" onClick={resetChecker}
                style={{ fontSize: '0.83rem' }}>
                <RefreshCw size={15} /> {t('scNewCheck')}
              </button>
            </div>
          </div>

          {/* Symptom chips summary */}
          <div className="mb-4 p-3 rounded-3" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '8px', letterSpacing: '0.05em' }}>
              {t('scSelectedCount')}
            </div>
            <div className="d-flex flex-wrap gap-2">
              {selectedSymptomNames.map((s) => (
                <span key={s.id} className="badge-cyan" style={{ fontSize: '0.75rem' }}>{s.name}</span>
              ))}
            </div>
          </div>

          {/* Result cards */}
          <div className="d-flex flex-column gap-4">
            {analysisResults.map((res, idx) => {
              const colors = getMatchColors(res.matchLevel);
              const pct = res.confidenceScore;
              const specialtyIcon = Object.entries(SPECIALTY_ICONS).find(
                ([key]) => res.doctorSpecialty?.toLowerCase().includes(key.toLowerCase())
              )?.[1] || '👨‍⚕️';

              return (
                <div key={res.disease.id} className="glass-card-static overflow-hidden"
                  style={{ borderLeft: `5px solid ${colors.border}` }}>

                  <div className="p-4 pb-3 d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, background: idx === 0 ? 'linear-gradient(135deg,#d97706,#f59e0b)' : 'var(--bg-input)', color: idx === 0 ? '#fff' : 'var(--text-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit', fontWeight: 900, fontSize: '0.85rem', border: idx === 0 ? 'none' : '1px solid var(--border-glass)' }}>
                        #{idx + 1}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '5px 14px', borderRadius: '999px', background: colors.bg, color: colors.badge, border: `1px solid ${colors.border}30` }}>
                        {pct}% — {res.matchLevel}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '5px 10px', borderRadius: '6px', background: 'var(--bg-input)', color: 'var(--text-dim)', fontFamily: 'Outfit' }}>
                        {t('scIcdCode')}: {res.disease.icd_code}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-3"
                      style={{ background: 'rgba(2,132,199,0.08)', border: '1px solid rgba(2,132,199,0.2)' }}>
                      <span style={{ fontSize: '1.1rem' }}>{specialtyIcon}</span>
                      <div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-dim)', letterSpacing: '0.04em' }}>{t('scRecommendedDoc')}</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-cyan)' }}>{res.doctorSpecialty}</div>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600 }}>{t('scMatchConfidence')}</span>
                      <span style={{ fontSize: '0.7rem', color: colors.badge, fontWeight: 800 }}>{pct}%</span>
                    </div>
                    <div className="confidence-bar-track">
                      <div className="confidence-bar-fill" style={{ width: `${pct}%`, background: colors.barColor }} />
                    </div>
                  </div>

                  <div className="px-4 pb-3">
                    <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                      <h4 style={{ fontFamily: 'Outfit', fontWeight: 800, color: 'var(--text-main)', margin: 0, fontSize: '1.2rem' }}>
                        {res.disease.name}
                      </h4>
                      <button onClick={() => speakAudio(`${res.disease.name}. ${res.disease.overview}`)}
                        className="btn btn-sm text-primary p-0 border-0 bg-transparent" title={t('scListenResults')}>
                        <Volume2 size={18} />
                      </button>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 0 }}>
                      {res.disease.overview}
                    </p>
                  </div>

                  {res.disease.emergency_signs && (
                    <div className="mx-4 mb-4 p-3 rounded-3 d-flex align-items-start gap-2"
                      style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)' }}>
                      <AlertTriangle size={15} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#dc2626', marginBottom: '3px', letterSpacing: '0.04em' }}>
                          {t('scEmergencySigns')}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#dc2626' }}>{res.disease.emergency_signs}</span>
                      </div>
                    </div>
                  )}

                  <div className="px-4 pb-4 d-flex align-items-center justify-content-between flex-wrap gap-2"
                    style={{ borderTop: '1px solid var(--border-card)', paddingTop: '14px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      <Shield size={13} style={{ marginRight: '4px' }} />
                      {t('emergencyDisclaimer')}
                    </span>
                    <button onClick={() => setShowDoctorHelpModal(true)}
                      className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                      style={{ borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700 }}>
                      <PhoneCall size={14} /><span>{t('scCallDocBtn')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-4 rounded-3 text-center"
            style={{ background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.2)' }}>
            <AlertTriangle size={18} color="#d97706" style={{ marginBottom: '8px' }} />
            <p style={{ fontSize: '0.82rem', color: '#92400e', margin: 0, lineHeight: 1.6 }}>
              <strong>{t('scDisclaimerTitle')}</strong>{t('scDisclaimerText')}
            </p>
          </div>
        </div>
      )}

      {/* ── DOCTOR HELP MODAL ── */}
      {showDoctorHelpModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(5px)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow-lg overflow-hidden">

              <div className="modal-header text-white p-4" style={{ background: 'linear-gradient(135deg, #0284c7, #0d9488)' }}>
                <div className="d-flex align-items-center gap-3">
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={22} color="#fff" />
                  </div>
                  <div>
                    <h5 className="modal-title fw-bold m-0" style={{ fontFamily: 'Outfit' }}>
                      {t('scNeedHelpTitle')}
                    </h5>
                    <span style={{ fontSize: '0.78rem', opacity: 0.9 }}>{t('scRuralSupport')}</span>
                  </div>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDoctorHelpModal(false)} />
              </div>

              <div className="modal-body p-4">
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>{t('scNeedHelpDesc')}</p>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3 rounded-3 h-100" style={{ background: 'rgba(2,132,199,0.07)', border: '1px solid rgba(2,132,199,0.25)' }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <PhoneCall size={20} color="#0284c7" />
                        <h6 className="fw-bold m-0" style={{ color: '#0284c7' }}>{t('scHelpline104Title')}</h6>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{t('scHelpline104Sub')}</p>
                      <a href="tel:104" className="btn btn-primary w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                        style={{ borderRadius: '8px', background: 'var(--primary-gradient)', border: 'none' }}>
                        <Phone size={16} /><span>104</span>
                      </a>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="p-3 rounded-3 h-100" style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.25)' }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <AlertTriangle size={20} color="#dc2626" />
                        <h6 className="fw-bold m-0" style={{ color: '#dc2626' }}>{t('scHelpline108Title')}</h6>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{t('scHelpline108Sub')}</p>
                      <a href="tel:108" className="btn btn-danger w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                        style={{ borderRadius: '8px', background: 'linear-gradient(135deg,#dc2626,#b91c1c)', border: 'none' }}>
                        <Phone size={16} /><span>108</span>
                      </a>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="p-3 rounded-3" style={{ background: 'rgba(5,150,105,0.07)', border: '1px solid rgba(5,150,105,0.25)' }}>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <MapPin size={18} color="#059669" />
                        <h6 className="fw-bold m-0" style={{ color: '#059669' }}>{t('scAshaGuidanceTitle')}</h6>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                        {t('scAshaGuidanceSub')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer p-3" style={{ background: 'var(--bg-input)' }}>
                <button
                  onClick={() => speakAudio(`${t('scNeedHelpTitle')}. ${t('scNeedHelpDesc')}.`)}
                  className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1">
                  <Volume2 size={16} /><span>{t('scListenResults')}</span>
                </button>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowDoctorHelpModal(false)}>
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
