import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative flex-1" id="search-bar-container">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <input
        id="pokemon-search-input"
        type="text"
        className="block w-full rounded-2xl border-none bg-white p-4 pl-12 text-slate-900 placeholder-slate-400 shadow-sm ring-1 ring-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:text-slate-100 dark:ring-slate-800 dark:focus:ring-indigo-600 transition-all"
        placeholder="Search by name or type..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
