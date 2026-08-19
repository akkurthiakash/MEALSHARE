'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GlassBackground from '../../components/GlassBackground';
import toast from 'react-hot-toast';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const oobCode = searchParams.get('oobCode') || searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);

  const { confirmResetPassword } = useAuth();

  useEffect(() => {
    if (!oobCode) {
      setInvalidCode(true);
    }
  }, [oobCode]);

  // Password Strength Indicator Calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Weak', color: 'bg-rose-500' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score, label: 'Moderate', color: 'bg-amber-500' };
    return { score, label: 'Strong', color: 'bg-[#059669]' };
  };

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (!oobCode) {
      setInvalidCode(true);
      return;
    }

    setLoading(true);
    try {
      await confirmResetPassword(oobCode, newPassword);
      setSuccess(true);
      toast.success('Your password has been reset successfully.');
    } catch (err: any) {
      setInvalidCode(true);
      toast.error('Your reset link is invalid or expired.');
    } finally {
      setLoading(false);
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
            Password Recovery
          </p>
        </div>

        {/* Form Box Card */}
        <div className="bg-[#FFFDF9] dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-[#E2D9D0] dark:border-slate-800 w-full space-y-6">
          
          <div className="border-b border-[#E2D9D0] dark:border-slate-800 pb-4">
            <h2 className="text-xl font-black text-[#0F172A] dark:text-white uppercase">
              Reset your password
            </h2>
            <p className="text-xs font-bold text-[#475569] dark:text-slate-400 mt-1">
              Enter your new account password below.
            </p>
          </div>

          {invalidCode ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto border border-rose-500/30">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase">Invalid or Expired Link</h3>
              <p className="text-xs font-bold text-slate-500 leading-relaxed">
                Your reset link is invalid or expired. Please request a new password reset link.
              </p>
              <div className="pt-2">
                <Link
                  href="/forgot-password"
                  className="px-6 py-3 rounded-full bg-[#059669] hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider inline-block shadow-md"
                >
                  Request a new reset link
                </Link>
              </div>
            </div>
          ) : success ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-[#059669] flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase">Password Reset Successfully</h3>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
              <div className="pt-3">
                <Link
                  href="/login"
                  className="px-6 py-3 rounded-full bg-[#059669] hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider inline-block shadow-md"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-serif">
              
              {/* New Password Input */}
              <div className="space-y-1">
                <label className="text-xs uppercase text-[#475569] font-black">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#475569] absolute left-4 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password (min 6 characters)"
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

              {/* Password Strength Indicator */}
              {newPassword.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase">
                    <span className="text-slate-500">Strength:</span>
                    <span className={strength.score >= 3 ? 'text-[#059669]' : 'text-rose-500'}>{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div style={{ width: `${(strength.score / 5) * 100}%` }} className={`h-full ${strength.color} transition-all duration-300`} />
                  </div>
                </div>
              )}

              {/* Confirm Password Input */}
              <div className="space-y-1">
                <label className="text-xs uppercase text-[#475569] font-black">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#475569] absolute left-4 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] text-sm font-black text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-full bg-[#059669] hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wider transition-all duration-200 shadow-md active:scale-95 mt-2"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-2 text-xs font-black text-[#475569] hover:text-[#059669] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Login</span>
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

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center font-bold">Loading...</div>}>
      <ResetPasswordContent />
    </React.Suspense>
  );
}
