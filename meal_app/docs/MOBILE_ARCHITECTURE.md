# MEALSHARE NATIVE FLUTTER MOBILE ARCHITECTURE

---

## 1. Multi-Platform Architecture

```text
       MEALSHARE WEB APP                          MEALSHARE FLUTTER MOBILE APP
     (Next.js + React + TS)                         (Native Flutter / Dart)
               │                                                │
               └───────────────────────┬────────────────────────┘
                                       │
                            REST API / HTTP Calls
                                       │
                                       ▼
                             NODE.JS EXPRESS BACKEND
                              (Port 5000 / REST API)
                                       │
                                       ▼
                             FIREBASE ADMIN SDK
                                       │
                                       ▼
                       CLOUD FIRESTORE (mealshare-70949)
```

---

## 2. Directory & Component Layout (`meal_app/lib/`)

```text
lib/
├── core/
│   ├── constants/       # AppConstants & API URL configurations
│   └── theme/           # AppTheme & AppColors design tokens
├── models/              # User, PantryItem, Recipe, MealPlan models
├── services/            # ApiService (REST HTTP calls to Node.js backend)
├── state/               # AuthNotifier, PantryNotifier, RecipeNotifier
├── widgets/             # Reusable UI widgets (AppButton, AppCard, AppStatusBadge)
└── screens/             # Native mobile screen layouts & bottom navigation shell
```
