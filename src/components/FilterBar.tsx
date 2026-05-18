import { GENERATIONS, Generation } from "../types";

interface FilterBarProps {
  selectedGen: Generation;
  onGenChange: (gen: Generation) => void;
}

export default function FilterBar({ selectedGen, onGenChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none" id="filter-bar">
      {GENERATIONS.map((gen) => (
        <button
          key={gen.id}
          id={`gen-filter-${gen.id}`}
          onClick={() => onGenChange(gen.id as Generation)}
          className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
            selectedGen === gen.id
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
              : "bg-white text-slate-500 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
          }`}
        >
          {gen.name}
        </button>
      ))}
    </div>
  );
}
