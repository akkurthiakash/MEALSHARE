'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Trash2, 
  UserCheck, 
  UserX, 
  X, 
  Shield, 
  Calendar, 
  Activity, 
  Package, 
  CheckCircle2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getStoredMealPlans, getCompletedMealHistory } from '../../../lib/plannerStorage';
import { getPantryItems } from '../../../lib/db';

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'Active' | 'Disabled';
  dietPlan: string;
  calorieTarget: number;
  createdAt: string;
}

const INITIAL_USERS: AdminUserRecord[] = [
  { id: 'u-1', name: 'System Admin', email: 'akkurthiakash2@gmail.com', role: 'admin', status: 'Active', dietPlan: 'Balanced', calorieTarget: 2200, createdAt: '2026-01-01' },
  { id: 'u-2', name: 'Chef Akash', email: 'akash@mealshare.com', role: 'user', status: 'Active', dietPlan: 'High Protein', calorieTarget: 2000, createdAt: '2026-02-10' },
  { id: 'u-3', name: 'Sarah Miller', email: 'sarah@example.com', role: 'user', status: 'Active', dietPlan: 'Keto', calorieTarget: 1800, createdAt: '2026-02-12' },
  { id: 'u-4', name: 'David Chen', email: 'david@example.com', role: 'user', status: 'Active', dietPlan: 'Vegan', calorieTarget: 1900, createdAt: '2026-02-15' },
  { id: 'u-5', name: 'Emma Watson', email: 'emma@example.com', role: 'user', status: 'Disabled', dietPlan: 'Balanced', calorieTarget: 2000, createdAt: '2026-02-16' }
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Disabled'>('All');
  
  // Selected user for modal profile
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);

  // Delete Confirmation Modal
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<AdminUserRecord | null>(null);

  // Real Database Counts for active user
  const [userPlannedCount, setUserPlannedCount] = useState(0);
  const [userCompletedCount, setUserCompletedCount] = useState(0);
  const [userPantryCount, setUserPantryCount] = useState(0);

  useEffect(() => {
    setUserPlannedCount(getStoredMealPlans().length);
    setUserCompletedCount(getCompletedMealHistory().length);
    getPantryItems().then(items => setUserPantryCount(items.length));
  }, []);

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Disabled' : 'Active';
        toast.success(`Account status for ${u.name} updated to ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleDeleteUser = () => {
    if (!deleteConfirmUser) return;
    setUsers(users.filter(u => u.id !== deleteConfirmUser.id));
    toast.success(`User account "${deleteConfirmUser.name}" deleted permanently.`);
    setDeleteConfirmUser(null);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 font-serif">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center space-x-3">
          <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          <span>User Management</span>
        </h1>
        <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-1">
          Search, manage account status, review diet targets, and inspect user activity profiles.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-black uppercase text-slate-500">Status:</span>
          {(['All', 'Active', 'Disabled'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase transition-all ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-bold">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">User Profile</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Diet Target</th>
                <th className="py-4 px-6">Activity (Planned / Completed)</th>
                <th className="py-4 px-6">Joined</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  
                  {/* Name & Email */}
                  <td className="py-4 px-6">
                    <div>
                      <span className="text-base font-black text-slate-900 dark:text-white block">{u.name}</span>
                      <span className="text-xs text-slate-500 font-mono font-medium">{u.email}</span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      u.role === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      u.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {u.status}
                    </span>
                  </td>

                  {/* Diet Plan */}
                  <td className="py-4 px-6">
                    <div>
                      <span className="text-slate-900 dark:text-white font-black block">{u.dietPlan}</span>
                      <span className="text-xs text-slate-500 font-bold">{u.calorieTarget} kcal/day</span>
                    </div>
                  </td>

                  {/* Activity */}
                  <td className="py-4 px-6">
                    <span className="text-slate-900 dark:text-white font-black">
                      {userPlannedCount} planned / {userCompletedCount} done
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="py-4 px-6 text-slate-500 text-xs font-bold">{u.createdAt}</td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="p-2 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 bg-slate-100 dark:bg-slate-800 rounded-xl transition-colors"
                      title="View Detailed Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        u.status === 'Active' ? 'text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40' : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                      }`}
                      title={u.status === 'Active' ? 'Disable User' : 'Enable User'}
                    >
                      {u.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>

                    {u.role !== 'admin' && (
                      <button
                        onClick={() => setDeleteConfirmUser(u)}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED USER PROFILE MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white font-black text-2xl flex items-center justify-center">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{selectedUser.name}</h2>
                <span className="text-xs text-slate-500 font-mono font-bold">{selectedUser.email}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm font-bold">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <span className="text-xs text-slate-500 font-normal uppercase block">Account Status</span>
                <span className="text-emerald-600 font-black">{selectedUser.status}</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <span className="text-xs text-slate-500 font-normal uppercase block">Diet Profile</span>
                <span className="text-slate-900 dark:text-white font-black">{selectedUser.dietPlan} ({selectedUser.calorieTarget} kcal)</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <span className="text-xs text-slate-500 font-normal uppercase block">Planned Meals</span>
                <span className="text-slate-900 dark:text-white font-black">{userPlannedCount} Meals</span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                <span className="text-xs text-slate-500 font-normal uppercase block">Completed History</span>
                <span className="text-slate-900 dark:text-white font-black">{userCompletedCount} Meals</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full py-3 bg-slate-900 dark:bg-slate-800 text-white font-black text-xs uppercase rounded-2xl"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-center">
            <Shield className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Delete User Account?</h3>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email})? This action cannot be undone.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmUser(null)}
                className="w-1/2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="w-1/2 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-rose-600/30"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
