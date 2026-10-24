/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { HomeOverview } from './components/HomeOverview';
import { FaqSection } from './components/FaqSection';
import { IpayDownloadSection } from './components/IpayDownloadSection';
import { GameSection } from './components/GameSection';
import { SavingsCalculatorSection } from './components/SavingsCalculatorSection';
import { LoanScheduleSection } from './components/LoanScheduleSection';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { TransactionPointsSection } from './components/TransactionPointsSection';
import { Footer } from './components/Footer';
import { ActiveModuleId } from './types';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModuleId>('home');
  const contentContainerRef = useRef<HTMLDivElement | null>(null);

  // GSAP transition when changing modules
  const handleNavigate = (newModule: ActiveModuleId) => {
    if (contentContainerRef.current) {
      gsap.fromTo(
        contentContainerRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
    setActiveModule(newModule);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Initial entrance animation
    if (contentContainerRef.current) {
      gsap.fromTo(
        contentContainerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      );
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      {/* VietinBank Top Bar & Logo */}
      <Header activeModule={activeModule} onNavigate={handleNavigate} />

      {/* 7 Interactive Modules Tabs */}
      <NavigationTabs activeModule={activeModule} onSelect={handleNavigate} />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div ref={contentContainerRef}>
          {activeModule === 'home' && (
            <HomeOverview onSelectModule={handleNavigate} />
          )}

          {activeModule === 'faq' && (
            <FaqSection onBackToHome={() => handleNavigate('home')} />
          )}

          {activeModule === 'ipay' && (
            <IpayDownloadSection onBackToHome={() => handleNavigate('home')} />
          )}

          {activeModule === 'game' && (
            <GameSection onBackToHome={() => handleNavigate('home')} />
          )}

          {activeModule === 'savings' && (
            <SavingsCalculatorSection onBackToHome={() => handleNavigate('home')} />
          )}

          {activeModule === 'loans' && (
            <LoanScheduleSection onBackToHome={() => handleNavigate('home')} />
          )}

          {activeModule === 'products' && (
            <FeaturedProductsSection onBackToHome={() => handleNavigate('home')} />
          )}

          {activeModule === 'locations' && (
            <TransactionPointsSection onBackToHome={() => handleNavigate('home')} />
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
