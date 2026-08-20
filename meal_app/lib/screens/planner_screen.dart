import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/meal_plan.dart';
import '../theme/app_theme.dart';

class PlannerScreen extends StatefulWidget {
  const PlannerScreen({Key? key}) : super(key: key);

  @override
  State<PlannerScreen> createState() => _PlannerScreenState();
}

class _PlannerScreenState extends State<PlannerScreen> {
  final ApiService _apiService = ApiService();
  bool _isLoading = true;
  List<MealPlan> _mealPlans = [];

  @override
  void initState() {
    super.initState();
    _loadPlans();
  }

  Future<void> _loadPlans() async {
    setState(() => _isLoading = true);
    final plans = await _apiService.fetchMealPlans();
    setState(() {
      _mealPlans = plans;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return _isLoading
        ? const Center(child: CircularProgressIndicator(color: AppTheme.primary))
        : _mealPlans.isEmpty
            ? const Center(
                child: Text('No meal plans yet for this week.', style: TextStyle(color: AppTheme.textSecondary)),
              )
            : RefreshIndicator(
                onRefresh: _loadPlans,
                color: AppTheme.primary,
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _mealPlans.length,
                  itemBuilder: (context, index) {
                    final plan = _mealPlans[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: plan.completed ? AppTheme.success.withOpacity(0.2) : AppTheme.primary.withOpacity(0.2),
                          child: Icon(
                            plan.completed ? Icons.check_circle : Icons.restaurant_menu,
                            color: plan.completed ? AppTheme.success : AppTheme.primary,
                          ),
                        ),
                        title: Text(plan.recipeTitle, style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text('${plan.day} • ${plan.mealType} • ${plan.calories} kcal'),
                        trailing: IconButton(
                          icon: Icon(
                            plan.completed ? Icons.check_box : Icons.check_box_outline_blank,
                            color: plan.completed ? AppTheme.success : AppTheme.textSecondary,
                          ),
                          onPressed: () async {
                            if (!plan.completed) {
                              await _apiService.completeMealPlan(plan.id);
                              _loadPlans();
                            }
                          },
                        ),
                      ),
                    );
                  },
                ),
              );
  }
}
