# Database Architecture Documentation — MealShare Pro

## 1. Actual Database Technology
- **Primary Database**: Google Cloud Firestore (NoSQL Document Database).
- **Secondary Local Cache & Offline Store**: Browser `localStorage` (structured JSON format) with automatic failover and seamless synchronization when offline.
- **Backend API Connector**: Express.js REST API service with Firebase Admin SDK ([`backend/src/server.ts`](file:///c:/Users/akkur/OneDrive/Documents/Desktop/MealShare/backend/src/server.ts)).

## 2. Live Database Location
- **Cloud Database**: Cloud Firestore Project `mealshare-f18b0` (Region: Global / Multi-Region).
- **Local Browser Cache**: Key `mealshare_pantry`, `mealshare_planner`, `mealshare_history`, `mealshare_notif_prefs`.

## 3. Database Connection File
- **Client SDK Connection**: [`frontend/lib/firebase.ts`](file:///c:/Users/akkur/OneDrive/Documents/Desktop/MealShare/frontend/lib/firebase.ts)
- **Admin Server SDK Connection**: [`backend/src/services/adminAuthService.ts`](file:///c:/Users/akkur/OneDrive/Documents/Desktop/MealShare/backend/src/services/adminAuthService.ts)

## 4. Backend / API Data Layer
- **REST Endpoints**:
  - `GET /api/health`: Health status & latency diagnostics.
  - `POST /api/admin/auth/login`: Admin authentication via hashed credential verification.
  - `GET /api/admin/activity`: System activity audit logs.
  - `GET /api/admin/health`: Database and collection health metrics.
  - `GET /api/pantry`: REST pantry records.
  - `GET /api/recipes`: REST recipe records.
  - `GET /api/notifications`: SSE & REST real-time notification stream.

## 5. Schema File
- **Location**: [`database/schema.firestore.json`](file:///c:/Users/akkur/OneDrive/Documents/Desktop/MealShare/database/schema.firestore.json)

## 6. Seed File
- **Location**: [`database/seed.json`](file:///c:/Users/akkur/OneDrive/Documents/Desktop/MealShare/database/seed.json)
- **Master Master Catalog**: [`frontend/lib/catalogData.ts`](file:///c:/Users/akkur/OneDrive/Documents/Desktop/MealShare/frontend/lib/catalogData.ts) (500+ distinct ingredients).
- **Master Recipes**: [`frontend/lib/recipeData.ts`](file:///c:/Users/akkur/OneDrive/Documents/Desktop/MealShare/frontend/lib/recipeData.ts) (500+ distinct recipes).

## 7. Collections & Data Models

### `users` Collection
- `uid`: String (Primary Key)
- `email`: String
- `displayName`: String
- `role`: `'user' | 'admin'`
- `dietPreference`: String
- `dailyCalorieTarget`: Number
- `createdAt`: ISO Timestamp

### `foodCatalog` (Master Ingredients)
- `id`: String (Primary Key, e.g., `cat-tomato`)
- `name`: String
- `category`: String
- `imageUrl`: String
- `defaultUnit`: String

### `pantry` Collection
- `id`: String (Primary Key)
- `userId`: String (Foreign Key -> `users.uid`)
- `name`: String
- `category`: String
- `quantity`: Number
- `unit`: String
- `expiryDate`: String (YYYY-MM-DD)
- `imageUrl`: String
- `status`: `'fresh' | 'use_soon' | 'expired'` (Computed)

### `recipes` Collection
- `id`: String (Primary Key, e.g., `b-1`, `r-1`)
- `name`: String
- `description`: String
- `category`: String
- `mealType`: `'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'`
- `imageUrl`: String (Unique finished-dish image)
- `cookingTime`: Number (minutes)
- `difficulty`: `'Easy' | 'Medium'`
- `servings`: Number
- `calories`: Number
- `proteinGrams`: Number
- `carbsGrams`: Number
- `fatGrams`: Number
- `ingredients`: Array of `{ name: string, quantity?: number, unit?: string }`
- `instructions`: Array of strings

### `mealPlans` Collection
- `id`: String (Primary Key)
- `userId`: String (Foreign Key -> `users.uid`)
- `day`: String (`'Monday'`, `'Tuesday'`, etc.)
- `mealType`: `'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'`
- `recipeId`: String (Foreign Key -> `recipes.id`)
- `recipeTitle`: String
- `recipeImage`: String
- `calories`: Number

### `mealHistory` Collection
- `id`: String (Primary Key)
- `userId`: String (Foreign Key -> `users.uid`)
- `recipeId`: String (Foreign Key -> `recipes.id`)
- `recipeName`: String
- `recipeImage`: String
- `completedDate`: String (YYYY-MM-DD)
- `mealType`: String
- `calories`: Number

## 8. Relational Foreign Key Graph
```
        users (uid)
       /     |     \
      /      |      \
  pantry  mealPlans  mealHistory
    |        |        |
    v        v        v
ingredients  recipes  recipes (recipeId)
```

## 9. Environment Variables Used (Without Exposing Values)
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_BACKEND_URL`
- `PORT`
