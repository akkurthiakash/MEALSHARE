'use client';

import React from 'react';
import { PantryItem, getIngredientImage } from '../lib/db';
import { Clock, CheckCircle2, XCircle, Trash2, Tag, Utensils } from 'lucide-react';

interface PantryCardProps {
  item: PantryItem;
  onDelete: (id: string) => void;
}

export default function PantryCard({ item, onDelete }: PantryCardProps) {
  const getBadgeStyle = (status?: string) => {
    switch (status) {
      case 'expired':
        return {
          bg: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
          icon: XCircle,
          label: 'Expired'
        };
      case 'use_soon':
        return {
          bg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
          icon: Clock,
          label: 'Use Soon'
        };
      default:
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
          icon: CheckCircle2,
          label: 'Fresh'
        };
    }
  };

  const badge = getBadgeStyle(item.status);
  const StatusIcon = badge.icon;

  // Resolve strict ingredient image based on ingredient entity
  const ingredientImage = getIngredientImage(item.catalogId || item.name);
  const displayImg = item.imageUrl && item.imageUrl.trim() !== '' ? item.imageUrl : ingredientImage;

  return (
    <div className="group relative bg-[#f0ebe1] dark:bg-slate-900 border border-[#e2dcd0] dark:border-slate-800 hover:border-emerald-600/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 font-serif flex flex-col justify-between">
      <div>
        {/* Card Image Header */}
        <div className="relative h-44 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <img
            src={displayImg}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = ingredientImage;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
          
          <button
            onClick={() => onDelete(item.id)}
            className="absolute top-3 right-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-2 text-slate-700 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-full transition-all shadow-sm"
            title="Delete item"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full border backdrop-blur-md text-xs font-black uppercase tracking-wider ${badge.bg}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              <span>{badge.label}</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm text-xs font-bold">
              <Tag className="w-3 h-3 text-emerald-400" />
              <span>{item.category}</span>
            </span>
          </div>
        </div>

        {/* Card Details */}
        <div className="p-5 space-y-3">
          <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
            {item.name}
          </h3>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-3xl font-black text-slate-900 dark:text-white">{item.quantity}</span>
              <span className="ml-1.5 text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">{item.unit}</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Expiry Date</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">{item.expiryDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
