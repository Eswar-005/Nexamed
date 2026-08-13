import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SOSProvider, useSOS } from './context/SOSContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SOSModal } from './components/SOSModal';
import { MedicineDetailModal } from './components/MedicineDetailModal';
import { NewsDetailModal } from './components/NewsDetailModal';

import { Home } from './pages/Home';
import { PharmaEncyclopedia } from './pages/PharmaEncyclopedia';
import { DiseaseEncyclopedia } from './pages/DiseaseEncyclopedia';
import { SymptomChecker } from './pages/SymptomChecker';
import { OCRScanner } from './pages/OCRScanner';
import { StoreLocator } from './pages/StoreLocator';
import { BloodBankLocator } from './pages/BloodBankLocator';
import { OrganBankLocator } from './pages/OrganBankLocator';
import { HealthNews } from './pages/HealthNews';
import { UserProfile } from './pages/UserProfile';

import { PhoneCall } from 'lucide-react';

const BG_PARTICLES = [
  { left: '6%',  size: 6, dur: 38, delay: 0,  opacity: 0.32 },
  { left: '14%', size: 4, dur: 30, delay: 9,  opacity: 0.26 },
  { left: '23%', size: 7, dur: 44, delay: 4,  opacity: 0.3 },
  { left: '31%', size: 5, dur: 33, delay: 15, opacity: 0.28 },
  { left: '42%', size: 4, dur: 27, delay: 7,  opacity: 0.24 },
  { left: '50%', size: 6, dur: 40, delay: 18, opacity: 0.28 },
  { left: '58%', size: 5, dur: 31, delay: 2,  opacity: 0.26 },
  { left: '66%', size: 4, dur: 36, delay: 12, opacity: 0.28 },
  { left: '74%', size: 7, dur: 42, delay: 6,  opacity: 0.3 },
  { left: '82%', size: 5, dur: 29, delay: 20, opacity: 0.26 },
  { left: '90%', size: 6, dur: 37, delay: 10, opacity: 0.32 },
  { left: '96%', size: 4, dur: 32, delay: 5,  opacity: 0.24 },
];

const BackgroundDecor = () => (
  <div className="bg-decor" aria-hidden="true">
    <div className="bg-aurora" />
    <div className="bg-blob blob-1" />
    <div className="bg-blob blob-2" />
    <div className="bg-blob blob-3" />
    <div className="bg-blob blob-4" />
    <div className="bg-glow-bottom" />
    <div className="bg-grid" />
    <div className="bg-particles">
      {BG_PARTICLES.map((p, i) => (
        <span
          key={i}
          className="bg-particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            ['--po' ]: p.opacity,
            animationDuration: `${p.dur}s`,
            animationDelay: `-${p.delay}s`,
          }}
        />
      ))}
    </div>
  </div>
);

const FloatingSOSButton = () => {
  const { triggerSOS } = useSOS();
  return (
    <button
      className="sos-floating-btn"
      onClick={triggerSOS}
      title="TRIGGER 1-TAP EMERGENCY SOS"
      aria-label="Emergency SOS"
    >
      <PhoneCall size={24} />
      <span style={{ fontSize: '0.6rem', fontWeight: '900', letterSpacing: '0.05em' }}>SOS</span>
    </button>
  );
};

export const MainApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMedId, setSelectedMedId] = useState(null);
  const [medDetails, setMedDetails] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [pharmaQuery, setPharmaQuery] = useState('');

  const handleSelectMedicine = (id) => {
    setSelectedMedId(id);
    fetch(`/api/medicines/${id}`)
      .then((res) => res.json())
      .then((data) => { setMedDetails(data); })
      .catch((err) => console.error(err));
  };

  const closeMedicineDetail = () => {
    setSelectedMedId(null);
    setMedDetails(null);
  };

  const handleSearchMedicine = (q) => {
    setSelectedMedId(null);
    setPharmaQuery(q || '');
    setActiveTab('pharma');
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} onSelectMedicine={handleSelectMedicine} onSearchMedicine={handleSearchMedicine} onSelectNews={setSelectedNews} />;
      case 'pharma':
        return <PharmaEncyclopedia initialQuery={pharmaQuery} onSelectMedicine={handleSelectMedicine} />;
      case 'disease':
        return <DiseaseEncyclopedia onSelectMedicine={handleSelectMedicine} />;
      case 'symptom':
        return <SymptomChecker />;
      case 'ocr':
        return <OCRScanner onSelectMedicine={handleSelectMedicine} />;
      case 'stores':
        return <StoreLocator />;
      case 'blood':
        return <BloodBankLocator />;
      case 'organ':
        return <OrganBankLocator />;
      case 'news':
        return <HealthNews onSelectNews={setSelectedNews} />;
      case 'profile':
        return <UserProfile />;
      default:
        return <Home setActiveTab={setActiveTab} onSelectMedicine={handleSelectMedicine} onSearchMedicine={handleSearchMedicine} onSelectNews={setSelectedNews} />;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 position-relative">
      <BackgroundDecor />
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-grow-1 page-fade-in">{renderTab()}</main>
      <Footer />
      <FloatingSOSButton />
      <SOSModal />
      {selectedMedId && medDetails && (
        <MedicineDetailModal selectedMed={medDetails.medicine} medDetails={medDetails} onClose={closeMedicineDetail} />
      )}
      <NewsDetailModal news={selectedNews} onClose={() => setSelectedNews(null)} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SOSProvider>
          <MainApp />
        </SOSProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
