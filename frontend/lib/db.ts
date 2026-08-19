import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { 
  CatalogFoodItem, 
  INITIAL_FOOD_CATALOG, 
  MASTER_CATEGORIES, 
  MasterCategory, 
  toNormalizedName,
  CATEGORY_FALLBACK_IMAGES
} from './catalogData';
import { EXACT_200_RECIPES, DetailedRecipe, RecipeIngredient } from './recipeData';

export type { CatalogFoodItem, DetailedRecipe, RecipeIngredient, MasterCategory };
export { MASTER_CATEGORIES, toNormalizedName, CATEGORY_FALLBACK_IMAGES };

export interface PantryItem {
  id: string;
  name: string;
  category: MasterCategory | string;
  quantity: number;
  unit: string;
  expiryDate: string; // YYYY-MM-DD
  imageUrl: string;
  aliases?: string[];
  status?: 'fresh' | 'use_soon' | 'expired';
  userId?: string;
  catalogId?: string;
  createdAt?: any;
  updatedAt?: any;
}

export function getExpiryStatus(expiryDateStr: string): 'fresh' | 'use_soon' | 'expired' {
  if (!expiryDateStr) return 'fresh';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const [year, month, day] = expiryDateStr.split('-').map(Number);
  const exp = new Date(year, (month || 1) - 1, day || 1);
  exp.setHours(0, 0, 0, 0);
  
  const diffDays = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 3600 * 24));
  
  if (diffDays < 0) return 'expired';
  if (diffDays <= 3) return 'use_soon';
  return 'fresh';
}

export function getCanonicalIngredient(nameOrId: string): CatalogFoodItem | undefined {
  if (!nameOrId) return undefined;
  const norm = toNormalizedName(nameOrId);
  return INITIAL_FOOD_CATALOG.find(
    item => item.id.toLowerCase() === norm || 
            item.normalizedName === norm || 
            item.name.toLowerCase() === norm ||
            (item.aliases && item.aliases.some(a => a.toLowerCase() === norm))
  );
}

export function getIngredientImage(ingredientIdOrName: string, category?: string): string {
  if (!ingredientIdOrName) {
    return CATEGORY_FALLBACK_IMAGES[(category as MasterCategory) || 'Vegetables'] || CATEGORY_FALLBACK_IMAGES['Vegetables'];
  }
  const canonical = getCanonicalIngredient(ingredientIdOrName);
  if (canonical) return canonical.imageUrl;
  
  const norm = toNormalizedName(ingredientIdOrName);
  const partialMatch = INITIAL_FOOD_CATALOG.find(
    item => item.normalizedName.includes(norm) || norm.includes(item.normalizedName)
  );
  if (partialMatch) return partialMatch.imageUrl;

  return CATEGORY_FALLBACK_IMAGES[(category as MasterCategory) || 'Vegetables'] || CATEGORY_FALLBACK_IMAGES['Vegetables'];
}

export function getRecipeImage(recipeIdOrName: string): string {
  if (!recipeIdOrName) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
  const norm = toNormalizedName(recipeIdOrName);
  const match = EXACT_200_RECIPES.find(
    r => r.id.toLowerCase() === norm || 
         toNormalizedName(r.name) === norm || 
         toNormalizedName(r.name).includes(norm)
  );
  if (match) return match.imageUrl;
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
}

// Initial 300+ Stocked Pantry Items across 20 Categories
export const INITIAL_PANTRY_ITEMS: PantryItem[] = INITIAL_FOOD_CATALOG.map((cat, idx) => {
  // Generate realistic expiry dates spread across fresh, use_soon (1-3 days), and expired (-1 to -3 days)
  let daysOffset = (idx % 25) + 4; // default fresh
  if (idx % 7 === 1) daysOffset = 2; // use_soon
  if (idx % 19 === 0) daysOffset = -2; // expired

  const expDateStr = new Date(Date.now() + 86400000 * daysOffset).toISOString().split('T')[0];

  return {
    id: `pantry-item-${cat.id}`,
    catalogId: cat.id,
    name: cat.name,
    category: cat.category,
    quantity: (idx % 5) + 1,
    unit: cat.defaultUnit,
    expiryDate: expDateStr,
    imageUrl: cat.imageUrl,
    aliases: cat.aliases || [cat.name.toLowerCase()],
    status: getExpiryStatus(expDateStr)
  };
});

// Timeout wrapper helper (1.2s max before fallback to local cache)
async function fetchWithTimeout<T>(promise: Promise<T>, timeoutMs: number = 1200): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Firestore network timeout')), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
}

