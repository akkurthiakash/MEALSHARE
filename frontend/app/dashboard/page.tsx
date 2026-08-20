'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  getPantryItems, 
  getDetailedRecipes, 
  rankRecipesByPantry, 
  PantryItem, 
  DetailedRecipe 
} from '../../lib/db';
import { 
  getStoredMealPlans, 
  getCompletedMealHistory, 
  MealPlanItem, 
  CompletedMealItem 
} from '../../lib/plannerStorage';
import { 
  Package, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Utensils, 
  Activity, 
  AlertTriangle,
  Plus,
  Search,
  BookOpen,
  ShoppingBag,
  ChevronRight,
  ShieldCheck,
  Flame,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Chef Akash';

  const [pantry, setPantry] = useState<PantryItem[]>([]);
  const [recipes, setRecipes] = useState<DetailedRecipe[]>([]);
  const [plans, setPlans] = useState<MealPlanItem[]>([]);
  const [history, setHistory] = useState<CompletedMealItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [pantryData, recipeData] = await Promise.all([
      getPantryItems(),
      getDetailedRecipes()
    ]);
    setPantry(pantryData);
    setRecipes(recipeData);
    setPlans(getStoredMealPlans());
    setHistory(getCompletedMealHistory());
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    const handlePlannerUpdate = () => setPlans(getStoredMealPlans());
    const handleHistoryUpdate = () => setHistory(getCompletedMealHistory());

    window.addEventListener('mealshare_planner_updated', handlePlannerUpdate);
    window.addEventListener('mealshare_history_updated', handleHistoryUpdate);

    return () => {
      window.removeEventListener('mealshare_planner_updated', handlePlannerUpdate);
      window.removeEventListener('mealshare_history_updated', handleHistoryUpdate);
    };
  }, []);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayDayName = daysOfWeek[new Date().getDay()];

  // Today's Planned Meals
  const activePlans = plans.filter(p => p.status !== 'REMOVED');
  const todayPlans = activePlans.filter(p => p.day === todayDayName || p.day === 'Monday');
  const todayCompleted = history.filter(h => h.dayName === todayDayName || h.dayName === 'Monday');

  const todayCaloriesLogged = todayCompleted.reduce((acc, h) => acc + (h.calories || 0), 0);
  const todayProteinLogged = todayCompleted.reduce((acc, h) => acc + (h.proteinGrams || 0), 0);

  // Live Pantry Status Counts
  const freshItems = pantry.filter(i => i.status === 'fresh');
  const useSoonItems = pantry.filter(i => i.status === 'use_soon');
  const expiredItems = pantry.filter(i => i.status === 'expired');

  // Recipe Matches & Live Classifications
  const rankedMatches = rankRecipesByPantry(recipes, pantry);
  const readyToCookRecipes = rankedMatches.filter(m => m.status === 'READY_TO_COOK');
  const useSoonRecipes = rankedMatches.filter(m => m.status === 'USE_SOON');

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16 text-[#0F172A] dark:text-slate-100 font-sans">
      
      {/* GLASS UI HERO SECTION */}
      <div className="relative rounded-3xl overflow-hidden glass-card min-h-[440px] flex flex-col lg:flex-row shadow-2xl">
        
        {/* LEFT SECTION */}
        <div className="w-full lg:w-3/5 p-8 sm:p-12 flex flex-col justify-between space-y-8 z-10 relative">
          
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-[#059669] dark:text-emerald-400 text-xs font-black border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Smart Pantry & Culinary Intelligence</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black text-[#0F172A] dark:text-white tracking-tight leading-tight uppercase font-serif">
              Personalized <br />
              <span className="text-[#059669] dark:text-emerald-400">Meal Planning</span>
            </h1>

            <p className="text-sm sm:text-base font-extrabold text-slate-700 dark:text-slate-300 leading-relaxed max-w-lg">
              MealShare is an intelligent pantry inventory management and smart recipe recommendation platform designed to help you track kitchen ingredients, plan balanced meals, and eliminate food waste.
            </p>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3 font-serif">
              <Link
                href="/recipes"
                className="px-6 py-3.5 rounded-full bg-black hover:bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg transition-all active:scale-95"
              >
                <Search className="w-4 h-4 text-[#FFC107]" />
                <span>Find a Recipe</span>
              </Link>

              <Link
                href="/planner"
                className="px-6 py-3.5 rounded-full bg-[#059669] hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg transition-all active:scale-95"
              >
                <Calendar className="w-4 h-4 text-white" />
                <span>Plan a Meal</span>
              </Link>

              <Link
                href="/pantry"
                className="px-6 py-3.5 rounded-full bg-white/90 dark:bg-slate-800 text-[#0F172A] dark:text-white font-extrabold text-xs uppercase tracking-wider border border-[#E2D9D0] dark:border-slate-700 flex items-center space-x-2 shadow-sm transition-all hover:bg-slate-100"
              >
                <Package className="w-4 h-4 text-[#FF5722]" />
                <span>Pantry ({pantry.length} Items)</span>
              </Link>
            </div>
          </div>

          <Link
            href="/recipes"
            className="inline-flex items-center space-x-4 p-3 pr-6 rounded-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/80 dark:border-slate-700 hover:border-[#FFC107] shadow-md transition-all max-w-md group"
          >
            <div className="w-12 h-12 rounded-full bg-[#FFC107] p-0.5 shadow-md shrink-0">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80"
                alt="Chef Recommendation"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-black text-[#0F172A] dark:text-white block group-hover:text-[#FFC107] transition-colors">
                Chef's Recommendation
              </span>
              <span className="text-[11px] font-extrabold text-slate-500 flex items-center space-x-1">
                <span>Discover recipes matched to your stocked pantry</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#FFC107]" />
              </span>
            </div>
          </Link>
        </div>

        {/* RIGHT HERO IMAGE */}
        <div className="w-full lg:w-2/5 relative min-h-[280px] lg:min-h-full">
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80"
            alt="Culinary Meal Planning"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#FFFDF9] lg:via-transparent lg:to-transparent dark:lg:from-[#0F172A]" />
        </div>
      </div>

      {/* LIVE REAL-TIME DASHBOARD METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-serif">
        
        <div className="bg-white/80 dark:bg-slate-900/80 border border-[#E2D9D0] dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center space-x-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">Ready to Cook</span>
            <span className="text-3xl font-black text-[#0F172A] dark:text-white">{readyToCookRecipes.length} <span className="text-xs font-bold text-slate-400">Recipes</span></span>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 border border-[#E2D9D0] dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center space-x-4">
          <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">Use Soon Recipes</span>
            <span className="text-3xl font-black text-[#0F172A] dark:text-white">{useSoonRecipes.length} <span className="text-xs font-bold text-slate-400">Recipes</span></span>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 border border-[#E2D9D0] dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center space-x-4">
          <div className="p-4 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">Planned Today</span>
            <span className="text-3xl font-black text-[#0F172A] dark:text-white">{todayPlans.length} <span className="text-xs font-bold text-slate-400">Meals</span></span>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 border border-[#E2D9D0] dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center space-x-4">
          <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase block">Today's Nutrition</span>
            <span className="text-2xl font-black text-[#0F172A] dark:text-white">{todayCaloriesLogged} kcal</span>
            <span className="text-xs font-bold text-emerald-600 block">{todayProteinLogged}g Protein</span>
          </div>
        </div>

      </div>

      {/* CLICKABLE PANTRY INVENTORY QUICK STATUS */}
      <div className="bg-white/80 dark:bg-slate-900/80 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 font-serif">
        <div className="flex items-center justify-between border-b border-[#E2D9D0] dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-[#FF5722]" />
            <h3 className="text-lg font-black text-[#0F172A] dark:text-white uppercase">Pantry Inventory Status</h3>
          </div>
          <Link href="/pantry" className="text-xs font-black text-[#059669] hover:underline uppercase">View All ➔</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/pantry?status=fresh" className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500 transition-all flex items-center justify-between group">
            <div>
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase block">Fresh Items</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{freshItems.length}</span>
            </div>
            <span className="text-xs font-black text-emerald-600 group-hover:translate-x-1 transition-transform">Filter ➔</span>
          </Link>

          <Link href="/pantry?status=use-soon" className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-500 transition-all flex items-center justify-between group">
            <div>
              <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase block">Use Soon</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{useSoonItems.length}</span>
            </div>
            <span className="text-xs font-black text-amber-600 group-hover:translate-x-1 transition-transform">Filter ➔</span>
          </Link>

          <Link href="/pantry?status=expired" className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 hover:border-rose-500 transition-all flex items-center justify-between group">
            <div>
              <span className="text-xs font-black text-rose-700 dark:text-rose-400 uppercase block">Expired</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">{expiredItems.length}</span>
            </div>
            <span className="text-xs font-black text-rose-600 group-hover:translate-x-1 transition-transform">Filter ➔</span>
          </Link>
        </div>
      </div>

      {/* TWO COLUMN LIVE SECTIONS: TODAY'S MEAL SCHEDULE & READY TO COOK RECIPES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-serif">
        
        {/* TODAY'S SCHEDULED MEALS */}
        <div className="bg-white/80 dark:bg-slate-900/80 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2D9D0] dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-[#059669]" />
              <h3 className="text-xl font-black text-[#0F172A] dark:text-white uppercase">
                Today's Meals ({todayPlans.length})
              </h3>
            </div>
            <Link href="/planner" className="text-xs font-black text-[#059669] hover:underline uppercase">
              Planner ➔
            </Link>
          </div>

          {todayPlans.length === 0 ? (
            <div className="text-center py-8 text-slate-500 font-bold text-xs space-y-2">
              <p>No meals scheduled for today.</p>
              <Link href="/planner" className="inline-block px-4 py-2 bg-[#059669] text-white rounded-full font-black text-xs uppercase">
                Schedule a Meal
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {todayPlans.map(plan => {
                const isDone = plan.status === 'COMPLETED' || history.some(h => h.planId === plan.id);

                return (
                  <div key={plan.id} className="p-4 rounded-2xl bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={plan.imageUrl} alt={plan.recipeTitle} className="w-14 h-14 rounded-xl object-cover border border-[#E2D9D0]" />
                      <div>
                        <span className="text-[10px] font-black uppercase text-[#059669] block">{plan.mealType}</span>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase truncate">{plan.recipeTitle}</h4>
                        <span className="text-xs text-slate-500 font-bold">{plan.calories} kcal</span>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${isDone ? 'bg-[#059669] text-white' : 'bg-amber-500 text-white'}`}>
                      {isDone ? 'COMPLETED' : 'PLANNED'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* READY TO COOK RECIPES */}
        <div className="bg-white/80 dark:bg-slate-900/80 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2D9D0] dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <Utensils className="w-6 h-6 text-[#FF5722]" />
              <h3 className="text-xl font-black text-[#0F172A] dark:text-white uppercase">
                Ready to Cook Recipes ({readyToCookRecipes.length})
              </h3>
            </div>
            <Link href="/recipes" className="text-xs font-black text-[#059669] hover:underline uppercase">
              Catalog ➔
            </Link>
          </div>

          <div className="space-y-4">
            {readyToCookRecipes.slice(0, 4).map(({ recipe }) => (
              <Link
                key={recipe.id}
                href={`/recipes?search=${encodeURIComponent(recipe.name)}`}
                className="p-4 rounded-2xl bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] dark:border-slate-700 flex items-center justify-between hover:border-[#059669] transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <img src={recipe.imageUrl} alt={recipe.name} className="w-14 h-14 rounded-xl object-cover border border-[#E2D9D0]" />
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#FF5722] block">{recipe.category}</span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase truncate group-hover:text-[#059669] transition-colors">{recipe.name}</h4>
                    <span className="text-xs text-slate-500 font-bold">{recipe.cookingTime} mins • {recipe.calories} kcal</span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-[#059669] text-white text-[10px] font-black uppercase">
                  Ready to Cook
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
