
import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { ValueProps } from './components/ValueProps';
import { ProductDemo } from './components/ProductDemo';
import { Comparison } from './components/Comparison';
import { UseCases } from './components/UseCases';
import { TrustSection } from './components/TrustSection';
import { Footer } from './components/Footer';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoggedIn) {
    return <Dashboard onLogout={() => setIsLoggedIn(false)} />;
  }

  if (showAuth) {
    return <AuthPage onClose={() => setShowAuth(false)} onLoginSuccess={() => {
      setIsLoggedIn(true);
      setShowAuth(false);
    }} />;
  }

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col overflow-x-hidden">
      <Navbar scrolled={scrolled} onLoginClick={() => setShowAuth(true)} />
      
      <main className="flex-grow">
        <Hero onCtaClick={() => setShowAuth(true)} />
        <HowItWorks />
        <ValueProps />
        <ProductDemo />
        <Comparison />
        <UseCases />
        <TrustSection onCtaClick={() => setShowAuth(true)} />
      </main>

      <Footer />
    </div>
  );
};

export default App;
