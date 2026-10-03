import React, { useState, useEffect } from 'react';
import { AuthProvider } from './lib/auth/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './pages/LandingPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { ThreatLibraryPage } from './pages/ThreatLibraryPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { HistoryPage } from './pages/HistoryPage';
import { DashboardPage } from './pages/DashboardPage';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');

  // Sync hash routing if user enters with #analyze, #threats, etc.
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['landing', 'analyze', 'threats', 'simulator', 'history', 'dashboard'].includes(hash)) {
        setCurrentTab(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        {/* Navigation Bar */}
        <Navbar currentTab={currentTab} setCurrentTab={handleTabChange} />

        {/* Main Content Area */}
        <main className="flex-1">
          {currentTab === 'landing' && <LandingPage onNavigate={handleTabChange} />}
          {currentTab === 'analyze' && <AnalyzePage />}
          {currentTab === 'threats' && <ThreatLibraryPage />}
          {currentTab === 'simulator' && <SimulatorPage />}
          {currentTab === 'history' && <HistoryPage />}
          {currentTab === 'dashboard' && <DashboardPage onNavigate={handleTabChange} />}
        </main>

        {/* Global Modals & Notifications */}
        <AuthModal />

        {/* Footer */}
        <Footer />
      </div>
    </AuthProvider>
  );
}
