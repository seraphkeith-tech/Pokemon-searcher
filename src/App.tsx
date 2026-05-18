import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Ghost, LayoutGrid, Heart, Search } from "lucide-react";
import { PokemonDetail, PokemonShort, Generation, GENERATIONS, StatFilters, INITIAL_STAT_FILTERS } from "./types";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import AdvancedFilters from "./components/AdvancedFilters";
import PokemonCard from "./components/PokemonCard";
import PokemonModal from "./components/PokemonModal";
import Skeleton from "./components/Skeleton";

const API_BASE = ""; // Not used anymore, handled by server proxy

export default function App() {
  const [pokemonList, setPokemonList] = useState<PokemonDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGen, setSelectedGen] = useState<Generation>("all");
  const [statFilters, setStatFilters] = useState<StatFilters>(INITIAL_STAT_FILTERS);
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem("pokemon-favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  useEffect(() => {
    localStorage.setItem("pokemon-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const gen = GENERATIONS.find(g => g.id === selectedGen) || GENERATIONS[0];
        const response = await fetch(`/api/pokemon?limit=${gen.limit}&offset=${gen.offset}`);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const details = await response.json();
        setPokemonList(details);
      } catch (error) {
        console.error("Failed to fetch pokemon:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [selectedGen]);

  const filteredPokemon = useMemo(() => {
    let result = pokemonList;

    if (showOnlyFavorites) {
      result = result.filter(p => favorites.includes(p.id));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.types.some(t => t.type.name.toLowerCase().includes(query))
      );
    }

    // Stat Filters
    result = result.filter(p => {
      const statsMap = p.stats.reduce((acc, s) => {
        acc[s.stat.name] = s.base_stat;
        return acc;
      }, {} as Record<string, number>);

      return (
        statsMap["hp"] >= statFilters.hp &&
        statsMap["attack"] >= statFilters.attack &&
        statsMap["defense"] >= statFilters.defense &&
        statsMap["special-attack"] >= statFilters.specialAttack &&
        statsMap["special-defense"] >= statFilters.specialDefense &&
        statsMap["speed"] >= statFilters.speed
      );
    });

    return result;
  }, [pokemonList, searchQuery, showOnlyFavorites, favorites, statFilters]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                <Sparkles className="h-6 w-6" />
              </div>
              <h1 className="text-xl font-black tracking-tight dark:text-white">PokéQuest</h1>
            </div>

            <div className="hidden md:flex flex-1 max-w-xl">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            <div className="flex items-center gap-4">
              <button
                id="toggle-favorites-btn"
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                  showOnlyFavorites 
                    ? "bg-rose-50 text-rose-500 ring-2 ring-rose-200 dark:bg-rose-950/30 dark:ring-rose-800" 
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                <Heart className={`h-5 w-5 ${showOnlyFavorites ? "fill-current" : ""}`} />
                {favorites.length > 0 && !showOnlyFavorites && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          <div className="md:hidden pb-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Sub Header / Filters */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold dark:text-white">Pokedex</h2>
              <p className="text-xs text-slate-400 font-medium">Browse and search for any pokemon</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <FilterBar selectedGen={selectedGen} onGenChange={setSelectedGen} />
            <AdvancedFilters 
              filters={statFilters} 
              onChange={setStatFilters} 
              onReset={() => setStatFilters(INITIAL_STAT_FILTERS)} 
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Showing <span className="font-bold text-indigo-600 dark:text-indigo-400">{filteredPokemon.length}</span> results
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Skeleton />
                </motion.div>
              ))
            ) : filteredPokemon.length > 0 ? (
              filteredPokemon.map((p: PokemonDetail) => (
                <PokemonCard
                  key={p.id}
                  pokemon={p}
                  isFavorite={favorites.includes(p.id)}
                  onToggleFavorite={toggleFavorite}
                  onClick={(poke: PokemonDetail) => setSelectedPokemon(poke)}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="mb-4 rounded-full bg-slate-100 p-6 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <Ghost className="h-12 w-12 text-slate-300 dark:text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-slate-600 dark:text-slate-400">No Pokemon found</h3>
                <p className="mt-2 text-slate-400">Try adjusting your filters or search query</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Detail Modal */}
      <PokemonModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-100 py-12 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <p className="text-sm font-medium text-slate-400">
            Data provided by <a href="https://pokeapi.co/" className="text-indigo-500 hover:underline">PokeAPI</a>
          </p>
          <div className="mt-4 flex justify-center gap-6">
             <span className="text-xs text-slate-300">© 2026 PokéQuest</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
