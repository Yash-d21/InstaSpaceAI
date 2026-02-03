
import React from 'react';

const steps = [
  {
    number: "01",
    title: "Upload Room Photo",
    description: "Snap a photo of your existing space. Our AI analyzes dimensions, lighting, and architectural constraints automatically.",
    icon: (
      <svg className="w-12 h-12 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    number: "02",
    title: "AI Generates Designs",
    description: "Get 3 distinct, photorealistic design variants based on your aesthetic preferences and practical buildability logic.",
    icon: (
      <svg className="w-12 h-12 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.673.337a4 4 0 01-2.5.476l-1.517-.168a2 2 0 01-1.212-.483l-3.328-2.662a2 2 0 01-.192-2.828l3.328-4.16a2 2 0 012.828-.192l3.328 2.662a2 2 0 01.483 1.212l.168 1.517a4 4 0 00.476 2.5l.337.673a6 6 0 01.517 3.86l-.477 2.387a2 2 0 01-.547 1.022l-1.932 1.932a2 2 0 01-2.828 0l-1.932-1.932z" />
      </svg>
    )
  },
  {
    number: "03",
    title: "Get Execution Plan",
    description: "Export a complete materials list, labor cost estimates, and a realistic construction timeline ready for your contractor.",
    icon: (
      <svg className="w-12 h-12 text-[#C5A059]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 md:py-32 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 font-geometric">Building Your Dream, <span className="text-gray-500 italic">Simplified.</span></h2>
          <p className="text-gray-400 max-w-2xl text-lg">A frictionless journey from a messy room to a masterpiece with full transparency on budget and effort.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="mb-8">{step.icon}</div>
              <div className="absolute top-0 right-0 text-7xl font-bold opacity-[0.03] pointer-events-none font-geometric">
                {step.number}
              </div>
              <h3 className="text-2xl font-bold mb-4 font-geometric group-hover:text-[#C5A059] transition-colors">{step.title}</h3>
              <p className="text-gray-400 leading-relaxed">{step.description}</p>
              
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-4 w-12 h-px bg-white/10"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
