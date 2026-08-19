'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStoredMealPlans, getCompletedMealHistory } from '../../lib/plannerStorage';
import { getPantryItems } from '../../lib/db';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  CheckCircle2, 
  Package, 
  Sparkles, 
  Users, 
  Utensils, 
  ChefHat, 
  Edit3, 
  X, 
  Check 
} from 'lucide-react';
import toast from 'react-hot-toast';

interface UserProfileData {
  displayName: string;
  email: string;
  householdSize: number;
  dietaryPreference: string;
  favoriteCuisines: string[];
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Executive Chef';
  dailyCalorieTarget: number;
}

const DEFAULT_PROFILE: UserProfileData = {
  displayName: 'Chef Akash',
  email: 'chef@mealshare.com',
  householdSize: 2,
  dietaryPreference: 'Balanced Wellness',
  favoriteCuisines: ['Indian', 'Italian', 'Mexican', 'Asian'],
  experienceLevel: 'Executive Chef',
  dailyCalorieTarget: 2000
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [plannedCount, setPlannedCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [pantryCount, setPantryCount] = useState(0);

  const [profile, setProfile] = useState<UserProfileData>(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfileData>(DEFAULT_PROFILE);

  useEffect(() => {
    // Load stored profile or fallback to Auth user details
    const saved = localStorage.getItem('mealshare_user_profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        // fallback
      }
    } else if (user) {
      const initial: UserProfileData = {
        ...DEFAULT_PROFILE,
        displayName: user.displayName || user.email?.split('@')[0] || 'Chef Akash',
        email: user.email || 'chef@mealshare.com'
      };
      setProfile(initial);
    }

    setPlannedCount(getStoredMealPlans().length);
    setCompletedCount(getCompletedMealHistory().length);
    getPantryItems().then(items => setPantryCount(items.length));
  }, [user]);

  const handleOpenEdit = () => {
    setEditForm(profile);
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editForm);
    localStorage.setItem('mealshare_user_profile', JSON.stringify(editForm));
    setIsEditing(false);
    toast.success('Profile details updated successfully!');
  };

  const handleToggleCuisine = (cuisine: string) => {
    setEditForm(prev => {
      const exists = prev.favoriteCuisines.includes(cuisine);
      const next = exists 
        ? prev.favoriteCuisines.filter(c => c !== cuisine)
        : [...prev.favoriteCuisines, cuisine];
      return { ...prev, favoriteCuisines: next };
    });
  };

  const ALL_CUISINES = ['Indian', 'Italian', 'Mexican', 'Asian', 'Mediterranean', 'American', 'French', 'Thai'];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 font-serif text-[#0F172A] dark:text-slate-100">
      
      {/* Header Banner & Edit Action */}
      <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 rounded-full bg-[#059669] text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-emerald-600/30 shrink-0 border-4 border-emerald-400">
            {profile.displayName.charAt(0)}
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white uppercase">{profile.displayName}</h1>
              <span className="px-3 py-0.5 rounded-full bg-[#FF5722] text-white text-[10px] font-black uppercase">
                {user?.role || 'Chef'}
              </span>
            </div>
            <span className="text-xs font-extrabold text-slate-500 block">{profile.email}</span>
            <div className="flex items-center space-x-2 pt-1 text-xs font-bold text-[#059669]">
              <ChefHat className="w-4 h-4" />
              <span>{profile.experienceLevel} • Household of {profile.householdSize}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenEdit}
          className="px-5 py-3 rounded-full bg-black hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider flex items-center space-x-2 shadow-md transition-all shrink-0 active:scale-95"
        >
          <Edit3 className="w-4 h-4 text-[#FFC107]" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* 4 SUMMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <Calendar className="w-6 h-6 text-[#059669] mb-2" />
          <span className="text-3xl font-black text-[#0F172A] dark:text-white block">{plannedCount}</span>
          <span className="text-xs font-bold text-slate-500 uppercase block">Active Meals Planned</span>
        </div>

        <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-[#059669] mb-2" />
          <span className="text-3xl font-black text-[#059669] block">{completedCount}</span>
          <span className="text-xs font-bold text-slate-500 uppercase block">Completed Meals</span>
        </div>

        <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <Package className="w-6 h-6 text-[#FF5722] mb-2" />
          <span className="text-3xl font-black text-[#0F172A] dark:text-white block">{pantryCount}</span>
          <span className="text-xs font-bold text-slate-500 uppercase block">Pantry Inventory Items</span>
        </div>

        <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <Users className="w-6 h-6 text-amber-600 mb-2" />
          <span className="text-3xl font-black text-[#0F172A] dark:text-white block">{profile.householdSize}</span>
          <span className="text-xs font-bold text-slate-500 uppercase block">Household Members</span>
        </div>
      </div>

      {/* CULINARY PROFILE & PREFERENCES DETAILS */}
      <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-xl font-black text-[#0F172A] dark:text-white uppercase border-b border-[#E2D9D0] dark:border-slate-800 pb-3">
          Culinary Profile & Dietary Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-bold">
          <div className="p-5 bg-[#FDF7F2] dark:bg-slate-800 rounded-2xl border border-[#E2D9D0] dark:border-slate-700 space-y-1">
            <span className="text-xs text-slate-500 uppercase block">Active Diet Goal</span>
            <span className="text-xl font-black text-[#059669] uppercase block">{profile.dietaryPreference}</span>
            <span className="text-xs text-slate-500 font-bold block pt-1">Daily Target: {profile.dailyCalorieTarget} kcal</span>
          </div>

          <div className="p-5 bg-[#FDF7F2] dark:bg-slate-800 rounded-2xl border border-[#E2D9D0] dark:border-slate-700 space-y-1">
            <span className="text-xs text-slate-500 uppercase block">Cooking Experience</span>
            <span className="text-xl font-black text-[#0F172A] dark:text-white uppercase block">{profile.experienceLevel}</span>
            <span className="text-xs text-slate-500 font-bold block pt-1">Skill tailored recipe recommendations</span>
          </div>
        </div>

        {/* Favorite Cuisines */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-black text-[#059669] uppercase tracking-wider block">Favorite Cuisines</span>
          <div className="flex flex-wrap gap-2">
            {profile.favoriteCuisines.map((c, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-emerald-500/10 text-[#059669] border border-emerald-500/30 rounded-full text-xs font-black uppercase shadow-sm"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <form onSubmit={handleSaveProfile} className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2D9D0] dark:border-slate-800 pb-3">
              <h2 className="text-2xl font-black text-[#0F172A] dark:text-white uppercase flex items-center space-x-2">
                <ChefHat className="w-6 h-6 text-[#059669]" />
                <span>Edit Culinary Profile</span>
              </h2>
              <button type="button" onClick={() => setIsEditing(false)}>
                <X className="w-6 h-6 text-slate-400 hover:text-slate-900" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-black uppercase mb-1">Display Name</label>
                <input
                  type="text"
                  value={editForm.displayName}
                  onChange={e => setEditForm({ ...editForm, displayName: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] dark:border-slate-700 font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-black uppercase mb-1">Household Size</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={editForm.householdSize}
                    onChange={e => setEditForm({ ...editForm, householdSize: parseInt(e.target.value) || 1 })}
                    className="w-full p-3 rounded-xl bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] dark:border-slate-700 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-black uppercase mb-1">Daily Calorie Goal</label>
                  <input
                    type="number"
                    min={1000}
                    max={5000}
                    value={editForm.dailyCalorieTarget}
                    onChange={e => setEditForm({ ...editForm, dailyCalorieTarget: parseInt(e.target.value) || 2000 })}
                    className="w-full p-3 rounded-xl bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] dark:border-slate-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-black uppercase mb-1">Cooking Experience</label>
                <select
                  value={editForm.experienceLevel}
                  onChange={e => setEditForm({ ...editForm, experienceLevel: e.target.value as any })}
                  className="w-full p-3 rounded-xl bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] dark:border-slate-700 font-bold"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Executive Chef">Executive Chef</option>
                </select>
              </div>

              {/* Favorite Cuisines Toggle */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-black uppercase mb-2">Favorite Cuisines</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_CUISINES.map(cuisine => {
                    const isSel = editForm.favoriteCuisines.includes(cuisine);
                    return (
                      <button
                        type="button"
                        key={cuisine}
                        onClick={() => handleToggleCuisine(cuisine)}
                        className={`px-3 py-1.5 rounded-full text-xs font-black uppercase transition-all ${
                          isSel ? 'bg-[#059669] text-white shadow-sm' : 'bg-[#FDF7F2] dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-[#E2D9D0]'
                        }`}
                      >
                        {cuisine} {isSel && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2D9D0] dark:border-slate-800 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs uppercase"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#059669] hover:bg-emerald-700 text-white font-black text-xs uppercase shadow-md flex items-center space-x-1"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
