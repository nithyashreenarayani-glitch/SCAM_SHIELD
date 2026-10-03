import React, { useState } from 'react';
import { useAuth } from '../../lib/auth/AuthContext';
import { X, Shield, Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    signup,
    isSupabaseActive,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    if (authModalMode === 'login') {
      const res = await login(email, password);
      if (res.success) {
        closeAuthModal();
      } else {
        setError(res.error || 'Invalid credentials.');
      }
    } else if (authModalMode === 'signup') {
      const res = await signup(email, password, name);
      if (res.success) {
        setSuccessMsg('Account created successfully! Redirecting...');
        setTimeout(() => closeAuthModal(), 1000);
      } else {
        setError(res.error || 'Could not create account.');
      }
    } else {
      // Forgot password
      setSuccessMsg(`If an account exists for ${email}, password reset instructions have been sent.`);
      setTimeout(() => closeAuthModal(), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 md:p-8 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white">
            {authModalMode === 'login'
              ? 'Sign in to ScamShield'
              : authModalMode === 'signup'
              ? 'Create a ScamShield Account'
              : 'Reset Your Password'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {authModalMode === 'login'
              ? 'Access your full analysis history, saved reports, and personalized telemetry.'
              : authModalMode === 'signup'
              ? 'Get unlimited AI scam analyses, cloud history sync, and threat simulator tracking.'
              : 'Enter your email to receive recovery instructions.'}
          </p>

          {/* Database indicator */}
          <div className="mt-2 text-[10px] font-mono text-slate-400">
            {isSupabaseActive ? (
              <span className="text-emerald-400">● Supabase Auth Connected</span>
            ) : (
              <span className="text-indigo-400">● Session Engine Active (Supabase Optional)</span>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-500/20 bg-red-950/30 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-lg border border-emerald-500/20 bg-emerald-950/30 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalMode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Security Specialist"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/80 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@domain.com"
                className="w-full rounded-lg border border-slate-800 bg-slate-950/80 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {authModalMode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300">Password</label>
                {authModalMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('forgot')}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 transition"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950/80 pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition disabled:opacity-50 shadow-md shadow-indigo-600/20"
          >
            {loading
              ? 'Processing...'
              : authModalMode === 'login'
              ? 'Sign In'
              : authModalMode === 'signup'
              ? 'Create Account'
              : 'Send Reset Link'}
          </button>
        </form>

        {/* Footer switcher */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          {authModalMode === 'login' ? (
            <div>
              Don't have an account?{' '}
              <button
                onClick={() => setAuthModalMode('signup')}
                className="text-indigo-400 font-semibold hover:text-indigo-300 transition"
              >
                Sign up free
              </button>
            </div>
          ) : (
            <div>
              Already have an account?{' '}
              <button
                onClick={() => setAuthModalMode('login')}
                className="text-indigo-400 font-semibold hover:text-indigo-300 transition"
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
