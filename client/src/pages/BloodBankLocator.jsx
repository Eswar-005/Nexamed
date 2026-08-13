import React, { useState, useEffect } from 'react';
import { Droplet, Phone, MapPin, Heart, CheckCircle2, Award, Search, Info, TrendingUp } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

// Blood compatibility guide
const COMPATIBILITY = {
  'O-':  { donate: 'All (Universal Donor)', receive: 'O-' },
  'O+':  { donate: 'O+, A+, B+, AB+',       receive: 'O+, O-' },
  'A-':  { donate: 'A-, A+, AB-, AB+',       receive: 'A-, O-' },
  'A+':  { donate: 'A+, AB+',                receive: 'A+, A-, O+, O-' },
  'B-':  { donate: 'B-, B+, AB-, AB+',       receive: 'B-, O-' },
  'B+':  { donate: 'B+, AB+',                receive: 'B+, B-, O+, O-' },
  'AB-': { donate: 'AB-, AB+',               receive: 'A-, B-, O-, AB-' },
  'AB+': { donate: 'AB+ (Universal Recipient)', receive: 'All' },
};

export const BloodBankLocator = () => {
  const [activeTab, setActiveTab] = useState('find');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [city, setCity] = useState('');
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCompat, setShowCompat] = useState(false);

  const [donorName, setDonorName] = useState('');
  const [donorGroup, setDonorGroup] = useState('O+');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorCity, setDonorCity] = useState('');
  const [donorAge, setDonorAge] = useState('25');
  const [registeredDonorCard, setRegisteredDonorCard] = useState(null);

  const fetchBloodBanks = (bg = bloodGroup, c = city) => {
    setLoading(true);
    fetch(`/api/blood-banks?bloodGroup=${encodeURIComponent(bg)}&city=${encodeURIComponent(c)}`)
      .then((res) => res.json())
      .then((data) => { setBanks(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchBloodBanks('O+', ''); }, []);

  const handleFilter = (e) => { e.preventDefault(); fetchBloodBanks(bloodGroup, city); };

  const handleDonorRegister = (e) => {
    e.preventDefault();
    if (!donorName || !donorPhone) return;
    setRegisteredDonorCard({
      pledgeId: `NEX-BLOOD-${Math.floor(100000 + Math.random() * 900000)}`,
      name: donorName, bloodGroup: donorGroup, phone: donorPhone,
      city: donorCity || 'Hyderabad', age: donorAge,
      date: new Date().toLocaleDateString()
    });
  };

  const maxUnits = Math.max(...banks.map(b => b.units_available || 0), 1);

  return (
    <div className="container py-4 page-fade-in">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div className="page-header mb-0">
          <div className="page-header-icon" style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}>
            <Droplet size={24} />
          </div>
          <div>
            <h2 className="fw-bold m-0" style={{ fontFamily: 'Outfit', fontSize: '1.5rem', color: 'var(--text-main)' }}>
              Blood Bank Stocks &amp; Donor Registry
            </h2>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: 0 }}>
              Live unit availability or pledge as a voluntary life-saving blood donor
            </p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button
            className={activeTab === 'find' ? 'btn-gradient-danger d-flex align-items-center gap-1' : 'btn-glass d-flex align-items-center gap-1'}
            style={{ fontSize: '0.83rem' }}
            onClick={() => setActiveTab('find')}>
            <Search size={15} /> Find Blood
          </button>
          <button
            className={activeTab === 'donate' ? 'btn-gradient d-flex align-items-center gap-1' : 'btn-glass d-flex align-items-center gap-1'}
            style={{ fontSize: '0.83rem' }}
            onClick={() => setActiveTab('donate')}>
            <Heart size={15} /> Pledge Donor
          </button>
        </div>
      </div>

      {activeTab === 'find' ? (
        <>
          {/* Filter Controls */}
          <div className="glass-card-static p-4 mb-4">
            <form onSubmit={handleFilter}>
              <div className="row g-4 align-items-end">
                <div className="col-md-6">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '0.07em' }}>
                      SELECT BLOOD GROUP
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCompat(v => !v)}
                      className="btn-glass d-flex align-items-center gap-1"
                      style={{ fontSize: '0.72rem', padding: '4px 10px', color: '#dc2626', borderColor: 'rgba(220,38,38,0.3)' }}
                    >
                      <Info size={12} /> Compatibility
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {BLOOD_GROUPS.map((bg) => (
                      <button
                        key={bg} type="button"
                        className={`blood-group-btn ${bloodGroup === bg ? 'active' : ''}`}
                        onClick={() => { setBloodGroup(bg); fetchBloodBanks(bg, city); }}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>

                  {/* Compatibility guide */}
                  {showCompat && COMPATIBILITY[bloodGroup] && (
                    <div className="mt-3 p-3 rounded-3 animate-fade-up"
                      style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#dc2626', marginBottom: '8px' }}>
                        {bloodGroup} COMPATIBILITY GUIDE
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <div className="mb-1"><strong style={{ color: 'var(--text-main)' }}>Can Donate To:</strong> {COMPATIBILITY[bloodGroup].donate}</div>
                        <div><strong style={{ color: 'var(--text-main)' }}>Can Receive From:</strong> {COMPATIBILITY[bloodGroup].receive}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-md-4">
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '0.07em', display: 'block', marginBottom: '10px' }}>
                    FILTER BY CITY
                  </label>
                  <input type="text" className="glass-input"
                    placeholder="e.g. Hyderabad, Bengaluru, Mumbai..."
                    value={city} onChange={(e) => setCity(e.target.value)} />
                </div>

                <div className="col-md-2">
                  <button type="submit" className="btn-gradient-danger w-100 py-2 d-flex align-items-center justify-content-center gap-1"
                    style={{ borderRadius: 'var(--radius-md)' }}>
                    <Search size={16} /> Filter
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Blood Bank Cards */}
          {loading ? (
            <div className="row g-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="col-md-6 col-lg-4">
                  <div className="glass-card-static p-4" style={{ height: '200px' }}>
                    <div className="shimmer-skeleton rounded mb-3" style={{ height: '18px', width: '50%' }} />
                    <div className="shimmer-skeleton rounded mb-2" style={{ height: '24px', width: '80%' }} />
                    <div className="shimmer-skeleton rounded mb-4" style={{ height: '14px', width: '100%' }} />
                    <div className="shimmer-skeleton rounded" style={{ height: '40px' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : banks.length === 0 ? (
            <div className="text-center py-5 glass-card-static rounded-4">
              <Droplet size={52} style={{ color: 'var(--text-light)', marginBottom: '16px' }} />
              <h5 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-main)' }}>No blood banks found</h5>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Try a different blood group or city.</p>
            </div>
          ) : (
            <>
              <div className="d-flex align-items-center gap-2 mb-3">
                <TrendingUp size={16} color="var(--primary-cyan)" />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)' }}>
                  {banks.length} blood banks found for <strong style={{ color: '#dc2626' }}>{bloodGroup}</strong>
                  {city && <> in <strong>{city}</strong></>}
                </span>
              </div>
              <div className="row g-3">
                {banks.map((b) => {
                  const stockPct = Math.min(100, Math.round((b.units_available / maxUnits) * 100));
                  const stockColor = stockPct > 60 ? '#059669' : stockPct > 30 ? '#d97706' : '#dc2626';
                  return (
                    <div key={b.id} className="col-md-6 col-lg-4 animate-fade-up">
                      <div className="card-premium p-4 h-100 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <span style={{
                              fontSize: '0.68rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px',
                              background: b.government_run ? 'rgba(5,150,105,0.12)' : 'rgba(2,132,199,0.12)',
                              color: b.government_run ? '#059669' : '#0284c7',
                              border: `1px solid ${b.government_run ? 'rgba(5,150,105,0.3)' : 'rgba(2,132,199,0.3)'}`
                            }}>
                              {b.government_run ? '🏛 Govt Partnered' : '🏥 Licensed Trust'}
                            </span>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '1.6rem', color: stockColor, lineHeight: 1 }}>
                                {b.units_available}
                              </div>
                              <div style={{ fontSize: '0.64rem', color: 'var(--text-dim)', fontWeight: 700 }}>UNITS ({bloodGroup})</div>
                            </div>
                          </div>

                          {/* Stock bar */}
                          <div className="confidence-bar-track mb-3">
                            <div className="confidence-bar-fill" style={{ width: `${stockPct}%`, background: stockColor }} />
                          </div>

                          <h5 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                            {b.name}
                          </h5>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{b.address}</p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: 0 }}>License: {b.license_number}</p>
                        </div>

                        <div className="d-flex gap-2 mt-3">
                          <a href={`tel:${b.phone}`}
                            className="d-flex align-items-center justify-content-center gap-1 text-white flex-grow-1 py-2 rounded-3 fw-bold text-decoration-none"
                            style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)', fontSize: '0.82rem', boxShadow: '0 3px 10px rgba(220,38,38,0.3)' }}>
                            <Phone size={15} /> Call Blood Bank
                          </a>
                          <a href={`https://maps.google.com/?q=${b.latitude},${b.longitude}`}
                            target="_blank" rel="noreferrer"
                            className="btn-glass d-flex align-items-center justify-content-center p-2 rounded-3 text-decoration-none"
                            style={{ width: '42px', color: 'var(--primary-cyan)' }}>
                            <MapPin size={18} />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      ) : (
        /* Blood Donor Registration */
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="glass-card-static p-4" style={{ border: '1px solid rgba(220,38,38,0.2)' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Heart size={22} color="#dc2626" />
                <h4 style={{ fontFamily: 'Outfit', fontWeight: 700, margin: 0, color: 'var(--text-main)', fontSize: '1.15rem' }}>
                  Voluntary Blood Donor Pledge
                </h4>
              </div>
              <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Register as a voluntary blood donor to receive emergency blood request alerts in your city.
              </p>

              <form onSubmit={handleDonorRegister} className="d-flex flex-column gap-3">
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>FULL DONOR NAME</label>
                  <input type="text" className="glass-input" placeholder="Rahul Sharma" value={donorName} onChange={(e) => setDonorName(e.target.value)} required />
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>BLOOD GROUP</label>
                    <select className="glass-input" value={donorGroup} onChange={(e) => setDonorGroup(e.target.value)}>
                      {BLOOD_GROUPS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                  <div className="col-6">
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>AGE</label>
                    <input type="number" className="glass-input" placeholder="25" min="18" max="65" value={donorAge} onChange={(e) => setDonorAge(e.target.value)} required />
                  </div>
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>MOBILE</label>
                    <input type="tel" className="glass-input" placeholder="+91 9876543210" value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} required />
                  </div>
                  <div className="col-6">
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', display: 'block', marginBottom: '6px', letterSpacing: '0.05em' }}>CITY</label>
                    <input type="text" className="glass-input" placeholder="Hyderabad" value={donorCity} onChange={(e) => setDonorCity(e.target.value)} required />
                  </div>
                </div>
                <button type="submit"
                  className="btn-gradient-danger d-flex align-items-center justify-content-center gap-2 py-3 mt-1 w-100"
                  style={{ fontSize: '0.9rem', fontFamily: 'Outfit', borderRadius: 'var(--radius-md)' }}>
                  <Heart size={18} /> Submit Voluntary Blood Pledge
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-6">
            {registeredDonorCard ? (
              <div className="glass-card p-4 text-center h-100 d-flex flex-column align-items-center justify-content-center animate-scale-in"
                style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.1), rgba(15,23,42,0.85))', border: '1px solid rgba(220,38,38,0.35)' }}>
                <div className="d-inline-flex p-3 rounded-circle mb-2" style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)' }}>
                  <Award size={36} color="#fff" />
                </div>
                <span style={{ fontSize: '0.68rem', fontWeight: 900, letterSpacing: '0.06em', background: 'rgba(220,38,38,0.2)', color: '#dc2626', padding: '4px 14px', borderRadius: '999px', marginBottom: '14px', display: 'block', border: '1px solid rgba(220,38,38,0.35)' }}>
                  REGISTERED BLOOD DONOR CARD
                </span>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, color: 'var(--text-main)' }}>{registeredDonorCard.name}</h3>
                <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '2.5rem', color: '#dc2626', lineHeight: 1, marginBottom: '14px' }}>
                  {registeredDonorCard.bloodGroup}
                </div>
                <div className="glass-card p-3 text-start w-100 mb-3">
                  {[
                    { label: 'Pledge ID', value: registeredDonorCard.pledgeId },
                    { label: 'Phone', value: registeredDonorCard.phone },
                    { label: 'City', value: registeredDonorCard.city },
                    { label: 'Age', value: `${registeredDonorCard.age} years` },
                    { label: 'Registered', value: registeredDonorCard.date },
                  ].map((row) => (
                    <div key={row.label} className="d-flex justify-content-between" style={{ fontSize: '0.8rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>{row.label}:</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>
                  <CheckCircle2 size={16} /> Active in Nexamed Emergency Blood Network
                </div>
              </div>
            ) : (
              <div className="glass-card-static h-100 d-flex flex-column align-items-center justify-content-center text-center p-4"
                style={{ minHeight: '300px' }}>
                <Droplet size={52} color="#dc2626" style={{ opacity: 0.3, marginBottom: '16px' }} />
                <h5 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-main)' }}>Your Donor Pledge Card</h5>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', maxWidth: '260px' }}>
                  Fill the form on the left to generate your verified digital blood donor pledge card.
                </p>
                <div className="p-3 rounded-3 mt-3" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', maxWidth: '280px' }}>
                  <p style={{ fontSize: '0.78rem', color: '#dc2626', margin: 0, fontWeight: 600 }}>
                    💉 One blood donation can save up to <strong>3 lives</strong>. Donate today.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
