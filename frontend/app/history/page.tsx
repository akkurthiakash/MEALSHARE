'use client';

import React, { useState, useEffect } from 'react';
import { 
  getStoredMealPlans, 
  getCompletedMealHistory, 
  markMealCompleted, 
  removeMealPlan,
  saveMealPlan,
  CompletedMealItem, 
  MealPlanItem,
  MealStatus 
} from '../../lib/plannerStorage';
import { getRecipeImage } from '../../lib/db';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  Check, 
  Trash2, 
  RotateCcw, 
  Download, 
  Search, 
  Flame, 
  Award, 
  Utensils 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function HistoryPage() {
  const [plans, setPlans] = useState<MealPlanItem[]>([]);
  const [history, setHistory] = useState<CompletedMealItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PLANNED' | 'COMPLETED' | 'REMOVED'>('ALL');
  const [slotFilter, setSlotFilter] = useState<'All' | 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('All');

  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPlans(getStoredMealPlans());
    setHistory(getCompletedMealHistory());
  };

  const handleMarkCompleted = (plan: MealPlanItem) => {
    markMealCompleted(plan);
    loadData();
    toast.success(`Marked "${plan.recipeTitle}" as completed!`);
  };

  const handleRemovePlan = (id: string) => {
    removeMealPlan(id);
    loadData();
    toast.success('Meal plan status updated to REMOVED');
  };

  const handleExportCSV = () => {
    if (history.length === 0) {
      toast.error('No meal history logs to export.');
      return;
    }
    const headers = 'ID,Recipe,Meal Type,Day,Calories,Status,Completed At\n';
    const rows = history.map(h => `"${h.id}","${h.recipeTitle}","${h.mealType}","${h.dayName}",${h.calories},"COMPLETED","${new Date(h.completedAt).toISOString()}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MealShare_Completed_Meals_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    toast.success('Exported meal history CSV file!');
  };

  // Combine plans and history for complete lifecycle tracking
  const allLifecycleItems = [
    ...history.map(h => ({
      id: h.id,
      recipeTitle: h.recipeTitle,
      mealType: h.mealType,
      day: h.dayName,
      calories: h.calories,
      status: 'COMPLETED' as MealStatus,
      imageUrl: h.imageUrl,
      dateLabel: `Completed on ${new Date(h.completedAt).toLocaleDateString()}`
    })),
    ...plans.filter(p => p.status === 'PLANNED').map(p => ({
      id: p.id,
      recipeTitle: p.recipeTitle,
      mealType: p.mealType,
      day: p.day,
      calories: p.calories,
      status: 'PLANNED' as MealStatus,
      imageUrl: p.imageUrl || getRecipeImage(p.recipeTitle),
      dateLabel: `Scheduled for ${p.day}`
    })),
    ...plans.filter(p => p.status === 'REMOVED').map(p => ({
      id: p.id,
      recipeTitle: p.recipeTitle,
      mealType: p.mealType,
      day: p.day,
      calories: p.calories,
      status: 'REMOVED' as MealStatus,
      imageUrl: p.imageUrl || getRecipeImage(p.recipeTitle),
      dateLabel: `Removed from ${p.day}`
    }))
  ];

  const filteredItems = allLifecycleItems.filter(item => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesSlot = slotFilter === 'All' || item.mealType === slotFilter;
    const matchesSearch = !searchQuery.trim() || item.recipeTitle.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesStatus && matchesSlot && matchesSearch;
  });

  const completedCount = history.length;
  const plannedCount = plans.filter(p => p.status === 'PLANNED').length;
  const totalCaloriesLogged = history.reduce((acc, curr) => acc + (curr.calories || 0), 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-serif text-[#0F172A] dark:text-slate-100">
      
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-white tracking-tight uppercase flex items-center space-x-3">
            <Activity className="w-8 h-8 text-[#059669]" />
            <span>Meal History & Lifecycle Logs</span>
          </h1>
          <p className="text-sm font-bold text-[#475569] dark:text-slate-400 mt-1">
            Review planned, completed, and removed meal records from the planner.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-3 rounded-full bg-black hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider flex items-center space-x-2 shadow-md transition-all shrink-0 active:scale-95"
        >
          <Download className="w-4 h-4 text-[#FFC107]" />
          <span>Export History (CSV)</span>
        </button>
      </div>

      {/* 4 SUMMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center space-x-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-[#059669]">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">Completed Meals</span>
            <span className="text-3xl font-black text-[#0F172A] dark:text-white">{completedCount}</span>
          </div>
        </div>

        <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center space-x-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-600">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">Active Planned</span>
            <span className="text-3xl font-black text-[#0F172A] dark:text-white">{plannedCount}</span>
          </div>
        </div>

        <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center space-x-4">
          <div className="p-4 rounded-2xl bg-orange-500/10 text-[#FF5722]">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">Completed Calories</span>
            <span className="text-3xl font-black text-[#0F172A] dark:text-white">{totalCaloriesLogged} <span className="text-xs font-bold text-slate-500">kcal</span></span>
          </div>
        </div>

        <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center space-x-4">
          <div className="p-4 rounded-2xl bg-teal-500/10 text-teal-600">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">Active Streak</span>
            <span className="text-2xl font-black text-[#0F172A] dark:text-white uppercase">{completedCount > 0 ? '5 Days 🔥' : '0 Days'}</span>
          </div>
        </div>
      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#E2D9D0] dark:border-slate-800 pb-4 gap-4">
          
          {/* Status Filter Tabs: ALL, PLANNED, COMPLETED, REMOVED */}
          <div className="flex items-center space-x-2">
            {(['ALL', 'PLANNED', 'COMPLETED', 'REMOVED'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase transition-all ${
                  statusFilter === st
                    ? st === 'COMPLETED' ? 'bg-[#059669] text-white shadow-sm'
                      : st === 'PLANNED' ? 'bg-amber-500 text-white shadow-sm'
                      : st === 'REMOVED' ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-black text-white shadow-sm'
                    : 'bg-[#F8EFE7] dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[#E2D9D0]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search meal logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Meal Slot Filter Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#E2D9D0] dark:border-slate-800 pb-3">
          {(['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map(slot => (
            <button
              key={slot}
              onClick={() => setSlotFilter(slot)}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase transition-all ${
                slotFilter === slot ? 'bg-[#059669] text-white shadow-sm' : 'bg-[#F8EFE7] dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>

        {/* LOG RECORDS LIST */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-10 space-y-2 text-slate-500 font-bold">
            <Utensils className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-base font-black text-slate-900 dark:text-white uppercase">No records found</p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Schedule or mark meals completed in the Planner to track your culinary journey.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E2D9D0] dark:divide-slate-800">
            {filteredItems.map(item => {
              let badgeBg = 'bg-[#059669] text-white';
              if (item.status === 'PLANNED') badgeBg = 'bg-amber-500 text-white';
              else if (item.status === 'REMOVED') badgeBg = 'bg-rose-600 text-white';

              return (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-bold text-sm">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageUrl || FALLBACK_IMAGE}
                      onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      alt={item.recipeTitle}
                      className="w-14 h-14 rounded-2xl object-cover border border-[#E2D9D0] shrink-0"
                    />
                    <div>
                      <h4 className="text-base font-black text-[#0F172A] dark:text-white uppercase">{item.recipeTitle}</h4>
                      <span className="text-xs text-[#059669] font-black uppercase">{item.mealType} • {item.day}</span>
                      <span className="text-xs text-slate-400 font-bold block mt-0.5">
                        {item.dateLabel}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-4">
                    <div className="text-right">
                      <span className="text-base font-black text-[#0F172A] dark:text-white block">{item.calories} kcal</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase inline-block mt-0.5 ${badgeBg}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
