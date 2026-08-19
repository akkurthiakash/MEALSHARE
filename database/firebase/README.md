# Firebase Firestore Layer — MealShare

This directory organizes the Firebase Firestore database artifacts, collections documentation, schema JSON, and seed files.

## Folder Structure
```
database/firebase/
├── collections/
│   └── collections.md    # Detailed field definitions for all Firestore collections
├── schema/
│   └── schema.json       # Formal Firestore schema definition
├── seed/
│   └── seed.json         # Development seed and initial data populate source
└── README.md             # Firebase configuration & deployment guide
```

## Live Connection Details
- **SDK Connection**: `frontend/lib/firebase.ts`
- **Backend Admin SDK**: `backend/src/services/adminAuthService.ts`
- **Project ID**: `mealshare-f18b0`

## Active Collections
1. `users`
2. `foodCatalog`
3. `pantry`
4. `recipes`
5. `mealPlans`
6. `mealHistory`
7. `dietGoals`
8. `notifications`
9. `admin_activity`
