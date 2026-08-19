import { DetailedRecipe } from './db';

export type MealStatus = 'PLANNED' | 'COMPLETED' | 'REMOVED';

export interface MealPlanItem {
  id: string;
  day: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  recipeTitle: string;
  recipeId?: string;
  imageUrl?: string;
  calories: number;
  status?: MealStatus;
  completed?: boolean;
  completedAt?: string | null;
}

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export type DayName = typeof DAYS[number];

export interface RecipeNutrition {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface CompletedMealItem {
  id: string;
  planId: string;
  recipeId: string;
  recipeTitle: string;
  imageUrl: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  status: MealStatus;
  completedAt: string; // ISO string
  dateStr: string; // YYYY-MM-DD
  dayName: DayName;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export function getRecipeNutrition(recipe?: DetailedRecipe | null): RecipeNutrition {
  if (!recipe) {
    return { calories: 350, proteinGrams: 15, carbsGrams: 45, fatGrams: 12 };
  }

  const name = recipe.name.toLowerCase();
  const cat = recipe.category;

  let calories = recipe.calories || 360;
  let protein = recipe.proteinGrams || 16;
  let carbs = recipe.carbsGrams || 46;
  let fat = recipe.fatGrams || 12;

  if (!recipe.proteinGrams) {
    if (cat === 'Breakfast & Eggs' || name.includes('egg') || name.includes('omelette') || name.includes('scramble')) {
      calories = 340;
      protein = 22;
      carbs = 12;
      fat = 24;
    } else if (cat === 'Chicken' || name.includes('chicken')) {
      calories = 480;
      protein = 38;
      carbs = 28;
      fat = 18;
    } else if (cat === 'Rice' || name.includes('fried rice') || name.includes('rice')) {
      calories = 420;
      protein = 16;
      carbs = 58;
      fat = 12;
    }
  }

  return {
    calories,
    proteinGrams: protein,
    carbsGrams: carbs,
    fatGrams: fat,
  };
}

export function getRecipeMealSlot(recipe: DetailedRecipe): 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' {
  const name = recipe.name.toLowerCase();
  const cat = recipe.category;

  if (
    cat === 'Breakfast & Eggs' ||
    name.includes('scramble') ||
    name.includes('omelette') ||
    name.includes('oat') ||
    name.includes('parfait') ||
    name.includes('pancake') ||
    name.includes('french toast') ||
    name.includes('egg toast') ||
    name.includes('cereal')
  ) {
    return 'Breakfast';
  }

  if (
    name.includes('roast') ||
    name.includes('baked') ||
    name.includes('steak') ||
    name.includes('stew') ||
    cat === 'Soups' ||
    cat === 'Vegetables'
  ) {
    return 'Dinner';
  }

  if (
    cat === 'Rice' ||
    cat === 'Pasta & Noodles' ||
    cat === 'Sandwiches, Toast & Wraps' ||
    cat === 'Dal, Beans & Lentils' ||
    cat === 'Salads' ||
    cat === 'Chicken'
  ) {
    return 'Lunch';
  }

