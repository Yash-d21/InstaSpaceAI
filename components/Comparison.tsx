
import React from 'react';

const ComparisonRow = ({ label, trad, apps, insta }: { label: string, trad: string, apps: string, insta: string }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/5 py-6 md:py-8 gap-4 items-center">
    <div className="col-span-2 md:col-span-1 text-sm font-bold uppercase tracking-widest text-gray-500">{label}</div>
    <div className="text-sm text-gray-400 md:text-center px-2">{trad}</div>
    <div className="text-sm text-gray-400 md:text-center px-2">{apps}</div>
    <div className="text-sm text-white font-bold md:text-center bg-[#C5A059]/10 py-3 border border-[#C5A059]/30">{insta}</div>
  </div>
);

export const Comparison: React.FC = () => {
  return (
    <section className="py-24 md:py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 font-geometric">Why Design with <span className="text-[#C5A059]">Data</span>?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Traditional design is a black box. InstaSpace AI is an open execution ledger.</p>
        </div>

        <div className="bg-[#121212] border border-white/10 p-4 md:p-8">
          <div className="hidden md:grid grid-cols-4 pb-12 gap-4 border-b border-white/10">
            <div className="text-xs font-bold uppercase tracking-tighter opacity-0">Feature</div>
            <div className="text-xs font-bold uppercase tracking-tighter text-center text-gray-500">Traditional Designers</div>
            <div className="text-xs font-bold uppercase tracking-tighter text-center text-gray-500">Basic Design Apps</div>
            <div className="text-xs font-bold uppercase tracking-tighter text-center text-[#C5A059]">InstaSpace AI</div>
          </div>

          <ComparisonRow 
            label="Pricing" 
            trad="Expensive ($3k+)" 
            apps="Free / Basic Sub" 
            insta="Cost Effective" 
          />
          <ComparisonRow 
            label="Speed" 
            trad="2-4 Weeks" 
            apps="Instant" 
            insta="Seconds per Iteration" 
          />
          <ComparisonRow 
            label="Execution Plan" 
            trad="Manual / Static" 
            apps="Non-existent" 
            insta="Automated & Dynamic" 
          />
          <ComparisonRow 
            label="Cost Accuracy" 
            trad="Experience-based" 
            apps="Zero Logic" 
            insta="Real-market Pricing" 
          />
          <ComparisonRow 
            label="Buildable" 
            trad="Yes (If Pro)" 
            apps="Visual Only" 
            insta="Construction Ready" 
          />
        </div>
      </div>
    </section>
  );
};
