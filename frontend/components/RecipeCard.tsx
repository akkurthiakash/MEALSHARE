'use client';

import React, { useState } from 'react';
import { DetailedRecipe, RecipeMatchResult, getIngredientImage } from '../lib/db';
import { Clock, CheckCircle2, ChevronRight, X, Sparkles } from 'lucide-react';

interface RecipeCardProps {
  recipeMatch: RecipeMatchResult;
}

export default function RecipeCard({ recipeMatch }: RecipeCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { recipe, matchPercentage } = recipeMatch;

  return (
    <>
      <div className="group glass-card hover:border-[#FFC107] rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between font-extrabold">
        <div>
          {/* Finished Cooked Dish Cover Image */}
          <div className="relative h-48 w-full overflow-hidden bg-slate-900">
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />

            {matchPercentage < 100 && (
              <div className="absolute top-3 left-3 flex items-center text-xs font-extrabold">
                <span className="px-3 py-1 rounded-full border border-emerald-400 bg-emerald-600 text-white shadow-sm uppercase">
                  {matchPercentage}% Match
                </span>
              </div>
            )}

            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-xs font-extrabold text-white">
              <span className="flex items-center space-x-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{recipe.cookingTime} mins</span>
              </span>
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-emerald-300 uppercase">
                {recipe.difficulty}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <h3 className="text-xl font-serif font-black text-[#0F172A] dark:text-white group-hover:text-[#FFC107] transition-colors line-clamp-1 uppercase">
              {recipe.name}
            </h3>
            <p className="text-xs font-extrabold text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {recipe.description}
            </p>

            {/* Recipe Required Ingredients List */}
            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 space-y-1.5 text-xs">
              {recipe.ingredients.slice(0, 4).map((ing, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center space-x-2 text-[#0F172A] dark:text-slate-200">
                    <img
                      src={getIngredientImage(ing.name)}
                      alt={ing.name}
                      className="w-5 h-5 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <span>{ing.name}</span>
                  </span>
                  <span className="text-[10px] uppercase font-extrabold text-emerald-600">IN PANTRY</span>
                </div>
              ))}
              {recipe.ingredients.length > 4 && (
                <span className="block text-[11px] text-slate-500 font-extrabold pt-1">
                  +{recipe.ingredients.length - 4} more ingredients
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-5 pt-0">
          <button
            onClick={() => setShowModal(true)}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-full bg-black hover:bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            <span>View Recipe</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm font-extrabold">
          <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative space-y-6">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-slate-900">
              <img 
                src={recipe.imageUrl} 
                alt={recipe.name} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                }}
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white font-extrabold text-sm">
                {matchPercentage < 100 && (
                  <span className="bg-emerald-600 px-3 py-1 rounded-full uppercase">{matchPercentage}% Match</span>
                )}
                <span className="bg-black/60 px-3 py-1 rounded-full backdrop-blur-md uppercase">{recipe.cookingTime} Mins • {recipe.category}</span>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-serif font-black text-[#0F172A] dark:text-white uppercase">{recipe.name}</h2>
              <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm">{recipe.description}</p>
            </div>

            {/* Ingredients Needed */}
            <div className="bg-white/60 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200/60 space-y-3">
              <h4 className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
                Recipe Ingredients ({recipe.ingredients.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recipe.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 text-xs font-extrabold">
                    <div className="flex items-center space-x-2">
                      <img src={getIngredientImage(ing.name)} alt={ing.name} className="w-6 h-6 rounded-full object-cover border border-slate-200" />
                      <span className="text-[#0F172A] dark:text-white">{ing.name}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-600 uppercase">IN PANTRY</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider">
                Cooking Instructions
              </h4>
              <ol className="space-y-3">
                {recipe.instructions.map((step, idx) => (
                  <li key={idx} className="flex space-x-3 text-[#0F172A] dark:text-slate-200 text-sm bg-white/60 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FFC107] text-black font-extrabold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
