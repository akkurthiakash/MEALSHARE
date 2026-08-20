class RecipeIngredient {
  final String id;
  final String name;
  final double quantity;
  final String unit;

  RecipeIngredient({
    required this.id,
    required this.name,
    required this.quantity,
    required this.unit,
  });

  factory RecipeIngredient.fromJson(Map<String, dynamic> json) {
    return RecipeIngredient(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      quantity: (json['quantity'] as num?)?.toDouble() ?? 1.0,
      unit: json['unit'] ?? 'pcs',
    );
  }
}

class Recipe {
  final String id;
  final String title;
  final String description;
  final String category;
  final String mealType;
  final String imageUrl;
  final int prepTimeMinutes;
  final int cookTimeMinutes;
  final int calories;
  final int proteinGrams;
  final int carbsGrams;
  final int fatGrams;
  final int servings;
  final String difficulty;
  final List<RecipeIngredient> ingredients;
  final List<String> instructions;

  Recipe({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.mealType,
    required this.imageUrl,
    required this.prepTimeMinutes,
    required this.cookTimeMinutes,
    required this.calories,
    required this.proteinGrams,
    required this.carbsGrams,
    required this.fatGrams,
    required this.servings,
    required this.difficulty,
    required this.ingredients,
    required this.instructions,
  });

  factory Recipe.fromJson(Map<String, dynamic> json) {
    return Recipe(
      id: json['id'] ?? '',
      title: json['title'] ?? json['name'] ?? 'Tasty Dish',
      description: json['description'] ?? '',
      category: json['category'] ?? 'General',
      mealType: json['mealType'] ?? 'Lunch',
      imageUrl: json['imageUrl'] ?? '',
      prepTimeMinutes: json['prepTimeMinutes'] ?? 10,
      cookTimeMinutes: json['cookTimeMinutes'] ?? 15,
      calories: json['calories'] ?? 350,
      proteinGrams: json['proteinGrams'] ?? 15,
      carbsGrams: json['carbsGrams'] ?? 45,
      fatGrams: json['fatGrams'] ?? 10,
      servings: json['servings'] ?? 2,
      difficulty: json['difficulty'] ?? 'Easy',
      ingredients: (json['ingredients'] as List<dynamic>?)
              ?.map((i) => RecipeIngredient.fromJson(i))
              .toList() ??
          [],
      instructions: (json['instructions'] as List<dynamic>?)
              ?.map((i) => i.toString())
              .toList() ??
          [],
    );
  }
}
