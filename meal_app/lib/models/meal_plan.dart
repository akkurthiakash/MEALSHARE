class MealPlan {
  final String id;
  final String userId;
  final String recipeId;
  final String day;
  final String mealType;
  final String recipeTitle;
  final String imageUrl;
  final int calories;
  final bool completed;
  final String status;

  MealPlan({
    required this.id,
    required this.userId,
    required this.recipeId,
    required this.day,
    required this.mealType,
    required this.recipeTitle,
    required this.imageUrl,
    required this.calories,
    required this.completed,
    required this.status,
  });

  factory MealPlan.fromJson(Map<String, dynamic> json) {
    return MealPlan(
      id: json['id'] ?? '',
      userId: json['userId'] ?? '',
      recipeId: json['recipeId'] ?? '',
      day: json['day'] ?? 'Monday',
      mealType: json['mealType'] ?? 'Lunch',
      recipeTitle: json['recipeTitle'] ?? 'Meal Plan Dish',
      imageUrl: json['imageUrl'] ?? '',
      calories: json['calories'] ?? 400,
      completed: json['completed'] ?? false,
      status: json['status'] ?? 'PLANNED',
    );
  }
}
