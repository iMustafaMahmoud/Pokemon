import { QueryClient, dehydrate } from "@tanstack/react-query";
import { PokemonAPI } from "../../../services/pokemon-api";
import { Hydrate } from "../../providers/Hydrate";
import PokemonDetailPage from "../../../components/PokemonDetailPage";
import { Metadata } from "next";

interface PokemonPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PokemonPageProps): Promise<Metadata> {
  const { id } = await params;
  const pokemonId = parseInt(id, 10);

  try {
    const pokemon = await PokemonAPI.getPokemonById(pokemonId);
    return {
      title: `${
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
      } - Pokémon Details`,
      description: `Detailed information about ${pokemon.name}: stats, abilities, height, weight, and more.`,
      keywords: [
        `${pokemon.name}`,
        "Pokémon",
        "Pokemon stats",
        "Pokemon abilities",
        "Pokemon details",
      ],
    };
  } catch {
    return {
      title: "Pokémon Not Found",
      description: "The requested Pokémon could not be found.",
    };
  }
}

export default async function PokemonPage({ params }: PokemonPageProps) {
  const { id } = await params;
  const pokemonId = parseInt(id, 10);

  if (isNaN(pokemonId)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Invalid Pokémon ID
          </h1>
          <p className="text-gray-600">
            The Pokémon ID must be a valid number.
          </p>
        </div>
      </div>
    );
  }

  const queryClient = new QueryClient();

  // Prefetch Pokemon data on the server
  await queryClient.prefetchQuery({
    queryKey: ["pokemon", pokemonId],
    queryFn: () => PokemonAPI.getPokemonById(pokemonId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <PokemonDetailPage pokemonId={pokemonId} />
    </Hydrate>
  );
}
