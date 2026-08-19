import React from 'react';

export default function GlassBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Soft Base Warm Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF9]/90 via-[#FDF7F2]/85 to-[#F9EFE6]/90 dark:from-[#0B1324]/95 dark:via-[#0D1627]/90 dark:to-[#070D19]/95 transition-colors duration-500" />

      {/* Soft Ambient Light Glows */}
      <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-emerald-500/15 dark:bg-emerald-600/15 blur-3xl" />
      <div className="absolute top-1/3 -right-32 w-[36rem] h-[36rem] rounded-full bg-amber-500/15 dark:bg-amber-500/15 blur-3xl" />
      <div className="absolute bottom-10 left-1/3 w-[38rem] h-[38rem] rounded-full bg-orange-500/15 dark:bg-orange-600/15 blur-3xl" />

      {/* High-Quality Rich Glassmorphism Food Image Clusters across background */}
      
      {/* 1. Fresh Vegetables Cluster (Top Left) */}
      <div className="absolute top-12 left-10 w-80 h-80 rounded-3xl p-1.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/70 dark:border-slate-700/50 shadow-2xl opacity-45 dark:opacity-30 rotate-[-6deg]">
        <div 
          className="w-full h-full rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80')` }}
        />
      </div>

      {/* 2. Juicy Fruits Platter (Top Right) */}
      <div className="absolute top-14 right-12 w-86 h-86 rounded-full p-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/70 dark:border-slate-700/50 shadow-2xl opacity-45 dark:opacity-30 rotate-[8deg]">
        <div 
          className="w-full h-full rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80')` }}
        />
      </div>

      {/* 3. Fresh Steak & Meat (Center Right) */}
      <div className="absolute top-[40%] right-8 w-96 h-72 rounded-3xl p-1.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/70 dark:border-slate-700/50 shadow-2xl opacity-45 dark:opacity-30 rotate-[-10deg]">
        <div 
          className="w-full h-full rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80')` }}
        />
      </div>

      {/* 4. Salmon & Fresh Seafood (Center Left) */}
      <div className="absolute top-[45%] left-12 w-84 h-84 rounded-3xl p-1.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/70 dark:border-slate-700/50 shadow-2xl opacity-45 dark:opacity-30 rotate-[12deg]">
        <div 
          className="w-full h-full rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80')` }}
        />
      </div>

      {/* 5. Finished Curry Dish (Bottom Right) */}
      <div className="absolute bottom-10 right-16 w-96 h-96 rounded-full p-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/70 dark:border-slate-700/50 shadow-2xl opacity-45 dark:opacity-30 rotate-[-4deg]">
        <div 
          className="w-full h-full rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80')` }}
        />
      </div>

      {/* 6. Grains, Rice & Spices (Bottom Left) */}
      <div className="absolute bottom-12 left-20 w-80 h-80 rounded-3xl p-1.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-white/70 dark:border-slate-700/50 shadow-2xl opacity-45 dark:opacity-30 rotate-[8deg]">
        <div 
          className="w-full h-full rounded-2xl bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80')` }}
        />
      </div>
    </div>
  );
}
