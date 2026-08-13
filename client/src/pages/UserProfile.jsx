import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User, ShieldAlert, Plus, Mail, Lock, Heart,
  CheckCircle, Eye, EyeOff, PhoneCall, Activity,
  FileText, Calendar, Clock, AlertCircle, Trash2,
  Shield, UserCheck, ShieldCheck, FileSpreadsheet,
  Download, Printer, ChevronRight, ExternalLink, X,
  AlertTriangle
} from 'lucide-react';

export const UserProfile = () => {
  const { user, token, userProfile, userAllergies, userHistory, userContacts, userReports, login, logout, fetchProfile } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [showPassword, setShowPassword] = useState(false);

  const [allergenInput, setAllergenInput] = useState('');
  const [allergySeverity, setAllergySeverity] = useState('severe');
  const [allergyReaction, setAllergyReaction] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [activeProfileTab, setActiveProfileTab] = useState('reports');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showPassportPrintModal, setShowPassportPrintModal] = useState(false);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone, password, bloodGroup,
          // New users start with empty records; they add allergies in the portal
          allergies: [],
          medicalHistory: [],
          emergencyContacts: []
        })
      });
      const data = await res.json();
      if (!res.ok) { setAuthError(data.error || 'Authentication failed'); }
      else { login(data.token, data.user); }
    } catch (err) {
      setAuthError('Connection error. Ensure server is running at localhost:5000.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsRegister(false);
    setEmail('demo@nexamed.com');
    setPassword('password123');
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@nexamed.com', password: 'password123' })
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Demo login failed');
      } else if (data.token) {
        login(data.token, data.user);
      }
    } catch (err) {
      setAuthError('Connection error. Ensure server is running at localhost:5000.');
    } finally {
      setAuthLoading(false);
    }
  };

  const addAllergy = async (e) => {
    e.preventDefault();
    if (!allergenInput) return;
    const updated = [...userAllergies, { allergen: allergenInput, severity: allergySeverity, reaction: allergyReaction }];
    try {
      await fetch('http://localhost:5000/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ allergies: updated })
      });
      setAllergenInput(''); setAllergyReaction('');
      fetchProfile(token);
    } catch (err) { console.error(err); }
  };

  const getSeverityStyle = (severity) => {
    const s = (severity || '').toLowerCase();
    if (s === 'severe') return { bg: 'rgba(220,38,38,0.1)', color: '#dc2626', border: 'rgba(220,38,38,0.3)' };
    if (s === 'moderate') return { bg: 'rgba(217,119,6,0.1)', color: '#d97706', border: 'rgba(217,119,6,0.3)' };
    return { bg: 'rgba(2,132,199,0.1)', color: '#0284c7', border: 'rgba(2,132,199,0.3)' };
  };

  const getReportStatusStyle = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('attention') || s.includes('high') || s.includes('critical'))
      return { bg: 'rgba(217,119,6,0.12)', color: '#d97706', border: 'rgba(217,119,6,0.3)', badge: '⚠️ Attention' };
    return { bg: 'rgba(5,150,105,0.12)', color: '#059669', border: 'rgba(5,150,105,0.3)', badge: '✓ Normal' };
  };

  if (!user) {
    return (
      <div className="container py-5 d-flex justify-content-center">
        <div style={{ width: '100%', maxWidth: '460px' }}>
          {/* Login Card */}
          <div className="glass-card-static p-5 rounded-4" style={{ border: '1px solid rgba(2,132,199,0.2)' }}>
            <div className="text-center mb-4">
              <div className="d-inline-flex p-3 rounded-3 mb-3"
                style={{ background: 'var(--primary-gradient)', boxShadow: '0 6px 20px rgba(2,132,199,0.3)' }}>
                <User size={32} color="#fff" />
              </div>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                {isRegister ? 'Create Patient Account' : 'Patient Login'}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Access your digital health passport and diagnostic reports
              </p>
            </div>

            {authError && (
              <div className="d-flex align-items-center gap-2 p-3 rounded-3 mb-3"
                style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', fontSize: '0.83rem', color: '#dc2626' }}>
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="d-flex flex-column gap-3 mb-3">
              {isRegister && (
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>FULL NAME</label>
                  <input type="text" className="glass-input" placeholder="Rahul Sharma" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>EMAIL ADDRESS</label>
                <div className="position-relative">
                  <Mail size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3"
                    style={{ color: 'var(--text-dim)', pointerEvents: 'none' }} />
                  <input type="email" className="glass-input" style={{ paddingLeft: '40px' }}
                    placeholder="demo@nexamed.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>PASSWORD</label>
                <div className="position-relative">
                  <Lock size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3"
                    style={{ color: 'var(--text-dim)', pointerEvents: 'none' }} />
                  <input type={showPassword ? 'text' : 'password'} className="glass-input"
                    style={{ paddingLeft: '40px', paddingRight: '44px' }}
                    placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button"
                    className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent p-0"
                    style={{ color: 'var(--text-dim)', cursor: 'pointer' }}
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-gradient py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                style={{ borderRadius: 'var(--radius-md)', fontFamily: 'Outfit', fontSize: '0.95rem' }}
                disabled={authLoading}>
                {authLoading ? (
                  <div className="spinner-border spinner-border-sm" style={{ width: '18px', height: '18px' }} role="status" />
                ) : null}
                {isRegister ? 'Create Account' : 'Sign In to Portal'}
              </button>
            </form>

            <div className="d-flex flex-column gap-2 pt-3" style={{ borderTop: '1px solid var(--border-card)' }}>
              <button className="btn-glass w-100 py-2 d-flex align-items-center justify-content-center gap-2" onClick={handleDemoLogin}
                style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', borderColor: 'rgba(2,132,199,0.3)' }}>
                🚀 Quick Demo Login (Rahul Sharma)
              </button>
              <button className="border-0 bg-transparent p-0 text-center w-100"
                style={{ fontSize: '0.83rem', color: 'var(--text-dim)', cursor: 'pointer' }}
                onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                <strong style={{ color: 'var(--primary-cyan)' }}>
                  {isRegister ? 'Sign In' : 'Register'}
                </strong>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div className="page-header mb-0">
          <div className="page-header-icon">
            <User size={24} />
          </div>
          <div>
            <h2 className="fw-bold m-0" style={{ fontFamily: 'Outfit', fontSize: '1.5rem', color: 'var(--text-main)' }}>
              Digital Health Passport & Diagnostic Reports
            </h2>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: 0 }}>
              {user.name} · {user.email} · Nexamed Patient ID: NEX-2026-0042
            </p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button className="btn-gradient d-flex align-items-center gap-2"
            style={{ fontSize: '0.83rem' }}
            onClick={() => setShowPassportPrintModal(true)}>
            <Printer size={15} /> Print Summary Report
          </button>
          <button className="btn-glass d-flex align-items-center gap-2" onClick={logout}
            style={{ fontSize: '0.83rem', color: '#dc2626', borderColor: 'rgba(220,38,38,0.3)' }}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Patient Identity Card */}
        <div className="col-lg-4">
          <div className="glass-card-static p-4 h-100">
            {/* Avatar */}
            <div className="d-flex align-items-center gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-card)' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '18px',
                background: 'var(--primary-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.6rem',
                boxShadow: '0 6px 18px rgba(2,132,199,0.35)', flexShrink: 0
              }}>
                {user.name.charAt(0)}
              </div>
              <div>
                <h4 style={{ fontFamily: 'Outfit', fontWeight: 800, color: 'var(--text-main)', margin: 0, fontSize: '1.1rem' }}>
                  {user.name}
                </h4>
                <div className="d-flex gap-1 mt-1 flex-wrap">
                  <span className="badge-cyan" style={{ fontSize: '0.68rem' }}>{user.role.toUpperCase()}</span>
                  <span className="badge-danger" style={{ fontSize: '0.68rem' }}>
                    {userProfile?.blood_group || 'O+'}
                  </span>
                </div>
              </div>
            </div>

            {/* Vitals Summary */}
            <div className="d-flex flex-column gap-2 mb-4">
              {[
                { label: 'Mobile Phone', value: user.phone || '+91 9876543210' },
                { label: 'Date of Birth', value: userProfile?.date_of_birth || '1995-06-15' },
                { label: 'Weight / Height', value: `${userProfile?.weight_kg || '72.5'} kg / ${userProfile?.height_cm || '175'} cm` },
                { label: 'Calculated BMI', value: '23.6 kg/m² (Normal Weight)' },
                { label: 'Diagnostic Reports', value: `${userReports.length} lab report(s)` },
                { label: 'Allergy Flags', value: `${userAllergies.length} allergen(s)` },
                { label: 'Chronic Illnesses', value: `${userHistory.length} condition(s)` },
                { label: 'SOS Contacts', value: `${userContacts.length} emergency contact(s)` },
              ].map((row) => (
                <div key={row.label} className="d-flex justify-content-between align-items-center p-2 rounded-2"
                  style={{ background: 'var(--bg-input)', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>{row.label}</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Allergy shield info */}
            <div className="p-3 rounded-3" style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.2)' }}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <ShieldAlert size={16} color="#dc2626" />
                <span style={{ fontWeight: 700, fontSize: '0.83rem', color: '#dc2626' }}>Live Allergy Warning Shield</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                Registered allergen flags trigger warnings on matching chemical formulations across the portal.
              </p>
            </div>
          </div>
        </div>

        {/* Tabbed Passport Sections */}
        <div className="col-lg-8">
          <div className="glass-card-static p-4 h-100">

            {/* Profile Navigation Tabs */}
            <div className="d-flex gap-2 mb-4 p-1 rounded-3" style={{ background: 'var(--bg-input)' }}>
              {[
                { id: 'reports',   label: `Lab Reports (${userReports.length})`, icon: FileSpreadsheet, color: '#059669' },
                { id: 'allergies', label: `Allergy Shield (${userAllergies.length})`, icon: ShieldAlert, color: '#dc2626' },
                { id: 'history',   label: `Medical History (${userHistory.length})`, icon: FileText,   color: '#7c3aed' },
                { id: 'contacts',  label: `SOS Contacts (${userContacts.length})`,    icon: PhoneCall,  color: '#0284c7' },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeProfileTab === tab.id;
                return (
                  <button key={tab.id}
                    onClick={() => setActiveProfileTab(tab.id)}
                    className="flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2 px-2 rounded-2 border-0"
                    style={{
                      fontSize: '0.81rem', fontWeight: 700, fontFamily: 'Outfit',
                      cursor: 'pointer', transition: 'all 0.2s',
                      background: isActive ? 'var(--bg-card)' : 'transparent',
                      color: isActive ? tab.color : 'var(--text-dim)',
                      boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
                    }}>
                    <Icon size={15} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: DIAGNOSTIC REPORTS */}
            {activeProfileTab === 'reports' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}
                    className="d-flex align-items-center gap-2">
                    <FileSpreadsheet size={20} color="#059669" />
                    Diagnostic Lab Reports & Prescriptions
                  </h5>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    {userReports.length} records available
                  </span>
                </div>

                {userReports.length === 0 ? (
                  <div className="text-center py-4 rounded-3" style={{ background: 'var(--bg-input)' }}>
                    <FileSpreadsheet size={36} style={{ color: 'var(--text-light)', marginBottom: '8px' }} />
                    <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: 0 }}>No diagnostic reports uploaded</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {userReports.map((report) => {
                      const st = getReportStatusStyle(report.status);
                      return (
                        <div key={report.id} className="card-premium p-4">
                          <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                            <div>
                              <span style={{
                                fontSize: '0.68rem', fontWeight: 800, padding: '3px 10px', borderRadius: '999px',
                                background: 'rgba(2,132,199,0.12)', color: 'var(--primary-cyan)',
                                border: '1px solid rgba(2,132,199,0.25)', display: 'inline-block', marginBottom: '6px'
                              }}>
                                {report.category}
                              </span>
                              <h5 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)', margin: 0 }}>
                                {report.title}
                              </h5>
                            </div>
                            <span style={{
                              fontSize: '0.72rem', fontWeight: 800, padding: '4px 12px', borderRadius: '999px',
                              background: st.bg, color: st.color, border: `1px solid ${st.border}`
                            }}>
                              {st.badge}
                            </span>
                          </div>

                          <div className="d-flex flex-wrap gap-3 mb-3" style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                            <span>🏛️ <strong>{report.lab_name}</strong></span>
                            <span>👨‍⚕️ <strong>{report.doctor_name}</strong></span>
                            <span>📅 {report.report_date}</span>
                          </div>

                          <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: '12px' }}>
                            {report.summary}
                          </p>

                          <button className="btn-glass d-flex align-items-center gap-2"
                            style={{ fontSize: '0.8rem', color: 'var(--primary-cyan)', borderColor: 'rgba(2,132,199,0.3)' }}
                            onClick={() => setSelectedReport(report)}>
                            <FileSpreadsheet size={14} />
                            <span>View Test Result Breakdown</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ALLERGIES */}
            {activeProfileTab === 'allergies' && (
              <div>
                <h5 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}
                  className="d-flex align-items-center gap-2">
                  <ShieldAlert size={20} color="#dc2626" />
                  Registered Drug & Food Allergies
                </h5>

                {userAllergies.length === 0 ? (
                  <div className="text-center py-4 mb-4 rounded-3" style={{ background: 'var(--bg-input)' }}>
                    <ShieldAlert size={32} style={{ color: 'var(--text-light)', marginBottom: '8px' }} />
                    <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: 0 }}>No allergies registered yet</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2 mb-4">
                    {userAllergies.map((a, idx) => {
                      const sc = getSeverityStyle(a.severity);
                      return (
                        <div key={idx} className="glass-card p-3 d-flex justify-content-between align-items-center">
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{a.allergen}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              Reaction: {a.reaction || 'Severe sensitivity'}
                            </div>
                          </div>
                          <span style={{
                            fontSize: '0.7rem', fontWeight: 800, padding: '4px 12px', borderRadius: '999px',
                            background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`
                          }}>
                            {(a.severity || 'unknown').toUpperCase()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add Allergy Form */}
                <form onSubmit={addAllergy} className="p-4 rounded-3" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)' }}>
                  <h6 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-main)', marginBottom: '14px' }}>
                    Register New Drug Allergy
                  </h6>
                  <div className="row g-2 mb-3">
                    <div className="col-md-5">
                      <input type="text" className="glass-input"
                        placeholder="Allergen (e.g. Aspirin, Penicillin)..."
                        value={allergenInput}
                        onChange={(e) => setAllergenInput(e.target.value)}
                        required />
                    </div>
                    <div className="col-md-4">
                      <input type="text" className="glass-input"
                        placeholder="Reaction (e.g. Hives)..."
                        value={allergyReaction}
                        onChange={(e) => setAllergyReaction(e.target.value)} />
                    </div>
                    <div className="col-md-3">
                      <select className="glass-input" value={allergySeverity} onChange={(e) => setAllergySeverity(e.target.value)}>
                        <option value="severe">Severe</option>
                        <option value="moderate">Moderate</option>
                        <option value="mild">Mild</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn-gradient w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                    style={{ borderRadius: 'var(--radius-md)', fontFamily: 'Outfit' }}>
                    <Plus size={16} /> Save Allergy Flag
                  </button>
                </form>
              </div>
            )}

            {/* TAB 3: MEDICAL HISTORY */}
            {activeProfileTab === 'history' && (
              <div>
                <h5 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}
                  className="d-flex align-items-center gap-2">
                  <FileText size={20} color="#7c3aed" />
                  Chronic Medical History & Pre-existing Conditions
                </h5>

                {userHistory.length === 0 ? (
                  <div className="text-center py-4 rounded-3" style={{ background: 'var(--bg-input)' }}>
                    <FileText size={32} style={{ color: 'var(--text-light)', marginBottom: '8px' }} />
                    <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: 0 }}>No chronic conditions recorded</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {userHistory.map((h, idx) => (
                      <div key={idx} className="glass-card p-4" style={{ borderLeft: '4px solid #7c3aed' }}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', margin: 0 }}>
                            {h.condition_name}
                          </h6>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', background: 'rgba(124,58,237,0.12)', color: '#7c3aed', border: '1px solid rgba(124,58,237,0.3)' }}>
                            Diagnosed {h.diagnosed_year}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.55 }}>
                          {h.notes || 'Under clinical observation and management.'}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: EMERGENCY SOS CONTACTS */}
            {activeProfileTab === 'contacts' && (
              <div>
                <h5 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px' }}
                  className="d-flex align-items-center gap-2">
                  <PhoneCall size={20} color="#0284c7" />
                  Notified 1-Tap SOS Emergency Contacts
                </h5>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  These contacts receive your live GPS coordinate pin automatically whenever you trigger the 1-Tap Emergency SOS button.
                </p>

                {userContacts.length === 0 ? (
                  <div className="text-center py-4 rounded-3" style={{ background: 'var(--bg-input)' }}>
                    <PhoneCall size={32} style={{ color: 'var(--text-light)', marginBottom: '8px' }} />
                    <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: 0 }}>No emergency contacts assigned</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {userContacts.map((c, idx) => (
                      <div key={idx} className="glass-card p-4 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-3">
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '12px',
                            background: 'rgba(2,132,199,0.12)', color: 'var(--primary-cyan)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <PhoneCall size={18} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>{c.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.phone} · {c.relationship}</div>
                          </div>
                        </div>
                        <span className="badge-cyan" style={{ fontSize: '0.72rem' }}>
                          Priority #{c.priority || idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── REPORT BREAKDOWN MODAL ── */}
      {selectedReport && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(6,13,26,0.85)', backdropFilter: 'blur(12px)', zIndex: 9999 }}>
          <div className="glass-card-static p-0 w-100 overflow-auto rounded-4"
            style={{ maxWidth: '750px', maxHeight: '90vh', border: '1px solid rgba(2,132,199,0.3)' }}>

            {/* Modal Header */}
            <div className="p-4 pb-3 d-flex justify-content-between align-items-start"
              style={{ background: 'var(--primary-gradient)', borderRadius: '16px 16px 0 0' }}>
              <div>
                <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '3px 10px', borderRadius: '999px', fontWeight: 700 }}>
                  {selectedReport.category} · {selectedReport.report_date}
                </span>
                <h3 className="fw-bold mt-2 mb-0" style={{ fontFamily: 'Outfit', color: '#fff', fontSize: '1.4rem' }}>
                  {selectedReport.title}
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>
                  {selectedReport.lab_name}
                </span>
              </div>
              <button className="btn-glass rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '38px', height: '38px', padding: 0, flexShrink: 0, background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
                onClick={() => setSelectedReport(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="p-4">
              {/* Doctor info bar */}
              <div className="d-flex justify-content-between align-items-center p-3 rounded-3 mb-4"
                style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)', fontSize: '0.83rem' }}>
                <div>
                  <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>ATTENDING DOCTOR / PATHOLOGIST:</span>
                  <div style={{ color: 'var(--text-main)', fontWeight: 700 }}>{selectedReport.doctor_name}</div>
                </div>
                <span className="badge-cyan" style={{ fontSize: '0.75rem' }}>Status: {selectedReport.status}</span>
              </div>

              {/* Summary */}
              <div className="mb-4">
                <h6 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Clinical Findings Summary
                </h6>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{selectedReport.summary}</p>
              </div>

              {/* Parameter Table */}
              {selectedReport.test_results && (
                <div className="mb-4">
                  <h6 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
                    Laboratory Test Parameter Breakdown
                  </h6>
                  <div className="table-responsive rounded-3 overflow-hidden" style={{ border: '1px solid var(--border-card)' }}>
                    <table className="table table-hover align-middle m-0" style={{ fontSize: '0.83rem' }}>
                      <thead style={{ background: 'var(--bg-input)' }}>
                        <tr>
                          <th>TEST PARAMETER</th>
                          <th>VALUE</th>
                          <th>REFERENCE RANGE</th>
                          <th>STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {JSON.parse(selectedReport.test_results).map((tr, idx) => (
                          <tr key={idx}>
                            <td className="fw-semibold text-main">{tr.parameter}</td>
                            <td className="fw-bold" style={{ color: 'var(--primary-cyan)' }}>{tr.value}</td>
                            <td className="text-muted">{tr.reference}</td>
                            <td>
                              <span style={{
                                fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px',
                                background: tr.status === 'High' || tr.status === 'Attention Needed' ? 'rgba(217,119,6,0.12)' : 'rgba(5,150,105,0.12)',
                                color: tr.status === 'High' || tr.status === 'Attention Needed' ? '#d97706' : '#059669'
                              }}>
                                {tr.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="d-flex gap-2">
                <button className="btn-gradient flex-grow-1 py-3 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => window.print()}>
                  <Printer size={16} /> Print Official Lab Report
                </button>
                <button className="btn-glass py-3 px-4 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => setSelectedReport(null)}>
                  <X size={16} /> Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PRINT PATIENT HEALTH PASSPORT MODAL ── */}
      {showPassportPrintModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(6,13,26,0.85)', backdropFilter: 'blur(12px)', zIndex: 9999 }}>
          <div className="glass-card-static p-4 w-100 overflow-auto rounded-4"
            style={{ maxWidth: '680px', maxHeight: '90vh', background: '#ffffff', color: '#0f172a' }}>

            <div className="text-center pb-3 mb-3 border-bottom border-secondary-subtle">
              <h3 className="fw-black m-0 text-primary" style={{ fontFamily: 'Outfit' }}>NEXAMED HEALTHCARE PORTAL</h3>
              <p className="text-muted small m-0">DIGITAL PATIENT HEALTH PASSPORT & SUMMARY REPORT</p>
              <div className="badge bg-secondary text-white mt-1">NEX-2026-0042</div>
            </div>

            <div className="row g-3 mb-3 small">
              <div className="col-6"><strong>Patient Name:</strong> {user.name}</div>
              <div className="col-6"><strong>Date of Birth:</strong> {userProfile?.date_of_birth || '1995-06-15'}</div>
              <div className="col-6"><strong>Blood Group:</strong> <span className="text-danger fw-bold">{userProfile?.blood_group || 'O+'}</span></div>
              <div className="col-6"><strong>Mobile:</strong> {user.phone || '+91 9876543210'}</div>
            </div>

            <div className="p-3 bg-light rounded mb-3 small">
              <strong className="text-danger">⚠️ ALLERGY WARNING SHIELD:</strong>
              <ul className="m-0 ps-3">
                {userAllergies.map((a, i) => (
                  <li key={i}><strong>{a.allergen}</strong> ({a.severity}) — Reaction: {a.reaction}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-light rounded mb-3 small">
              <strong className="text-primary">📋 CHRONIC MEDICAL HISTORY:</strong>
              <ul className="m-0 ps-3">
                {userHistory.map((h, i) => (
                  <li key={i}><strong>{h.condition_name}</strong> (Diagnosed {h.diagnosed_year}) — {h.notes}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-light rounded mb-3 small">
              <strong className="text-dark">🚨 EMERGENCY CONTACTS (SOS):</strong>
              <ul className="m-0 ps-3">
                {userContacts.map((c, i) => (
                  <li key={i}><strong>{c.name}</strong> ({c.relationship}) — {c.phone}</li>
                ))}
              </ul>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-primary flex-grow-1" onClick={() => window.print()}>
                <Printer size={16} className="me-2" /> Print Document
              </button>
              <button className="btn btn-secondary" onClick={() => setShowPassportPrintModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
