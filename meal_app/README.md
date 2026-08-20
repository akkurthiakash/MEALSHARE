# MealShare Native Flutter Mobile Application

MealShare Mobile (`meal_app/`) is a 100% native mobile app built with Flutter and Dart, serving as the mobile companion to the MealShare web application.

---

## 1. Core Principles & Architecture

- **No WebView / No Embedded HTML**: Implemented using native Flutter widgets (`Scaffold`, `NavigationBar`, `ListView`, `Card`, `FilterChip`).
- **Single Source of Truth**: Connects directly to the existing Node.js Express REST API (`http://10.0.2.2:5000/api` for Android Emulator / LAN IP for physical phones).
- **Same Cloud Database**: Synchronizes directly with project `mealshare-70949` Cloud Firestore.
- **Shared Brand Identity**: Utilizes Emerald Green (`#16A34A`), Warm Background (`#F8FAFC`), Deep Navy Typography, and identical status terminology (`Ready to Cook`, `Uses Use Soon Ingredients`, `Missing Ingredients`, `Unavailable — Expired Ingredient`).

---

## 2. Directory Structure

```text
meal_app/
├── lib/
│   ├── core/
│   │   ├── constants/       # AppConstants & API URLs
│   │   └── theme/           # AppTheme & AppColors
│   ├── models/              # User, PantryItem, Recipe, MealPlan models
│   ├── services/            # ApiService (REST HTTP calls to Node.js backend)
│   ├── state/               # AuthNotifier, PantryNotifier, RecipeNotifier
│   ├── widgets/             # Reusable UI widgets (AppButton, AppCard, AppStatusBadge)
│   └── screens/             # Native mobile screen layouts & bottom navigation shell
└── docs/
    ├── API_MAPPING.md
    ├── MOBILE_ARCHITECTURE.md
    ├── MOBILE_UI_REFERENCE.md
    └── WEB_UI_REFERENCE.md
```

---

## 3. How to Run

1. Connect your physical Android phone via USB or open an Android Emulator.
2. Verify connected device:
   ```bash
   flutter devices
   ```
3. Run the application:
   ```bash
   flutter run
   ```
