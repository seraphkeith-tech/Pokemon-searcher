import { StatFilters } from "../types";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface AdvancedFiltersProps {
  filters: StatFilters;
  onChange: (filters: StatFilters) => void;
  onReset: () => void;
}

const STAT_LABELS: Record<keyof StatFilters, string> = {
  hp: "Min HP",
  attack: "Min Attack",
  defense: "Min Defense",
  specialAttack: "Min Sp. Atk",
  specialDefense: "Min Sp. Def",
  speed: "Min Speed",
};

export default function AdvancedFilters({ filters, onChange, onReset }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatChange = (stat: keyof StatFilters, value: string) => {
    const numValue = parseInt(value) || 0;
    onChange({ ...filters, [stat]: numValue });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v > 0).length;

  return (
    <div className="relative" id="advanced-filters-container">
      <button
        id="toggle-advanced-filters"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
          isOpen || activeFiltersCount > 0
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
            : "bg-white text-slate-500 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
        }`}
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span>Stats Filter</span>
        {activeFiltersCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
            {activeFiltersCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-transparent"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Stat Minimums</h3>
                <button
                  onClick={onReset}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-600"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              </div>

              <div className="space-y-4">
                {(Object.keys(STAT_LABELS) as Array<keyof StatFilters>).map((stat) => (
                  <div key={stat} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span>{STAT_LABELS[stat]}</span>
                      <span className="text-indigo-500">{filters[stat]}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={filters[stat]}
                      onChange={(e) => handleStatChange(stat, e.target.value)}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-100 accent-indigo-600 dark:bg-slate-800"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
