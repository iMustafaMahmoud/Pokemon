"use client";

import { Suspense } from "react";
import { useSuspenseInfinitePokemonList } from "../hooks/use-pokemon";
import PokemonCard from "./PokemonCard";
import PokemonCardSkeleton from "./PokemonCardSkeleton";
import LoadingSpinner from "./LoadingSpinner";
import { PokemonAPI } from "../services/pokemon-api";
import { PokemonListItem } from "@/types/pokemon";
import { constructPokemonCardData } from "@/app/utils/pokemonUtils";

const POKEMON_PER_PAGE = 20;

// Component that fetches individual Pokemon data with Suspense
function PokemonListCard({ pokemon }: { pokemon: PokemonListItem }) {
  const pokemonId = PokemonAPI.extractPokemonIdFromUrl(pokemon.url);

  // Create a minimal Pokemon object for the card from list data
  const cardData = constructPokemonCardData(pokemon, pokemonId);

  return <PokemonCard pokemon={cardData} />;
}

// Component that handles the actual data fetching with Suspense
function LoadMoreContent() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfinitePokemonList(POKEMON_PER_PAGE);

  const handleLoadMore = () => {
    fetchNextPage();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {data?.pages?.map((page) =>
          page.results.map((pokemon) => (
            <PokemonListCard key={pokemon.url} pokemon={pokemon} />
          ))
        )}
      </div>

      {hasNextPage && (
        <div className="flex flex-col justify-center items-center gap-2">
          <button
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
            className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center gap-2 shadow-sm"
          >
            {isFetchingNextPage ? (
              <>
                <LoadingSpinner size="sm" />
                Loading more Pokémon...
              </>
            ) : (
              "Load More Pokémon"
            )}
          </button>
          <p className="text-gray-500 text-sm">
            Showing {data?.pages.length * POKEMON_PER_PAGE} Pokémon
          </p>
        </div>
      )}
    </div>
  );
}
// Main component
export default function LoadMoreView() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            <PokemonCardSkeleton count={POKEMON_PER_PAGE} />
          </div>
        </div>
      }
    >
      <LoadMoreContent />
    </Suspense>
  );
}
