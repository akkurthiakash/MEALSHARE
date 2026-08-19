'use client';

import React from 'react';
import { Leaf, DollarSign, Award, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';

export default function EcoPage() {
  const BADGES = [
    { title: 'Zero Waste Pioneer', desc: 'Saved 10+ expiring ingredients with Leftover Chaining', icon: Award, unlocked: true },
    { title: 'Pantry Guardian', desc: 'Maintained 100% fresh pantry radar for 14 straight days', icon: ShieldCheck, unlocked: true },
    { title: 'CO₂ Hero', desc: 'Reduced CO₂ emissions by over 25 kg eCO₂', icon: Sparkles, unlocked: false },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
          <Leaf className="w-8 h-8 text-emerald-400" />
          <span>Eco Savings & Impact Dashboard</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Visualizing your monetary savings, food waste prevention, and greenhouse gas equivalent reductions.
        </p>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-tr from-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-emerald-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Money Saved</span>
            <DollarSign className="w-6 h-6" />
          </div>
          <span className="text-4xl font-black text-white">$148.50</span>
          <p className="text-xs text-emerald-400/80 mt-2 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.5% compared to last month</span>
          </p>
        </div>

        <div className="bg-gradient-to-tr from-slate-900 to-teal-950/40 border border-teal-500/30 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-teal-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Food Waste Prevented</span>
            <Leaf className="w-6 h-6" />
          </div>
          <span className="text-4xl font-black text-white">12.4 <span className="text-xl text-slate-400 font-normal">kg</span></span>
          <p className="text-xs text-teal-400/80 mt-2">Roughly 28 full meals rescued</p>
        </div>

        <div className="bg-gradient-to-tr from-slate-900 to-cyan-950/40 border border-cyan-500/30 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between text-cyan-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">CO₂e Reduced</span>
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-4xl font-black text-white">18.2 <span className="text-xl text-slate-400 font-normal">kg</span></span>
          <p className="text-xs text-cyan-400/80 mt-2">Equivalent to driving 72 km less</p>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4">Sustainability Badges & Milestones</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BADGES.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border flex items-start space-x-4 ${
                  badge.unlocked
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-slate-800/40 border-slate-800 opacity-50 text-slate-400'
                }`}
              >
                <div className={`p-3 rounded-xl ${badge.unlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{badge.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{badge.desc}</p>
                  <span className={`inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded mt-2 ${
                    badge.unlocked ? 'bg-emerald-400 text-slate-950' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {badge.unlocked ? 'Unlocked' : 'In Progress'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