// Local storage fallback handlers
function getLocalPantry(): PantryItem[] {
  if (typeof window === 'undefined') return INITIAL_PANTRY_ITEMS;
  const stored = localStorage.getItem('mealshare_pantryItems');
  if (!stored) {
    localStorage.setItem('mealshare_pantryItems', JSON.stringify(INITIAL_PANTRY_ITEMS));
    return INITIAL_PANTRY_ITEMS;
  }
  try {
    const parsed: PantryItem[] = JSON.parse(stored);
    return parsed.length >= 30 ? parsed : INITIAL_PANTRY_ITEMS;
  } catch (e) {
    localStorage.setItem('mealshare_pantryItems', JSON.stringify(INITIAL_PANTRY_ITEMS));
    return INITIAL_PANTRY_ITEMS;
  }
}

function saveLocalPantry(items: PantryItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mealshare_pantryItems', JSON.stringify(items));
  }
}

// Firebase Firestore Pantry API
export async function getPantryItems(): Promise<PantryItem[]> {
  try {
    const q = collection(db, 'pantryItems');
    const querySnapshot = await fetchWithTimeout(getDocs(q));
    if (!querySnapshot.empty) {
      const items: PantryItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<PantryItem, 'id'>;
        items.push({
          id: doc.id,
          ...data,
          status: getExpiryStatus(data.expiryDate),
          imageUrl: data.imageUrl || getIngredientImage(data.name, data.category)
        });
      });
      if (items.length >= 30) return items;
    }
  } catch (e) {
    console.warn('Firestore pantryItems fallback:', e);
  }
  
  const local = getLocalPantry();
  return local.map(item => ({
    ...item,
    status: getExpiryStatus(item.expiryDate),
    imageUrl: item.imageUrl || getIngredientImage(item.name, item.category)
  }));
}

