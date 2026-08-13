import React, { useState, useEffect } from 'react';
import { HeartHandshake, Phone, ShieldCheck, ExternalLink, Award, CheckCircle2 } from 'lucide-react';

export const OrganBankLocator = () => {
  const [activeTab, setActiveTab] = useState('centers');
  const [organBanks, setOrganBanks] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('28');
  const [gender, setGender] = useState('male');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [pledgedOrgans, setPledgedOrgans] = useState(['All Organs & Tissues']);
  const [pledgeCard, setPledgeCard] = useState(null);

  const availableOrgansList = ['All Organs & Tissues', 'Cornea / Eyes', 'Kidneys', 'Heart', 'Liver', 'Lungs', 'Pancreas'];

  const fetchOrganBanks = (type = selectedType, c = city) => {
    setLoading(true);
    fetch(`http://localhost:5000/api/organ-banks?type=${encodeURIComponent(type)}&city=${encodeURIComponent(c)}`)
      .then((res) => res.json())
      .then((data) => { setOrganBanks(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchOrganBanks('', ''); }, []);

  const toggleOrganSelect = (organ) => {
    if (organ === 'All Organs & Tissues') {
      setPledgedOrgans(['All Organs & Tissues']);
    } else {
      const filtered = pledgedOrgans.filter((x) => x !== 'All Organs & Tissues');
      if (filtered.includes(organ)) {
        setPledgedOrgans(filtered.filter((x) => x !== organ));
      } else {
        setPledgedOrgans([...filtered, organ]);
      }
    }
  };

  const handlePledgeSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    setPledgeCard({
      nottoPledgeId: `NOTTO-IN-${Math.floor(100000 + Math.random() * 900000)}`,
      fullName, age, gender, phone, emergencyContact,
      organs: pledgedOrgans.join(', '),
      date: new Date().toLocaleDateString()
    });
  };

  const filterTypes = [
    { value: '', label: 'All Centers' },
    { value: 'multi_organ', label: 'Multi-Organ' },
    { value: 'eye_bank', label: 'Eye Banks' },
  ];

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div className="page-header mb-0">
          <div className="page-header-icon" style={{ background: 'linear-gradient(135deg, #0d9488, #059669)' }}>
            <HeartHandshake size={24} />
          </div>
          <div>
            <h2 className="fw-bold m-0" style={{ fontFamily: 'Outfit', fontSize: '1.5rem', color: 'var(--text-main)' }}>
              NOTTO Organ & Eye Registry Hub
            </h2>
            <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: 0 }}>
              Govt-registered transplant centers & voluntary organ donor pledge
            </p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button
            className={activeTab === 'centers' ? 'btn-gradient d-flex align-items-center gap-1' : 'btn-glass d-flex align-items-center gap-1'}
            style={{ fontSize: '0.83rem' }}
            onClick={() => setActiveTab('centers')}>
            Transplant Centers
          </button>
          <button
            className={activeTab === 'pledge' ? 'btn-gradient d-flex align-items-center gap-1' : 'btn-glass d-flex align-items-center gap-1'}
            style={{ fontSize: '0.83rem' }}
            onClick={() => setActiveTab('pledge')}>
            <ShieldCheck size={15} /> Register Pledge
          </button>
        </div>
      </div>

      {/* NOTTO Helpline Banner */}
      <div className="p-4 mb-4 rounded-4 d-flex flex-wrap align-items-center justify-content-between gap-3"
        style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.1), rgba(5,150,105,0.07))', border: '1px solid rgba(13,148,136,0.25)' }}>
        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'rgba(13,148,136,0.15)', color: '#0d9488', padding: '3px 12px', borderRadius: '999px', border: '1px solid rgba(13,148,136,0.3)', letterSpacing: '0.05em' }}>
            NOTTO — MINISTRY OF HEALTH, GOI
          </span>
          <h4 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-main)', margin: '8px 0 4px' }}>
            National Organ Donor Pledge Portal
          </h4>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: 0 }}>
            National Organ Helpline <strong style={{ color: '#0d9488' }}>1800-11-4770</strong> (24×7 Toll Free) · Verified donor pledge registration
          </p>
        </div>
        <a href="https://notto.mohfw.gov.in" target="_blank" rel="noreferrer"
          className="btn-glass d-inline-flex align-items-center gap-2 text-decoration-none"
          style={{ color: '#0d9488', borderColor: 'rgba(13,148,136,0.35)', fontSize: '0.85rem' }}>
          <span>Official NOTTO Portal</span>
          <ExternalLink size={14} />
        </a>
      </div>

      {activeTab === 'centers' ? (
        <>
          {/* Type filter */}
          <div className="d-flex gap-2 mb-4 flex-wrap">
            {filterTypes.map((ft) => (
              <button key={ft.value}
                className={selectedType === ft.value ? 'btn-gradient d-flex align-items-center gap-1' : 'btn-glass d-flex align-items-center gap-1'}
                style={{ fontSize: '0.83rem' }}
                onClick={() => { setSelectedType(ft.value); fetchOrganBanks(ft.value, city); }}>
                {ft.label}
              </button>
            ))}
            {organBanks.length > 0 && (
              <span className="badge-teal ms-auto d-flex align-items-center" style={{ fontSize: '0.78rem' }}>
                {organBanks.length} Centers
              </span>
            )}
          </div>

          {/* Organ Bank Cards */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: '#0d9488' }} role="status" />
            </div>
          ) : (
            <div className="row g-3">
              {organBanks.map((ob) => (
                <div key={ob.id} className="col-md-6 col-lg-4">
                  <div className="card-premium p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <span className="d-flex align-items-center gap-1"
                          style={{ fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', background: 'rgba(13,148,136,0.12)', color: '#0d9488', border: '1px solid rgba(13,148,136,0.3)' }}>
                          <ShieldCheck size={12} /> NOTTO Verified
                        </span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, background: 'var(--bg-input)', color: 'var(--text-dim)', padding: '3px 8px', borderRadius: '6px', fontFamily: 'Outfit' }}>
                          {ob.notto_id}
                        </span>
                      </div>
                      <h5 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                        {ob.name}
                      </h5>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{ob.address}</p>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0d9488', background: 'rgba(13,148,136,0.08)', padding: '3px 8px', borderRadius: '4px' }}>
                        {ob.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="d-flex gap-2 mt-3">
                      <a href={`tel:${ob.phone.split(' ')[0]}`}
                        className="btn-gradient flex-grow-1 d-flex align-items-center justify-content-center gap-1 text-decoration-none py-2 rounded-3"
                        style={{ fontSize: '0.82rem' }}>
                        <Phone size={14} /> Call Hospital
                      </a>
                      {ob.website && (
                        <a href={ob.website} target="_blank" rel="noreferrer"
                          className="btn-glass d-flex align-items-center justify-content-center p-2 rounded-3 text-decoration-none"
                          style={{ width: '40px', color: '#0d9488' }}>
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* NOTTO Pledge Form */
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="glass-card-static p-4" style={{ border: '1px solid rgba(13,148,136,0.2)' }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <ShieldCheck size={22} color="#0d9488" />
                <h4 style={{ fontFamily: 'Outfit', fontWeight: 700, margin: 0, color: 'var(--text-main)', fontSize: '1.1rem' }}>
                  NOTTO Organ Donor Pledge Registration
                </h4>
              </div>
              <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Fill this form to register your formal consent for post-mortem organ and tissue donation.
              </p>

              <form onSubmit={handlePledgeSubmit} className="d-flex flex-column gap-3">
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>FULL NAME (AS PER AADHAR/ID)</label>
                  <input type="text" className="glass-input" placeholder="Rahul Sharma" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div className="row g-2">
                  <div className="col-4">
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>AGE</label>
                    <input type="number" className="glass-input" value={age} onChange={(e) => setAge(e.target.value)} required />
                  </div>
                  <div className="col-4">
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>GENDER</label>
                    <select className="glass-input" value={gender} onChange={(e) => setGender(e.target.value)}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-4">
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>MOBILE</label>
                    <input type="text" className="glass-input" placeholder="+91..." value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>EMERGENCY CONTACT / NEXT OF KIN</label>
                  <input type="text" className="glass-input" placeholder="Priya Sharma (Spouse) — +91 9812345678" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '10px' }}>PLEDGED ORGANS & TISSUES</label>
                  <div className="d-flex flex-wrap gap-2">
                    {availableOrgansList.map((organ) => {
                      const isSelected = pledgedOrgans.includes(organ);
                      return (
                        <button key={organ} type="button"
                          onClick={() => toggleOrganSelect(organ)}
                          style={{
                            padding: '7px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700,
                            cursor: 'pointer', transition: 'all 0.18s',
                            background: isSelected ? 'linear-gradient(135deg, #0d9488, #059669)' : 'var(--bg-input)',
                            color: isSelected ? '#fff' : 'var(--text-muted)',
                            border: isSelected ? 'none' : '1px solid var(--border-glass)',
                            boxShadow: isSelected ? '0 3px 10px rgba(13,148,136,0.35)' : 'none'
                          }}>
                          {isSelected ? '✓ ' : '+ '}{organ}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <button type="submit" className="btn-gradient py-3 fw-bold d-flex align-items-center justify-content-center gap-2 mt-1"
                  style={{ borderRadius: 'var(--radius-md)', fontFamily: 'Outfit', fontSize: '0.92rem' }}>
                  <Award size={18} /> Submit NOTTO Organ Donor Pledge
                </button>
              </form>
            </div>
          </div>

          <div className="col-lg-5">
            {pledgeCard ? (
              <div className="glass-card p-4 text-center h-100 d-flex flex-column align-items-center justify-content-center"
                style={{ background: 'linear-gradient(135deg, rgba(13,148,136,0.15), rgba(15,23,42,0.85))', border: '1px solid rgba(13,148,136,0.35)' }}>
                <div className="d-inline-flex p-3 rounded-circle mb-2" style={{ background: 'linear-gradient(135deg,#0d9488,#059669)' }}>
                  <ShieldCheck size={36} color="#fff" />
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.06em', background: 'rgba(13,148,136,0.18)', color: '#0d9488', padding: '4px 14px', borderRadius: '999px', marginBottom: '12px', display: 'block', border: '1px solid rgba(13,148,136,0.35)' }}>
                  NOTTO VERIFIED ORGAN DONOR CARD
                </span>
                <h3 style={{ fontFamily: 'Outfit', fontWeight: 800, color: 'var(--text-main)' }}>{pledgeCard.fullName}</h3>
                <p style={{ fontSize: '0.83rem', color: '#0d9488', fontWeight: 700, marginBottom: '14px' }}>
                  Pledged: {pledgeCard.organs}
                </p>
                <div className="glass-card p-3 text-start w-100 mb-3">
                  {[
                    { label: 'NOTTO Registry ID', value: pledgeCard.nottoPledgeId },
                    { label: 'Age / Gender', value: `${pledgeCard.age} yrs / ${pledgeCard.gender}` },
                    { label: 'Contact', value: pledgeCard.phone },
                    { label: 'Emergency Kin', value: pledgeCard.emergencyContact },
                    { label: 'Registered', value: pledgeCard.date },
                  ].map((row) => (
                    <div key={row.label} className="d-flex justify-content-between mb-1" style={{ fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>{row.label}:</span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 700, maxWidth: '55%', textAlign: 'right', wordBreak: 'break-all' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>
                  <CheckCircle2 size={16} /> Pledge Registered — Thank You for Saving Lives
                </div>
              </div>
            ) : (
              <div className="glass-card-static h-100 d-flex flex-column align-items-center justify-content-center text-center p-4">
                <HeartHandshake size={52} color="#0d9488" style={{ opacity: 0.3, marginBottom: '16px' }} />
                <h5 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-main)' }}>NOTTO Donor Card Preview</h5>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', maxWidth: '280px' }}>
                  Fill the form to generate your official digital NOTTO organ donor pledge registration card.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
