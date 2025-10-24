import { PokemonListItem } from "@/types/pokemon";

export const constructPokemonCardData = (
  pokemon: PokemonListItem,
  pokemonId: number
) => {
  return {
    id: pokemonId,
    name: pokemon.name,
    sprites: {
      front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`,
      other: {
        "official-artwork": {
          front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`,
        },
      },
    },
    types: [],
    height: 0,
    weight: 0,
    stats: [],
    abilities: [],
    base_experience: 0,
  };
};
