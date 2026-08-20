'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassBackground from '../../../components/GlassBackground';

export default function AdminLoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('akkurthiakash2@gmail.com');
  const [password, setPassword] = useState('Akash@3366');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const authenticatedUser = await login(email, password, 'admin');
      if (authenticatedUser?.role === 'admin') {
        toast.success('Admin authentication successful!');
        window.location.href = '/admin';
      } else {
        toast.error('Account does not have administrator privileges.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAdminLogin = async () => {
    setLoading(true);
    try {
      const authenticatedUser = await loginWithGoogle('admin');
      if (!authenticatedUser) return;

      if (authenticatedUser.role === 'admin') {
        toast.success('Admin verified via Google!');
        window.location.href = '/admin';
      } else {
        toast.error('Google account is not an authorized administrator.');
      }
    } catch (err: any) {
      toast.error('Google Admin sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] relative flex flex-col justify-between overflow-x-hidden font-serif text-slate-100 -m-8 transition-colors duration-200">
      <GlassBackground />
      
      {/* Top Navigation Bar */}
      <div className="relative z-10 p-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/70 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white uppercase block leading-none">
              MEALSHARE ADMIN
            </span>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Security Portal
            </span>
          </div>
        </div>

        <Link 
          href="/login"
          className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-black text-xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>User Login</span>
        </Link>
      </div>

      {/* Main Centered Admin Form Box */}
      <div className="relative z-10 max-w-md w-full mx-auto px-4 py-8 flex flex-col items-center my-auto">
        
        {/* Portal Header */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Restricted Access</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            ADMINISTRATOR PORTAL
          </h1>
          <p className="text-xs font-bold text-slate-400">
            Authorized personnel only. Secure credentials required.
          </p>
        </div>

        {/* Admin Card */}
        <div className="bg-slate-900/90 rounded-3xl p-8 shadow-2xl border border-slate-800 backdrop-blur-xl w-full space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-black text-white uppercase flex items-center space-x-2">
              <span>ADMIN SIGN IN</span>
            </h2>
            <span className="text-[11px] font-black px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              ROLE: ADMIN
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Admin Email Input */}
            <div className="space-y-1">
              <label className="text-xs uppercase text-slate-400 font-black">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mealshare.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Admin Password Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase text-slate-400 font-black">Admin Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-sm font-black text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Admin Login Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-amber-500/20 active:scale-95 mt-2"
            >
              {loading ? 'Verifying Admin Access...' : 'ENTER ADMIN PORTAL'}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <span className="bg-slate-900 px-3">ADMIN GOOGLE AUTH</span>
            </div>
          </div>

          {/* Google Admin Login */}
          <button
            type="button"
            onClick={handleGoogleAdminLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-black text-sm border border-slate-700 flex items-center justify-center space-x-3 transition-all active:scale-95"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Sign In with Admin Google</span>
          </button>

          {/* Switch back to User Login */}
          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs font-black text-slate-400 hover:text-amber-400 transition-colors uppercase"
            >
              ← Return to Standard User Login
            </Link>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-xs font-black text-slate-500 border-t border-slate-800 bg-slate-900/60">
        © 2026 MealShare Admin Control Systems.
      </footer>
    </div>
  );
}
