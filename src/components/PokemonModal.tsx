import { motion, AnimatePresence } from "motion/react";
import { X, Ruler, Weight, Shield, Swords, Heart, Zap, History, Move } from "lucide-react";
import { PokemonDetail } from "../types";

interface PokemonModalProps {
  pokemon: PokemonDetail | null;
  onClose: () => void;
}

const STAT_ICONS: Record<string, any> = {
  hp: Heart,
  attack: Swords,
  defense: Shield,
  "special-attack": Zap,
  "special-defense": History,
  speed: Move,
};

const STAT_COLORS: Record<string, string> = {
  hp: "bg-rose-500",
  attack: "bg-orange-500",
  defense: "bg-blue-500",
  "special-attack": "bg-indigo-500",
  "special-defense": "bg-emerald-500",
  speed: "bg-amber-500",
};

export default function PokemonModal({ pokemon, onClose }: PokemonModalProps) {
  if (!pokemon) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          layoutId={`pokemon-card-${pokemon.id}`}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
          id="pokemon-detail-modal"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative flex flex-col items-center justify-center bg-slate-50 p-8 dark:bg-slate-800/50">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />
              <img
                src={pokemon.sprites.other["official-artwork"].front_default}
                alt={pokemon.name}
                className="relative z-10 h-48 w-48 object-contain drop-shadow-2xl"
              />
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {pokemon.types.map((t) => (
                  <span
                    key={t.type.name}
                    className="rounded-full bg-white px-4 py-1.5 text-sm font-bold capitalize tracking-wide shadow-sm dark:bg-slate-700 dark:text-slate-100"
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-8">
              <span className="font-mono text-sm font-bold text-indigo-500">#{String(pokemon.id).padStart(3, '0')}</span>
              <h2 className="text-3xl font-black capitalize tracking-tight text-slate-800 dark:text-white">
                {pokemon.name}
              </h2>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                  <Ruler className="h-5 w-5 text-indigo-500" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Height</p>
                    <p className="font-bold dark:text-slate-100">{pokemon.height / 10} m</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
                  <Weight className="h-5 w-5 text-indigo-500" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Weight</p>
                    <p className="font-bold dark:text-slate-100">{pokemon.weight / 10} kg</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Abilities</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {pokemon.abilities.map((a) => (
                    <span
                      key={a.ability.name}
                      className={`rounded-lg px-3 py-1 text-sm font-medium ${
                        a.is_hidden 
                          ? "bg-slate-100 text-slate-500 italic dark:bg-slate-800 dark:text-slate-400" 
                          : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400"
                      }`}
                    >
                      {a.ability.name} {a.is_hidden && "(Hidden)"}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Base Stats</h4>
                {pokemon.stats.map((s) => {
                  const Icon = STAT_ICONS[s.stat.name] || Zap;
                  const percent = (s.base_stat / 255) * 100;
                  return (
                    <div key={s.stat.name} className="flex items-center gap-4">
                      <div className="flex w-24 items-center gap-2">
                        <Icon className="h-3 w-3 text-slate-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          {s.stat.name === "special-attack" ? "Sp. Atk" : s.stat.name === "special-defense" ? "Sp. Def" : s.stat.name}
                        </span>
                      </div>
                      <div className="flex-1 overflow-hidden rounded-full bg-slate-100 h-2 dark:bg-slate-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${STAT_COLORS[s.stat.name] || "bg-indigo-500"}`}
                        />
                      </div>
                      <span className="w-8 text-right font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
                        {s.base_stat}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
