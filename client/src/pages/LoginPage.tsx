import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { Shield, Lock, Mail, Zap, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your corporate email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    await login(email, password);
    setLoading(false);
    navigate('/dashboard');
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    await demoLogin();
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md cyber-card rounded-3xl border border-slate-800 p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-mono font-bold text-white tracking-tight">
            AegisAI Gateway Login
          </h1>
          <p className="text-xs text-slate-400">
            Access the Enterprise Threat & Privacy Command Center
          </p>
        </div>

        {/* Hackathon Judge 1-Click Login Banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-emerald-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              Hackathon Judge Shortcut
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
              Demo Mode
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            Bypass credential entry and authenticate as CISO Admin (<code className="text-emerald-300">demo@aegisai.com</code>).
          </p>
          <button
            type="button"
            disabled={loading}
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-mono font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md"
          >
            ⚡ Instant One-Click Demo Login
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">Corporate Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#030712] border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 block">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#030712] border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-xs font-mono font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition shadow"
          >
            {loading ? 'Authenticating...' : 'Sign In with Password'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <span>Don't have an enterprise account? </span>
          <Link to="/register" className="text-emerald-400 hover:underline font-mono font-semibold">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};
