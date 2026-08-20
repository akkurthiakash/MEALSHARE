class User {
  final String id;
  final String email;
  final String name;
  final String role; // 'user' | 'admin'

  User({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? json['uid'] ?? '',
      email: json['email'] ?? '',
      name: json['name'] ?? json['displayName'] ?? 'User',
      role: json['role'] ?? 'user',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'role': role,
    };
  }
}

class PantryItem {
  final String id;
  final String name;
  final String category;
  final double quantity;
  final String unit;
  final String expiryDate;
  final String status; // 'fresh' | 'use_soon' | 'expired'

  PantryItem({
    required this.id,
    required this.name,
    required this.category,
    required this.quantity,
    required this.unit,
    required this.expiryDate,
    required this.status,
  });

  factory PantryItem.fromJson(Map<String, dynamic> json) {
    return PantryItem(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      category: json['category'] ?? 'General',
      quantity: (json['quantity'] as num?)?.toDouble() ?? 1.0,
      unit: json['unit'] ?? 'pcs',
      expiryDate: json['expiryDate'] ?? '',
      status: json['status'] ?? 'fresh',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'quantity': quantity,
      'unit': unit,
      'expiryDate': expiryDate,
      'status': status,
    };
  }
}

class Recipe {
  final String id;
  final String title;
  final String description;
  final int prepTimeMinutes;
  final int cookTimeMinutes;
  final int calories;
  final int proteinGrams;
  final int carbsGrams;
  final int fatGrams;
  final int matchPercentage;

  Recipe({
    required this.id,
    required this.title,
    required this.description,
    required this.prepTimeMinutes,
    required this.cookTimeMinutes,
    required this.calories,
    required this.proteinGrams,
    required this.carbsGrams,
    required this.fatGrams,
    this.matchPercentage = 100,
  });

  factory Recipe.fromJson(Map<String, dynamic> json) {
    return Recipe(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      prepTimeMinutes: json['prepTimeMinutes'] ?? 10,
      cookTimeMinutes: json['cookTimeMinutes'] ?? 15,
      calories: json['calories'] ?? 0,
      proteinGrams: json['proteinGrams'] ?? 0,
      carbsGrams: json['carbsGrams'] ?? 0,
      fatGrams: json['fatGrams'] ?? 0,
      matchPercentage: json['matchPercentage'] ?? 100,
    );
  }
}
