import express, { type Request, type Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './config/firebase';
import { authenticateFirebaseToken, requireAdmin, AuthenticatedRequest } from './middleware/authMiddleware';
import { calculateExpiryStatus, matchRecipesToPantry, calculateNutritionTargets } from './services/mealServices';
import { notificationService } from './services/notificationService';
import { adminAuthService } from './services/adminAuthService';
import { PantryItem, Recipe, MealPlan, MealHistoryItem, DietGoal } from './types';

import { databaseAccessService } from './services/databaseAccessService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ==========================================
// HEALTH & DIAGNOSTIC ENDPOINTS
// ==========================================

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    backend: 'Node.js + Express',
    database: 'Cloud Firestore',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health/database', async (req: Request, res: Response) => {
  const result = await databaseAccessService.testFirestoreAccess();
  res.json({
    backend: 'Node.js + Express',
    database: 'Cloud Firestore',
    status: result.status === 'CONNECTED' ? 'connected' : 'error',
    readTest: result.status === 'CONNECTED' ? 'successful' : 'failed',
    timestamp: new Date().toISOString(),
    collections: {
      recipes: result.recipesCount,
      ingredients: result.ingredientsCount,
      pantryItems: result.pantryCount,
      users: result.usersCount
    }
  });
});

app.post('/api/admin/seed', async (req: Request, res: Response) => {
  try {
    const { seedFirestoreDatabase } = require('./services/seedDatabase');
    await seedFirestoreDatabase();
    res.json({ success: true, message: 'Firestore collections populated with seed data.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// USER & AUTHENTICATION ENDPOINTS
// ==========================================

app.get('/api/profile', authenticateFirebaseToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const uid = req.user!.uid;
    let userProfile = {
      uid,
      email: req.user!.email,
      displayName: req.user!.name || 'MealShare User',
      role: req.user!.role,
      dietPreference: 'Balanced',
      dailyCalorieTarget: 2000
    };

    if (db) {
      const uDoc = await db.collection('users').doc(uid).get();
      if (uDoc.exists) {
        userProfile = { ...userProfile, ...uDoc.data() };
      }
    }

    res.json(userProfile);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// PANTRY ENDPOINTS
// ==========================================

app.get('/api/pantry', authenticateFirebaseToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.uid;
    let items: PantryItem[] = [];

    if (db) {
      const snap = await db.collection('pantry').where('userId', '==', userId).get();
      items = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId || userId,
          catalogId: data.catalogId || '',
          name: data.name || '',
          category: data.category || 'General',
          quantity: data.quantity || 1,
          unit: data.unit || 'pcs',
          expiryDate: data.expiryDate || '',
          imageUrl: data.imageUrl || '',
          status: calculateExpiryStatus(data.expiryDate || ''),
          createdAt: data.createdAt
        };
      });
    }

    // Fallback if empty in dev mode
    if (items.length === 0) {
      items = [
        { id: 'p1', userId, catalogId: 'ing-milk', name: 'Fresh Milk', category: 'Dairy', quantity: 1, unit: 'Liter', expiryDate: '2026-08-20', imageUrl: '', status: calculateExpiryStatus('2026-08-20') },
        { id: 'p2', userId, catalogId: 'ing-spinach', name: 'Spinach Leaves', category: 'Vegetables', quantity: 250, unit: 'g', expiryDate: '2026-08-19', imageUrl: '', status: calculateExpiryStatus('2026-08-19') },
        { id: 'p3', userId, catalogId: 'ing-eggs', name: 'Organic Eggs', category: 'Dairy', quantity: 6, unit: 'pcs', expiryDate: '2026-08-25', imageUrl: '', status: calculateExpiryStatus('2026-08-25') }
      ];
    }

    // Filter by Category if provided in query params
    const categoryFilter = req.query.category as string;
    if (categoryFilter && categoryFilter !== 'All') {
      items = items.filter(i => i.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/pantry', authenticateFirebaseToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.uid;
    const { name, category, quantity, unit, expiryDate, catalogId, imageUrl } = req.body;

    if (!name || !expiryDate) {
      return res.status(400).json({ error: 'Name and Expiry Date are required' });
    }

    const newItem: Partial<PantryItem> = {
      userId,
      catalogId: catalogId || '',
      name: name.trim(),
      category: category || 'General',
      quantity: Number(quantity) || 1,
      unit: unit || 'pcs',
      expiryDate,
      imageUrl: imageUrl || '',
      status: calculateExpiryStatus(expiryDate),
      createdAt: new Date().toISOString()
    };

    if (db) {
      const docRef = await db.collection('pantry').add(newItem);
      return res.json({ id: docRef.id, ...newItem });
    }

    res.json({ id: 'p_' + Date.now(), ...newItem });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/pantry/:id', authenticateFirebaseToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (db) {
      await db.collection('pantry').doc(id).delete();
    }
    res.json({ success: true, message: 'Item deleted from pantry' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// RECIPES & RECOMMENDATION ENGINE
// ==========================================

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 'r1',
    title: 'Golden Leftover Egg Fried Rice',
    name: 'Golden Leftover Egg Fried Rice',
    normalizedName: 'golden leftover egg fried rice',
    description: 'Quick 10-minute fried rice utilizing leftover Basmati rice and fresh eggs!',
    category: 'Rice & Grains',
    mealType: 'Lunch',
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    calories: 420,
    proteinGrams: 16,
    carbsGrams: 58,
    fatGrams: 12,
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      { id: 'ing-eggs', name: 'Organic Eggs', quantity: 2, unit: 'pcs' },
      { id: 'ing-rice', name: 'Basmati Rice', quantity: 200, unit: 'g' }
    ],
    instructions: ['Heat oil in pan', 'Scramble eggs', 'Add cooked rice and soy sauce', 'Serve hot']
  },
  {
    id: 'r2',
    title: 'Spinach & Egg Omelet',
    name: 'Spinach & Egg Omelet',
    normalizedName: 'spinach and egg omelet',
    description: 'Nutritious high-protein breakfast loaded with fresh spinach leaves.',
    category: 'Eggs',
    mealType: 'Breakfast',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    prepTimeMinutes: 5,
    cookTimeMinutes: 7,
    calories: 280,
    proteinGrams: 22,
    carbsGrams: 4,
    fatGrams: 18,
    servings: 1,
    difficulty: 'Easy',
    ingredients: [
      { id: 'ing-spinach', name: 'Spinach Leaves', quantity: 100, unit: 'g' },
      { id: 'ing-eggs', name: 'Organic Eggs', quantity: 3, unit: 'pcs' }
    ],
    instructions: ['Sauté spinach until wilted', 'Whisk eggs and pour into pan', 'Fold omelet and enjoy']
  }
];

app.get('/api/recipes', async (req: Request, res: Response) => {
  try {
    let recipes = SAMPLE_RECIPES;

    if (db) {
      const snap = await db.collection('recipes').limit(50).get();
      if (!snap.empty) {
        recipes = snap.docs.map(d => ({ id: d.id, ...d.data() } as Recipe));
      }
    }

    const { search, category, mealType } = req.query;
    if (search) {
      const query = (search as string).toLowerCase().trim();
      recipes = recipes.filter(r => r.name.toLowerCase().includes(query) || r.description.toLowerCase().includes(query));
    }

    if (category) {
      recipes = recipes.filter(r => r.category.toLowerCase() === (category as string).toLowerCase());
    }

    if (mealType) {
      recipes = recipes.filter(r => r.mealType.toLowerCase() === (mealType as string).toLowerCase());
    }

    res.json(recipes);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/recipes/recommendations', authenticateFirebaseToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.uid;
    let pantry: PantryItem[] = [];

    if (db) {
      const snap = await db.collection('pantry').where('userId', '==', userId).get();
      pantry = snap.docs.map(doc => doc.data() as PantryItem);
    }

    const recommendations = matchRecipesToPantry(SAMPLE_RECIPES, pantry);
    res.json(recommendations);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// MEAL PLANNER & HISTORY
// ==========================================

app.get('/api/meal-plans', authenticateFirebaseToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.uid;
    let plans: MealPlan[] = [];

    if (db) {
      const snap = await db.collection('mealPlans').where('userId', '==', userId).get();
      plans = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MealPlan));
    }

    res.json(plans);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/meal-plans', authenticateFirebaseToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.uid;
    const { recipeId, day, mealType, recipeTitle, imageUrl, calories } = req.body;

    const newPlan: Partial<MealPlan> = {
      userId,
      recipeId,
      day: day || 'Monday',
      mealType: mealType || 'Lunch',
      recipeTitle: recipeTitle || 'Delicious Meal',
      imageUrl: imageUrl || '',
      calories: Number(calories) || 400,
      completed: false,
      status: 'PLANNED',
      createdAt: new Date().toISOString()
    };

    if (db) {
      const ref = await db.collection('mealPlans').add(newPlan);
      return res.json({ id: ref.id, ...newPlan });
    }

    res.json({ id: 'plan_' + Date.now(), ...newPlan });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/meal-plans/:id/complete', authenticateFirebaseToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.uid;
    const { id } = req.params;
    const completedAt = new Date().toISOString();

    if (db) {
      const planRef = db.collection('mealPlans').doc(id);
      const doc = await planRef.get();

      if (!doc.exists) {
        return res.status(404).json({ error: 'Meal plan record not found' });
      }

      const planData = doc.data() as MealPlan;
      if (planData.userId !== userId) {
        return res.status(403).json({ error: 'Unauthorized meal completion attempt' });
      }

      await planRef.update({
        completed: true,
        status: 'COMPLETED',
        completedAt
      });

      // Add to Meal History
      await db.collection('mealHistory').add({
        userId,
        planId: id,
        recipeId: planData.recipeId,
        recipeTitle: planData.recipeTitle,
        imageUrl: planData.imageUrl,
        mealType: planData.mealType,
        completedAt,
        dateStr: completedAt.split('T')[0],
        dayName: planData.day,
        calories: planData.calories,
        proteinGrams: 20,
        carbsGrams: 50,
        fatGrams: 10
      });
    }

    res.json({ success: true, message: 'Meal marked as completed and logged to history' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// DIET GOALS ENDPOINTS
// ==========================================

app.get('/api/diet-goals', authenticateFirebaseToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.uid;
    let goal: DietGoal = {
      userId,
      profile: 'Balanced',
      calorieTarget: 2000,
      proteinPercentage: 30,
      carbohydratePercentage: 45,
      fatPercentage: 25,
      ...calculateNutritionTargets(2000, 30, 45, 25)
    };

    if (db) {
      const doc = await db.collection('dietGoals').doc(userId).get();
      if (doc.exists) {
        goal = doc.data() as DietGoal;
      }
    }

    res.json(goal);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/diet-goals', authenticateFirebaseToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.uid;
    const { profile, calorieTarget, proteinPercentage, carbohydratePercentage, fatPercentage } = req.body;

    const calTarget = Number(calorieTarget) || 2000;
    const pPct = Number(proteinPercentage) || 30;
    const cPct = Number(carbohydratePercentage) || 45;
    const fPct = Number(fatPercentage) || 25;

    const updatedGoal: DietGoal = {
      userId,
      profile: profile || 'Balanced',
      calorieTarget: calTarget,
      proteinPercentage: pPct,
      carbohydratePercentage: cPct,
      fatPercentage: fPct,
      ...calculateNutritionTargets(calTarget, pPct, cPct, fPct),
      updatedAt: new Date().toISOString()
    };

    if (db) {
      await db.collection('dietGoals').doc(userId).set(updatedGoal, { merge: true });
    }

    res.json(updatedGoal);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ADMIN & AUDIT LOGS
// ==========================================

app.post('/api/admin/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const isValid = adminAuthService.verifyCredentials(email, password);
  if (!isValid) {
    adminAuthService.logActivity(email, 'LOGIN_FAILED', 'auth', `Failed login attempt for: ${email}`);
    return res.status(401).json({ error: 'Administrator access denied.' });
  }

  adminAuthService.logActivity(email, 'LOGIN_SUCCESS', 'auth', 'Admin logged in successfully.');
  res.json({
    success: true,
    user: {
      uid: 'admin-primary',
      email: 'akkurthiakash2@gmail.com',
      displayName: 'System Admin',
      role: 'admin',
      token: `admin-token-${Date.now()}`
    }
  });
});

app.get('/api/admin/activity', authenticateFirebaseToken, requireAdmin, (req: Request, res: Response) => {
  res.json(adminAuthService.getAuditLogs());
});

// ==========================================
// REAL-TIME NOTIFICATIONS (SSE)
// ==========================================

app.get('/api/notifications', (req: Request, res: Response) => {
  res.json(notificationService.getHistory());
});

app.get('/api/notifications/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  res.write(`data: ${JSON.stringify({ type: 'system', title: 'Connected', message: 'SSE Stream Active', timestamp: new Date().toISOString() })}\n\n`);
  notificationService.addClient(res);

  req.on('close', () => {
    notificationService.removeClient(res);
    res.end();
  });
});

if (process.env.VERCEL !== '1') {
  app.listen(Number(PORT), '0.0.0.0', async () => {
    console.log(`\nMEALSHARE BACKEND`);
    console.log(`-----------------`);
    console.log(`Runtime: Node.js`);
    console.log(`Framework: Fastify / Express`);
    console.log(`Authentication: Firebase Authentication`);
    console.log(`Database: Cloud Firestore`);
    console.log(`Project: ${process.env.FIREBASE_PROJECT_ID || 'mealshare-70949'}`);

    const result = await databaseAccessService.testFirestoreAccess();

    console.log(`Firestore Status: ${result.status === 'CONNECTED' ? 'CONNECTED' : 'FAILED'}`);
    console.log(`\n⚡ Server running on http://0.0.0.0:${PORT} (Accessible via http://localhost:${PORT} and http://10.0.2.2:${PORT})`);
  });
}

export default app;
