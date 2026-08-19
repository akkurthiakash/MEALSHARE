'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  ArrowRight, 
  Wand2, 
  X,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DetailedRecipe } from '../lib/db';
import { 
  getStoredMealPlans, 
  saveMealPlans, 
  addMealPlanItem, 
  buildSmartWeeklyPlan, 
  MealPlanItem, 
  DAYS, 
  DayName 
} from '../lib/plannerStorage';

interface SmartWeeklyMealPlanProps {
  cookableRecipes: DetailedRecipe[];
}

export default function SmartWeeklyMealPlan({ cookableRecipes }: SmartWeeklyMealPlanProps) {
  const [plans, setPlans] = useState<MealPlanItem[]>([]);
  const [selectedRecipeForScheduling, setSelectedRecipeForScheduling] = useState<DetailedRecipe | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayName>('Monday');
  const [selectedSlot, setSelectedSlot] = useState<'Breakfast' | 'Lunch' | 'Dinner'>('Breakfast');

  const reloadPlans = () => {
    setPlans(getStoredMealPlans());
  };

  useEffect(() => {
    reloadPlans();
    const handleUpdate = () => reloadPlans();
    window.addEventListener('mealshare_planner_updated', handleUpdate);
    return () => window.removeEventListener('mealshare_planner_updated', handleUpdate);
  }, []);

  const handleBuildMyWeek = () => {
    if (cookableRecipes.length === 0) {
      toast.error('No pantry-ready recipes available to build a weekly plan');
      return;
    }

    const { addedCount } = buildSmartWeeklyPlan(cookableRecipes);
    if (addedCount > 0) {
      toast.success(`Successfully scheduled pantry recipes into your weekly plan!`);
      reloadPlans();
    } else {
      toast('Your weekly plan is already filled with scheduled meals.', { icon: 'ℹ️' });
    }
  };

  const isRecipeScheduled = (recipeName: string) => {
    return plans.some(p => p.recipeTitle.toLowerCase() === recipeName.toLowerCase());
  };

  const handleScheduleRecipeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipeForScheduling) return;

    const result = addMealPlanItem({
      day: selectedDay,
      mealType: selectedSlot,
      recipeTitle: selectedRecipeForScheduling.name,
      recipeId: selectedRecipeForScheduling.id,
      imageUrl: selectedRecipeForScheduling.imageUrl,
      calories: 400
    });

    if (result.isDuplicate) {
      toast.error(`${selectedRecipeForScheduling.name} is already scheduled for ${selectedDay} (${selectedSlot})`);
    } else {
      toast.success(`Added ${selectedRecipeForScheduling.name} to ${selectedDay} ${selectedSlot}!`);
      reloadPlans();
      setSelectedRecipeForScheduling(null);
    }
  };

  return (
    <div className="space-y-8 font-sans pt-6 border-t border-[#e2dcd0] dark:border-slate-800">
      {/* Section Header */}
      <div className="bg-[#f0ebe1] dark:bg-slate-900 border border-[#e2dcd0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-300 dark:border-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pantry-Connected Meal Bridge</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Smart Weekly Meal Plan
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-bold text-base max-w-xl">
            Turn your pantry-ready recipes into a simple weekly meal plan.
          </p>
        </div>

        {cookableRecipes.length > 0 && (
          <div className="flex-shrink-0">
            <button
              onClick={handleBuildMyWeek}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-lg flex items-center justify-center space-x-3 transition-all shadow-lg shadow-emerald-700/20 active:scale-95"
            >
              <Wand2 className="w-5 h-5 text-emerald-200" />
              <span>Build My Week</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {cookableRecipes.length === 0 ? (
        /* Empty State */
        <div className="bg-[#f0ebe1] dark:bg-slate-900 border border-[#e2dcd0] dark:border-slate-800 rounded-3xl py-16 px-6 text-center space-y-6 max-w-2xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 mx-auto flex items-center justify-center border border-amber-200 dark:border-amber-800">
            <Calendar className="w-8 h-8 stroke-[1.75]" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              No pantry-ready recipes yet.
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-bold text-base">
              Add ingredients to your pantry to unlock recipes for your weekly plan.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/pantry"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-[#059669] hover:bg-[#047857] text-white font-bold text-base transition-all shadow-md shadow-emerald-700/20 active:scale-95"
            >
              <span>Go to Pantry</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Day Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>Your Weekly Overview</span>
              </h3>
              <Link
                href="/planner"
                className="text-sm font-extrabold text-[#059669] dark:text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <span>Open Full Meal Planner</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {DAYS.map(day => {
                const dayPlans = plans.filter(p => p.day === day);
                const slots: Array<'Breakfast' | 'Lunch' | 'Dinner'> = ['Breakfast', 'Lunch', 'Dinner'];

                return (
                  <div
                    key={day}
                    className="bg-[#f0ebe1] dark:bg-slate-900 border border-[#e2dcd0] dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="border-b border-[#e2dcd0] dark:border-slate-800 pb-2 mb-3">
                        <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-wider">
                          {day}
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {slots.map(slot => {
                          const planForSlot = dayPlans.find(p => p.mealType === slot);

                          return (
                            <div key={slot} className="space-y-1">
                              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
                                {slot}
                              </span>
                              {planForSlot ? (
                                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 shadow-2xs group">
                                  {planForSlot.imageUrl && (
                                    <div className="h-16 w-full rounded-lg overflow-hidden bg-slate-900 mb-1.5">
                                      <img
                                        src={planForSlot.imageUrl}
                                        alt={planForSlot.recipeTitle}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                      />
                                    </div>
                                  )}
                                  <h5 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1 leading-snug">
                                    {planForSlot.recipeTitle}
                                  </h5>
                                  <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1 mt-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Scheduled</span>
                                  </span>
                                </div>
                              ) : (
                                <div className="bg-[#eae5da] dark:bg-slate-800/40 border border-dashed border-[#dcd6c7] dark:border-slate-700/60 rounded-xl p-2 text-center">
                                  <span className="text-[11px] text-slate-400 font-bold block">
                                    Empty
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pantry-Ready Recipes Available for Scheduling */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Pantry-Ready Recipes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cookableRecipes.map(recipe => {
                const scheduled = isRecipeScheduled(recipe.name);

                return (
                  <div
                    key={recipe.id}
                    className="bg-[#f0ebe1] dark:bg-slate-900 border border-[#e2dcd0] dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs p-5 flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
                  >
                    <div className="space-y-3">
                      {/* Dish Image */}
                      <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-900">
                        <img
                          src={recipe.imageUrl}
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md">
                          100% Pantry Ready
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-white line-clamp-1">
                          {recipe.name}
                        </h4>
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {recipe.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4">
                      {scheduled ? (
                        <button
                          disabled
                          className="w-full py-3 px-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-extrabold text-sm flex items-center justify-center space-x-2 cursor-default"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Scheduled</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedRecipeForScheduling(recipe)}
                          className="w-full py-3 px-4 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-sm transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center space-x-2 active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add to Planner</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Selector Modal */}
      {selectedRecipeForScheduling && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm font-serif">
          <div className="bg-[#f6f4ee] dark:bg-slate-900 border border-[#e2dcd0] dark:border-slate-800 rounded-3xl max-w-md w-full p-6 relative shadow-2xl space-y-5">
            <button
              onClick={() => setSelectedRecipeForScheduling(null)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-[#e7e1d5] dark:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-black uppercase text-emerald-600 tracking-wider">
                Schedule Meal
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {selectedRecipeForScheduling.name}
              </h3>
            </div>

            <div className="h-36 w-full rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={selectedRecipeForScheduling.imageUrl}
                alt={selectedRecipeForScheduling.name}
                className="w-full h-full object-cover"
              />
            </div>

            <form onSubmit={handleScheduleRecipeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Select Day
                </label>
                <select
                  value={selectedDay}
                  onChange={e => setSelectedDay(e.target.value as DayName)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#eae6db] dark:bg-slate-800 border border-[#dcd6c7] dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {DAYS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Select Meal Slot
                </label>
                <select
                  value={selectedSlot}
                  onChange={e => setSelectedSlot(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#eae6db] dark:bg-slate-800 border border-[#dcd6c7] dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-extrabold text-base transition-all shadow-md shadow-emerald-700/20 active:scale-95"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
