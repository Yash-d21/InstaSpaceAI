
import React, { useState } from 'react';

const variants = [
  { id: 1, name: 'Modern Minimal', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Industrial Loft', img: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Scandi Warmth', img: 'https://images.unsplash.com/photo-1616486341353-c5833ad88010?auto=format&fit=crop&q=80&w=400' }
];

export const ProductDemo: React.FC = () => {
  const [activeVariant, setActiveVariant] = useState(1);

  return (
    <section className="py-24 md:py-32 px-6 bg-grid">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 font-geometric">The Designer's Command Center</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Full control over your renovation project in one unified dashboard.</p>
        </div>

        <div className="bg-[#1e1e1e] border border-white/10 rounded-lg overflow-hidden shadow-2xl flex flex-col lg:flex-row h-full">
          {/* Sidebar / Options */}
          <div className="lg:w-80 border-b lg:border-b-0 lg:border-r border-white/10 p-6 flex flex-col gap-8 bg-black/20">
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Design Variants</div>
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
                {variants.map(v => (
                  <button 
                    key={v.id}
                    onClick={() => setActiveVariant(v.id)}
                    className={`relative p-2 border transition-all ${activeVariant === v.id ? 'border-[#C5A059] bg-[#C5A059]/5' : 'border-white/5 hover:border-white/20'}`}
                  >
                    <img src={v.img} alt={v.name} className="w-full h-12 lg:h-20 object-cover mb-2" />
                    <div className="text-[10px] font-bold text-center uppercase">{v.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-3 text-xs font-bold uppercase tracking-widest transition-all">
              Regenerate All
            </button>
            
            <div className="mt-auto hidden lg:block">
              <div className="p-4 bg-[#C5A059]/5 border border-[#C5A059]/20">
                <div className="text-[10px] text-[#C5A059] uppercase mb-1 font-bold">AI Status</div>
                <div className="text-xs text-white">Project context analyzed. Floor plan extracted. Lighting maps generated.</div>
              </div>
            </div>
          </div>

          {/* Main Preview Area */}
          <div className="flex-grow flex flex-col">
            <div className="flex-grow relative bg-[#121212]">
              <img 
                src={variants.find(v => v.id === activeVariant)?.img.replace('w=400', 'w=1200')} 
                alt="Main preview" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                 <div>
                   <h4 className="text-2xl font-bold font-geometric">{variants.find(v => v.id === activeVariant)?.name}</h4>
                   <div className="flex gap-4 mt-2">
                     <span className="text-xs text-gray-400">Area: 420 sqft</span>
                     <span className="text-xs text-gray-400">Est. Labor: 8 Days</span>
                   </div>
                 </div>
                 <div className="bg-[#C5A059] text-black px-4 py-2 text-xs font-bold uppercase cursor-pointer">View Render</div>
              </div>
            </div>

            <div className="h-64 grid md:grid-cols-3 border-t border-white/10">
               <div className="p-6 border-b md:border-b-0 md:border-r border-white/10">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-4 font-bold flex justify-between">
                    Cost Breakdown <span className="text-green-500">Optimized</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs"><span>Flooring</span> <span className="font-bold">$2,200</span></div>
                    <div className="flex justify-between text-xs"><span>Fixtures</span> <span className="font-bold">$4,500</span></div>
                    <div className="flex justify-between text-xs border-t border-white/5 pt-2"><span>Total Est.</span> <span className="font-bold text-[#C5A059]">$11,850</span></div>
                  </div>
               </div>
               <div className="p-6 border-b md:border-b-0 md:border-r border-white/10">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-4 font-bold">Shopping List (Procured)</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] bg-white/5 p-2 border border-white/5">
                      <div className="w-6 h-6 bg-white/10"></div>
                      <div>OAK Herringbone Planks (60m²)</div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] bg-white/5 p-2 border border-white/5">
                      <div className="w-6 h-6 bg-white/10"></div>
                      <div>Brass Recessed Downlights (x12)</div>
                    </div>
                  </div>
               </div>
               <div className="p-6">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-4 font-bold">Timeline Preview</div>
                  <div className="flex flex-col gap-4 mt-2">
                    <div className="w-full h-1 bg-white/10 relative">
                       <div className="absolute top-0 left-0 w-3/4 h-full bg-[#C5A059]"></div>
                    </div>
                    <div className="text-[10px] text-gray-400">Demolition & Prep: <span className="text-white">Complete</span></div>
                    <div className="text-[10px] text-gray-400">Material Delivery: <span className="text-[#C5A059]">In Progress</span></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
