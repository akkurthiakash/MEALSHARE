# Firestore Collections Reference — MealShare

### 1. `users`
- `uid`: String (Primary Key)
- `email`: String
- `displayName`: String
- `role`: `'user' | 'admin'`
- `createdAt`: String (ISO date)

### 2. `foodCatalog` (Master Ingredients)
- `id`: String (e.g. `cat-tomato`)
- `name`: String
- `category`: String
- `imageUrl`: String (Ingredient image)
- `defaultUnit`: String

### 3. `pantry`
- `id`: String
- `userId`: String (Foreign Key -> `users.uid`)
- `name`: String
- `category`: String
- `quantity`: Number
- `unit`: String
- `expiryDate`: String (YYYY-MM-DD)
- `status`: `'fresh' | 'use_soon' | 'expired'`

### 4. `recipes`
- `id`: String
- `name`: String
- `category`: String
- `mealType`: `'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'`
- `imageUrl`: String (Unique finished-dish cover image)
- `cookingTime`: Number
- `servings`: Number
- `calories`: Number
- `proteinGrams`: Number
- `carbsGrams`: Number
- `fatGrams`: Number
- `ingredients`: Array of `{ name, quantity, unit }`
- `instructions`: Array of strings

### 5. `mealPlans`
- `id`: String
- `userId`: String (Foreign Key -> `users.uid`)
- `day`: String (`'Monday'`, etc.)
- `mealType`: String
- `recipeId`: String (Foreign Key -> `recipes.id`)
- `recipeTitle`: String
- `calories`: Number
- `status`: `'PLANNED' | 'COMPLETED' | 'REMOVED'`

### 6. `mealHistory`
- `id`: String
- `userId`: String
- `planId`: String
- `recipeTitle`: String
- `mealType`: String
- `dayName`: String
- `calories`: Number
- `completedAt`: String (ISO timestamp)

### 7. `dietGoals`
- `userId`: String
- `profile`: `'Balanced' | 'High Protein' | 'Low Carb' | 'Vegetarian' | 'Vegan' | 'Keto'`
- `calorieTarget`: Number
- `proteinPercentage`: Number
- `carbPercentage`: Number
- `fatPercentage`: Number

### 8. `notifications`
- `id`: String
- `userId`: String
- `type`: `'expiry' | 'reminder' | 'system'`
- `title`: String
- `message`: String
- `read`: Boolean
- `createdAt`: String

### 9. `admin_activity`
- `id`: String
- `adminEmail`: String
- `action`: String
- `targetType`: String
- `description`: String
- `timestamp`: String
