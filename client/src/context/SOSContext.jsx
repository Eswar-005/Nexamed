import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const SOSContext = createContext();

export const SOSProvider = ({ children }) => {
  const { user } = useAuth();
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [sosDetails, setSosDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const triggerSOS = async () => {
    setLoading(true);
    setError(null);
    let lat = 17.4325;
    let lng = 78.4071;

    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        lat = position.coords.latitude;
        lng = position.coords.longitude;
      } catch {
        console.warn('Geolocation fallback to default coords');
      }
    }

    try {
      const res = await fetch('/api/sos/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, userId: user?.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'SOS broadcast failed');
      setSosDetails(data);
      setIsSOSActive(true);
    } catch (err) {
      console.error('SOS Trigger Error:', err);
      setError(err.message || 'Could not reach the emergency service. Call 108 now.');
    } finally {
      setLoading(false);
    }
  };

  const resolveSOS = async () => {
    if (sosDetails?.sosId) {
      try {
        await fetch('/api/sos/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sosId: sosDetails.sosId })
        });
      } catch (err) {
        console.error('SOS resolve error:', err);
      }
    }
    setIsSOSActive(false);
    setSosDetails(null);
    setError(null);
  };

  return (
    <SOSContext.Provider value={{ isSOSActive, sosDetails, loading, error, triggerSOS, resolveSOS }}>
      {children}
    </SOSContext.Provider>
  );
};

export const useSOS = () => useContext(SOSContext);
