# MEALSHARE FLUTTER MOBILE APP REFERENCE

---

## 1. Overview & Architecture

- **Platform**: Flutter Native Cross-Platform Application (`meal_app/`)
- **Backend Communication**: Directly connects via REST API (`http://10.0.2.2:5000/api` on Android Emulator or LAN IP on physical device) to the Node.js Express server.
- **Database Source**: Uses the exact same Cloud Firestore database (`mealshare-70949`).
- **Authentication Source**: Uses the exact same Firebase Authentication system.

---

## 2. Key Screen Transformations (Web → Mobile)

| Web Page | Native Flutter Equivalent |
| :--- | :--- |
| **Desktop Dashboard** | Scrollable vertical layout with card carousels, status banners, and macro progress bars. |
| **Desktop Pantry Table** | Horizontal category filter chips, search input, and card items with shelf-life status badges. |
| **Desktop Recipe Grid** | Search bar with debounced API lookup, category chips, and dish photo cards displaying exact readiness status badges (`Ready to Cook`, `Uses Use Soon Ingredients`, `Missing Ingredients`, `Unavailable — Expired Ingredient`). |
| **Desktop Meal Planner** | Day-selector row (Mon-Sun), vertical meal slots (`Breakfast`, `Lunch`, `Dinner`, `Snack`), with `Mark as Completed` triggers linked to `mealHistory`. |
| **Desktop Diet Goals** | Profile selector cards, macro target progress bars, and dietary recipe recommendations. |
| **Desktop User Profile** | User avatar, account details, role badge, and preference switches. |

---

## 3. Documentation Files
- `meal_app/docs/WEB_UI_REFERENCE.md`: Maps visual design language tokens and colors.
- `meal_app/docs/API_MAPPING.md`: Maps Flutter screens to backend API routes and Firestore collections.
- `meal_app/docs/MOBILE_ARCHITECTURE.md`: High-level multi-platform architecture diagram.
