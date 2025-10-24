import { QueryClient, dehydrate } from "@tanstack/react-query";
import { PokemonAPI } from "../services/pokemon-api";
import { Metadata } from "next";
import { Hydrate } from "./providers/Hydrate";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Pokémon Browser - Discover and Explore Pokémon",
  description:
    "Browse and discover Pokémon with detailed information, stats, and abilities. View Pokémon in pagination or load more modes.",
  keywords: [
    "Pokémon",
    "Pokédex",
    "Pokemon browser",
    "Pokemon stats",
    "Pokemon abilities",
  ],
};

export default async function Home() {
  const queryClient = new QueryClient();

  // Prefetch initial Pokemon data on the server
  await queryClient.prefetchQuery({
    queryKey: ["pokemon-list", { limit: 20, offset: 0 }],
    queryFn: () => PokemonAPI.getPokemonList({ limit: 20, offset: 0 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <HomeClient />
    </Hydrate>
  );
}
