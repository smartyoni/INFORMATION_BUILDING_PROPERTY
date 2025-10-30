import { useState, useEffect } from 'react';
import { BuildingProvider } from './context/BuildingContext';
import { PropertyProvider } from './context/PropertyContext';
import { MobileView } from './components/mobile/MobileView';
import { WebView } from './components/web/WebView';
import { PropertyMobileView } from './components/mobile/PropertyMobileView';
import { PropertyWebView } from './components/web/PropertyWebView';

function AppContent() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentTab, setCurrentTab] = useState('buildings');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="font-maple">
      {currentTab === 'buildings' ? (
        isMobile ? <MobileView onTabChange={setCurrentTab} /> : <WebView onTabChange={setCurrentTab} />
      ) : (
        isMobile ? <PropertyMobileView onTabChange={setCurrentTab} /> : <PropertyWebView onTabChange={setCurrentTab} />
      )}
    </div>
  );
}

function App() {
  return (
    <BuildingProvider>
      <PropertyProvider>
        <AppContent />
      </PropertyProvider>
    </BuildingProvider>
  );
}

export default App;
