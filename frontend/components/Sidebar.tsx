'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  BookOpen, 
  Calendar, 
  Activity, 
  User, 
  Settings, 
  LogOut, 
  UtensilsCrossed,
  ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  if (pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/reset-password') {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Pantry', href: '/pantry', icon: Package },
    { name: 'Recipes', href: '/recipes', icon: BookOpen },
    { name: 'Planner', href: '/planner', icon: Calendar },
    { name: 'Diet Goals', href: '/diet', icon: Activity },
    { name: 'Meal History', href: '/history', icon: Activity },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ name: 'Admin Panel', href: '/admin', icon: ShieldAlert });
  }

  return (
    <aside className="w-72 bg-white/95 dark:bg-[#0c1322]/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-slate-800 p-6 h-screen sticky top-0 text-slate-900 dark:text-slate-100 shrink-0 transition-colors duration-200 font-sans z-30 shadow-xl overflow-y-auto">
      
      {/* Fode Style Logo with Yellow Dot Suffix */}
      <Link href="/dashboard" className="flex items-center space-x-3 mb-8 px-2 group">
        <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
          <UtensilsCrossed className="w-5 h-5 text-[#FFC107]" />
        </div>
        <div>
          <span className="text-2xl font-extrabold tracking-tight text-[#17130B] dark:text-white block font-serif">
            MealShare<span className="text-[#FFC107] font-black text-3xl inline-block -ml-0.5">.</span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FFC107] block -mt-1">
            CULINARY HUB
          </span>
        </div>
      </Link>

      {/* Navigation List */}
      <nav className="space-y-1.5">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              prefetch={true}
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
                isActive
                  ? 'bg-[#FFC107] text-black shadow-md shadow-amber-500/20 font-black'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{link.name}</span>
            </Link>
          );
        })}

        {/* Settings and Logout directly below Profile */}
        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
          <Link
            href="/settings"
            prefetch={true}
            className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all duration-200 ${
              pathname === '/settings'
                ? 'bg-[#FFC107] text-black shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Settings</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-2xl text-sm font-extrabold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors group text-left"
          >
            <LogOut className="w-4 h-4 text-rose-600 group-hover:translate-x-0.5 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
