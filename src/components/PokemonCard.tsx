import React from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { PokemonDetail } from "../types";

interface PokemonCardProps {
  pokemon: PokemonDetail;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onClick: (pokemon: PokemonDetail) => void;
  key?: React.Key;
}

const TYPE_COLORS: Record<string, string> = {
  normal: "bg-[#A8A878]",
  fire: "bg-[#F08030]",
  water: "bg-[#6890F0]",
  electric: "bg-[#F8D030]",
  grass: "bg-[#78C850]",
  ice: "bg-[#98D8D8]",
  fighting: "bg-[#C03028]",
  poison: "bg-[#A040A0]",
  ground: "bg-[#E0C068]",
  flying: "bg-[#A890F0]",
  psychic: "bg-[#F85888]",
  bug: "bg-[#A8B820]",
  rock: "bg-[#B8A038]",
  ghost: "bg-[#705898]",
  dragon: "bg-[#7038F8]",
  dark: "bg-[#705848]",
  steel: "bg-[#B8B8D0]",
  fairy: "bg-[#EE99AC]",
};

export default function PokemonCard({
  pokemon,
  isFavorite,
  onToggleFavorite,
  onClick,
}: PokemonCardProps) {
  const mainType = pokemon.types[0].type.name;
  const bgColor = TYPE_COLORS[mainType] || "bg-slate-400";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.03 }}
      className="group relative cursor-pointer overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none transition-shadow hover:shadow-2xl hover:shadow-slate-300/50 dark:hover:bg-slate-800/80"
      onClick={() => onClick(pokemon)}
      id={`pokemon-card-${pokemon.id}`}
    >
      <div className={`absolute inset-0 opacity-10 transition-opacity group-hover:opacity-15 ${bgColor}`} />
      
      <div className="p-5">
        <div className="flex items-start justify-between">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 font-mono">
            #{String(pokemon.id).padStart(3, '0')}
          </span>
          <button
            id={`fav-btn-${pokemon.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(pokemon.id);
            }}
            className={`rounded-full p-2 transition-colors ${
              isFavorite
                ? "bg-rose-50 text-rose-500 dark:bg-rose-950/30"
                : "bg-slate-50 text-slate-400 hover:text-rose-400 dark:bg-slate-800 dark:text-slate-500"
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>

        <div className="relative mt-2 flex justify-center">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full blur-2xl opacity-40 ${bgColor}`} />
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            alt={pokemon.name}
            className="relative h-32 w-32 object-contain transition-transform group-hover:scale-110"
            loading="lazy"
          />
        </div>

        <div className="mt-4 text-center">
          <h3 className="text-lg font-bold capitalize tracking-tight text-slate-800 dark:text-slate-100">
            {pokemon.name}
          </h3>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {pokemon.types.map((t) => (
              <span
                key={t.type.name}
                className={`type-badge ${TYPE_COLORS[t.type.name]} text-[10px] px-2.5 py-0.5`}
              >
                {t.type.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
