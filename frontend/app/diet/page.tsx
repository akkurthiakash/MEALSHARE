'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Info,
  Clock,
  BookOpen,
  X
} from 'lucide-react';
import { getStoredMealPlans } from '../../lib/plannerStorage';
import { getDetailedRecipes, DetailedRecipe } from '../../lib/db';
import toast from 'react-hot-toast';

export interface DietProfileSetting {
  id: string;
  name: string;
  calorieDefault: number;
  proteinPercentage: number;
  carbPercentage: number;
  fatPercentage: number;
  description: string;
  healthBenefits: string[];
}

export const DIET_PROFILES: DietProfileSetting[] = [
  {
    id: 'balanced',
    name: 'Balanced',
    calorieDefault: 2000,
    proteinPercentage: 25,
    carbPercentage: 50,
    fatPercentage: 25,
    description: 'Provides a varied macro distribution supporting daily wellness and sustained energy.',
    healthBenefits: [
      'Provides a varied macro distribution.',
      'Supports overall meal balance.',
      'Can simplify everyday meal planning.'
    ]
  },
  {
    id: 'high_protein',
    name: 'High Protein',
    calorieDefault: 2200,
    proteinPercentage: 35,
    carbPercentage: 40,
    fatPercentage: 25,
    description: 'Prioritizes protein intake for active lifestyles, athletic recovery, and satiety.',
    healthBenefits: [
      'Helps increase protein intake.',
      'Useful for meals where protein is a priority.',
      'Can support satiety.'
    ]
  },
  {
    id: 'low_carb',
    name: 'Low Carb',
    calorieDefault: 1800,
    proteinPercentage: 30,
    carbPercentage: 20,
    fatPercentage: 50,
    description: 'Reduces carbohydrate intake while emphasizing vegetables, lean protein, and healthy fats.',
    healthBenefits: [
      'Reduces carbohydrate intake.',
      'Emphasizes protein, vegetables, and fats.',
      'Supports balanced glucose response.'
    ]
  },
  {
    id: 'keto',
    name: 'Keto',
    calorieDefault: 1800,
    proteinPercentage: 20,
    carbPercentage: 5,
    fatPercentage: 75,
    description: 'Uses a very low-carbohydrate, fat-focused structure to induce metabolic ketosis.',
    healthBenefits: [
      'Uses a very low-carbohydrate structure.',
      'Emphasizes fat and moderate protein.',
      'Minimizes daily net carbs.'
    ]
  },
  {
    id: 'vegetarian',
    name: 'Vegetarian',
    calorieDefault: 1900,
    proteinPercentage: 20,
    carbPercentage: 55,
    fatPercentage: 25,
    description: 'Plant-forward nutrition excluding meat, poultry, fish, and seafood.',
    healthBenefits: [
      'Excludes meat and fish.',
      'Can emphasize vegetables, grains, legumes, dairy and eggs depending on the profile.',
      'High in dietary fiber.'
    ]
  },
  {
    id: 'vegan',
    name: 'Vegan',
    calorieDefault: 1900,
    proteinPercentage: 18,
    carbPercentage: 60,
    fatPercentage: 22,
    description: '100% plant-based food choices excluding all animal-derived ingredients.',
    healthBenefits: [
      'Uses plant-based foods.',
      'Excludes animal-derived ingredients.',
      'Supports eco-friendly sustainable eating.'
    ]
  }
];

