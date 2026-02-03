
import React from 'react';

const cases = [
  {
    title: "Homeowners",
    desc: "Transform your living room without the fear of hidden renovation costs.",
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Interior Designers",
    desc: "Speed up your initial client proposals by 10x with data-backed renders.",
    img: "https://images.unsplash.com/photo-1595844737601-5c89d6a50d27?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Real Estate Developers",
    desc: "Visualize potential renovations for listings to close deals faster.",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Renovation Contractors",
    desc: "Provide instant, accurate quotes to clients with build-ready documentation.",
    img: "https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=600"
  }
];

export const UseCases: React.FC = () => {
  return (
    <section id="cases" className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 font-geometric">Professional Utility. <span className="text-gray-500">Everywhere.</span></h2>
          <p className="text-gray-400 max-w-2xl">From first-time buyers to industry veterans, we bridge the gap between vision and reality.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cases.map((c, idx) => (
            <div key={idx} className="relative group overflow-hidden h-96 border border-white/5">
              <img src={c.img} alt={c.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-2xl font-bold mb-2 font-geometric">{c.title}</h3>
                <p className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0 transform">
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
