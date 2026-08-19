'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  Utensils, 
  Package, 
  BookOpen, 
  Calendar, 
  Activity, 
  Leaf, 
  LogOut, 
  User as UserIcon 
} from 'lucide-react';

import NotificationBell from './NotificationBell';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user && (pathname === '/login' || pathname === '/signup')) {
    return null;
  }

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Utensils },
    { name: 'Pantry', href: '/pantry', icon: Package },
    { name: 'Recipes', href: '/recipes', icon: BookOpen },
    { name: 'Weekly Planner', href: '/planner', icon: Calendar },
    { name: 'Diet & Nutrition', href: '/diet', icon: Activity },
    { name: 'Meal History', href: '/history', icon: Leaf },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Utensils className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              MealShare <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Pro</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={true}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Section & Real-time Notification Bell */}
          <div className="flex items-center space-x-4">
            <NotificationBell />

            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-sm font-semibold text-slate-200">
                    {user.displayName || user.email?.split('@')[0] || 'Chef'}
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">Firebase Connected</span>
                </div>
                <button
                  onClick={() => logout()}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/20 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all duration-200 shadow-md shadow-emerald-400/20"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
