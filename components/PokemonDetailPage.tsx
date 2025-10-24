"use client";

import { useSuspensePokemonById } from "../hooks/use-pokemon";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import { ErrorBoundary } from "./ErrorBoundary";

interface PokemonDetailPageProps {
  pokemonId: number;
}

// Component that handles the actual data fetching with Suspense
function PokemonDetailContent({ pokemonId }: PokemonDetailPageProps) {
  const router = useRouter();
  // With suspense: true, this will suspend if data is not available
  const { data: pokemon } = useSuspensePokemonById(pokemonId);

  const imageUrl =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default ||
    "/placeholder-pokemon.svg";

  const typeColors: Record<string, string> = {
    normal: "bg-gray-500",
    fire: "bg-red-500",
    water: "bg-blue-500",
    electric: "bg-yellow-500",
    grass: "bg-green-500",
    ice: "bg-cyan-500",
    fighting: "bg-orange-600",
    poison: "bg-purple-500",
    ground: "bg-yellow-600",
    flying: "bg-indigo-400",
    psychic: "bg-pink-500",
    bug: "bg-green-400",
    rock: "bg-yellow-700",
    ghost: "bg-purple-600",
    dragon: "bg-indigo-600",
    dark: "bg-gray-800",
    steel: "bg-gray-400",
    fairy: "bg-pink-300",
  };

  const statNames: Record<string, string> = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Attack",
    "special-defense": "Sp. Defense",
    speed: "Speed",
  };

  const getStatValue = (statName: string): number => {
    const stat = pokemon.stats.find((s) => s.stat.name === statName);
    return stat ? stat.base_stat : 0;
  };

  const getStatPercentage = (value: number): number => {
    return Math.min((value / 255) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-black hover:text-gray-900 transition-colors font-medium bg-white px-4 py-2 rounded-md shadow-sm cursor-pointer"
          >
            ← Back to List
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto">
          {/* Header with Gradient */}
          <div className="bg-linear-to-r from-purple-500 to-pink-500 px-8 py-6">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-white text-2xl mr-2">⚡</span>
                  <h1 className="text-3xl font-bold text-white capitalize">
                    {pokemon.name}
                  </h1>
                </div>
                <p className="text-white text-lg opacity-90">
                  #{pokemon.id.toString().padStart(3, "0")}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column - Pokemon Image and Basic Info */}
              <div className="space-y-6">
                {/* Pokemon Image */}
                <div className="flex justify-center">
                  <div className="relative w-64 h-64 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <Image
                      src={imageUrl}
                      alt={pokemon.name}
                      width={200}
                      height={200}
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-pokemon.svg";
                      }}
                    />
                  </div>
                </div>

                {/* Type Badge */}
                <div className="flex justify-center gap-2">
                  {pokemon.types.map((typeData) => (
                    <span
                      key={typeData.slot}
                      className={`px-6 py-2 text-white rounded-full font-medium text-lg ${
                        typeColors[typeData.type.name] || "bg-gray-500"
                      }`}
                    >
                      {typeData.type.name}
                    </span>
                  ))}
                </div>

                {/* Height and Weight */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-8">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">📏</span>
                      <div>
                        <p className="text-sm text-gray-600">Height</p>
                        <p className="text-xl font-bold text-gray-800">
                          {(pokemon.height / 10).toFixed(1)} m
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">⚖️</span>
                      <div>
                        <p className="text-sm text-gray-600">Weight</p>
                        <p className="text-xl font-bold text-gray-800">
                          {(pokemon.weight / 10).toFixed(1)} kg
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Stats and Abilities */}
              <div className="space-y-6">
                {/* Base Stats */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Base Stats
                  </h2>
                  <div className="space-y-3">
                    {Object.entries(statNames).map(([key, name]) => {
                      const value = getStatValue(key);
                      const percentage = getStatPercentage(value);
                      return (
                        <div key={key} className="flex items-center space-x-4">
                          <div className="w-20 text-sm font-medium text-gray-600">
                            {name}
                          </div>
                          <div className="flex-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gray-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="w-12 text-sm font-bold text-gray-800 text-right">
                            {value}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Abilities */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Abilities
                  </h2>
                  <div className="space-y-2">
                    {pokemon.abilities.map((ability) => (
                      <div
                        key={ability.slot}
                        className="flex items-center space-x-2"
                      >
                        <span className="text-sm font-medium text-gray-800 capitalize">
                          {ability.ability.name}
                        </span>
                        {ability.is_hidden && (
                          <span className="text-xs text-gray-500">
                            (Hidden)
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Base Experience */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Base Experience
                  </h2>
                  <p className="text-lg font-bold text-purple-600">
                    {pokemon.base_experience} XP
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with ErrorBoundary and Suspense
export default function PokemonDetailPage({
  pokemonId,
}: PokemonDetailPageProps) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 flex items-center justify-center">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto">
              <div className="text-red-600 text-2xl font-bold mb-4">
                Failed to load Pokémon details
              </div>
              <p className="text-red-500 text-center mb-4">
                {error?.message || "Unable to fetch Pokémon information"}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={resetError}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer font-medium"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer font-medium"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      <Suspense
        fallback={
          <div className="min-h-screen bg-linear-to-br from-purple-50 to-pink-50 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        }
      >
        <PokemonDetailContent pokemonId={pokemonId} />
      </Suspense>
    </ErrorBoundary>
  );
}
