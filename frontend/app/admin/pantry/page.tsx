'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  getFoodCatalog, 
  CatalogFoodItem, 
  getIngredientImage, 
  MASTER_CATEGORIES, 
  MasterCategory,
  toNormalizedName,
  seedDatabaseIdempotent
} from '../../../lib/db';

export default function AdminPantryPage() {
  const [catalog, setCatalog] = useState<CatalogFoodItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  // Pagination (Requirement 37)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Add / Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MasterCategory>('Vegetables');
  const [imageUrl, setImageUrl] = useState('');
  const [defaultUnit, setDefaultUnit] = useState('pcs');

  // Delete modal
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<CatalogFoodItem | null>(null);

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    setLoading(true);
    const data = await getFoodCatalog();
    setCatalog(data);
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setCategory('Vegetables');
    setImageUrl('');
    setDefaultUnit('pcs');
    setShowModal(true);
  };

  const handleOpenEdit = (item: CatalogFoodItem) => {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category as MasterCategory);
    setImageUrl(item.imageUrl);
    setDefaultUnit(item.defaultUnit || 'pcs');
    setShowModal(true);
  };

  const handleSaveIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const rawImg = imageUrl.trim() || getIngredientImage(name);
    const norm = toNormalizedName(name);

    if (editingId) {
      setCatalog(catalog.map(c => {
        if (c.id === editingId) {
          return {
            ...c,
            name: name.trim(),
            normalizedName: norm,
            category: category as MasterCategory,
            imageUrl: rawImg,
            defaultUnit
          };
        }
        return c;
      }));
      toast.success(`Catalog ingredient "${name}" updated!`);
    } else {
      const newItem: CatalogFoodItem = {
        id: 'ing-' + norm.replace(/\s+/g, '-'),
        name: name.trim(),
        normalizedName: norm,
        category: category as MasterCategory,
        imageUrl: rawImg,
        defaultUnit
      };
      setCatalog([newItem, ...catalog.filter(c => c.normalizedName !== norm)]);
      toast.success(`Catalog ingredient "${name}" added to master database!`);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (!deleteConfirmItem) return;
    setCatalog(catalog.filter(c => c.id !== deleteConfirmItem.id));
    toast.success(`Ingredient "${deleteConfirmItem.name}" deleted.`);
    setDeleteConfirmItem(null);
  };

  const handleReSeedDatabase = async () => {
    const toastId = toast.loading('Re-seeding database idempotently...');
    const result = await seedDatabaseIdempotent();
    await loadCatalog();
    toast.success(`Database re-seeded! ${result.catalogSeeded} master ingredients active.`, { id: toastId });
  };

  // Filter Catalog
  const filteredCatalog = catalog.filter(item => {
    const term = toNormalizedName(searchQuery);
    const matchesSearch = !term || item.normalizedName.includes(term) || item.name.toLowerCase().includes(term);
    const matchesCategory = categoryFilter === 'All' || item.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Calculate Pagination
  const totalPages = Math.ceil(filteredCatalog.length / itemsPerPage) || 1;
  const paginatedCatalog = filteredCatalog.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8 font-serif">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center space-x-3">
            <Package className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            <span>Master Ingredient Database</span>
          </h1>
          <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mt-1">
            Master catalog containing 500+ genuinely unique ingredients categorized across 18 exact food categories.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleReSeedDatabase}
            className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all"
            title="Idempotent Database Seed"
          >
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            <span>Seed/Clean DB</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-700/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Master Ingredient</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search 500+ master ingredients by name, category, or keyword..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-3 text-xs font-bold text-slate-500">
            <span>Total Ingredients:</span>
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-sm">
              {catalog.length} Unique Records
            </span>
          </div>
        </div>

        {/* 18 Categories Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 border-t border-slate-100 dark:border-slate-800 pt-3">
          {['All', ...MASTER_CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => { setCategoryFilter(cat); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold uppercase whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-emerald-600 text-white shadow-sm font-black'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grid with 24 items per page */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedCatalog.map(item => (
          <div key={item.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl flex items-center justify-between space-x-3 hover:border-emerald-500 transition-colors shadow-sm">
            <div className="flex items-center space-x-3 min-w-0">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-800 bg-slate-900"
              />
              <div className="min-w-0">
                <h3 className="text-base font-black text-slate-900 dark:text-white truncate">{item.name}</h3>
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 block">{item.category}</span>
                <span className="text-[11px] font-bold text-slate-400 block">Unit: {item.defaultUnit || 'pcs'}</span>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <button
                onClick={() => handleOpenEdit(item)}
                className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                title="Edit master ingredient"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setDeleteConfirmItem(item)}
                className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                title="Delete ingredient"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
        <span className="text-xs font-bold text-slate-500">
          Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredCatalog.length)} of {filteredCatalog.length} ingredients
        </span>

        <div className="flex items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 disabled:opacity-40 font-bold text-xs flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <span className="text-xs font-black text-slate-700 dark:text-slate-300 px-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="p-2 rounded-xl border bg-slate-50 dark:bg-slate-800 disabled:opacity-40 font-bold text-xs flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {editingId ? 'Edit Master Ingredient' : 'Add Master Ingredient'}
              </h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSaveIngredient} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-500">Ingredient Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Tomato" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-sm font-bold mt-1" />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as MasterCategory)} className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-sm font-bold mt-1">
                  {MASTER_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500">Default Unit</label>
                <input type="text" required value={defaultUnit} onChange={(e) => setDefaultUnit(e.target.value)} placeholder="pcs / kg / g / L" className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-sm font-bold mt-1" />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500">Raw Ingredient Photo URL</label>
                <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-sm font-bold mt-1" />
              </div>

              <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase rounded-2xl shadow-lg shadow-emerald-700/30">
                Save Ingredient
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-center">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Delete Master Ingredient?</h3>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{deleteConfirmItem.name}</strong> from the master food catalog?
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <button onClick={() => setDeleteConfirmItem(null)} className="w-1/2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl">
                Cancel
              </button>
              <button onClick={handleDelete} className="w-1/2 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-rose-600/30">
                Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
