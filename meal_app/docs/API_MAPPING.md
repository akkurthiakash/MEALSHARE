# MEALSHARE FLUTTER MOBILE API MAPPING

This document maps every native Flutter screen in `meal_app/` to its corresponding Node.js backend REST endpoint (`http://10.0.2.2:5000/api`) and underlying Cloud Firestore collection in project `mealshare-70949`.

---

## Screen to API Endpoint Matrix

| Flutter Screen | Backend API Endpoint | HTTP Method | Firestore Collection |
| :--- | :--- | :--- | :--- |
| **Login Screen** | `/admin/auth/login` | `POST` | `users` |
| **Dashboard Tab** | `/health/database`<br>`/recipes/recommendations`<br>`/pantry` | `GET` | `recipes`, `pantry`, `mealPlans` |
| **Pantry Tab** | `/pantry`<br>`/pantry`<br>`/pantry/:id` | `GET`<br>`POST`<br>`DELETE` | `pantry` |
| **Recipes Tab** | `/recipes`<br>`/recipes/recommendations` | `GET` | `recipes` |
| **Meal Planner Tab** | `/meal-plans`<br>`/meal-plans`<br>`/meal-plans/:id/complete` | `GET`<br>`POST`<br>`POST` | `mealPlans`, `mealHistory` |
| **Diet Goals Screen** | `/diet-goals`<br>`/diet-goals` | `GET`<br>`POST` | `dietGoals` |
| **Profile Screen** | `/profile` | `GET` | `users` |
| **Notifications** | `/notifications`<br>`/notifications/stream` | `GET`<br>`SSE` | `notifications` |
