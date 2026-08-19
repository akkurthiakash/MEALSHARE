'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getDetailedRecipes, DetailedRecipe } from '../../../lib/db';

const RECIPE_CATEGORIES = [
  'All',
  'Breakfast & Eggs',
  'Rice',
  'Vegetables',
  'Pasta & Noodles',
  'Sandwiches, Toast & Wraps',
  'Chicken',
  'Fish & Seafood',
  'Dal, Beans & Lentils',
  'Soups',
  'Salads',
  'Snacks & Quick Meals',
  'Smoothies & Simple Drinks'
] as const;

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<DetailedRecipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  // Modal State for Add / Edit
  const [showModal, setShowModal] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('Breakfast & Eggs');
  const [cookingTime, setCookingTime] = useState(15);
  const [imageUrl, setImageUrl] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [instructionsText, setInstructionsText] = useState('');

  // Warning state for Duplicate Image Protection
  const [duplicateImageWarning, setDuplicateImageWarning] = useState<string | null>(null);

  // Delete confirmation
  const [deleteConfirmRecipe, setDeleteConfirmRecipe] = useState<DetailedRecipe | null>(null);

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    setLoading(true);
    const data = await getDetailedRecipes();
    setRecipes(data);
    setLoading(false);
  };

  const handleOpenAddModal = () => {
    setEditingRecipeId(null);
    setName('');
    setDescription('');
    setCategory('Breakfast & Eggs');
    setCookingTime(15);
    setImageUrl('');
    setIngredientsText('Egg, Fresh Milk, Salt, Pepper');
    setInstructionsText('Whisk eggs and milk.\nCook over medium heat.\nServe hot.');
    setDuplicateImageWarning(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (r: DetailedRecipe) => {
    setEditingRecipeId(r.id);
    setName(r.name);
    setDescription(r.description);
    setCategory(r.category);
    setCookingTime(r.cookingTime);
    setImageUrl(r.imageUrl);
    setIngredientsText(r.ingredients.map(i => i.name).join(', '));
    setInstructionsText(r.instructions.join('\n'));
    setDuplicateImageWarning(null);
    setShowModal(true);
  };

  // Image URL change handler with Duplicate Image Validation
  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    if (!url.trim()) {
      setDuplicateImageWarning(null);
      return;
    }
    // Check if image is assigned to another recipe
    const duplicate = recipes.find(r => r.id !== editingRecipeId && r.imageUrl.toLowerCase().trim() === url.toLowerCase().trim());
    if (duplicate) {
      setDuplicateImageWarning(`Warning: This image URL is already assigned to "${duplicate.name}". High-quality unique finished dish images are recommended.`);
    } else {
      setDuplicateImageWarning(null);
    }
  };

  const handleSaveRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const ingArray = ingredientsText.split(',').map(s => ({ name: s.trim() })).filter(i => i.name);
    const instArray = instructionsText.split('\n').map(s => s.trim()).filter(Boolean);

    if (editingRecipeId) {
      setRecipes(recipes.map(r => {
        if (r.id === editingRecipeId) {
          return {
            ...r,
            name: name.trim(),
            description: description.trim() || `Chef crafted ${name.trim()}.`,
            category: category as any,
            cookingTime: Number(cookingTime),
            imageUrl: imageUrl.trim() || r.imageUrl,
            ingredients: ingArray,
            instructions: instArray
          };
        }
        return r;
      }));
      toast.success(`Recipe "${name}" updated successfully!`);
    } else {
      const newRecipe: DetailedRecipe = {
        id: 'rec-' + Date.now(),
        name: name.trim(),
        description: description.trim() || `Chef crafted ${name.trim()}.`,
        category: category as any,
        cookingTime: Number(cookingTime),
        difficulty: 'Easy',
        servings: 2,
        imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        ingredients: ingArray,
        instructions: instArray
      };
      setRecipes([newRecipe, ...recipes]);
      toast.success(`Master Recipe "${name}" created successfully!`);
    }

    setShowModal(false);
  };

  const handleDeleteRecipe = () => {
    if (!deleteConfirmRecipe) return;
    setRecipes(recipes.filter(r => r.id !== deleteConfirmRecipe.id));
    toast.success(`Recipe "${deleteConfirmRecipe.name}" deleted.`);
    setDeleteConfirmRecipe(null);
  };

  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 font-serif">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center space-x-3">
            <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            <span>Master Recipe Management</span>
          </h1>
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-1">
            Manage recipes across 12 culinary categories, enforce finished dish images, and maintain ingredient isolation.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-700/30 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Master Recipe</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search recipes by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
            <span>Total:</span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black">{recipes.length} Recipes</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 border-t border-slate-100 dark:border-slate-800 pt-3">
          {RECIPE_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredRecipes.map((r) => (
          <div key={r.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between p-5 space-y-4 hover:border-emerald-500 transition-colors">
            
            <div className="space-y-3">
              {/* Finished Dish Cover Image */}
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-900">
                <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                  {r.category}
                </span>
                <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-emerald-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{r.cookingTime} Mins</span>
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white line-clamp-1">{r.name}</h3>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{r.description}</p>
              </div>

              {/* Recipe Ingredients Pill */}
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/60">
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 block mb-1">
                  Ingredients ({r.ingredients.length})
                </span>
                <div className="flex flex-wrap gap-1">
                  {r.ingredients.slice(0, 4).map((ing, idx) => (
                    <span key={idx} className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800">
                      {ing.name}
                    </span>
                  ))}
                  {r.ingredients.length > 4 && (
                    <span className="text-[10px] font-bold text-slate-400">+{r.ingredients.length - 4} more</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleOpenEditModal(r)}
                className="flex items-center space-x-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Recipe</span>
              </button>

              <button
                onClick={() => setDeleteConfirmRecipe(r)}
                className="flex items-center space-x-1.5 text-xs font-black text-rose-500 hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT RECIPE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {editingRecipeId ? 'Edit Master Recipe' : 'Add New Master Recipe'}
              </h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveRecipe} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-500">Recipe Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Fish Curry" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-sm font-bold mt-1" />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500">Description</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief recipe summary" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-sm font-bold mt-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase text-slate-500">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-sm font-bold mt-1">
                    {RECIPE_CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-slate-500">Cooking Time (Mins)</label>
                  <input type="number" required value={cookingTime} onChange={(e) => setCookingTime(Number(e.target.value))} className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-sm font-bold mt-1" />
                </div>
              </div>

              {/* Finished Dish Cover Image with Duplicate Validation */}
              <div>
                <label className="text-xs font-black uppercase text-slate-500">Finished Dish Image URL (Unique)</label>
                <input type="url" value={imageUrl} onChange={(e) => handleImageUrlChange(e.target.value)} placeholder="https://..." className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-sm font-bold mt-1" />
                {duplicateImageWarning && (
                  <div className="flex items-center space-x-2 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 mt-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{duplicateImageWarning}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500">Recipe Ingredients (Comma Separated)</label>
                <textarea rows={2} required value={ingredientsText} onChange={(e) => setIngredientsText(e.target.value)} placeholder="Fish, Tomato, Onion, Garlic, Spices" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-sm font-bold mt-1" />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500">Preparation Instructions (One Step Per Line)</label>
                <textarea rows={3} required value={instructionsText} onChange={(e) => setInstructionsText(e.target.value)} placeholder="Heat oil in pan. Sauté spices." className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-sm font-bold mt-1" />
              </div>

              <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase rounded-2xl shadow-lg shadow-emerald-700/30">
                Save Master Recipe
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-center">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Delete Master Recipe?</h3>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{deleteConfirmRecipe.name}</strong> from the master database?
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <button onClick={() => setDeleteConfirmRecipe(null)} className="w-1/2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl">
                Cancel
              </button>
              <button onClick={handleDeleteRecipe} className="w-1/2 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-rose-600/30">
                Delete Recipe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
