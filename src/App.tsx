/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  RotateCcw, 
  Calculator, 
  Trophy, 
  ChevronRight,
  Filter,
  Trash2,
  CheckSquare,
  Square,
  Info
} from 'lucide-react';
import { EXCHANGE_ITEMS, ExchangeItem } from './data';

export default function App() {
  // State for excluded (obtained) items
  const [excludedIds, setExcludedIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('ffxiv_mogmog_excluded');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('ffxiv_mogmog_excluded', JSON.stringify(Array.from(excludedIds)));
  }, [excludedIds]);

  // Toggle exclusion
  const toggleExclusion = (id: string) => {
    setExcludedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Reset all exclusions
  const resetAll = () => {
    setExcludedIds(new Set());
  };

  // Calculate totals
  const totalCost = useMemo(() => {
    return EXCHANGE_ITEMS.reduce((sum, item) => sum + item.cost, 0);
  }, []);

  const currentTotal = useMemo(() => {
    return EXCHANGE_ITEMS
      .filter(item => !excludedIds.has(item.id))
      .reduce((sum, item) => sum + item.cost, 0);
  }, [excludedIds]);

  const excludedCount = excludedIds.size;
  const totalCount = EXCHANGE_ITEMS.length;

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, ExchangeItem[]> = {};
    EXCHANGE_ITEMS.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-200 font-sans selection:bg-amber-500/30">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#161920]/80 backdrop-blur-md border-b border-white/10 px-4 py-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-500 mb-1">
              <Calculator size={18} />
              <span className="text-xs font-bold tracking-widest uppercase">FFXIV 莫古莫古★大收集</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              兌換統計工具
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={resetAll}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all active:scale-95"
            >
              <RotateCcw size={14} />
              還原內容
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 pb-32">
        {/* Info Card */}
        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4 items-start">
          <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
            <Info size={20} />
          </div>
          <div>
            <h3 className="font-bold text-amber-200 mb-1">使用說明</h3>
            <p className="text-sm text-amber-200/70 leading-relaxed">
              點擊項目後，系統會自動從總數中扣除該項目所需的神典石數量。
              這可以用於追蹤您已經擁有或不打算兌換的項目。
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-10">
          {(Object.entries(groupedItems) as [string, ExchangeItem[]][]).map(([category, items]) => (
            <section key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  {category}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((item) => {
                  const isExcluded = excludedIds.has(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={false}
                      onClick={() => toggleExclusion(item.id)}
                      className={`
                        group relative flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200
                        ${isExcluded 
                          ? 'bg-white/5 border-white/5 opacity-50 grayscale' 
                          : 'bg-[#1a1d24] border-white/10 hover:border-amber-500/50 hover:bg-[#1e222b] shadow-lg shadow-black/20'}
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`
                          flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-colors
                          ${isExcluded ? 'bg-slate-700 text-slate-400' : 'bg-amber-500/20 text-amber-500 group-hover:bg-amber-500 group-hover:text-white'}
                        `}>
                          {isExcluded ? <CheckSquare size={16} /> : <Square size={16} />}
                        </div>
                        <div>
                          <h4 className={`font-medium transition-colors ${isExcluded ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-xs font-mono ${isExcluded ? 'text-slate-600' : 'text-amber-500/80'}`}>
                              {item.cost}
                            </span>
                            <span className="text-[10px] text-slate-600 uppercase tracking-tighter">神典石</span>
                          </div>
                        </div>
                      </div>

                      <div className={`text-xs font-mono transition-opacity ${isExcluded ? 'opacity-0' : 'opacity-30 group-hover:opacity-100'}`}>
                        #{item.id.padStart(2, '0')}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Sticky Footer Stats */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#161920]/95 backdrop-blur-xl border-t border-white/10 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">已扣除項目</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">{excludedCount}</span>
                <span className="text-sm text-slate-500">/ {totalCount} 項目</span>
              </div>
            </div>
            
            <div className="w-px h-10 bg-white/10 hidden md:block"></div>
 
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">剩餘所需總數</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-500 tabular-nums">
                  {currentTotal}
                </span>
                <span className="text-xs text-amber-500/50 font-bold uppercase">神典石</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">活動總計</div>
            <div className="text-sm font-mono text-slate-400">
              {totalCost} <span className="text-[10px] opacity-50">神典石</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Scrollbar */}
      <style>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0f1115;
        }
        ::-webkit-scrollbar-thumb {
          background: #1a1d24;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #2a2d34;
        }
      `}</style>
    </div>
  );
}
