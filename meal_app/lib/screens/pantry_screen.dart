import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/pantry_item.dart';
import '../theme/app_theme.dart';

class PantryScreen extends StatefulWidget {
  const PantryScreen({Key? key}) : super(key: key);

  @override
  State<PantryScreen> createState() => _PantryScreenState();
}

class _PantryScreenState extends State<PantryScreen> {
  final ApiService _apiService = ApiService();
  bool _isLoading = true;
  List<PantryItem> _pantryItems = [];
  String _selectedCategory = 'All';

  final List<String> _categories = ['All', 'Dairy', 'Vegetables', 'Meat', 'Pantry', 'Fruit'];

  @override
  void initState() {
    super.initState();
    _loadPantry();
  }

  Future<void> _loadPantry() async {
    setState(() => _isLoading = true);
    final items = await _apiService.fetchPantry(category: _selectedCategory);
    setState(() {
      _pantryItems = items;
      _isLoading = false;
    });
  }

  void _showAddItemModal() {
    final nameController = TextEditingController();
    final qtyController = TextEditingController(text: '1');
    final unitController = TextEditingController(text: 'pcs');
    final expiryController = TextEditingController(text: '2026-08-25');
    String category = 'Dairy';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom + 20,
            left: 20,
            right: 20,
            top: 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Add Pantry Item 📦', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              TextField(
                controller: nameController,
                decoration: const InputDecoration(labelText: 'Item Name (e.g. Organic Eggs)', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: qtyController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'Quantity', border: OutlineInputBorder()),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: TextField(
                      controller: unitController,
                      decoration: const InputDecoration(labelText: 'Unit (e.g. pcs, g)', border: OutlineInputBorder()),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              TextField(
                controller: expiryController,
                decoration: const InputDecoration(labelText: 'Expiry Date (YYYY-MM-DD)', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primary),
                  onPressed: () async {
                    if (nameController.text.isEmpty) return;
                    await _apiService.addPantryItem({
                      'name': nameController.text,
                      'category': category,
                      'quantity': double.tryParse(qtyController.text) ?? 1.0,
                      'unit': unitController.text,
                      'expiryDate': expiryController.text,
                    });
                    Navigator.pop(context);
                    _loadPantry();
                  },
                  child: const Text('Save to Pantry', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppTheme.primary,
        onPressed: _showAddItemModal,
        child: const Icon(Icons.add, color: Colors.white),
      ),
      body: Column(
        children: [
          // Category Selector
          Container(
            height: 50,
            margin: const EdgeInsets.symmetric(vertical: 10),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _categories.length,
              itemBuilder: (context, index) {
                final cat = _categories[index];
                final isSelected = cat == _selectedCategory;
                return GestureDetector(
                  onTap: () {
                    setState(() => _selectedCategory = cat);
                    _loadPantry();
                  },
                  child: Container(
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    decoration: BoxDecoration(
                      color: isSelected ? AppTheme.primary : AppTheme.cardBg,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: isSelected ? AppTheme.primary : AppTheme.border),
                    ),
                    child: Center(
                      child: Text(
                        cat,
                        style: TextStyle(
                          color: isSelected ? Colors.white : AppTheme.textSecondary,
                          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          // Pantry Items List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: AppTheme.primary))
                : _pantryItems.isEmpty
                    ? const Center(
                        child: Text(
                          'Your pantry is empty. Tap + to add items!',
                          style: TextStyle(color: AppTheme.textSecondary),
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _loadPantry,
                        color: AppTheme.primary,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: _pantryItems.length,
                          itemBuilder: (context, index) {
                            final item = _pantryItems[index];
                            Color statusColor = AppTheme.success;
                            if (item.status == 'EXPIRING_SOON') statusColor = AppTheme.warning;
                            if (item.status == 'EXPIRED') statusColor = AppTheme.danger;

                            return Card(
                              margin: const EdgeInsets.only(bottom: 12),
                              child: ListTile(
                                leading: CircleAvatar(
                                  backgroundColor: statusColor.withOpacity(0.2),
                                  child: Icon(Icons.kitchen, color: statusColor),
                                ),
                                title: Text(item.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                                subtitle: Text('${item.quantity} ${item.unit} • Expires: ${item.expiryDate}'),
                                trailing: IconButton(
                                  icon: const Icon(Icons.delete_outline, color: AppTheme.danger),
                                  onPressed: () async {
                                    await _apiService.deletePantryItem(item.id);
                                    _loadPantry();
                                  },
                                ),
                              ),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}