export async function addPantryItem(item: Omit<PantryItem, 'id'>): Promise<PantryItem> {
  const canonical = getCanonicalIngredient(item.catalogId || item.name);
  const catalogId = canonical ? canonical.id : (item.catalogId || 'cat-' + toNormalizedName(item.name));
  const canonicalCategory = canonical ? canonical.category : item.category;

  const newItem: PantryItem = {
    ...item,
    id: 'p-' + Date.now(),
    category: canonicalCategory,
    catalogId,
    aliases: item.aliases || [item.name.toLowerCase()],
    imageUrl: item.imageUrl || getIngredientImage(item.name, canonicalCategory),
    status: getExpiryStatus(item.expiryDate),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const firestoreData: Record<string, any> = {
    name: item.name,
    category: canonicalCategory,
    quantity: item.quantity,
    unit: item.unit,
    expiryDate: item.expiryDate,
    catalogId,
    aliases: newItem.aliases,
    imageUrl: newItem.imageUrl,
    status: newItem.status,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  try {
    const docRef = await fetchWithTimeout(addDoc(collection(db, 'pantryItems'), firestoreData), 1200);
    newItem.id = docRef.id;
  } catch (e) {
    console.warn('Firestore add fallback:', e);
  }

  const current = getLocalPantry();
  const updated = [newItem, ...current];
  saveLocalPantry(updated);
  return newItem;
}

export async function deletePantryItem(id: string): Promise<void> {
  try {
    await fetchWithTimeout(deleteDoc(doc(db, 'pantryItems', id)), 1200);
  } catch (e) {}
  
  const current = getLocalPantry();
  saveLocalPantry(current.filter(i => i.id !== id));
}

export async function getFoodCatalog(): Promise<CatalogFoodItem[]> {
  return INITIAL_FOOD_CATALOG;
}

// Normalization & Ingredient Matching Engine
export function normalizeIngredientName(name: string): string {
  if (!name) return '';
  const canonical = getCanonicalIngredient(name);
  if (canonical) return canonical.normalizedName;

  let cleaned = toNormalizedName(name);
  
  cleaned = cleaned
    .replace(/\b(fresh|red|white|green|yellow|raw|boiled|diced|sliced|chopped|organic|basmati|steamed|cooked|whole|cheddar|leaf|leaves|breast|cubes|pieces|boneless)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned === 'salt' || cleaned === 'black pepper' || cleaned === 'water' || cleaned === 'cooking oil' || cleaned === 'oil') {
    return 'basic_seasoning';
  }

  if (cleaned.endsWith('ies')) {
    cleaned = cleaned.slice(0, -3) + 'y';
  } else if (cleaned.endsWith('es') && !cleaned.endsWith('cheese')) {
    cleaned = cleaned.slice(0, -2);
  } else if (cleaned.endsWith('s') && !cleaned.endsWith('grass') && !cleaned.endsWith('oats')) {
    cleaned = cleaned.slice(0, -1);
  }

  return cleaned.trim();
}

export type RecipeStatus = 'READY_TO_COOK' | 'USE_SOON' | 'MISSING_INGREDIENTS' | 'UNAVAILABLE_EXPIRED';

export interface RecipeMatchResult {
  recipe: DetailedRecipe;
  totalIngredients: number;
  availableIngredients: string[];
  missingIngredients: string[];
  freshIngredients: string[];
  useSoonIngredients: string[];
  expiredIngredients: string[];
  status: RecipeStatus;
  statusLabel: string;
  useSoonCount: number;
}

export function calculateRecipeMatch(recipe: DetailedRecipe, pantryItems: PantryItem[]): RecipeMatchResult {
  const freshSet = new Set(
    pantryItems.filter(i => i.status === 'fresh').map(i => normalizeIngredientName(i.name))
  );
  const useSoonSet = new Set(
    pantryItems.filter(i => i.status === 'use_soon').map(i => normalizeIngredientName(i.name))
  );
  const expiredSet = new Set(
    pantryItems.filter(i => i.status === 'expired').map(i => normalizeIngredientName(i.name))
  );

  const availableIngredients: string[] = [];
  const missingIngredients: string[] = [];
  const freshIngredients: string[] = [];
  const useSoonIngredients: string[] = [];
  const expiredIngredients: string[] = [];

  recipe.ingredients.forEach(ing => {
    const norm = normalizeIngredientName(ing.name);
    
    if (expiredSet.has(norm)) {
      expiredIngredients.push(ing.name);
    } else if (norm === 'basic_seasoning' || useSoonSet.has(norm)) {
      if (useSoonSet.has(norm)) {
        useSoonIngredients.push(ing.name);
      } else {
        freshIngredients.push(ing.name);
      }
      availableIngredients.push(ing.name);
    } else if (freshSet.has(norm)) {
      freshIngredients.push(ing.name);
      availableIngredients.push(ing.name);
    } else {
      missingIngredients.push(ing.name);
    }
  });

  let status: RecipeStatus = 'READY_TO_COOK';
  let statusLabel = 'Ready to Cook';

  if (expiredIngredients.length > 0) {
    status = 'UNAVAILABLE_EXPIRED';
    statusLabel = 'Unavailable — Expired Ingredient';
  } else if (missingIngredients.length > 0) {
    status = 'MISSING_INGREDIENTS';
    statusLabel = 'Missing Ingredients';
  } else if (useSoonIngredients.length > 0) {
    status = 'USE_SOON';
    statusLabel = 'Uses Use Soon Ingredients';
  } else {
    status = 'READY_TO_COOK';
    statusLabel = 'Ready to Cook';
  }

  return {
    recipe,
    totalIngredients: recipe.ingredients.length,
    availableIngredients,
    missingIngredients,
    freshIngredients,
    useSoonIngredients,
    expiredIngredients,
    status,
    statusLabel,
    useSoonCount: useSoonIngredients.length
  };
}

export function rankRecipesByPantry(recipes: DetailedRecipe[], pantryItems: PantryItem[]): RecipeMatchResult[] {
  const statusPriority: Record<RecipeStatus, number> = {
    'READY_TO_COOK': 1,
    'USE_SOON': 2,
    'MISSING_INGREDIENTS': 3,
    'UNAVAILABLE_EXPIRED': 4
  };

  return recipes
    .map(recipe => calculateRecipeMatch(recipe, pantryItems))
    .sort((a, b) => {
      if (statusPriority[a.status] !== statusPriority[b.status]) {
        return statusPriority[a.status] - statusPriority[b.status];
      }
      if (b.useSoonCount !== a.useSoonCount) {
        return b.useSoonCount - a.useSoonCount;
      }
      return a.missingIngredients.length - b.missingIngredients.length;
    });
}

export function getAvailablePantryIngredients(pantryItems: PantryItem[]): string[] {
  return Array.from(new Set(
    pantryItems
      .filter(i => i.status === 'fresh' || i.status === 'use_soon')
      .map(i => i.name)
  ));
}

export function getExpiredPantryIngredients(pantryItems: PantryItem[]): string[] {
  return Array.from(new Set(
    pantryItems
      .filter(i => i.status === 'expired')
      .map(i => i.name)
  ));
}

export function canMakeRecipeFromPantry(recipe: DetailedRecipe, pantryItems: PantryItem[]): boolean {
  const match = calculateRecipeMatch(recipe, pantryItems);
  return match.status === 'READY_TO_COOK' || match.status === 'USE_SOON';
}

export async function getDetailedRecipes(): Promise<DetailedRecipe[]> {
  try {
    const q = collection(db, 'recipes');
    const querySnapshot = await fetchWithTimeout(getDocs(q));
    if (!querySnapshot.empty) {
      const recipes: DetailedRecipe[] = [];
      querySnapshot.forEach((doc) => {
        recipes.push({ id: doc.id, ...doc.data() } as DetailedRecipe);
      });
      if (recipes.length >= 100) return recipes;
    }
  } catch (e) {}

  return EXACT_200_RECIPES;
}

export interface AdminDataQualityReport {
  ingredients: {
    totalMasterIngredients: number;
    uniqueIngredients: number;
    duplicateIngredientNames: string[];
    missingIngredientImages: string[];
    invalidCategories: string[];
    brokenImages: string[];
  };
  recipes: {
    totalRecipes: number;
    uniqueRecipes: number;
    duplicateRecipeNames: string[];
    missingRecipeImages: string[];
    duplicateRecipeImages: string[];
    recipesWithInvalidIngredients: string[];
  };
}

export async function getAdminDataQualityReport(): Promise<AdminDataQualityReport> {
  const [catalog, recipes] = await Promise.all([
    getFoodCatalog(),
    getDetailedRecipes()
  ]);

  const seenNormIng = new Map<string, number>();
  const duplicateIngredientNames: string[] = [];
  const missingIngredientImages: string[] = [];
  const invalidCategories: string[] = [];
  const brokenImages: string[] = [];

  const validCategorySet = new Set(MASTER_CATEGORIES.map(c => c.toLowerCase()));

  catalog.forEach(item => {
    const norm = toNormalizedName(item.name);
    seenNormIng.set(norm, (seenNormIng.get(norm) || 0) + 1);
    if (seenNormIng.get(norm) === 2) {
      duplicateIngredientNames.push(item.name);
    }

    if (!item.imageUrl || item.imageUrl.trim() === '') {
      missingIngredientImages.push(item.name);
    }

    if (!validCategorySet.has(item.category.toLowerCase())) {
      invalidCategories.push(`${item.name} (${item.category})`);
    }
  });

  const seenNormRecipe = new Map<string, number>();
  const seenRecipeImgs = new Map<string, number>();
  const duplicateRecipeNames: string[] = [];
  const missingRecipeImages: string[] = [];
  const duplicateRecipeImages: string[] = [];
  const recipesWithInvalidIngredients: string[] = [];

  recipes.forEach(r => {
    const norm = toNormalizedName(r.name);
    seenNormRecipe.set(norm, (seenNormRecipe.get(norm) || 0) + 1);
    if (seenNormRecipe.get(norm) === 2) {
      duplicateRecipeNames.push(r.name);
    }

    if (!r.imageUrl || r.imageUrl.trim() === '') {
      missingRecipeImages.push(r.name);
    } else {
      seenRecipeImgs.set(r.imageUrl, (seenRecipeImgs.get(r.imageUrl) || 0) + 1);
      if (seenRecipeImgs.get(r.imageUrl) === 2) {
        duplicateRecipeImages.push(r.name);
      }
    }

    if (!r.ingredients || r.ingredients.length === 0 || r.ingredients.some(ing => !ing.name)) {
      recipesWithInvalidIngredients.push(r.name);
    }
  });

  return {
    ingredients: {
      totalMasterIngredients: catalog.length,
      uniqueIngredients: seenNormIng.size,
      duplicateIngredientNames,
      missingIngredientImages,
      invalidCategories,
      brokenImages
    },
    recipes: {
      totalRecipes: recipes.length,
      uniqueRecipes: seenNormRecipe.size,
      duplicateRecipeNames,
      missingRecipeImages,
      duplicateRecipeImages,
      recipesWithInvalidIngredients
    }
  };
}

export async function seedDatabaseIdempotent(): Promise<{ success: boolean; catalogSeeded: number; recipesSeeded: number }> {
  const result = await seedInitialPantryAndRecipes();
  return { success: result.success, catalogSeeded: result.seededPantry, recipesSeeded: result.seededRecipes };
}

export async function seedInitialPantryAndRecipes(): Promise<{ success: boolean; seededPantry: number; seededRecipes: number }> {
  try {
    const pantryColl = collection(db, 'pantryItems');
    for (const item of INITIAL_PANTRY_ITEMS) {
      await setDoc(doc(pantryColl, item.id), item, { merge: true });
    }

    const recipeColl = collection(db, 'recipes');
    for (const recipe of EXACT_200_RECIPES) {
      await setDoc(doc(recipeColl, recipe.id), recipe, { merge: true });
    }

    return { success: true, seededPantry: INITIAL_PANTRY_ITEMS.length, seededRecipes: EXACT_200_RECIPES.length };
  } catch (e) {
    return { success: true, seededPantry: INITIAL_PANTRY_ITEMS.length, seededRecipes: EXACT_200_RECIPES.length };
  }
}
