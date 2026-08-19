'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  X, 
  ChevronRight,
  ChevronLeft,
  Utensils,
  Filter,
  Check,
  X as CrossIcon,
  Ban
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';
import { 
  getDetailedRecipes, 
  getPantryItems, 
  rankRecipesByPantry, 
  DetailedRecipe, 
  PantryItem, 
  RecipeMatchResult,
  RecipeStatus,
  normalizeIngredientName
} from '../../lib/db';
import { deduplicateRecipes } from '../../lib/recipeData';

export type RecipeFilterTab = 
  | 'All'
  | 'Ready to Cook'
  | 'Use Soon Ingredients'
  | 'Unavailable (Expired)'
  | 'Quick (<20 min)'
  | 'Vegetable & Salads'
  | 'Meat & Chicken'
  | 'Rice & Grains'
  | 'Pasta & Noodles'
  | 'Eggs & Breakfast';

const FILTER_TABS: RecipeFilterTab[] = [
  'All',
  'Ready to Cook',
  'Use Soon Ingredients',
  'Unavailable (Expired)',
  'Quick (<20 min)',
  'Vegetable & Salads',
  'Meat & Chicken',
  'Rice & Grains',
  'Pasta & Noodles',
  'Eggs & Breakfast'
];

function RecipesContent() {
  const searchParams = useSearchParams();
  const searchArg = searchParams.get('search');
  const ingredientParam = searchParams.get('ingredient');

  const [recipes, setRecipes] = useState<DetailedRecipe[]>([]);
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [rankedResults, setRankedResults] = useState<RecipeMatchResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState<RecipeFilterTab>('All');
  const [searchQuery, setSearchQuery] = useState(searchArg || ingredientParam || '');
  const [selectedRecipe, setSelectedRecipe] = useState<DetailedRecipe | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [fetchedRecipes, fetchedPantry] = await Promise.all([
        getDetailedRecipes(),
        getPantryItems()
      ]);

      const cleanRecipes = deduplicateRecipes(fetchedRecipes);
      setRecipes(cleanRecipes);
      setPantryItems(fetchedPantry);

      const ranked = rankRecipesByPantry(cleanRecipes, fetchedPantry);
      setRankedResults(ranked);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (searchArg) {
      setSearchQuery(searchArg);
    }
  }, [searchArg]);

  // Tab Filtering Logic
  const filterByTab = (results: RecipeMatchResult[]): RecipeMatchResult[] => {
    if (activeTab === 'All') return results;
    if (activeTab === 'Ready to Cook') return results.filter(r => r.status === 'READY_TO_COOK');
    if (activeTab === 'Use Soon Ingredients') return results.filter(r => r.status === 'USE_SOON');
    if (activeTab === 'Unavailable (Expired)') return results.filter(r => r.status === 'UNAVAILABLE_EXPIRED');
    if (activeTab === 'Quick (<20 min)') return results.filter(r => r.recipe.cookingTime <= 20);
    if (activeTab === 'Vegetable & Salads') return results.filter(r => r.recipe.category === 'Vegetables' || r.recipe.category === 'Salads');
    if (activeTab === 'Meat & Chicken') return results.filter(r => r.recipe.category === 'Chicken' || r.recipe.ingredients.some(i => ['chicken', 'mutton', 'lamb', 'beef'].some(m => i.name.toLowerCase().includes(m))));
    if (activeTab === 'Rice & Grains') return results.filter(r => r.recipe.category === 'Rice' || r.recipe.ingredients.some(i => i.name.toLowerCase().includes('rice')));
    if (activeTab === 'Pasta & Noodles') return results.filter(r => r.recipe.category === 'Pasta & Noodles');
    if (activeTab === 'Eggs & Breakfast') return results.filter(r => r.recipe.category === 'Breakfast & Eggs' || r.recipe.ingredients.some(i => i.name.toLowerCase().includes('egg')));
    return results;
  };

  const processedResults = filterByTab(rankedResults).filter(res => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase().trim();
    const terms = term.split(',').map(t => t.trim()).filter(Boolean);

    return terms.every(t => 
      res.recipe.name.toLowerCase().includes(t) ||
      res.recipe.category.toLowerCase().includes(t) ||
      res.recipe.ingredients.some(i => i.name.toLowerCase().includes(t))
    );
  });

  // Cross-section deduplication
  const seenIds = new Set<string>();
  const deduplicatedResults: RecipeMatchResult[] = [];
  for (const item of processedResults) {
    if (!seenIds.has(item.recipe.id)) {
      seenIds.add(item.recipe.id);
      deduplicatedResults.push(item);
    }
  }

  // Pagination calculations
  const totalPages = Math.ceil(deduplicatedResults.length / itemsPerPage) || 1;
  const paginatedResults = deduplicatedResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const expiringPantryItems = pantryItems.filter(i => i.status === 'use_soon');

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 text-[#0F172A] dark:text-slate-100 font-serif">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-white tracking-tight uppercase flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-[#059669]" />
            <span>Recipe Catalog & Suggestions</span>
          </h1>
          <p className="text-sm font-bold text-[#475569] dark:text-slate-400 mt-1">
            Browse recipes categorized by real pantry availability and explicit ingredient status.
          </p>
        </div>
      </div>

      {/* Waste Reduction Alert */}
      {expiringPantryItems.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-emerald-500/10 border border-amber-500/30 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-black text-sm uppercase">
            <AlertTriangle className="w-5 h-5 text-amber-600 animate-bounce" />
            <span>Use Soon Ingredients Alert</span>
          </div>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
            You have <strong className="text-amber-700 dark:text-amber-200">{expiringPantryItems.length} ingredients expiring soon</strong> ({expiringPantryItems.map(i => i.name).slice(0, 4).join(', ')}). Try these recipes to reduce food waste:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {expiringPantryItems.slice(0, 6).map(item => (
              <button
                key={item.id}
                onClick={() => { setSearchQuery(item.name); setActiveTab('Use Soon Ingredients'); setCurrentPage(1); }}
                className="px-3 py-1 bg-amber-500 text-white rounded-full text-[10px] font-black uppercase hover:bg-amber-600 transition-colors shadow-sm"
              >
                Use {item.name} ➔
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search & Tabs */}
      <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 p-4 sm:p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#475569] absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search recipes by name, ingredient, or category (e.g. Fish Curry, Chicken, Rice)..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] text-sm font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="text-xs font-bold text-[#475569] shrink-0">
            Showing <strong className="text-[#059669] font-black">{deduplicatedResults.length}</strong> recipes
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 border-t border-[#E2D9D0] dark:border-slate-800 pt-3">
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-[#059669] text-white shadow-sm font-black'
                  : 'bg-[#F8EFE7] dark:bg-slate-800 text-[#475569] hover:bg-[#E2D9D0]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Grid */}
      {paginatedResults.length === 0 ? (
        <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl p-12 text-center space-y-3 shadow-sm">
          <Utensils className="w-12 h-12 text-[#475569] mx-auto" />
          <h3 className="text-xl font-black text-[#0F172A] dark:text-white uppercase">No recipes found</h3>
          <p className="text-sm font-bold text-[#475569] max-w-sm mx-auto">
            Try adjusting your search terms or selecting a different filter tab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedResults.map(({ recipe, status, statusLabel, availableIngredients, missingIngredients, expiredIngredients }) => {
            
            // Status Chip Styling
            let badgeBg = 'bg-emerald-600 text-white';
            if (status === 'USE_SOON') badgeBg = 'bg-amber-600 text-white';
            else if (status === 'MISSING_INGREDIENTS') badgeBg = 'bg-slate-700 text-white';
            else if (status === 'UNAVAILABLE_EXPIRED') badgeBg = 'bg-rose-700 text-white';

            return (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#059669] cursor-pointer transition-all hover:scale-[1.01]"
              >
                <div className="space-y-3">
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-[#FDF7F2] border border-[#E2D9D0]">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                    
                    {/* Explicit Status Badge (No Percentage) */}
                    <span className={`absolute top-2.5 right-2.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${badgeBg}`}>
                      {statusLabel}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5722] block truncate">
                      {recipe.category}
                    </span>
                    <h3 className="text-lg font-black text-[#0F172A] dark:text-white truncate">
                      {recipe.name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-bold text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{recipe.cookingTime} min</span>
                    </span>
                    <span>•</span>
                    <span className="capitalize">{recipe.difficulty}</span>
                    <span>•</span>
                    <span>{recipe.calories} kcal</span>
                  </div>

                  {/* Ingredient status list */}
                  <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs font-bold">
                    {status === 'UNAVAILABLE_EXPIRED' ? (
                      <div className="text-rose-600 dark:text-rose-400 truncate flex items-center space-x-1 font-black">
                        <Ban className="w-3.5 h-3.5 shrink-0" />
                        <span>Expired: {expiredIngredients.join(', ')}</span>
                      </div>
                    ) : (
                      <>
                        <div className="text-emerald-700 dark:text-emerald-400 truncate flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5 shrink-0" />
                          <span>{availableIngredients.length} available</span>
                        </div>

                        {missingIngredients.length > 0 && (
                          <div className="text-slate-500 truncate flex items-center space-x-1">
                            <CrossIcon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                            <span>{missingIngredients.length} missing ({missingIngredients.slice(0, 2).join(', ')})</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider hover:underline">
                    View Recipe ➔
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-between bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 p-4 rounded-3xl shadow-sm">
        <span className="text-xs font-bold text-slate-500">
          Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, deduplicatedResults.length)} of {deduplicatedResults.length} recipes
        </span>

        <div className="flex items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 disabled:opacity-40 font-bold text-xs flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <span className="text-xs font-black text-slate-700 dark:text-slate-300 px-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 disabled:opacity-40 font-bold text-xs flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RECIPE DETAIL MODAL */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto font-serif">
            <div className="flex items-center justify-between border-b border-[#E2D9D0] pb-3">
              <div>
                <span className="text-xs font-black text-[#FF5722] uppercase tracking-wider">{selectedRecipe.category}</span>
                <h2 className="text-2xl font-black text-[#0F172A] dark:text-white uppercase">{selectedRecipe.name}</h2>
              </div>
              <button onClick={() => setSelectedRecipe(null)}><X className="w-6 h-6" /></button>
            </div>

            <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-[#E2D9D0]">
              <img src={selectedRecipe.imageUrl} alt={selectedRecipe.name} className="w-full h-full object-cover" />
            </div>

            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{selectedRecipe.description}</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-black uppercase text-[#059669] mb-2">Ingredients Required</h4>
                <ul className="space-y-1.5 text-xs font-bold">
                  {selectedRecipe.ingredients.map((ing, idx) => {
                    const norm = normalizeIngredientName(ing.name);
                    const pantryMatch = pantryItems.find(p => normalizeIngredientName(p.name) === norm);
                    const isExpired = pantryMatch?.status === 'expired';
                    const isAvailable = pantryMatch && (pantryMatch.status === 'fresh' || pantryMatch.status === 'use_soon');

                    return (
                      <li key={idx} className="flex items-center space-x-2">
                        {isExpired ? (
                          <Ban className="w-4 h-4 text-rose-600 shrink-0" />
                        ) : isAvailable ? (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <CrossIcon className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className={isExpired ? 'text-rose-600 font-black' : isAvailable ? 'text-slate-900 dark:text-white font-black' : 'text-slate-400'}>
                          {ing.quantity ? `${ing.quantity} ${ing.unit || ''} ` : ''}{ing.name} {isExpired ? '(Expired)' : ''}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase text-[#059669] mb-2">Instructions</h4>
                <ol className="list-decimal list-inside space-y-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RecipesPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center font-bold">Loading Recipes...</div>}>
      <RecipesContent />
    </React.Suspense>
  );
}
