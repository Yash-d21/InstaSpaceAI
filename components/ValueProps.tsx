
import React from 'react';

const values = [
  {
    title: "AI Design Generation",
    desc: "Generate multiple realistic interior designs instantly from a single smartphone photo.",
    badge: "Fast"
  },
  {
    title: "Budget-Aware Planning",
    desc: "Designs are optimized based on your actual budget, ensuring you don't overspend on looks.",
    badge: "Smart"
  },
  {
    title: "Build-Ready Output",
    desc: "Get materials lists, SKU codes, and cost breakdowns ready for procurement.",
    badge: "Pro"
  },
  {
    title: "Timeline Prediction",
    desc: "Know exactly how long your renovation will take with our logic-based scheduling engine.",
    badge: "Reliable"
  }
];

export const ValueProps: React.FC = () => {
  return (
    <section id="features" className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2 lg:row-span-2 bg-[#1e1e1e] border border-white/5 p-12 flex flex-col justify-end relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-50 transform group-hover:scale-110 transition-transform duration-700">
               <svg className="w-48 h-48 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                 <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
               </svg>
            </div>
            <div className="relative z-10">
              <div className="text-sm font-bold text-[#C5A059] uppercase tracking-widest mb-4">Core Engine</div>
              <h2 className="text-4xl font-extrabold mb-6 font-geometric leading-tight">Architecture-Grade Intelligence</h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
                Unlike consumer filter apps, InstaSpace AI uses professional architectural logic to ensure every beam, socket, and material choice is structurally sound.
              </p>
            </div>
          </div>

          {values.map((v, idx) => (
            <div key={idx} className="bg-white/5 border border-white/5 p-8 hover:bg-white/[0.08] hover:border-[#C5A059]/30 transition-all group flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest mb-4 inline-block border border-[#C5A059]/30 px-2 py-0.5">{v.badge}</div>
                <h3 className="text-xl font-bold mb-4 font-geometric group-hover:text-white transition-colors">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
              <div className="mt-8 text-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
