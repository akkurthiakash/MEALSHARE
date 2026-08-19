'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GlassBackground from '../../components/GlassBackground';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await resetPassword(email);
    } catch (e) {
      // Email enumeration protection: swallow error silently
    } finally {
      setLoading(false);
      setSubmitted(true);
      toast.success('Password reset link processed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF7F2] dark:bg-[#0b1324] relative flex flex-col justify-between overflow-x-hidden font-serif text-[#0F172A] dark:text-slate-100 -m-8 transition-colors duration-200">
      <GlassBackground />
      
      {/* Top Bar Logo */}
      <div className="relative z-10 p-6 flex justify-center border-b border-[#E2D9D0] dark:border-slate-800 bg-[#FFFDF9]/60 dark:bg-slate-900/60 backdrop-blur-md">
        <Link href="/login" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-full bg-[#FF5722] flex items-center justify-center text-white shadow-md shadow-orange-500/30 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xl font-black tracking-tight text-[#0F172A] dark:text-white uppercase">
            MEALSHARE
          </span>
        </Link>
      </div>

      {/* Main Form Container */}
      <div className="relative z-10 max-w-md w-full mx-auto px-4 py-8 flex flex-col items-center my-auto">
        
        {/* Header Title */}
        <div className="text-center mb-6 space-y-2">
          <h1 className="text-4xl font-black text-[#0F172A] dark:text-white tracking-tight uppercase">
            MEALSHARE
          </h1>
          <p className="text-sm font-bold text-[#FF5722] uppercase">
            Account Security & Recovery
          </p>
        </div>

        {/* Form Box Card */}
        <div className="bg-[#FFFDF9] dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-[#E2D9D0] dark:border-slate-800 w-full space-y-6">
          
          <div className="border-b border-[#E2D9D0] dark:border-slate-800 pb-4">
            <h2 className="text-xl font-black text-[#0F172A] dark:text-white uppercase">
              Reset your password
            </h2>
            <p className="text-xs font-bold text-[#475569] dark:text-slate-400 mt-1">
              Enter the email address associated with your account and we'll help you reset your password.
            </p>
          </div>

          {submitted ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-[#059669] flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-[#0F172A] dark:text-slate-200 leading-relaxed">
                If an account exists for <strong>{email}</strong>, a password reset link has been sent.
              </p>
              <p className="text-[11px] text-slate-500 font-bold">
                Please check your inbox or spam folder for password reset instructions.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-2 text-xs font-black text-[#059669] hover:underline uppercase"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Login</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 font-serif">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-[#059669] hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-md active:scale-95"
              >
                {loading ? 'Processing...' : 'Send Reset Link'}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-2 text-xs font-black text-[#475569] hover:text-[#059669] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-xs font-black text-[#475569] border-t border-[#E2D9D0] bg-[#FFFDF9]/60">
        © 2026 MealShare Pro. All rights reserved.
      </footer>
    </div>
  );
}
