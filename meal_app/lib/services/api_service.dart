import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/app_config.dart';
import '../models/pantry_item.dart';
import '../models/recipe.dart';
import '../models/meal_plan.dart';
import '../data/web_recipe_dataset.dart';

class ApiService {
  String get baseUrl => AppConfig.activeBaseUrl;

  // Fetch Pantry Items
  Future<List<PantryItem>> fetchPantry({String? category}) async {
    try {
      final url = Uri.parse('$baseUrl/pantry${category != null && category != 'All' ? '?category=$category' : ''}');
      final response = await http.get(url).timeout(const Duration(seconds: 4));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((j) => PantryItem.fromJson(j)).toList();
      }
    } catch (e) {
      // Fallback local mock data matching web pantry items
    }
    return [
      PantryItem(id: 'p1', userId: 'user-1', catalogId: 'ing-milk', name: 'Fresh Milk', category: 'Dairy', quantity: 1, unit: 'Liter', expiryDate: '2026-08-25', imageUrl: '', status: 'FRESH'),
      PantryItem(id: 'p2', userId: 'user-1', catalogId: 'ing-spinach', name: 'Spinach Leaves', category: 'Vegetables', quantity: 250, unit: 'g', expiryDate: '2026-08-19', imageUrl: '', status: 'EXPIRING_SOON'),
      PantryItem(id: 'p3', userId: 'user-1', catalogId: 'ing-eggs', name: 'Organic Eggs', category: 'Dairy', quantity: 6, unit: 'pcs', expiryDate: '2026-08-28', imageUrl: '', status: 'FRESH'),
    ];
  }

  // Add Pantry Item
  Future<bool> addPantryItem(Map<String, dynamic> itemData) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/pantry'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(itemData),
      ).timeout(const Duration(seconds: 4));
      return response.statusCode == 200;
    } catch (e) {
      return true; // Optimistic local success
    }
  }

  // Delete Pantry Item
  Future<bool> deletePantryItem(String id) async {
    try {
      final response = await http.delete(Uri.parse('$baseUrl/pantry/$id')).timeout(const Duration(seconds: 4));
      return response.statusCode == 200;
    } catch (e) {
      return true;
    }
  }

  // Fetch Recipes with Dataset Fallback
  Future<List<Recipe>> fetchRecipes({String? search, String? category}) async {
    try {
      String queryParams = '';
      if (search != null && search.isNotEmpty) queryParams += '?search=$search';
      if (category != null && category != 'All') {
        queryParams += queryParams.isEmpty ? '?category=$category' : '&category=$category';
      }
      final response = await http.get(Uri.parse('$baseUrl/recipes$queryParams')).timeout(const Duration(seconds: 4));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        if (data.isNotEmpty) {
          return data.map((j) => Recipe.fromJson(j)).toList();
        }
      }
    } catch (e) {
      // Offline fallback to 200 web recipes dataset
    }

    var list = WebRecipeDataset.recipes;
    if (search != null && search.isNotEmpty) {
      list = list.where((r) => r.title.toLowerCase().contains(search.toLowerCase())).toList();
    }
    if (category != null && category != 'All') {
      list = list.where((r) => r.category == category).toList();
    }
    return list;
  }

  // Fetch Recipe Recommendations
  Future<List<Recipe>> fetchRecommendations() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/recipes/recommendations')).timeout(const Duration(seconds: 4));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        if (data.isNotEmpty) {
          return data.map((j) => Recipe.fromJson(j)).toList();
        }
      }
    } catch (e) {
      // Fallback
    }
    return WebRecipeDataset.recipes.take(4).toList();
  }

  // Fetch Meal Plans
  Future<List<MealPlan>> fetchMealPlans() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/meal-plans')).timeout(const Duration(seconds: 4));
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((j) => MealPlan.fromJson(j)).toList();
      }
    } catch (e) {
      // Fallback
    }
    return [
      MealPlan(id: 'mp1', userId: 'user-1', recipeId: 'b-1', day: 'Monday', mealType: 'Breakfast', recipeTitle: 'Classic Egg Toast', imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', calories: 280, completed: false, status: 'PLANNED'),
      MealPlan(id: 'mp2', userId: 'user-1', recipeId: 'r-2', day: 'Monday', mealType: 'Lunch', recipeTitle: 'Golden Egg Fried Rice', imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80', calories: 410, completed: true, status: 'COMPLETED'),
    ];
  }

  // Add Meal Plan
  Future<bool> addMealPlan(Map<String, dynamic> planData) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/meal-plans'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(planData),
      ).timeout(const Duration(seconds: 4));
      return response.statusCode == 200;
    } catch (e) {
      return true;
    }
  }

  // Complete Meal Plan
  Future<bool> completeMealPlan(String id) async {
    try {
      final response = await http.post(Uri.parse('$baseUrl/meal-plans/$id/complete')).timeout(const Duration(seconds: 4));
      return response.statusCode == 200;
    } catch (e) {
      return true;
    }
  }
}
