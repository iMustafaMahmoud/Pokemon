import {
  Pokemon,
  PokemonListResponse,
  PokemonListParams,
} from "../types/pokemon";

const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export class PokemonAPI {
  private static async fetchFromAPI<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  static async getPokemonList(
    params: PokemonListParams
  ): Promise<PokemonListResponse> {
    const { limit, offset } = params;
    const url = `${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`;
    console.log("pokemon list", this.fetchFromAPI<PokemonListResponse>(url));
    return this.fetchFromAPI<PokemonListResponse>(url);
  }

  static async getPokemonById(id: number): Promise<Pokemon> {
    const url = `${POKEAPI_BASE_URL}/pokemon/${id}`;
    return this.fetchFromAPI<Pokemon>(url);
  }

  static async getPokemonByName(name: string): Promise<Pokemon> {
    const url = `${POKEAPI_BASE_URL}/pokemon/${name}`;
    return this.fetchFromAPI<Pokemon>(url);
  }

  static extractPokemonIdFromUrl(url: string): number {
    const match = url.match(/\/pokemon\/(\d+)\//);
    return match ? parseInt(match[1], 10) : 0;
  }
}
