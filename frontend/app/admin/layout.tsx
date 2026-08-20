'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Package, 
  Calendar, 
  Activity, 
  Settings, 
  LogOut, 
  ArrowLeft,
  Menu,
  X,
  Lock
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdminLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isAdminLoginPage) return;
    if (!loading && (!user || user.role !== 'admin')) {
      toast.error('Administrator access required. Redirecting to admin login.');
      router.push('/admin/login');
    }
  }, [user, loading, router, isAdminLoginPage]);

  if (isAdminLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f0] dark:bg-[#0b1324] flex items-center justify-center p-8 font-serif">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-black text-slate-700 dark:text-slate-300">Verifying Admin Permissions...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#f8f6f0] dark:bg-[#0b1324] flex items-center justify-center p-8 font-serif">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md text-center shadow-xl space-y-4">
          <Lock className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Access Denied</h2>
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
            Administrator privileges required for account: <strong className="text-slate-900 dark:text-white">{user?.email || 'Guest'}</strong>
          </p>
          <Link href="/admin/login" className="inline-block px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-2xl">
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    toast.success('Admin logged out successfully');
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Recipes', href: '/admin/recipes', icon: BookOpen },
    { name: 'Pantry', href: '/admin/pantry', icon: Package },
    { name: 'Meal Planner', href: '/admin/meals', icon: Calendar },
    { name: 'Data Quality Audit', href: '/admin/data-quality', icon: ShieldAlert },
    { name: 'Audit Activity Log', href: '/admin/activity', icon: Activity },
    { name: 'System Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f8f6f0] dark:bg-[#0b1324] flex font-serif text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-700"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* LEFT SIDEBAR: MealShare Admin */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-[#0c1322] text-white border-r border-slate-800 p-6 flex flex-col justify-between transform ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } transition-transform duration-200 ease-in-out shrink-0`}>
        
        <div>
          {/* Header */}
          <div className="flex items-center space-x-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-widest text-white uppercase block">
                MEALSHARE
              </span>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                ADMIN PANEL
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#059669] text-white shadow-md shadow-emerald-600/30 font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-sm font-bold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Back to MealShare</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3.5 py-2.5 w-full rounded-2xl text-sm font-bold text-rose-400 hover:bg-rose-950/40 transition-colors group text-left"
          >
            <LogOut className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 sm:p-10 min-w-0 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
