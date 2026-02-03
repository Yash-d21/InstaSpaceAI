
import React, { useState } from 'react';

interface AuthPageProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-6 relative overflow-hidden bg-grid">
      {/* Floating blurred accents */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Close button */}
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors z-50 p-2"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Main Auth Card */}
      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-[#C5A059] flex items-center justify-center font-bold text-black text-lg mb-4">IS</div>
          <h2 className="text-3xl font-extrabold font-geometric tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 mt-2 text-center text-sm">
            {isLogin 
              ? 'Access your buildable interior design engine' 
              : 'Start designing construction-ready spaces today'}
          </p>
        </div>

        {/* Glass Container */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-colors placeholder:text-gray-700" 
                  placeholder="John Doe"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-colors placeholder:text-gray-700" 
                placeholder="architect@studio.com"
                required
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                {isLogin && (
                  <button type="button" className="text-[10px] text-[#C5A059] font-bold uppercase hover:underline">Forgot?</button>
                )}
              </div>
              <input 
                type="password" 
                className="w-full bg-black/40 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#C5A059] transition-colors placeholder:text-gray-700" 
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="w-full bg-[#F9F9F9] text-[#121212] py-4 font-bold text-sm uppercase tracking-widest hover:bg-[#C5A059] transition-all transform active:scale-[0.98]">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-[#1e1e1e] px-4 text-gray-500">Or continue with</span>
            </div>
          </div>

          <button onClick={onLoginSuccess} className="w-full bg-transparent border border-white/10 hover:bg-white/5 py-4 flex items-center justify-center gap-3 transition-all group">
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest">Google</span>
          </button>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-500 text-xs font-medium"
          >
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <span className="text-[#C5A059] font-bold uppercase tracking-widest hover:underline ml-1">
              {isLogin ? 'Sign up' : 'Log in'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
