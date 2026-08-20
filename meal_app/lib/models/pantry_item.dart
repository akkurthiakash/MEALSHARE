class PantryItem {
  final String id;
  final String userId;
  final String catalogId;
  final String name;
  final String category;
  final double quantity;
  final String unit;
  final String expiryDate;
  final String imageUrl;
  final String status;

  PantryItem({
    required this.id,
    required this.userId,
    required this.catalogId,
    required this.name,
    required this.category,
    required this.quantity,
    required this.unit,
    required this.expiryDate,
    required this.imageUrl,
    required this.status,
  });

  factory PantryItem.fromJson(Map<String, dynamic> json) {
    return PantryItem(
      id: json['id'] ?? '',
      userId: json['userId'] ?? '',
      catalogId: json['catalogId'] ?? '',
      name: json['name'] ?? '',
      category: json['category'] ?? 'General',
      quantity: (json['quantity'] as num?)?.toDouble() ?? 1.0,
      unit: json['unit'] ?? 'pcs',
      expiryDate: json['expiryDate'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
      status: json['status'] ?? 'FRESH',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'catalogId': catalogId,
      'name': name,
      'category': category,
      'quantity': quantity,
      'unit': unit,
      'expiryDate': expiryDate,
      'imageUrl': imageUrl,
      'status': status,
    };
  }
}
