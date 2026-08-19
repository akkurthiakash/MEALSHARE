# MealShare Database Overview

DATABASE TECHNOLOGY:
Firebase Firestore (Google Cloud NoSQL Document Database)

LIVE STORAGE:
Google Cloud Firestore Project `mealshare-f18b0` (Multi-Region) & Browser IndexedDB/localStorage Fallback

CONNECTION:
Client SDK: `frontend/lib/firebase.ts`
Backend API: `backend/src/services/adminAuthService.ts`

SCHEMA:
`database/schema.firestore.json` & `database/firebase/schema/schema.json`

SEED:
`database/seed.json` & `database/firebase/seed/seed.json`

## Collections Overview
- `users`: User profiles, email, role (`user` | `admin`), diet preference
- `foodCatalog`: Master ingredient catalog (525+ entries with category and images)
- `pantry`: User pantry inventory items with quantity, unit, expiry, and fresh/use_soon/expired status
- `recipes`: Master recipe database (200 entries with unique finished-dish cover images, macros, instructions)
- `mealPlans`: Scheduled meal planner records linked to recipes and days
- `mealHistory`: Completed meal execution logs
- `dietGoals`: Calorie targets and macro percentage distributions
- `notifications`: Expiry alerts, system notifications, and recommendations
- `admin_activity`: System audit logs for administrator operations
