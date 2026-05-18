export interface PokemonShort {
  name: string;
  url: string;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
}

export type Generation = "all" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export const GENERATIONS = [
  { id: "all", name: "All Gens", offset: 0, limit: 1025 },
  { id: "1", name: "Gen 1", offset: 0, limit: 151 },
  { id: "2", name: "Gen 2", offset: 151, limit: 100 },
  { id: "3", name: "Gen 3", offset: 251, limit: 135 },
  { id: "4", name: "Gen 4", offset: 386, limit: 107 },
  { id: "5", name: "Gen 5", offset: 493, limit: 156 },
  { id: "6", name: "Gen 6", offset: 649, limit: 72 },
  { id: "7", name: "Gen 7", offset: 721, limit: 88 },
  { id: "8", name: "Gen 8", offset: 809, limit: 96 },
  { id: "9", name: "Gen 9", offset: 905, limit: 120 },
];

export const POKEMON_TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground",
  "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"
];

export interface StatFilters {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export const INITIAL_STAT_FILTERS: StatFilters = {
  hp: 0,
  attack: 0,
  defense: 0,
  specialAttack: 0,
  specialDefense: 0,
  speed: 0,
};
