'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, UtensilsCrossed } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassBackground from '../../components/GlassBackground';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>('user');

  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const authenticatedUser = await login(email, password);
      if (authenticatedUser?.role === 'admin') {
        toast.success('Welcome to Admin Portal!');
        router.push('/admin');
      } else {
        toast.success('Welcome back to MealShare!');
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const authenticatedUser = await loginWithGoogle();
      if (!authenticatedUser) return;

      if (authenticatedUser.role === 'admin') {
        toast.success('Signed in as Admin!');
        router.push('/admin');
      } else {
        toast.success('Signed in with Google successfully!');
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error('Google login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF7F2] dark:bg-[#0b1324] relative flex flex-col justify-between overflow-x-hidden font-serif text-[#0F172A] dark:text-slate-100 -m-8 transition-colors duration-200">
      <GlassBackground />
      
      {/* Top Bar Logo */}
      <div className="relative z-10 p-6 flex justify-center border-b border-[#E2D9D0] dark:border-slate-800 bg-[#FFFDF9]/60 dark:bg-slate-900/60 backdrop-blur-md">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-full bg-[#FF5722] flex items-center justify-center text-white shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xl font-black tracking-tight text-[#0F172A] dark:text-white uppercase">
            MEALSHARE
          </span>
        </Link>
      </div>

      {/* Main Centered Universal Login Content */}
      <div className="relative z-10 max-w-md w-full mx-auto px-4 py-8 flex flex-col items-center my-auto">
        
        {/* Centered Main Header */}
        <div className="text-center mb-6 space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black text-[#0F172A] dark:text-white tracking-tight uppercase">
            MEALSHARE
          </h1>
          <p className="text-xs sm:text-sm font-bold text-[#FF5722] uppercase tracking-wide">
            Your pantry, your recipes, your smarter meal plan.
          </p>
        </div>

        {/* Universal Form Card Box */}
        <div className="bg-[#FFFDF9] dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-[#E2D9D0] dark:border-slate-800 w-full space-y-6">
          
          <div className="flex items-center justify-between border-b border-[#E2D9D0] dark:border-slate-800 pb-4">
            <h2 className="text-xl font-black text-[#0F172A] dark:text-white uppercase">
              SIGN IN
            </h2>
            <div className="flex items-center space-x-1.5 text-xs font-black text-[#475569]">
              <span>Login As:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as 'user' | 'admin')}
                className="px-2.5 py-1 rounded-xl bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] text-xs font-black text-[#059669] focus:outline-none cursor-pointer"
              >
                <option value="user">👤 User</option>
                <option value="admin">🛡 Admin</option>
              </select>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-serif">
            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs uppercase text-[#475569] font-black">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#475569] absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email Address"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] text-sm font-black text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase text-[#475569] font-black">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-black text-[#059669] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#475569] absolute left-4 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] text-sm font-black text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-[#475569] hover:text-[#0F172A]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-full bg-[#059669] hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-md active:scale-95 mt-2"
            >
              {loading ? 'Authenticating...' : 'LOGIN'}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2D9D0] dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[11px] font-black text-[#475569] uppercase tracking-widest">
              <span className="bg-[#FFFDF9] dark:bg-slate-900 px-3">OR SIGN IN WITH</span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-full bg-[#FFFDF9] dark:bg-slate-800 hover:bg-[#FDF7F2] text-[#0F172A] dark:text-white font-black text-sm border border-[#E2D9D0] flex items-center justify-center space-x-3 transition-all shadow-xs active:scale-95"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Create Account Link */}
          <div className="text-center pt-2">
            <Link
              href="/signup"
              className="text-xs font-black text-[#059669] hover:underline uppercase"
            >
              Create Account
            </Link>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-xs font-black text-[#475569] border-t border-[#E2D9D0] bg-[#FFFDF9]/60">
        © 2026 MealShare Pro. All rights reserved.
      </footer>
    </div>
  );
}
