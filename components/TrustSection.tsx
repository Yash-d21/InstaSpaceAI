
import React from 'react';

interface TrustSectionProps {
  onCtaClick?: () => void;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ onCtaClick }) => {
  return (
    <section className="py-24 md:py-48 px-6 bg-grid relative overflow-hidden">
      {/* Background radial gradient for focus */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#C5A059]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="flex justify-center gap-8 mb-16 opacity-30 grayscale items-center flex-wrap">
          <div className="flex items-center gap-2 font-bold text-lg"><span className="w-3 h-3 bg-white"></span> AI-POWERED</div>
          <div className="flex items-center gap-2 font-bold text-lg"><span className="w-3 h-3 bg-white"></span> BUILD-READY</div>
          <div className="flex items-center gap-2 font-bold text-lg"><span className="w-3 h-3 bg-white"></span> COST-INTELLIGENT</div>
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold mb-8 font-geometric leading-tight">
          Stop Guessing Interior Costs. <br /> 
          <span className="text-gray-500">Start Planning With Data.</span>
        </h2>
        
        <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed">
          Join 2,500+ professionals using InstaSpace AI to turn vision into physical spaces without the stress of budget overruns.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={onCtaClick}
            className="w-full sm:w-auto bg-[#F9F9F9] text-[#121212] px-10 py-5 font-bold text-xl hover:bg-[#C5A059] transition-all transform active:scale-95 shadow-2xl"
          >
            Start Your First Project
          </button>
          <button className="text-[#C5A059] font-bold text-lg border-b border-[#C5A059]/30 hover:border-[#C5A059] transition-all">
            Talk to an Expert
          </button>
        </div>

        <p className="mt-12 text-xs text-gray-600 uppercase tracking-[0.3em] font-bold">
          Built for real-world construction decisions
        </p>
      </div>
    </section>
  );
};