export default function DietGoalsPage() {
  const [selectedProfile, setSelectedProfile] = useState<DietProfileSetting>(DIET_PROFILES[0]);
  const [customCalorieTarget, setCustomCalorieTarget] = useState<number>(2000);
  const [recipes, setRecipes] = useState<DetailedRecipe[]>([]);
  const [plannedCalories, setPlannedCalories] = useState<number>(0);
  const [plannedBreakfast, setPlannedBreakfast] = useState<number>(0);
  const [plannedLunch, setPlannedLunch] = useState<number>(0);
  const [plannedDinner, setPlannedDinner] = useState<number>(0);
  const [showCalculationGuide, setShowCalculationGuide] = useState<boolean>(false);
  const [selectedRecipeModal, setSelectedRecipeModal] = useState<DetailedRecipe | null>(null);

  useEffect(() => {
    async function init() {
      const allRecipes = await getDetailedRecipes();
      setRecipes(allRecipes);

      // Restore saved active diet profile if set
      const savedName = localStorage.getItem('mealshare_active_diet');
      if (savedName) {
        const found = DIET_PROFILES.find(p => p.name.toLowerCase() === savedName.toLowerCase());
        if (found) {
          setSelectedProfile(found);
          setCustomCalorieTarget(found.calorieDefault);
        }
      }

      // Calculate actual planned calories from Planner
      const plans = getStoredMealPlans().filter(p => p.status !== 'REMOVED');
      const totalPlanned = plans.reduce((sum, p) => sum + (p.calories || 0), 0);
      setPlannedCalories(totalPlanned);

      const b = plans.filter(p => p.mealType === 'Breakfast').reduce((sum, p) => sum + (p.calories || 0), 0);
      const l = plans.filter(p => p.mealType === 'Lunch').reduce((sum, p) => sum + (p.calories || 0), 0);
      const d = plans.filter(p => p.mealType === 'Dinner').reduce((sum, p) => sum + (p.calories || 0), 0);

      setPlannedBreakfast(b);
      setPlannedLunch(l);
      setPlannedDinner(d);
    }
    init();
  }, []);

  const handleSelectProfile = (profile: DietProfileSetting) => {
    setSelectedProfile(profile);
    setCustomCalorieTarget(profile.calorieDefault);
    localStorage.setItem('mealshare_active_diet', profile.name);
    toast.success(`Active Diet Profile set to "${profile.name}"!`);
  };

  // Dynamic Macro Gram Calculations from calorieTarget & percentage split
  const proteinGrams = Math.round((customCalorieTarget * (selectedProfile.proteinPercentage / 100)) / 4);
  const carbGrams = Math.round((customCalorieTarget * (selectedProfile.carbPercentage / 100)) / 4);
  const fatGrams = Math.round((customCalorieTarget * (selectedProfile.fatPercentage / 100)) / 9);

  const proteinKcal = Math.round(customCalorieTarget * (selectedProfile.proteinPercentage / 100));
  const carbKcal = Math.round(customCalorieTarget * (selectedProfile.carbPercentage / 100));
  const fatKcal = Math.round(customCalorieTarget * (selectedProfile.fatPercentage / 100));

  // Filter recipes based on actual dietary metadata and ingredients
  const filteredRecommendedRecipes = recipes.filter(r => {
    const nameLower = r.name.toLowerCase();
    const catLower = r.category.toLowerCase();
    const ingNames = r.ingredients.map(i => i.name.toLowerCase());

    const meatKeywords = ['chicken', 'mutton', 'lamb', 'beef', 'pork', 'turkey', 'fish', 'prawn', 'shrimp', 'crab', 'seafood', 'bacon', 'ham', 'sausage'];
    const animalProductKeywords = [...meatKeywords, 'egg', 'milk', 'cheese', 'paneer', 'butter', 'yogurt', 'curd', 'ghee', 'cream', 'honey'];

    if (selectedProfile.id === 'vegetarian') {
      const containsMeat = ingNames.some(ing => meatKeywords.some(m => ing.includes(m))) || meatKeywords.some(m => nameLower.includes(m));
      return !containsMeat;
    }

    if (selectedProfile.id === 'vegan') {
      const containsAnimal = ingNames.some(ing => animalProductKeywords.some(a => ing.includes(a))) || animalProductKeywords.some(a => nameLower.includes(a));
      return !containsAnimal;
    }

    if (selectedProfile.id === 'high_protein') {
      return (r.proteinGrams || 15) >= 20;
    }

    if (selectedProfile.id === 'low_carb') {
      return (r.carbsGrams || 40) <= 30;
    }

    if (selectedProfile.id === 'keto') {
      return (r.carbsGrams || 40) <= 15 && (r.fatGrams || 10) >= 15;
    }

    return true; // Balanced
  }).slice(0, 6);

  const remainingCalories = Math.max(customCalorieTarget - plannedCalories, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-serif text-[#0F172A] dark:text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-white tracking-tight uppercase flex items-center space-x-3">
            <Activity className="w-8 h-8 text-[#059669]" />
            <span>Diet Goals & Macro Targets</span>
          </h1>
          <p className="text-sm font-bold text-[#475569] dark:text-slate-400 mt-1">
            Select a diet profile to calculate custom macro splits, inspect recommended database recipes, and track planned calories.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full text-xs font-black text-[#059669] shrink-0">
          <Zap className="w-4 h-4 text-[#059669]" />
          <span>Active Goal: {selectedProfile.name}</span>
        </div>
      </div>

      {/* 6 DIET PROFILE SELECTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DIET_PROFILES.map(profile => {
          const isActive = selectedProfile.id === profile.id;
          const pGrams = Math.round((profile.calorieDefault * (profile.proteinPercentage / 100)) / 4);
          const cGrams = Math.round((profile.calorieDefault * (profile.carbPercentage / 100)) / 4);
          const fGrams = Math.round((profile.calorieDefault * (profile.fatPercentage / 100)) / 9);

          return (
            <div
              key={profile.id}
              onClick={() => handleSelectProfile(profile)}
              className={`p-6 rounded-3xl border cursor-pointer transition-all duration-300 shadow-sm flex flex-col justify-between space-y-4 hover:scale-[1.01] ${
                isActive
                  ? 'bg-[#FFFDF9] dark:bg-slate-900 border-[#059669] ring-2 ring-[#059669]/30 shadow-md'
                  : 'bg-[#FFFDF9] dark:bg-slate-900 border-[#E2D9D0] dark:border-slate-800 hover:border-[#059669]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-[#0F172A] dark:text-white uppercase flex items-center space-x-2">
                    <span>{profile.name}</span>
                  </h3>
                  {isActive ? (
                    <span className="px-3 py-1 rounded-full bg-[#059669] text-white text-[10px] font-black uppercase flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active Goal</span>
                    </span>
                  ) : (
                    <span className="text-xs font-black text-slate-400 hover:text-[#059669]">Select ➔</span>
                  )}
                </div>
                <p className="text-xs text-[#475569] dark:text-slate-300 font-bold leading-relaxed">
                  {profile.description}
                </p>
              </div>

              {/* Macro Preview Bar */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-[#059669]">{profile.calorieDefault} kcal / day</span>
                  <span className="text-slate-500 font-bold">P: {pGrams}g • C: {cGrams}g • F: {fGrams}g</span>
                </div>
                
                {/* Visual Ratio Bar */}
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                  <div style={{ width: `${profile.proteinPercentage}%` }} className="bg-[#059669] h-full" title={`Protein: ${profile.proteinPercentage}%`} />
                  <div style={{ width: `${profile.carbPercentage}%` }} className="bg-[#FF5722] h-full" title={`Carbs: ${profile.carbPercentage}%`} />
                  <div style={{ width: `${profile.fatPercentage}%` }} className="bg-[#D97706] h-full" title={`Fat: ${profile.fatPercentage}%`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SELECTED PROFILE NUTRITION BLUEPRINT & CALCULATION PANEL */}
      <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#E2D9D0] dark:border-slate-800 pb-4 gap-4">
          <div>
            <span className="text-xs font-black text-[#059669] uppercase tracking-wider block">Selected Profile Settings</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white uppercase">
              {selectedProfile.name} Nutrition Blueprint
            </h2>
          </div>

          <div className="flex items-center space-x-3 bg-[#FDF7F2] dark:bg-slate-800 p-2 rounded-2xl border border-[#E2D9D0]">
            <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase">Target (kcal):</span>
            <input
              type="number"
              value={customCalorieTarget}
              onChange={(e) => setCustomCalorieTarget(Math.max(Number(e.target.value) || 1200, 800))}
              className="w-24 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-[#E2D9D0] text-sm font-black text-[#059669]"
            />
          </div>
        </div>

        {/* 4 CALCULATED MACRO GOAL CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#FDF7F2] dark:bg-slate-800 p-6 rounded-2xl border border-[#E2D9D0] dark:border-slate-700 space-y-2">
            <span className="text-xs font-black uppercase text-[#475569] dark:text-slate-400 block">Daily Calorie Target</span>
            <span className="text-4xl font-black text-[#0F172A] dark:text-white block">{customCalorieTarget} <span className="text-sm font-bold text-slate-400">kcal</span></span>
            <span className="text-xs font-bold text-[#059669] block">Planned: {plannedCalories} kcal ({remainingCalories} kcal remaining)</span>
          </div>

          <div className="bg-[#FDF7F2] dark:bg-slate-800 p-6 rounded-2xl border border-[#E2D9D0] dark:border-slate-700 space-y-2">
            <span className="text-xs font-black uppercase text-[#475569] dark:text-slate-400 block">Protein Goal ({selectedProfile.proteinPercentage}%)</span>
            <span className="text-4xl font-black text-[#059669] block">{proteinGrams}g</span>
            <span className="text-xs font-bold text-slate-500 block">{proteinKcal} kcal • 4 kcal/g</span>
          </div>

          <div className="bg-[#FDF7F2] dark:bg-slate-800 p-6 rounded-2xl border border-[#E2D9D0] dark:border-slate-700 space-y-2">
            <span className="text-xs font-black uppercase text-[#475569] dark:text-slate-400 block">Carbohydrate Goal ({selectedProfile.carbPercentage}%)</span>
            <span className="text-4xl font-black text-[#FF5722] block">{carbGrams}g</span>
            <span className="text-xs font-bold text-slate-500 block">{carbKcal} kcal • 4 kcal/g</span>
          </div>

          <div className="bg-[#FDF7F2] dark:bg-slate-800 p-6 rounded-2xl border border-[#E2D9D0] dark:border-slate-700 space-y-2">
            <span className="text-xs font-black uppercase text-[#475569] dark:text-slate-400 block">Fat Goal ({selectedProfile.fatPercentage}%)</span>
            <span className="text-4xl font-black text-[#D97706] block">{fatGrams}g</span>
            <span className="text-xs font-bold text-slate-500 block">{fatKcal} kcal • 9 kcal/g</span>
          </div>
        </div>

        {/* EXPANDABLE "HOW IS THIS CALCULATED?" */}
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 space-y-3">
          <button
            onClick={() => setShowCalculationGuide(!showCalculationGuide)}
            className="w-full flex items-center justify-between text-left font-black text-sm text-[#059669] uppercase"
          >
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-[#059669]" />
              <span>How is this calculated?</span>
            </div>
            {showCalculationGuide ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showCalculationGuide && (
            <div className="pt-3 border-t border-emerald-500/20 space-y-3 text-xs font-bold text-slate-700 dark:text-slate-300">
              <p>
                Macronutrient gram targets are dynamically computed directly from your target calorie intake (<strong>{customCalorieTarget} kcal</strong>) and energy density conversion constants:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-[#E2D9D0]">
                  <span className="font-black text-[#059669] uppercase block">Protein Calculation</span>
                  <span>{customCalorieTarget} × {selectedProfile.proteinPercentage}% = {proteinKcal} kcal</span><br />
                  <span>{proteinKcal} ÷ 4 = <strong>{proteinGrams}g protein</strong></span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-[#E2D9D0]">
                  <span className="font-black text-[#FF5722] uppercase block">Carbohydrate Calculation</span>
                  <span>{customCalorieTarget} × {selectedProfile.carbPercentage}% = {carbKcal} kcal</span><br />
                  <span>{carbKcal} ÷ 4 = <strong>{carbGrams}g carbs</strong></span>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-[#E2D9D0]">
                  <span className="font-black text-[#D97706] uppercase block">Fat Calculation</span>
                  <span>{customCalorieTarget} × {selectedProfile.fatPercentage}% = {fatKcal} kcal</span><br />
                  <span>{fatKcal} ÷ 9 ≈ <strong>{fatGrams}g fat</strong></span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Energy Density Standards: Protein = 4 kcal/g • Carbohydrates = 4 kcal/g • Fat = 9 kcal/g.
              </p>
            </div>
          )}
        </div>

        {/* POTENTIAL BENEFITS SECTION */}
        <div className="bg-[#FDF7F2] dark:bg-slate-800 p-6 rounded-2xl border border-[#E2D9D0] dark:border-slate-700 space-y-3">
          <h4 className="text-sm font-black text-[#0F172A] dark:text-white uppercase flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#FFC107]" />
            <span>Potential Benefits of {selectedProfile.name} Profile</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {selectedProfile.healthBenefits.map((b, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DAILY CALORIE PLANNING COMPARISON */}
        <div className="space-y-4 pt-4 border-t border-[#E2D9D0] dark:border-slate-800">
          <h3 className="text-xl font-black text-[#0F172A] dark:text-white uppercase flex items-center space-x-2">
            <Flame className="w-5 h-5 text-[#FF5722]" />
            <span>Daily Calorie Planning & Meal Split</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 space-y-1">
              <span className="text-xs font-black text-[#059669] uppercase block">Breakfast Planned</span>
              <span className="text-2xl font-black text-[#0F172A] dark:text-white block">{plannedBreakfast} kcal</span>
              <span className="text-[11px] text-slate-500 font-bold block">Target Split: ~{Math.round(customCalorieTarget * 0.25)} kcal</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 space-y-1">
              <span className="text-xs font-black text-[#059669] uppercase block">Lunch Planned</span>
              <span className="text-2xl font-black text-[#0F172A] dark:text-white block">{plannedLunch} kcal</span>
              <span className="text-[11px] text-slate-500 font-bold block">Target Split: ~{Math.round(customCalorieTarget * 0.35)} kcal</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 space-y-1">
              <span className="text-xs font-black text-[#059669] uppercase block">Dinner Planned</span>
              <span className="text-2xl font-black text-[#0F172A] dark:text-white block">{plannedDinner} kcal</span>
              <span className="text-[11px] text-slate-500 font-bold block">Target Split: ~{Math.round(customCalorieTarget * 0.30)} kcal</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 space-y-1">
              <span className="text-xs font-black text-[#059669] uppercase block">Total Planned vs Target</span>
              <span className="text-2xl font-black text-[#059669] block">{plannedCalories} / {customCalorieTarget} kcal</span>
              <span className="text-[11px] text-slate-500 font-bold block">{remainingCalories} kcal remaining</span>
            </div>
          </div>
        </div>

        {/* RECOMMENDED RECIPES FROM REAL DATABASE */}
        <div className="space-y-4 pt-4 border-t border-[#E2D9D0] dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-[#0F172A] dark:text-white uppercase flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-[#059669]" />
              <span>Recommended Database Recipes for {selectedProfile.name}</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">Showing {filteredRecommendedRecipes.length} compatible recipes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredRecommendedRecipes.map(recipe => (
              <div
                key={recipe.id}
                className="bg-white dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-black/70 text-white text-[10px] font-black uppercase">
                      {recipe.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-[#0F172A] dark:text-white truncate uppercase">{recipe.name}</h4>
                    <span className="text-xs font-bold text-[#059669]">{recipe.calories} kcal • {recipe.proteinGrams || 16}g P • {recipe.carbsGrams || 40}g C • {recipe.fatGrams || 12}g F</span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-500 font-bold">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{recipe.cookingTime} mins</span>
                    <span>•</span>
                    <span className="capitalize">{recipe.difficulty}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRecipeModal(recipe)}
                  className="w-full py-2 bg-[#059669] hover:bg-emerald-700 text-white font-black text-xs uppercase rounded-xl transition-all shadow-sm"
                >
                  View Recipe
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RECIPE DETAIL MODAL */}
      {selectedRecipeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto font-serif">
            <div className="flex items-center justify-between border-b border-[#E2D9D0] pb-3">
              <div>
                <span className="text-xs font-black text-[#059669] uppercase">{selectedRecipeModal.category}</span>
                <h3 className="text-xl font-black text-[#0F172A] dark:text-white uppercase">{selectedRecipeModal.name}</h3>
              </div>
              <button onClick={() => setSelectedRecipeModal(null)}><X className="w-5 h-5" /></button>
            </div>

            <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-[#E2D9D0]">
              <img src={selectedRecipeModal.imageUrl} alt={selectedRecipeModal.name} className="w-full h-full object-cover" />
            </div>

            <div className="grid grid-cols-4 gap-2 text-center py-2 bg-[#FDF7F2] dark:bg-slate-800 rounded-2xl border">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Calories</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">{selectedRecipeModal.calories} kcal</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Protein</span>
                <span className="text-sm font-black text-[#059669]">{selectedRecipeModal.proteinGrams || 16}g</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Carbs</span>
                <span className="text-sm font-black text-[#FF5722]">{selectedRecipeModal.carbsGrams || 40}g</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Fat</span>
                <span className="text-sm font-black text-[#D97706]">{selectedRecipeModal.fatGrams || 12}g</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-[#059669] uppercase mb-1">Ingredients</h4>
              <ul className="list-disc list-inside text-xs font-bold text-slate-700 dark:text-slate-300 space-y-1">
                {selectedRecipeModal.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing.quantity ? `${ing.quantity} ${ing.unit || ''} ` : ''}{ing.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
