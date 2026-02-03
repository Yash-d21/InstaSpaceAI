
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-20 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12">
        <div className="col-span-2">
           <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#C5A059] flex items-center justify-center font-bold text-black text-xs">IS</div>
            <span className="text-xl font-extrabold tracking-tight font-geometric">INSTASPACE<span className="text-[#C5A059]">AI</span></span>
          </div>
          <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
            Leading the revolution in construction-tech by merging generative AI with real-world architectural constraints.
          </p>
          <div className="flex gap-4 mt-8">
            <div className="w-8 h-8 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/10 flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </div>
            <div className="w-8 h-8 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/10 flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </div>
          </div>
        </div>

        <div>
          <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Product</h5>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">How it works</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">API for Developers</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Release Notes</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Resources</h5>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Design Blog</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Construction Guide</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Case Studies</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Partner Program</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Legal</h5>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Cookie Policy</a></li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <h5 className="text-white font-bold text-xs uppercase tracking-widest mb-6">Company</h5>
          <ul className="space-y-4 text-sm text-gray-500">
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-[#C5A059] transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xs text-gray-600">
          © 2024 InstaSpace AI. All rights reserved. Registered trademark of Architectural Logic Inc.
        </div>
        <div className="flex gap-8 text-xs text-gray-600 uppercase tracking-widest">
           <span>Status: Operational</span>
           <span>Latency: 124ms</span>
        </div>
      </div>
    </footer>
  );
};
