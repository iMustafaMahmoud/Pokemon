import {
  useQuery,
  useSuspenseQuery,
  useInfiniteQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { PokemonAPI } from "../services/pokemon-api";
import { PokemonListParams, PokemonListResponse } from "../types/pokemon";

// Regular query (no suspense)
export const usePokemonList = (params: PokemonListParams) => {
  return useQuery({
    queryKey: ["pokemon-list", params],
    queryFn: () => PokemonAPI.getPokemonList(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Suspense query
export const useSuspensePokemonList = (params: PokemonListParams) => {
  return useSuspenseQuery({
    queryKey: ["pokemon-list", params],
    queryFn: () => PokemonAPI.getPokemonList(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePokemonById = (id: number) => {
  return useQuery({
    queryKey: ["pokemon", id],
    queryFn: () => PokemonAPI.getPokemonById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Suspense version for Pokemon by ID
export const useSuspensePokemonById = (id: number) => {
  return useSuspenseQuery({
    queryKey: ["pokemon", id],
    queryFn: () => PokemonAPI.getPokemonById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useInfinitePokemonList = (limit: number = 20) => {
  return useInfiniteQuery({
    queryKey: ["pokemon-list-infinite", limit],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      PokemonAPI.getPokemonList({ limit, offset: pageParam * limit }),
    initialPageParam: 0,
    getNextPageParam: (
      lastPage: PokemonListResponse,
      allPages: PokemonListResponse[]
    ) => {
      if (!lastPage.next) return undefined;
      return allPages.length;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Suspense version for infinite Pokemon list
export const useSuspenseInfinitePokemonList = (limit: number = 20) => {
  return useSuspenseInfiniteQuery({
    queryKey: ["pokemon-list-infinite", limit],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      PokemonAPI.getPokemonList({ limit, offset: pageParam * limit }),
    initialPageParam: 0,
    getNextPageParam: (
      lastPage: PokemonListResponse,
      allPages: PokemonListResponse[]
    ) => {
      if (!lastPage.next) return undefined;
      return allPages.length;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
