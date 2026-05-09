import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { ChefHat, Flame, Lock, Mail } from 'lucide-react';

export const AuthScreen = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] p-8 shadow-2xl shadow-saffron/10 border border-saffron/5"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-saffron rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-saffron/30">
            <ChefHat size={32} />
          </div>
          <h1 className="font-display text-3xl font-bold text-slate-800 text-center">Saffron & Sage</h1>
          <p className="text-slate-500 text-sm">Your AI-powered culinary companion</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@saffron.com"
                required
                className="w-full bg-slate-50 border-2 border-transparent focus:border-saffron h-14 pl-12 pr-6 rounded-2xl outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-50 border-2 border-transparent focus:border-saffron h-14 pl-12 pr-6 rounded-2xl outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100 italic">
              {error}
            </p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 bg-saffron text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-saffron/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? 'Create Account' : 'Sign In'}
                <Flame size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-saffron transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
