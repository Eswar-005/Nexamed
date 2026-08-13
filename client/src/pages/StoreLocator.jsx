import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Phone, Clock, Navigation, CheckCircle, Search } from 'lucide-react';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

export const StoreLocator = () => {
  const [stores, setStores] = useState([]);
  const [cityQuery, setCityQuery] = useState('');
  const [userLocation, setUserLocation] = useState({ lat: 17.4325, lng: 78.4071 });
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  const fetchStores = (city = '', lat = userLocation.lat, lng = userLocation.lng) => {
    setLoading(true);
    fetch(`http://localhost:5000/api/stores?city=${encodeURIComponent(city)}&lat=${lat}&lng=${lng}`)
      .then((res) => res.json())
      .then((data) => {
        setStores(data || []);
        if (data?.length > 0 && !city) setUserLocation({ lat: data[0].latitude, lng: data[0].longitude });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchStores(''); }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setUserLocation({ lat, lng });
      fetchStores('', lat, lng);
      setGpsLoading(false);
    }, () => setGpsLoading(false));
  };

  const handleCitySearch = (e) => { e.preventDefault(); fetchStores(cityQuery); };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-icon" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
          <MapPin size={24} />
        </div>
        <div>
          <h2 className="fw-bold m-0" style={{ fontFamily: 'Outfit', fontSize: '1.5rem', color: 'var(--text-main)' }}>
            Smart Pharmacy Map Locator
          </h2>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: 0 }}>
            Find 24×7 pharmacies with GPS directions, contact numbers & live stock
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="glass-card-static p-4 mb-4">
        <form onSubmit={handleCitySearch}>
          <div className="d-flex gap-2">
            <div className="position-relative flex-grow-1">
              <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3"
                style={{ color: 'var(--text-dim)', pointerEvents: 'none' }} />
              <input type="text" className="glass-input" style={{ paddingLeft: '44px' }}
                placeholder="Enter city or pincode (Hyderabad, Bengaluru, Mumbai)..."
                value={cityQuery} onChange={(e) => setCityQuery(e.target.value)} />
            </div>
            <button type="submit" className="btn-gradient d-flex align-items-center gap-1"
              style={{ borderRadius: 'var(--radius-md)', whiteSpace: 'nowrap' }}>
              <Search size={16} /> Find
            </button>
            <button type="button" className="btn-glass d-flex align-items-center gap-1" onClick={detectLocation}
              style={{ whiteSpace: 'nowrap', borderRadius: 'var(--radius-md)', position: 'relative' }}
              disabled={gpsLoading}>
              {gpsLoading ? (
                <div className="spinner-border spinner-border-sm" role="status" style={{ color: 'var(--primary-cyan)', width: '16px', height: '16px' }} />
              ) : (
                <Navigation size={16} style={{ color: '#059669' }} />
              )}
              <span>GPS</span>
            </button>
          </div>
        </form>
        {stores.length > 0 && (
          <div className="mt-2" style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            <strong style={{ color: 'var(--primary-cyan)' }}>{stores.length}</strong> pharmacies found near your location
          </div>
        )}
      </div>

      <div className="row g-4">
        {/* Leaflet Map */}
        <div className="col-lg-7">
          <div className="glass-card-static p-2 overflow-hidden" style={{ borderRadius: 'var(--radius-lg)' }}>
            <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={12} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {stores.map((store) => (
                <Marker key={store.id} position={[store.latitude, store.longitude]}>
                  <Popup>
                    <div style={{ fontFamily: 'Plus Jakarta Sans', fontSize: '13px' }}>
                      <strong style={{ fontFamily: 'Outfit' }}>{store.name}</strong><br />
                      {store.address}<br />
                      📞 {store.phone}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Store List */}
        <div className="col-lg-5">
          <div className="glass-card-static p-4 h-100 overflow-auto" style={{ maxHeight: '460px' }}>
            <h5 style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--text-main)', marginBottom: '16px', fontSize: '1rem' }}>
              Nearby Pharmacies
              <span className="badge-cyan ms-2" style={{ fontSize: '0.72rem', verticalAlign: 'middle' }}>{stores.length}</span>
            </h5>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border" style={{ color: '#059669', width: '2rem', height: '2rem' }} role="status" />
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {stores.map((store) => (
                  <div key={store.id} className="glass-card p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', margin: 0 }}>
                        {store.name}
                      </h6>
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: '999px',
                        background: 'rgba(2,132,199,0.1)', color: 'var(--primary-cyan)',
                        border: '1px solid rgba(2,132,199,0.25)', whiteSpace: 'nowrap'
                      }}>
                        {store.distanceKm} km
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{store.address}</p>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        <Clock size={12} color="#d97706" />
                        {store.is_open_24h ? '24 Hours Open' : `${store.open_time} – ${store.close_time}`}
                      </span>
                      <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.75rem', color: '#059669' }}>
                        <CheckCircle size={12} /> Stock Verified
                      </span>
                    </div>
                    <div className="d-flex gap-2">
                      <a href={`tel:${store.phone}`}
                        className="btn-gradient flex-grow-1 d-flex align-items-center justify-content-center gap-1 text-decoration-none py-2 rounded-3"
                        style={{ fontSize: '0.78rem' }}>
                        <Phone size={13} /> Call
                      </a>
                      <a href={`https://maps.google.com/?q=${store.latitude},${store.longitude}`}
                        target="_blank" rel="noreferrer"
                        className="btn-glass d-flex align-items-center justify-content-center gap-1 text-decoration-none py-2 px-3 rounded-3"
                        style={{ fontSize: '0.78rem', color: '#059669' }}>
                        <Navigation size={13} /> Directions
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
