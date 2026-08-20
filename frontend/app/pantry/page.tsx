'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Trash2, 
  Search, 
  Clock, 
  X, 
  Utensils,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { 
  getPantryItems, 
  addPantryItem, 
  deletePantryItem, 
  PantryItem, 
  getFoodCatalog, 
  CatalogFoodItem,
  getIngredientImage,
  MASTER_CATEGORIES,
  MasterCategory,
  toNormalizedName,
  CATEGORY_FALLBACK_IMAGES
} from '../../lib/db';
import { useSearchParams } from 'next/navigation';

function PantryContent() {
  const searchParams = useSearchParams();
  const initialStatusParam = searchParams.get('status');
  
  const initialStatus: 'all' | 'fresh' | 'use_soon' | 'expired' = 
    initialStatusParam === 'use-soon' || initialStatusParam === 'use_soon' 
      ? 'use_soon' 
      : initialStatusParam === 'fresh' 
      ? 'fresh' 
      : initialStatusParam === 'expired' 
      ? 'expired' 
      : 'all';

  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [catalog, setCatalog] = useState<CatalogFoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'fresh' | 'use_soon' | 'expired'>(initialStatus);

  // Selection for multi-recipe search
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Pagination (24 items per page for ultra fast UI performance)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  // Add Item Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<CatalogFoodItem | null>(null);
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MasterCategory>('Vegetables');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pcs');
  const [expiryDate, setExpiryDate] = useState('');

  const loadData = async () => {
    setLoading(true);
    const [items, catData] = await Promise.all([getPantryItems(), getFoodCatalog()]);
    setPantryItems(items);
    setCatalog(catData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectCatalogItem = (item: CatalogFoodItem) => {
    setSelectedCatalogItem(item);
    setName(item.name);
    setCategory(item.category);
    setUnit(item.defaultUnit || 'pcs');
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !expiryDate) {
      toast.error('Please enter ingredient name and expiry date');
      return;
    }

    try {
      const rawImg = selectedCatalogItem?.imageUrl || getIngredientImage(name, category);
      const catalogId = selectedCatalogItem?.id || ('ing-' + toNormalizedName(name));
      const aliases = selectedCatalogItem?.aliases || [name.toLowerCase()];

      const newItem = await addPantryItem({
        name,
        category,
        quantity: Number(quantity),
        unit,
        expiryDate,
        imageUrl: rawImg,
        aliases,
        catalogId
      });

      setPantryItems([newItem, ...pantryItems.filter(i => i.id !== newItem.id)]);
      toast.success(`"${name}" added to your pantry!`);
      setShowAddModal(false);
      
      // Reset form
      setName('');
      setSelectedCatalogItem(null);
      setCatalogSearch('');
      setQuantity(1);
      setExpiryDate('');
    } catch (err) {
      toast.error('Failed to add pantry item');
    }
  };

  const handleDelete = async (id: string, itemName: string) => {
    try {
      await deletePantryItem(id);
      setPantryItems(pantryItems.filter(i => i.id !== id));
      toast.success(`"${itemName}" removed from pantry`);
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const toggleSelectItem = (itemName: string) => {
    const next = new Set(selectedItems);
    if (next.has(itemName)) next.delete(itemName);
    else next.add(itemName);
    setSelectedItems(next);
  };

  // Search Logic (matches Name, Category, or Aliases case-insensitively)
  const filteredItems = pantryItems.filter(item => {
    const term = searchQuery.toLowerCase().trim();
    const matchesSearch = !term || 
      item.name.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      (item.aliases && item.aliases.some(a => a.toLowerCase().includes(term)));

    const matchesCategory = activeCategory === 'All' || item.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filteredCatalogOptions = catalog.filter(cat => {
    if (!catalogSearch) return true;
    const term = toNormalizedName(catalogSearch);
    return cat.normalizedName.includes(term) || 
           cat.name.toLowerCase().includes(term) ||
           (cat.aliases && cat.aliases.some(a => a.toLowerCase().includes(term)));
  }).slice(0, 12);

  const selectedIngredientsQuery = Array.from(selectedItems).join(',');

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 text-[#0F172A] dark:text-slate-100 font-serif">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-white tracking-tight uppercase flex items-center space-x-3">
            <Package className="w-8 h-8 text-[#059669]" />
            <span>MealShare Pantry Inventory</span>
          </h1>
          <p className="text-sm font-bold text-[#475569] dark:text-slate-400 mt-1">
            Browse and manage 300+ pantry items connected to Firebase Firestore ({pantryItems.length} stocked items).
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          {selectedItems.size > 0 && (
            <Link
              href={`/recipes?ingredients=${encodeURIComponent(selectedIngredientsQuery)}`}
              className="flex items-center space-x-2 px-5 py-3.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-600/30 transition-all"
            >
              <Utensils className="w-4 h-4" />
              <span>Find Recipes ({selectedItems.size})</span>
            </Link>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-full bg-[#059669] hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-700/30 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pantry Item</span>
          </button>
        </div>
      </div>

      {/* Search & 20 Category Filter Bar */}
      <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 p-4 sm:p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#475569] absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search pantry (e.g. Mutton, Tomato)..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] text-xs font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
            <span className="text-[11px] font-bold uppercase text-[#475569] shrink-0 mr-1">Status:</span>
            {(['all', 'fresh', 'use_soon', 'expired'] as const).map(st => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase whitespace-nowrap shrink-0 transition-all ${
                  statusFilter === st
                    ? 'bg-[#059669] text-white shadow-sm font-black'
                    : 'bg-[#F8EFE7] dark:bg-slate-800 text-[#475569] hover:bg-[#E2D9D0]'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* 20 Exact Category Filter Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar border-t border-[#E2D9D0] dark:border-slate-800 pt-3">
          {['All', ...MASTER_CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase whitespace-nowrap shrink-0 transition-all ${
                activeCategory === cat
                  ? 'bg-[#059669] text-white shadow-sm font-black'
                  : 'bg-[#F8EFE7] dark:bg-slate-800 text-[#475569] hover:bg-[#E2D9D0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pantry Grid with 24 items per page */}
      {filteredItems.length === 0 ? (
        <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl p-12 text-center space-y-3 shadow-sm">
          <Package className="w-12 h-12 text-[#475569] mx-auto" />
          <h3 className="text-xl font-black text-[#0F172A] dark:text-white uppercase">No pantry items found</h3>
          <p className="text-sm font-bold text-[#475569] max-w-sm mx-auto">
            {searchQuery || activeCategory !== 'All' ? 'No stocked items match your active search or category filter.' : 'Add items to your pantry inventory.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedItems.map(item => {
            const fallbackImg = CATEGORY_FALLBACK_IMAGES[item.category as MasterCategory] || CATEGORY_FALLBACK_IMAGES['Vegetables'];
            const rawImg = item.imageUrl || getIngredientImage(item.name, item.category);
            const isExpired = item.status === 'expired';
            const isUseSoon = item.status === 'use_soon';
            const isSelected = selectedItems.has(item.name);

            return (
              <div
                key={item.id}
                className={`bg-[#FFFDF9] dark:bg-slate-900 border rounded-3xl p-5 shadow-sm flex flex-col justify-between space-y-4 transition-all relative ${
                  isSelected ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-[#E2D9D0] dark:border-slate-800 hover:border-[#059669]'
                }`}
              >
                <div className="space-y-3">
                  <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-[#FDF7F2] border border-[#E2D9D0]">
                    <img
                      src={rawImg}
                      alt={item.name}
                      onError={(e) => { (e.target as HTMLImageElement).src = fallbackImg; }}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />

                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectItem(item.name)}
                      className="absolute top-2.5 left-2.5 w-5 h-5 accent-amber-600 rounded cursor-pointer z-10"
                      title="Select for recipe search"
                    />

                    <span className={`absolute top-2.5 right-2.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isExpired 
                        ? 'bg-rose-600 text-white' 
                        : isUseSoon 
                        ? 'bg-[#FF5722] text-white animate-pulse' 
                        : 'bg-[#059669] text-white'
                    }`}>
                      {item.status?.replace('_', ' ') || 'FRESH'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#FF5722] block truncate">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-black text-[#0F172A] dark:text-white truncate">
                      {item.name}
                    </h3>
                  </div>

                  <div className="bg-[#FDF7F2] dark:bg-slate-800 p-3 rounded-2xl border border-[#E2D9D0] flex items-center justify-between text-xs font-bold">
                    <span className="text-[#475569] uppercase">Quantity:</span>
                    <span className="text-[#0F172A] dark:text-white font-black">{item.quantity} {item.unit}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2D9D0] flex items-center justify-between">
                  <Link
                    href={`/recipes?ingredient=${encodeURIComponent(item.name)}`}
                    className="text-xs font-black text-amber-600 dark:text-amber-400 hover:underline flex items-center space-x-1"
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Find Recipes</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Delete Pantry Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-between bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 p-4 rounded-3xl shadow-sm">
        <span className="text-xs font-bold text-slate-500">
          Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} pantry items
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

      {/* ADD PANTRY ITEM MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-[#FFFDF9] dark:bg-slate-900 border border-[#E2D9D0] dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E2D9D0] pb-3">
              <div>
                <h3 className="text-xl font-black text-[#0F172A] dark:text-white uppercase">Add Pantry Ingredient</h3>
                <p className="text-xs font-bold text-slate-500">Pick from 500+ Master Catalog items or enter custom details.</p>
              </div>
              <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-[#475569]">Search Master Catalog</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Type to search master catalog (e.g. Mutton, Tomato, Milk)..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border">
                {filteredCatalogOptions.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCatalogItem(cat)}
                    className={`flex items-center space-x-2 p-1.5 rounded-xl border text-left transition-all ${
                      selectedCatalogItem?.id === cat.id
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-black'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-400'
                    }`}
                  >
                    <img src={cat.imageUrl} alt={cat.name} className="w-7 h-7 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-bold block truncate">{cat.name}</span>
                      <span className="text-[9px] text-slate-400 block truncate">{cat.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddItem} className="space-y-3 font-bold">
              <div>
                <label className="text-xs font-black uppercase text-[#475569]">Selected Ingredient Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mutton Curry Cut"
                  className="w-full p-3 rounded-2xl bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] text-sm mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase text-[#475569]">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as MasterCategory)}
                    className="w-full p-3 rounded-2xl bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] text-sm mt-1"
                  >
                    {MASTER_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-[#475569]">Unit</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="pcs / kg / g / L"
                    className="w-full p-3 rounded-2xl bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] text-sm mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase text-[#475569]">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-3 rounded-2xl bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-[#475569]">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-[#FDF7F2] dark:bg-slate-800 border border-[#E2D9D0] text-sm mt-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#059669] hover:bg-emerald-700 text-white font-black text-sm uppercase rounded-2xl shadow-md mt-2"
              >
                Save Pantry Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PantryPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center font-bold">Loading Pantry Inventory...</div>}>
      <PantryContent />
    </React.Suspense>
  );
}
