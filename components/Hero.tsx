
import React, { useState } from 'react';

interface HeroProps {
  onCtaClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  const [sliderPos, setSliderPos] = useState(50);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(x, 0), 100));
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden bg-grid">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="z-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">Building for the Future</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8 font-geometric tracking-tight">
            Design Your Space. <br /> 
            <span className="text-gray-500">Know The Cost.</span> <br />
            Build With <span className="text-[#C5A059]">Confidence.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            InstaSpace AI generates photorealistic interior designs from your room photo, estimates real-world costs, and creates a build-ready execution plan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button 
              onClick={onCtaClick}
              className="w-full sm:w-auto bg-[#F9F9F9] text-[#121212] px-8 py-4 font-bold text-lg hover:bg-[#C5A059] transition-all duration-300 transform active:scale-95 shadow-xl shadow-white/5"
            >
              Try InstaSpace AI
            </button>
            <button className="w-full sm:w-auto px-8 py-4 font-bold text-lg border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Watch Demo
            </button>
          </div>
          
          <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="text-xs font-bold tracking-widest uppercase">Trusted By:</div>
            <div className="text-lg font-bold">ARC-D</div>
            <div className="text-lg font-bold">STRUCTO</div>
            <div className="text-lg font-bold">METROBUILD</div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -top-10 -right-10 bg-[#1e1e1e] border border-white/10 p-4 z-20 shadow-2xl hidden md:block animate-bounce-slow">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Cost Estimate</div>
            <div className="text-xl font-bold text-[#C5A059]">$12,450.00</div>
            <div className="text-[10px] text-green-500 mt-1">±4.2% Accuracy</div>
          </div>

          <div className="absolute -bottom-10 -left-10 bg-[#1e1e1e] border border-white/10 p-4 z-20 shadow-2xl hidden md:block">
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-tighter">Timeline</div>
                <div className="text-sm font-bold">14 Days</div>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="text-center">
                <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-tighter">Items</div>
                <div className="text-sm font-bold">24 Skus</div>
              </div>
            </div>
          </div>

          <div 
            className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden rounded-sm cursor-col-resize border border-white/10 group-hover:border-[#C5A059]/30 transition-colors"
            onMouseMove={handleMouseMove}
            onTouchMove={(e) => {
               const touch = e.touches[0];
               const rect = e.currentTarget.getBoundingClientRect();
               const x = ((touch.clientX - rect.left) / rect.width) * 100;
               setSliderPos(Math.min(Math.max(x, 0), 100));
            }}
          >
            <div className="absolute inset-0">
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200" 
                alt="After transformation"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-white/10">
                AI GENERATED
              </div>
            </div>

            <div 
              className="absolute inset-0 z-10"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img 
                src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200" 
                alt="Before room"
                className="w-full h-full object-cover grayscale"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-widest border border-white/10">
                ORIGINAL PHOTO
              </div>
            </div>

            <div 
              className="absolute inset-y-0 z-20 w-1 bg-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.5)]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-[#C5A059]">
                 <div className="flex gap-0.5">
                    <div className="w-0.5 h-3 bg-[#C5A059]"></div>
                    <div className="w-0.5 h-3 bg-[#C5A059]"></div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
