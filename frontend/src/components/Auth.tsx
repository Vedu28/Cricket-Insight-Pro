import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Shield, Trophy, Activity, AlertCircle, CheckCircle } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: (token: string, user: { id: string; name: string; email: string; role: string }) => void;
  backendUrl: string;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess, backendUrl }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // ADMIN, ANALYST, USER
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isForgot) {
        // Reset password
        const response = await fetch(`${backendUrl}/api/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, new_password: password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Reset failed');
        setMessage('Password successfully reset! You can now log in.');
        setIsForgot(false);
        setIsLogin(true);
      } else if (isLogin) {
        // Login
        const response = await fetch(`${backendUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        onAuthSuccess(data.token, data.user);
      } else {
        // Register
        const response = await fetch(`${backendUrl}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        onAuthSuccess(data.token, data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-emerald-500/10 filter blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-blue-500/10 filter blur-3xl -z-10"></div>

      <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-xl mb-4 text-emerald-400 ring-1 ring-emerald-500/20">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
            Cricket-Insight-Pro
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {isForgot 
              ? 'Enter credentials to reset account access' 
              : isLogin 
                ? 'Sign in to access advanced analytics & predictions' 
                : 'Create an account to track stats and scout talent'}
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start space-x-3 text-emerald-400 text-sm">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && !isForgot && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3.5 text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  required
                  placeholder="Rahul Dravid"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-500 w-5 h-5" />
              <input
                type="email"
                required
                placeholder="analyst@cricketinsight.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {isForgot ? 'New Password' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-slate-500 w-5 h-5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {!isLogin && !isForgot && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Choose Role</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'USER', label: 'Fan/User', icon: Activity },
                  { id: 'ANALYST', label: 'Analyst', icon: Shield },
                  { id: 'ADMIN', label: 'Admin', icon: Lock }
                ].map((item) => {
                  const Icon = item.icon;
                  const active = role === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition ${
                        active 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/5' 
                          : 'bg-slate-900/30 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1.5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => { setIsForgot(true); setIsLogin(false); }}
                className="text-xs text-slate-400 hover:text-emerald-400 transition"
              >
                Forgot your password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/10 active:scale-[0.98] transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : isForgot ? 'Reset Password' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-8 pt-6 border-t border-slate-900/60 text-center text-sm text-slate-400">
          {isForgot ? (
            <button
              onClick={() => { setIsForgot(false); setIsLogin(true); }}
              className="text-emerald-400 hover:underline font-medium"
            >
              Back to Login
            </button>
          ) : isLogin ? (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-emerald-400 hover:underline font-medium"
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => setIsLogin(true)}
                className="text-emerald-400 hover:underline font-medium"
              >
                Log in here
              </button>
            </p>
          )}
        </div>

        {/* Demo Credentials Alert */}
        <div className="mt-6 p-3 bg-slate-900/40 rounded-xl border border-slate-800/40 text-[11px] text-slate-500">
          <p className="font-semibold text-slate-400 mb-1">💡 Demo Credentials (Pre-seeded):</p>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>Admin: <code className="text-slate-400">admin@cricketinsight.com</code> / password: <code className="text-slate-400">password123</code></li>
            <li>Analyst: <code className="text-slate-400">analyst@cricketinsight.com</code> / password: <code className="text-slate-400">password123</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
};
