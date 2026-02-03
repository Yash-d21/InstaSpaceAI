
import React from 'react';

interface NavbarProps {
  scrolled: boolean;
  onLoginClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ scrolled, onLoginClick }) => {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-8 h-8 bg-[#C5A059] flex items-center justify-center font-bold text-black text-xs">IS</div>
          <span className="text-xl font-extrabold tracking-tight font-geometric">INSTASPACE<span className="text-[#C5A059]">AI</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#cases" className="hover:text-white transition-colors">Use Cases</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onLoginClick}
            className="hidden sm:block text-sm font-medium hover:text-[#C5A059] transition-colors"
          >
            Login
          </button>
          <button 
            onClick={onLoginClick}
            className="bg-[#C5A059] text-black px-5 py-2.5 text-sm font-bold hover:bg-[#D4B57D] transition-all transform active:scale-95"
          >
            Try InstaSpace AI
          </button>
        </div>
      </div>
    </nav>
  );
};