  return 'Snack';
}

export const INITIAL_PLANS: MealPlanItem[] = [
  { id: 'b-7', day: 'Monday', mealType: 'Breakfast', recipeTitle: 'Spinach Egg Scramble', recipeId: 'b-7', calories: 340, imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=600&q=80', status: 'PLANNED', completed: false, completedAt: null },
  { id: 'r-2', day: 'Monday', mealType: 'Lunch', recipeTitle: 'Egg Fried Rice', recipeId: 'r-2', calories: 420, imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80', status: 'PLANNED', completed: false, completedAt: null },
  { id: 'c-1', day: 'Wednesday', mealType: 'Dinner', recipeTitle: 'Simple Pan Fried Chicken', recipeId: 'c-1', calories: 450, imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80', status: 'PLANNED', completed: false, completedAt: null },
];

export const INITIAL_COMPLETED_HISTORY: CompletedMealItem[] = [];

export function getStoredMealPlans(): MealPlanItem[] {
  if (typeof window === 'undefined') return INITIAL_PLANS;
  const stored = localStorage.getItem('mealshare_planner_plans');
  if (!stored) {
    localStorage.setItem('mealshare_planner_plans', JSON.stringify(INITIAL_PLANS));
    return INITIAL_PLANS;
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.map(p => ({ ...p, status: p.status || (p.completed ? 'COMPLETED' : 'PLANNED') })) : INITIAL_PLANS;
  } catch (e) {
    return INITIAL_PLANS;
  }
}

export function saveMealPlans(plans: MealPlanItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mealshare_planner_plans', JSON.stringify(plans));
    window.dispatchEvent(new CustomEvent('mealshare_planner_updated', { detail: plans }));
  }
}

// Save or add meal plan item
export function saveMealPlan(item: MealPlanItem) {
  const current = getStoredMealPlans();
  const newItem: MealPlanItem = {
    ...item,
    status: item.status || 'PLANNED',
    completed: item.status === 'COMPLETED' || item.completed || false
  };
  const existingIndex = current.findIndex(p => p.id === newItem.id);
  let updated: MealPlanItem[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = newItem;
  } else {
    updated = [...current, newItem];
  }
  saveMealPlans(updated);
}

// Transition meal to REMOVED status
export function removeMealPlan(id: string) {
  const current = getStoredMealPlans();
  const updated = current.map(p => p.id === id ? { ...p, status: 'REMOVED' as MealStatus } : p);
  saveMealPlans(updated);
}

export function getCompletedMealHistory(): CompletedMealItem[] {
  if (typeof window === 'undefined') return INITIAL_COMPLETED_HISTORY;
  const stored = localStorage.getItem('mealshare_completed_history');
  if (!stored) {
    localStorage.setItem('mealshare_completed_history', JSON.stringify(INITIAL_COMPLETED_HISTORY));
    return INITIAL_COMPLETED_HISTORY;
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : INITIAL_COMPLETED_HISTORY;
  } catch (e) {
    return INITIAL_COMPLETED_HISTORY;
  }
}

export function saveCompletedMealHistory(history: CompletedMealItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mealshare_completed_history', JSON.stringify(history));
    window.dispatchEvent(new CustomEvent('mealshare_history_updated', { detail: history }));
  }
}

export function markMealAsCompleted(plan: MealPlanItem, recipe?: DetailedRecipe | null): { success: boolean; isAlreadyCompleted: boolean } {
  const currentHistory = getCompletedMealHistory();
  const currentPlans = getStoredMealPlans();

  const nowIso = new Date().toISOString();
  const todayStr = nowIso.split('T')[0];

  const isAlreadyCompleted = currentHistory.some(
    h => h.planId === plan.id || (h.dateStr === todayStr && h.recipeId === (plan.recipeId || recipe?.id) && h.mealType === plan.mealType)
  );

  if (isAlreadyCompleted || plan.status === 'COMPLETED') {
    return { success: false, isAlreadyCompleted: true };
  }

  const nut = getRecipeNutrition(recipe);
  const newHistoryItem: CompletedMealItem = {
    id: 'history-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    planId: plan.id,
    recipeId: plan.recipeId || recipe?.id || 'b-7',
    recipeTitle: recipe?.name || plan.recipeTitle,
    imageUrl: recipe?.imageUrl || plan.imageUrl || 'https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=600&q=80',
    mealType: plan.mealType,
    status: 'COMPLETED',
    completedAt: nowIso,
    dateStr: todayStr,
    dayName: (plan.day as DayName) || 'Monday',
    calories: nut.calories,
    proteinGrams: nut.proteinGrams,
    carbsGrams: nut.carbsGrams,
    fatGrams: nut.fatGrams,
  };

  const updatedHistory = [newHistoryItem, ...currentHistory];
  saveCompletedMealHistory(updatedHistory);

  const updatedPlans = currentPlans.map(p => 
    p.id === plan.id ? { ...p, status: 'COMPLETED' as MealStatus, completed: true, completedAt: nowIso } : p
  );
  saveMealPlans(updatedPlans);

  return { success: true, isAlreadyCompleted: false };
}

export function markMealCompleted(planOrId: MealPlanItem | string, recipe?: DetailedRecipe | null) {
  if (typeof planOrId === 'string') {
    const plans = getStoredMealPlans();
    const target = plans.find(p => p.id === planOrId);
    if (target) return markMealAsCompleted(target, recipe);
    return { success: false, isAlreadyCompleted: false };
  }
  return markMealAsCompleted(planOrId, recipe);
}

export function undoMealCompletion(planId: string): { success: boolean } {
  const currentHistory = getCompletedMealHistory();
  const currentPlans = getStoredMealPlans();

  const updatedHistory = currentHistory.filter(h => h.planId !== planId);
  saveCompletedMealHistory(updatedHistory);

  const updatedPlans = currentPlans.map(p => 
    p.id === planId ? { ...p, status: 'PLANNED' as MealStatus, completed: false, completedAt: null } : p
  );
  saveMealPlans(updatedPlans);

  return { success: true };
}

export function addMealPlanItem(item: Omit<MealPlanItem, 'id'>): { success: boolean; isDuplicate: boolean; plan?: MealPlanItem } {
  const currentPlans = getStoredMealPlans();
  
  const existingExact = currentPlans.find(
    p => p.day === item.day && p.mealType === item.mealType && (p.recipeId === item.recipeId || p.recipeTitle.toLowerCase() === item.recipeTitle.toLowerCase())
  );

  if (existingExact) {
    return { success: false, isDuplicate: true, plan: existingExact };
  }

  const newPlan: MealPlanItem = {
    ...item,
    id: 'plan-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    completed: false,
    completedAt: null,
  };

  const updated = [...currentPlans, newPlan];
  saveMealPlans(updated);
  return { success: true, isDuplicate: false, plan: newPlan };
}

export function buildSmartWeeklyPlan(cookableRecipes: DetailedRecipe[]): { addedCount: number } {
  if (cookableRecipes.length === 0) return { addedCount: 0 };

  const currentPlans = getStoredMealPlans();
  const slots: Array<'Breakfast' | 'Lunch' | 'Dinner'> = ['Breakfast', 'Lunch', 'Dinner'];
  
  let addedCount = 0;
  const updatedPlans = [...currentPlans];

  DAYS.forEach(day => {
    slots.forEach(slot => {
      const isSlotOccupied = updatedPlans.some(p => p.day === day && p.mealType === slot);
      
      if (!isSlotOccupied) {
        const matchingRecipes = cookableRecipes.filter(r => getRecipeMealSlot(r) === slot);
        const candidates = matchingRecipes.length > 0 ? matchingRecipes : cookableRecipes;

        const recipe = candidates.find(r => !updatedPlans.some(p => p.day === day && p.mealType === slot && (p.recipeId === r.id || p.recipeTitle === r.name))) || candidates[0];

        if (recipe) {
          updatedPlans.push({
            id: 'smart-plan-' + day + '-' + slot + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            day,
            mealType: slot,
            recipeTitle: recipe.name,
            recipeId: recipe.id,
            imageUrl: recipe.imageUrl,
            calories: 400,
            completed: false,
            completedAt: null,
          });
          addedCount++;
        }
      }
    });
  });

  if (addedCount > 0) {
    saveMealPlans(updatedPlans);
  }

  return { addedCount };
}
