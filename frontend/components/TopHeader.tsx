'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Sun, Moon, Volume2, VolumeX, User, LogOut, ChevronDown, Clock, Flame, X } from 'lucide-react';
import toast from 'react-hot-toast';
import NotificationBell from './NotificationBell';
import { getDetailedRecipes, DetailedRecipe } from '../lib/db';

export default function TopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { preferences, updatePreferences } = useNotifications();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DetailedRecipe[]>([]);
  const [allRecipes, setAllRecipes] = useState<DetailedRecipe[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/reset-password') {
    return null;
  }

  const userName = user?.displayName || user?.email?.split('@')[0] || 'Chef Akash';

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowDropdown(false);
    router.push(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleSelectRecipe = (recipe: DetailedRecipe) => {
    setShowDropdown(false);
    setSearchQuery('');
    router.push(`/recipes?search=${encodeURIComponent(recipe.name)}`);
  };

  const toggleMute = () => {
    const nextMaster = !preferences.masterNotifications;
    updatePreferences({ masterNotifications: nextMaster });
    toast.success(nextMaster ? 'Notifications unmuted' : 'Notifications muted');
  };

  return (
    <header className="h-20 px-8 flex items-center justify-between bg-white dark:bg-[#0b1324] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-200 font-sans">
      
      {/* Left Branding */}
      <div className="flex items-center space-x-3">
        <Link href="/dashboard" className="text-2xl font-serif font-black text-[#17130B] dark:text-white tracking-tight hover:opacity-80">
          MealShare<span className="text-[#FFC107] font-black text-3xl inline-block -ml-0.5">.</span>
        </Link>
      </div>

      {/* Center Search Field with Fast Debounced Dropdown */}
      <div ref={searchRef} className="flex-1 max-w-xl mx-8 hidden md:block relative">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => { if (searchQuery.trim()) setShowDropdown(true); }}
            placeholder="Search recipes (e.g. Fish Curry, Egg Fried Rice)..."
            className="w-full pl-5 pr-14 py-2.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FFC107] shadow-xs"
          />
          <button
            type="submit"
            className="absolute right-1.5 p-2 rounded-full bg-[#FFC107] text-black hover:bg-[#FFA000] transition-colors shadow-xs"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        {/* Dropdown Popup Overlay */}
        {showDropdown && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 p-3 space-y-2 max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center text-xs font-bold text-slate-500">Searching recipes...</div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-center text-xs font-bold text-slate-500">No recipes matched "{searchQuery}"</div>
            ) : (
              searchResults.map(recipe => (
                <div
                  key={recipe.id}
                  onClick={() => handleSelectRecipe(recipe)}
                  className="flex items-center space-x-3.5 p-2.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase truncate">{recipe.name}</h4>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 font-bold">
                      <span className="text-[#059669]">{recipe.mealType || 'Meal'}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-0.5"><Flame className="w-3 h-3 text-orange-500" /> {recipe.calories} kcal</span>
                      <span>•</span>
                      <span className="flex items-center space-x-0.5"><Clock className="w-3 h-3 text-emerald-600" /> {recipe.cookingTime} mins</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        
        {/* Mute Control */}
        <button
          onClick={toggleMute}
          title={preferences.masterNotifications ? 'Mute Notifications' : 'Unmute Notifications'}
          className={`p-2.5 rounded-2xl border transition-all shadow-xs flex items-center space-x-2 font-bold ${
            preferences.masterNotifications
              ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 text-slate-700 hover:text-[#FFC107]'
              : 'bg-rose-50 border-rose-200 text-rose-600'
          }`}
        >
          {preferences.masterNotifications ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <>
              <VolumeX className="w-4 h-4" />
              <span className="text-xs uppercase">Muted</span>
            </>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 text-slate-700 dark:text-slate-200 hover:text-[#FFC107] transition-all shadow-xs"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2.5 p-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-[#FFC107] text-black font-black text-sm flex items-center justify-center shadow-md border-2 border-amber-300">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white hidden sm:inline">
              {userName}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 p-2 space-y-1">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Signed in as</p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{userName}</p>
              </div>

              <Link
                href="/profile"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center space-x-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <User className="w-4 h-4 text-[#FFC107]" />
                <span>View Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-2.5 w-full rounded-2xl text-xs font-extrabold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
