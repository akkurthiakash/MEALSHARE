'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock, Search, Utensils, AlertCircle } from 'lucide-react';
import { getStoredMealPlans, getCompletedMealHistory, MealPlanItem, CompletedMealItem } from '../../../lib/plannerStorage';

export default function AdminMealsPage() {
  const [plans, setPlans] = useState<MealPlanItem[]>([]);
  const [history, setHistory] = useState<CompletedMealItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'scheduled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setPlans(getStoredMealPlans());
    setHistory(getCompletedMealHistory());
  }, []);

  const totalScheduled = plans.length;
  const totalCompleted = history.length;

  return (
    <div className="space-y-8 font-serif">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center space-x-3">
          <Calendar className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          <span>Meal Activity & Completion Tracker</span>
        </h1>
        <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-1">
          Monitor scheduled meal plans, completed meals, and daily calorie totals across all users.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <Utensils className="w-6 h-6 text-indigo-500 mb-2" />
          <span className="text-3xl font-black text-slate-900 dark:text-white block">{totalScheduled}</span>
          <span className="text-xs font-black text-slate-500 uppercase block">Total Scheduled Plans</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-2" />
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block">{totalCompleted}</span>
          <span className="text-xs font-black text-slate-500 uppercase block">Explicitly Completed</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
          <Clock className="w-6 h-6 text-amber-500 mb-2" />
          <span className="text-3xl font-black text-amber-500 block">{Math.max(0, totalScheduled - totalCompleted)}</span>
          <span className="text-xs font-black text-slate-500 uppercase block">Pending Completion</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {(['all', 'completed', 'scheduled'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-2xl text-xs font-black capitalize transition-all ${
                activeTab === t ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {t} Meals
            </button>
          ))}
        </div>
      </div>

      {/* Completed History Table */}
      {(activeTab === 'all' || activeTab === 'completed') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Completed Meals ({history.length})</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-bold">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-400 uppercase">
                  <th className="py-3 px-4">Recipe</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Slot</th>
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Calories</th>
                  <th className="py-3 px-4">Completed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {history.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 flex items-center space-x-3">
                      <img src={item.imageUrl} alt={item.recipeTitle} className="w-10 h-10 rounded-xl object-cover" />
                      <span className="text-slate-900 dark:text-white font-black">{item.recipeTitle}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-xs">Chef Akash</td>
                    <td className="py-3 px-4 text-emerald-600 font-black">{item.mealType}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{item.dayName}</td>
                    <td className="py-3 px-4 text-slate-900 dark:text-white">{item.calories} kcal</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{new Date(item.completedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Scheduled Plans Table */}
      {(activeTab === 'all' || activeTab === 'scheduled') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            <span>Scheduled Meal Plans ({plans.length})</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-bold">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs text-slate-400 uppercase">
                  <th className="py-3 px-4">Recipe</th>
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Meal Slot</th>
                  <th className="py-3 px-4">Calories</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {plans.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-black text-slate-900 dark:text-white">{p.recipeTitle}</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{p.day}</td>
                    <td className="py-3 px-4 text-indigo-600 font-black">{p.mealType}</td>
                    <td className="py-3 px-4 text-slate-900 dark:text-white">{p.calories} kcal</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
