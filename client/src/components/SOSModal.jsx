import React, { useState, useEffect } from 'react';
import { useSOS } from '../context/SOSContext';
import { AlertCircle, PhoneCall, MapPin, CheckCircle, ExternalLink, ShieldAlert, X } from 'lucide-react';

const TOTAL_SECONDS = 10;

export const SOSModal = () => {
  const { isSOSActive, sosDetails, error, resolveSOS } = useSOS();
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [broadcasting, setBroadcasting] = useState(false);

  // Reset and start countdown when modal opens
  useEffect(() => {
    if (!isSOSActive) return;
    setSecondsLeft(TOTAL_SECONDS);
    setBroadcasting(false);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setBroadcasting(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSOSActive]);

  if (error && !sosDetails) {
    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
        style={{ backgroundColor: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(24px)', zIndex: 99999 }}
      >
        <div className="glass-card-static p-4 text-center rounded-4 animate-scale-in" style={{ maxWidth: '440px', border: '1.5px solid rgba(220,38,38,0.5)' }}>
          <AlertCircle size={40} color="#dc2626" className="mb-3" />
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, color: '#ef4444', fontSize: '1.3rem' }}>SOS Could Not Be Broadcast</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{error}</p>
          <div className="d-flex gap-2 mt-3">
            <a href="tel:108" className="btn w-100 py-2 text-white fw-bold"
              style={{ background: 'linear-gradient(135deg,#ef4444,#b91c1c)' }}>
              <PhoneCall size={16} className="me-2" />Call 108 Now
            </a>
            <button className="btn btn-glass w-100 py-2 fw-bold" onClick={resolveSOS}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  if (!isSOSActive || !sosDetails) return null;

  const circumference = 2 * Math.PI * 36; // radius = 36
  const progress = (secondsLeft / TOTAL_SECONDS) * circumference;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ backgroundColor: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(24px)', zIndex: 99999 }}
    >
      <div
        className="glass-card-static w-100 overflow-auto rounded-4 animate-scale-in"
        style={{ maxWidth: '560px', border: '1.5px solid rgba(220,38,38,0.5)', boxShadow: '0 0 60px rgba(220,38,38,0.3)' }}
      >
        {/* Header */}
        <div className="p-4 text-center" style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.18), rgba(185,28,28,0.12))', borderBottom: '1px solid rgba(220,38,38,0.25)' }}>
          {/* Countdown ring — only show when counting */}
          {!broadcasting ? (
            <div className="sos-countdown-ring mx-auto mb-3">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle className="ring-track" cx="40" cy="40" r="36" />
                <circle
                  className="ring-progress"
                  cx="40" cy="40" r="36"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - progress}
                />
              </svg>
              <div className="sos-countdown-number">{secondsLeft}</div>
            </div>
          ) : (
            <div
              className="d-inline-flex p-3 rounded-circle mb-3"
              style={{ background: 'linear-gradient(135deg,#ef4444,#b91c1c)', animation: 'sosPulse 1.5s infinite', boxShadow: '0 0 40px rgba(239,68,68,0.6)' }}
            >
              <ShieldAlert size={44} color="#fff" />
            </div>
          )}

          {!broadcasting ? (
            <>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.06em', color: '#f87171', marginBottom: '6px' }}>
                PREPARING EMERGENCY BROADCAST
              </div>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, color: '#ef4444', margin: 0, fontSize: '1.4rem' }}>
                🚨 SOS Countdown
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px', marginBottom: 0 }}>
                Broadcasting in <strong style={{ color: '#ef4444' }}>{secondsLeft}s</strong>. Stay calm — help is on the way.
              </p>
            </>
          ) : (
            <>
              <h2 style={{ fontFamily: 'Outfit', fontWeight: 900, color: '#ef4444', margin: 0, fontSize: '1.5rem' }}>
                🚨 EMERGENCY SOS ACTIVE
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '6px', marginBottom: 0 }}>
                Live GPS coordinates sent. Emergency contacts notified.
              </p>
            </>
          )}
        </div>

        <div className="p-4">
          {/* GPS Location */}
          <div className="p-3 rounded-3 mb-4"
            style={{ background: 'rgba(220,38,38,0.07)', border: '1px solid rgba(220,38,38,0.25)' }}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <MapPin size={16} color="#dc2626" />
              <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#dc2626' }}>
                {broadcasting ? 'GPS LOCATION BROADCASTED' : 'LOCATION BEING PREPARED'}
              </span>
              {broadcasting && (
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: '#22c55e', marginLeft: 'auto',
                  animation: 'onlinePulse 1s infinite'
                }} />
              )}
            </div>
            <a href={sosDetails.locationUrl} target="_blank" rel="noreferrer"
              className="d-flex align-items-center gap-1 text-decoration-none"
              style={{ fontSize: '0.78rem', color: 'var(--primary-cyan)', wordBreak: 'break-all' }}>
              <span>{sosDetails.locationUrl}</span>
              <ExternalLink size={13} style={{ flexShrink: 0 }} />
            </a>
          </div>

          {/* Emergency call buttons */}
          <div className="row g-3 mb-4">
            <div className="col-6">
              <a href="tel:108"
                className="d-flex flex-column align-items-center justify-content-center gap-1 text-white text-decoration-none fw-bold py-4 rounded-3"
                style={{ background: 'linear-gradient(135deg,#ef4444,#b91c1c)', boxShadow: '0 4px 18px rgba(239,68,68,0.45)', fontFamily: 'Outfit' }}>
                <PhoneCall size={28} />
                <span style={{ fontSize: '1.1rem' }}>108</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.88, fontWeight: 500 }}>National Ambulance</span>
              </a>
            </div>
            <div className="col-6">
              <a href="tel:1075"
                className="d-flex flex-column align-items-center justify-content-center gap-1 text-dark text-decoration-none fw-bold py-4 rounded-3"
                style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow: '0 4px 18px rgba(245,158,11,0.35)', fontFamily: 'Outfit' }}>
                <PhoneCall size={28} />
                <span style={{ fontSize: '1.1rem' }}>1075</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.75, fontWeight: 500 }}>Health Helpline</span>
              </a>
            </div>
          </div>

          {/* Notified contacts */}
          <div className="mb-4 p-3 rounded-3" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.73rem', fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '0.05em', marginBottom: '6px' }}>
              EMERGENCY CONTACTS NOTIFIED
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
              {sosDetails.contactsNotified}
            </p>
          </div>

          {/* Cancel (only during countdown) + Resolve (after broadcast) */}
          {!broadcasting ? (
            <button
              onClick={resolveSOS}
              className="border-0 w-100 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
              style={{
                background: 'rgba(220,38,38,0.08)', border: '2px solid rgba(220,38,38,0.4)',
                color: '#dc2626', cursor: 'pointer', fontSize: '0.92rem', fontFamily: 'Outfit', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; }}
            >
              <X size={20} />
              Cancel — False Alarm
            </button>
          ) : (
            <button
              onClick={resolveSOS}
              className="border-0 w-100 py-3 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2"
              style={{
                background: 'rgba(5,150,105,0.1)', border: '2px solid rgba(5,150,105,0.4)',
                color: '#059669', cursor: 'pointer', fontSize: '0.92rem', fontFamily: 'Outfit', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(5,150,105,0.18)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(5,150,105,0.1)'; }}
            >
              <CheckCircle size={20} />
              I'm Safe Now — Resolve Emergency
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
