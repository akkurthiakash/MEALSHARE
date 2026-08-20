import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  || (process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, '')}/api` : 'http://localhost:5000/api');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Health
  async checkHealth() {
    try {
      const res = await apiClient.get('/health/database');
      return res.data;
    } catch (e) {
      return null;
    }
  },

  // Pantry
  async fetchPantry(category?: string) {
    try {
      const res = await apiClient.get('/pantry', { params: { category } });
      return res.data;
    } catch (e) {
      return [];
    }
  },

  async addPantryItem(item: any) {
    const res = await apiClient.post('/pantry', item);
    return res.data;
  },

  async deletePantryItem(id: string) {
    const res = await apiClient.delete(`/pantry/${id}`);
    return res.data;
  },

  // Recipes
  async fetchRecipes(search?: string, category?: string, mealType?: string) {
    try {
      const res = await apiClient.get('/recipes', { params: { search, category, mealType } });
      return res.data;
    } catch (e) {
      return [];
    }
  },

  async fetchRecommendations() {
    try {
      const res = await apiClient.get('/recipes/recommendations');
      return res.data;
    } catch (e) {
      return [];
    }
  },

  // Meal Plans
  async fetchMealPlans() {
    try {
      const res = await apiClient.get('/meal-plans');
      return res.data;
    } catch (e) {
      return [];
    }
  },

  async addMealPlan(plan: any) {
    const res = await apiClient.post('/meal-plans', plan);
    return res.data;
  },

  async completeMealPlan(id: string) {
    const res = await apiClient.post(`/meal-plans/${id}/complete`);
    return res.data;
  },

  // Diet Goals
  async fetchDietGoals() {
    try {
      const res = await apiClient.get('/diet-goals');
      return res.data;
    } catch (e) {
      return null;
    }
  },

  async updateDietGoals(goals: any) {
    const res = await apiClient.post('/diet-goals', goals);
    return res.data;
  },

  // User Profile
  async fetchProfile() {
    try {
      const res = await apiClient.get('/profile');
      return res.data;
    } catch (e) {
      return null;
    }
  }
};
