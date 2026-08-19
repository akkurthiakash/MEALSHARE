'use client';

import React, { useState, useEffect } from 'react';
import { 
  getStoredMealPlans, 
  saveMealPlan, 
  removeMealPlan, 
  markMealCompleted,
  MealPlanItem, 
  CompletedMealItem,
  getCompletedMealHistory
} from '../../lib/plannerStorage';
import { getDetailedRecipes, DetailedRecipe, getRecipeImage } from '../../lib/db';
import { Calendar, Plus, Trash2, Search, X, CheckCircle2, Clock, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
const SLOTS = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const;

export default function PlannerPage() {
  const [plans, setPlans] = useState<MealPlanItem[]>([]);
  const [history, setHistory] = useState<CompletedMealItem[]>([]);
  const [recipes, setRecipes] = useState<DetailedRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<typeof DAYS[number]>('Monday');
  const [selectedSlot, setSelectedSlot] = useState<typeof SLOTS[number]>('Breakfast');
  const [searchQuery, setSearchQuery] = useState('');

  // Remove confirmation modal state
  const [itemToRemove, setItemToRemove] = useState<MealPlanItem | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setPlans(getStoredMealPlans());
    setHistory(getCompletedMealHistory());
    const data = await getDetailedRecipes();
    setRecipes(data);
    setLoading(false);
  };

  const handleOpenAddModal = (day: typeof DAYS[number], slot: typeof SLOTS[number]) => {
    setSelectedDay(day);
    setSelectedSlot(slot);
    setSearchQuery('');
    setShowAddModal(true);
  };

  const handleAddRecipeToPlan = (recipe: DetailedRecipe) => {
    let slotToAssign: typeof SLOTS[number] = selectedSlot;
    const cat = recipe.category?.toLowerCase() || '';
    if (cat.includes('breakfast') || cat.includes('egg')) slotToAssign = 'Breakfast';
    else if (cat.includes('snack') || cat.includes('smoothie')) slotToAssign = 'Snack';

    const newPlan: MealPlanItem = {
      id: 'plan-' + Date.now(),
      day: selectedDay,
      mealType: slotToAssign,
      recipeId: recipe.id,
      recipeTitle: recipe.name,
      imageUrl: recipe.imageUrl,
      calories: recipe.calories || 400,
      status: 'PLANNED',
      completed: false,
      completedAt: null
    };

    saveMealPlan(newPlan);
    loadData();
    toast.success(`Added "${recipe.name}" to ${selectedDay} ${slotToAssign}!`);
    setShowAddModal(false);
  };

  const handleToggleComplete = (plan: MealPlanItem) => {
    markMealCompleted(plan);
    loadData();
    toast.success(`Marked "${plan.recipeTitle}" as completed!`);
  };

  const confirmRemoveItem = () => {
    if (!itemToRemove) return;
    removeMealPlan(itemToRemove.id);
    loadData();
    toast.success(`Removed "${itemToRemove.recipeTitle}" from planner`);
    setItemToRemove(null);
  };

  const filteredRecipes = recipes.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-serif text-[#0F172A] dark:text-slate-100">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-white tracking-tight uppercase flex items-center space-x-3">
          <Calendar className="w-8 h-8 text-[#059669]" />
          <span>Weekly Meal Planner</span>
        </h1>
        <p className="text-sm font-bold text-[#475569] dark:text-slate-400 mt-1">
          Schedule weekly meal slots using database recipes and track completion lifecycle.
        </p>
      </div>

      {/* Weekly Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {DAYS.map((day) => {
          const dayPlans = plans.filter(p => p.day === day && p.status !== 'REMOVED');

          return (
            <div key={day} className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
              
              <div className="border-b border-[#E2D9D0] dark:border-slate-800 pb-2 text-center">
                <h3 className="text-base font-black text-[#0F172A] dark:text-white uppercase">{day}</h3>
                <span className="text-[10px] text-[#475569] uppercase font-bold">
                  {dayPlans.filter(p => p.status === 'PLANNED').length} Planned
                </span>
              </div>

              {/* Slots */}
              <div className="space-y-3 flex-1">
                {SLOTS.map((slot) => {
                  const item = dayPlans.find(p => p.mealType === slot);
                  const isCompleted = item?.status === 'COMPLETED' || (item ? history.some(h => h.planId === item.id) : false);

                  return (
                    <div key={slot} className="bg-[#FDF7F2] dark:bg-slate-800 p-2.5 rounded-2xl border border-[#E2D9D0] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-[#059669]">{slot}</span>
                        {!item && (
                          <button
                            onClick={() => handleOpenAddModal(day, slot)}
                            className="p-1 hover:bg-[#F8EFE7] rounded-lg text-[#059669]"
                            title={`Add ${slot}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {item ? (
                        <div className="space-y-1.5">
                          <img
                            src={item.imageUrl || getRecipeImage(item.recipeTitle)}
                            alt={item.recipeTitle}
                            className="w-full h-16 rounded-xl object-cover border border-[#E2D9D0]"
                          />
                          <span className="text-xs font-black text-[#0F172A] dark:text-white truncate block uppercase">{item.recipeTitle}</span>
                          
                          {/* Status & Actions */}
                          <div className="space-y-1 pt-1">
                            {isCompleted ? (
                              <div className="flex items-center justify-between">
                                <span className="px-2 py-0.5 rounded-md bg-[#059669] text-white text-[9px] font-black uppercase flex items-center space-x-1">
                                  <Check className="w-3 h-3" />
                                  <span>COMPLETED</span>
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <button
                                  onClick={() => handleToggleComplete(item)}
                                  className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-[10px] font-black uppercase flex items-center space-x-1 transition-colors"
                                >
                                  <span>Mark Completed</span>
                                </button>
                                <button
                                  onClick={() => setItemToRemove(item)}
                                  className="p-1 text-rose-500 hover:text-rose-700"
                                  title="Remove meal"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="h-10 flex items-center justify-center border border-dashed border-[#E2D9D0] rounded-xl text-[10px] text-[#475569] font-bold italic">
                          Empty
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* CONFIRMATION MODAL BEFORE REMOVING MEAL */}
      {itemToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <div>
              <h3 className="text-lg font-black text-[#0F172A] dark:text-white uppercase">Remove Meal</h3>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1">
                Remove this meal from your planner?
              </p>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setItemToRemove(null)}
                className="flex-1 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black text-xs uppercase rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveItem}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase rounded-xl shadow-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD RECIPE TO PLANNER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto font-serif">
            <div className="flex items-center justify-between border-b border-[#E2D9D0] pb-3">
              <div>
                <h3 className="text-xl font-black text-[#0F172A] dark:text-white uppercase">
                  Add Meal to {selectedDay} ({selectedSlot})
                </h3>
                <p className="text-xs text-[#475569]">Select a recipe from Recipe Management Database</p>
              </div>
              <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
            </div>

            {/* Search Recipe Field */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search recipe by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] text-sm font-bold"
              />
            </div>

            {/* Dropdown Result Area */}
            <div className="divide-y divide-[#E2D9D0] dark:divide-slate-800 max-h-64 overflow-y-auto">
              {filteredRecipes.map(r => (
                <div
                  key={r.id}
                  onClick={() => handleAddRecipeToPlan(r)}
                  className="py-3 px-2 flex items-center justify-between hover:bg-[#FDF7F2] dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <img src={r.imageUrl} alt={r.name} className="w-12 h-12 rounded-xl object-cover border border-[#E2D9D0]" />
                    <div>
                      <h4 className="text-sm font-black text-[#0F172A] dark:text-white uppercase">{r.name}</h4>
                      <span className="text-xs text-[#059669] font-bold">{r.cookingTime} mins • {r.calories} kcal</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#059669] text-white font-black text-xs uppercase rounded-full shadow-sm">
                    Add to Schedule
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
