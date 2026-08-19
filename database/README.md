# MealShare Database Architecture

## Database Technology
**Google Cloud Firestore** (NoSQL Document Store)

## Where Data Is Stored
- **Cloud Master Store**: Cloud Firestore Project `mealshare-f18b0`
- **Local Cache & Offline Persistence**: Browser `localStorage` / IndexedDB (`mealshare_pantry`, `mealshare_planner`, `mealshare_history`)

## Connection Files
- **Client SDK**: [`frontend/lib/firebase.ts`](file:///c:/Users/akkur/OneDrive/Documents/Desktop/MealShare/frontend/lib/firebase.ts)
- **Backend Service**: [`backend/src/services/adminAuthService.ts`](file:///c:/Users/akkur/OneDrive/Documents/Desktop/MealShare/backend/src/services/adminAuthService.ts)

## Database Architecture Diagram
```
FRONTEND (Next.js 14)
   ↓
BACKEND (Express REST API)
   ↓
Firebase Firestore
   ↓
Collections (users, foodCatalog, pantry, recipes, mealPlans, mealHistory, dietGoals, notifications)
```

## Active Collections
1. `users`: User identity and account roles (`user` | `admin`)
2. `foodCatalog`: Master ingredient catalog (525 entries)
3. `pantry`: Stocked kitchen ingredients per user with expiry tracking
4. `recipes`: Master recipe library (200 recipes with unique cover images)
5. `mealPlans`: Scheduled meal entries (`PLANNED` status)
6. `mealHistory`: Completed meal logs (`COMPLETED` status)
7. `dietGoals`: Nutritional goals and dynamic macro target splits
8. `notifications`: Real-time system and ingredient expiry alerts
9. `admin_activity`: Audit log for administrative actions

## Database Relationships
```
users (uid)
   ├── pantry (userId) -> foodCatalog (ingredient)
   ├── mealPlans (userId) -> recipes (recipeId)
   ├── mealHistory (userId) -> recipes (recipeId)
   ├── dietGoals (userId)
   └── notifications (userId)
```

## Seed Data & Schema
- **Live Seed File**: [`database/seed.json`](file:///c:/Users/akkur/OneDrive/Documents/Desktop/MealShare/database/seed.json) & [`database/firebase/seed/seed.json`](file:///c:/Users/akkur/OneDrive/Documents/Desktop/MealShare/database/firebase/seed/seed.json)
- **Schema Specification**: [`database/schema.firestore.json`](file:///c:/Users/akkur/OneDrive/Documents/Desktop/MealShare/database/schema.firestore.json) & [`database/firebase/schema/schema.json`](file:///c:/Users/akkur/OneDrive/Documents/Desktop/MealShare/database/firebase/schema/schema.json)
