import Link from "next/link";
import Image from "next/image";
import { Pokemon } from "../types/pokemon";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export default function PokemonCard({ pokemon }: PokemonCardProps) {
  const imageUrl =
    pokemon.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.sprites.front_default ||
    "/placeholder-pokemon.svg";

  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <div className="group bg-white rounded-md shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 overflow-hidden p-4">
        <div className="relative h-48 bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center py-4">
          <Image
            src={imageUrl}
            alt={pokemon.name}
            width={120}
            height={120}
            className="object-contain transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-pokemon.svg";
            }}
          />
        </div>

        <div className="p-4 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-800 capitalize mb-2">
            {pokemon.name}
          </h3>
          <p className="text-gray-600 text-lg">
            #{pokemon.id.toString().padStart(3, "0")}
          </p>
        </div>
      </div>
    </Link>
  );
}
