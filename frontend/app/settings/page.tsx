'use client';

import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Settings, 
  Bell, 
  Sun, 
  Moon, 
  Database, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Key, 
  Sliders, 
  Check, 
  X, 
  RefreshCw 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { preferences, updatePreferences } = useNotifications();
  const { theme, toggleTheme } = useTheme();

  const [expiryThreshold, setExpiryThreshold] = useState<number>(3);
  const [autoClearExpired, setAutoClearExpired] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  // Export full JSON Backup
  const handleExportJSON = () => {
    const backup = {
      pantry: localStorage.getItem('mealshare_pantry_items') || '[]',
      planner: localStorage.getItem('mealshare_planner_items') || '[]',
      history: localStorage.getItem('mealshare_completed_history') || '[]',
      notifications: localStorage.getItem('mealshare_notification_preferences') || '{}',
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MealShare_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    toast.success('Downloaded full JSON backup!');
  };

  // Reset Pantry & Planner to seed
  const handleResetData = () => {
    localStorage.removeItem('mealshare_pantry_items');
    localStorage.removeItem('mealshare_planner_items');
    localStorage.removeItem('mealshare_completed_history');
    setShowResetModal(false);
    toast.success('Pantry and planner database reset to factory defaults!');
    window.location.reload();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 font-serif text-[#0F172A] dark:text-slate-100">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-white tracking-tight uppercase flex items-center space-x-3">
          <Settings className="w-8 h-8 text-[#059669]" />
          <span>Application Settings & Control Center</span>
        </h1>
        <p className="text-sm font-bold text-[#475569] dark:text-slate-400 mt-1">
          Configure notification thresholds, visual appearance modes, pantry inventory automation, and data backups.
        </p>
      </div>

      {/* 1. VISUAL APPEARANCE & THEME */}
      <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-[#E2D9D0] dark:border-slate-800 pb-3">
          <Sun className="w-6 h-6 text-[#FF5722]" />
          <h3 className="text-xl font-black text-[#0F172A] dark:text-white uppercase">Appearance & Display Mode</h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-[#FDF7F2] dark:bg-slate-800 rounded-2xl border border-[#E2D9D0] dark:border-slate-700 gap-4">
          <div>
            <h4 className="text-base font-black text-[#0F172A] dark:text-white uppercase">
              Current Theme: {theme === 'light' ? 'Cream Light Mode' : 'Dark Slate Mode'}
            </h4>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              Toggle between classic warm cream and dark slate contrast.
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="px-6 py-3 bg-[#FF5722] hover:bg-[#E64A19] text-white font-black text-xs uppercase rounded-full shadow-md transition-all shrink-0 active:scale-95 flex items-center space-x-2"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span>Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode</span>
          </button>
        </div>
      </div>

      {/* 2. NOTIFICATIONS & EXPIRY ALERTS */}
      <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-[#E2D9D0] dark:border-slate-800 pb-4">
          <Bell className="w-6 h-6 text-[#059669]" />
          <h2 className="text-2xl font-black text-[#0F172A] dark:text-white uppercase">
            Notification & Expiry Alerts
          </h2>
        </div>

        {/* Master Mute Toggle */}
        <div className="bg-[#FDF7F2] dark:bg-slate-800 p-5 rounded-2xl border border-[#E2D9D0] dark:border-slate-700 flex items-center justify-between">
          <div>
            <h4 className="text-base font-black text-[#0F172A] dark:text-white uppercase">Master Notification Toggle</h4>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Enable or silence all toast alerts and push reminders.</p>
          </div>
          <button
            onClick={() => {
              const next = !preferences.masterNotifications;
              updatePreferences({ masterNotifications: next });
              toast.success(next ? 'Notifications Enabled' : 'Notifications Muted');
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase transition-all shadow-sm ${
              !preferences.masterNotifications ? 'bg-rose-600 text-white' : 'bg-[#059669] text-white'
            }`}
          >
            {!preferences.masterNotifications ? 'MUTED' : 'ENABLED'}
          </button>
        </div>

        {/* Expiry Warning Threshold */}
        <div className="p-5 bg-[#FDF7F2] dark:bg-slate-800 rounded-2xl border border-[#E2D9D0] dark:border-slate-700 space-y-3 font-bold text-xs">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-[#0F172A] dark:text-white uppercase">Pantry Expiry Warning Threshold</span>
            <span className="text-[#059669] font-black">{expiryThreshold} Days Before Expiry</span>
          </div>
          <div className="flex items-center space-x-2">
            {[1, 3, 5, 7].map(days => (
              <button
                key={days}
                onClick={() => { setExpiryThreshold(days); toast.success(`Warning threshold set to ${days} days`); }}
                className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                  expiryThreshold === days ? 'bg-[#059669] text-white shadow-sm' : 'bg-white dark:bg-slate-900 border border-[#E2D9D0] text-slate-700 dark:text-slate-300'
                }`}
              >
                {days} {days === 1 ? 'Day' : 'Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Checkbox Toggles */}
        <div className="space-y-4 text-xs font-bold">
          <div className="flex items-center justify-between py-3 border-b border-[#E2D9D0] dark:border-slate-800">
            <div>
              <span className="text-sm font-black text-[#0F172A] dark:text-white uppercase block">Meal Plan Reminders</span>
              <span className="text-slate-500 font-bold">Get notified before scheduled breakfast, lunch, and dinner times.</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.mealReminders}
              onChange={(e) => updatePreferences({ mealReminders: e.target.checked })}
              className="w-5 h-5 accent-[#059669] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-[#E2D9D0] dark:border-slate-800">
            <div>
              <span className="text-sm font-black text-[#0F172A] dark:text-white uppercase block">Pantry Expiry Reminders</span>
              <span className="text-slate-500 font-bold">Receive alerts when stocked ingredients near expiration date.</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.expiryAlerts}
              onChange={(e) => updatePreferences({ expiryAlerts: e.target.checked })}
              className="w-5 h-5 accent-[#059669] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 3. ACCOUNT SECURITY & DATA CONTROLS */}
      <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-[#E2D9D0] dark:border-slate-800 pb-3">
          <ShieldCheck className="w-6 h-6 text-[#059669]" />
          <h3 className="text-xl font-black text-[#0F172A] dark:text-white uppercase">Data Controls & Security</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="p-5 rounded-2xl bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] dark:border-slate-700 text-left hover:border-[#059669] transition-all space-y-2 group"
          >
            <Key className="w-6 h-6 text-[#059669] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black text-[#0F172A] dark:text-white uppercase block">Change Password</span>
            <span className="text-[11px] font-bold text-slate-500 block">Update credentials security</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="p-5 rounded-2xl bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] dark:border-slate-700 text-left hover:border-[#059669] transition-all space-y-2 group"
          >
            <Download className="w-6 h-6 text-[#FF5722] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black text-[#0F172A] dark:text-white uppercase block">Export JSON Data</span>
            <span className="text-[11px] font-bold text-slate-500 block">Download full offline backup</span>
          </button>

          <button
            onClick={() => setShowResetModal(true)}
            className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-left hover:border-rose-500 transition-all space-y-2 group"
          >
            <Trash2 className="w-6 h-6 text-rose-600 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-black text-rose-700 dark:text-rose-400 uppercase block">Reset Database</span>
            <span className="text-[11px] font-bold text-slate-500 block">Restore factory demo data</span>
          </button>
        </div>
      </div>

      {/* PASSWORD CHANGE MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#E2D9D0] dark:border-slate-800 pb-3">
              <h3 className="text-xl font-black text-[#0F172A] dark:text-white uppercase flex items-center space-x-2">
                <Key className="w-5 h-5 text-[#059669]" />
                <span>Security Update</span>
              </h3>
              <button onClick={() => setShowPasswordModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-black uppercase mb-1">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full p-3 rounded-xl bg-[#FDF7F2] dark:bg-slate-800 border" />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-black uppercase mb-1">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full p-3 rounded-xl bg-[#FDF7F2] dark:bg-slate-800 border" />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setShowPasswordModal(false)} className="px-4 py-2 bg-slate-200 rounded-full text-xs font-black uppercase">Cancel</button>
              <button onClick={() => { setShowPasswordModal(false); toast.success('Password updated successfully'); }} className="px-5 py-2 bg-[#059669] text-white rounded-full text-xs font-black uppercase">Save Password</button>
            </div>
          </div>
        </div>
      )}

      {/* RESET DATABASE CONFIRM MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center space-x-3 text-rose-600 border-b pb-3">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-xl font-black uppercase">Reset Pantry & Planner Data</h3>
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Are you sure you want to reset your local pantry and meal planner data back to default initial seed items? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setShowResetModal(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-full text-xs font-black uppercase">Cancel</button>
              <button onClick={handleResetData} className="px-5 py-2 bg-rose-600 text-white rounded-full text-xs font-black uppercase">Yes, Reset All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
