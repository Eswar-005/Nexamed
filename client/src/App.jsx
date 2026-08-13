import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SOSProvider, useSOS } from './context/SOSContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SOSModal } from './components/SOSModal';

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
  const [pharmaQuery, setPharmaQuery] = useState('');

  const handleSelectMedicine = (id) => {
    setSelectedMedId(id);
    setActiveTab('pharma');
  };

  const handleSearchMedicine = (q) => {
    setSelectedMedId(null);
    setPharmaQuery(q || '');
    setActiveTab('pharma');
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} onSelectMedicine={handleSelectMedicine} onSearchMedicine={handleSearchMedicine} />;
      case 'pharma':
        return <PharmaEncyclopedia preselectedMedId={selectedMedId} initialQuery={pharmaQuery} />;
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
        return <HealthNews />;
      case 'profile':
        return <UserProfile />;
      default:
        return <Home setActiveTab={setActiveTab} onSelectMedicine={handleSelectMedicine} onSearchMedicine={handleSearchMedicine} />;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 position-relative">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-grow-1 page-fade-in">{renderTab()}</main>
      <Footer />
      <FloatingSOSButton />
      <SOSModal />
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
