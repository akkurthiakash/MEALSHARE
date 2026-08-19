'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles,
  BookOpen,
  Package,
  Layers,
  FileQuestion,
  Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  getAdminDataQualityReport, 
  AdminDataQualityReport, 
  seedDatabaseIdempotent 
} from '../../../lib/db';

export default function AdminDataQualityPage() {
  const [report, setReport] = useState<AdminDataQualityReport | null>(null);
  const [loading, setLoading] = useState(true);

  const loadReport = async () => {
    setLoading(true);
    const data = await getAdminDataQualityReport();
    setReport(data);
    setLoading(false);
  };

  useEffect(() => {
    loadReport();
  }, []);

  const handleFixDeduplicate = async () => {
    const toastId = toast.loading('Running automated database cleanup and canonical deduplication...');
    await seedDatabaseIdempotent();
    await loadReport();
    toast.success('Database cleanup & deduplication completed cleanly!', { id: toastId });
  };

  if (loading || !report) {
    return (
      <div className="p-8 text-center font-serif font-black">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span>Auditing Master Database Quality...</span>
      </div>
    );
  }

  const { ingredients, recipes } = report;

  return (
    <div className="space-y-8 font-serif text-slate-900 dark:text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Database Hygiene & Quality Audit</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Data Quality Control Center
          </h1>
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-1">
            Real-time audit of master ingredient uniqueness, canonical references, image validity, and recipe integrity.
          </p>
        </div>

        <button
          onClick={handleFixDeduplicate}
          className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase shadow-lg shadow-emerald-700/30 transition-all active:scale-95 shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Run Automated Cleanup</span>
        </button>
      </div>

      {/* SECTION 1: MASTER INGREDIENTS DATA QUALITY */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Master Ingredient Database Health</h2>
          </div>
          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-black">
            {ingredients.totalMasterIngredients} Master Records
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase block">Total Master Ingredients</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1">{ingredients.totalMasterIngredients}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase block">Unique Ingredients</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">{ingredients.uniqueIngredients}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase block">Duplicate Ingredient Names</span>
            <span className={`text-2xl font-black block mt-1 ${ingredients.duplicateIngredientNames.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {ingredients.duplicateIngredientNames.length}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase block">Missing Ingredient Images</span>
            <span className={`text-2xl font-black block mt-1 ${ingredients.missingIngredientImages.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {ingredients.missingIngredientImages.length}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase block">Invalid Categories</span>
            <span className={`text-2xl font-black block mt-1 ${ingredients.invalidCategories.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {ingredients.invalidCategories.length}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase block">Broken Images</span>
            <span className={`text-2xl font-black block mt-1 ${ingredients.brokenImages.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {ingredients.brokenImages.length}
            </span>
          </div>
        </div>

        {ingredients.duplicateIngredientNames.length === 0 && ingredients.missingIngredientImages.length === 0 && ingredients.invalidCategories.length === 0 ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl flex items-center space-x-3 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Master Ingredient Database is 100% clean and compliant with canonical normalized uniqueness standards!</span>
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-rose-600">Issues Needing Attention:</h4>
            {ingredients.duplicateIngredientNames.map((name: string, i: number) => (
              <div key={i} className="text-xs font-bold p-2 bg-rose-50 text-rose-800 rounded-xl">
                Duplicate ingredient detected: {name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: RECIPE DATABASE DATA QUALITY */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Recipe Database Health</h2>
          </div>
          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full text-xs font-black">
            {recipes.totalRecipes} Active Recipes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase block">Total Recipes</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white block mt-1">{recipes.totalRecipes}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase block">Unique Recipes</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">{recipes.uniqueRecipes}</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase block">Duplicate Recipe Names</span>
            <span className={`text-2xl font-black block mt-1 ${recipes.duplicateRecipeNames.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {recipes.duplicateRecipeNames.length}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase block">Missing Recipe Images</span>
            <span className={`text-2xl font-black block mt-1 ${recipes.missingRecipeImages.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {recipes.missingRecipeImages.length}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase block">Duplicate Recipe Images</span>
            <span className={`text-2xl font-black block mt-1 ${recipes.duplicateRecipeImages.length > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {recipes.duplicateRecipeImages.length}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold text-slate-500 uppercase block">Invalid Ingredients</span>
            <span className={`text-2xl font-black block mt-1 ${recipes.recipesWithInvalidIngredients.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {recipes.recipesWithInvalidIngredients.length}
            </span>
          </div>
        </div>

        {recipes.duplicateRecipeNames.length === 0 && recipes.recipesWithInvalidIngredients.length === 0 ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl flex items-center space-x-3 text-emerald-800 dark:text-emerald-200 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Recipe Database is 100% clean and referencing valid canonical master ingredients!</span>
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase text-rose-600">Issues Needing Attention:</h4>
            {recipes.duplicateRecipeNames.map((name: string, i: number) => (
              <div key={i} className="text-xs font-bold p-2 bg-rose-50 text-rose-800 rounded-xl">
                Duplicate recipe title detected: {name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
