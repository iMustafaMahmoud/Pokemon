"use client";

import { useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSuspensePokemonList } from "../hooks/use-pokemon";
import PokemonCard from "./PokemonCard";
import PokemonCardSkeleton from "./PokemonCardSkeleton";
import Pagination from "./Pagination";
import { PokemonListItem } from "../types/pokemon";
import { PokemonAPI } from "@/services/pokemon-api";
import { constructPokemonCardData } from "@/app/utils/pokemonUtils";

const POKEMON_PER_PAGE = 20;

// Simple card component using only list data (no extra API call)
function PokemonListCard({ pokemon }: { pokemon: PokemonListItem }) {
  const pokemonId = PokemonAPI.extractPokemonIdFromUrl(pokemon.url);

  // Create a minimal Pokemon object for the card from list data
  const cardData = constructPokemonCardData(pokemon, pokemonId);

  return <PokemonCard pokemon={cardData} />;
}

// Component that handles the actual data fetching
function PaginationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;
  const offset = (currentPage - 1) * POKEMON_PER_PAGE;

  // This should use prefetched data for the first page
  const { data: pokemonList } = useSuspensePokemonList({
    limit: POKEMON_PER_PAGE,
    offset,
  });

  // Calculate total pages using useMemo instead of useEffect
  const totalPages = useMemo(() => {
    return pokemonList?.count
      ? Math.ceil(pokemonList.count / POKEMON_PER_PAGE)
      : 0;
  }, [pokemonList?.count]);

  const handlePageChange = (page: number) => {
    // Update URL when page changes
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {pokemonList?.results?.map((pokemon) => (
          <PokemonListCard key={pokemon.url} pokemon={pokemon} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={false}
        />
      )}
    </div>
  );
}
// Main component
export default function PaginationView() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  return (
    <Suspense
      key={currentPage} // Reset Suspense boundary when page changes
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            <PokemonCardSkeleton count={POKEMON_PER_PAGE} />
          </div>
        </div>
      }
    >
      <PaginationContent />
    </Suspense>
  );
}
