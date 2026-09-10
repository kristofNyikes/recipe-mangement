"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  slug: string;
  initialFavorite: boolean;
};

const FavoriteButton = ({ slug, initialFavorite }: Props) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFavorite = async () => {
    setIsLoading(true);
    const method = isFavorite ? "DELETE" : "POST";

    const response = await fetch(`/api/v1/recipe/${slug}/favorite`, { method });

    if (response.ok) {
      setIsFavorite(!isFavorite);
    }
    setIsLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleFavorite}
      disabled={isLoading}
      className={`badge ${isFavorite ? "badge-success" : ""} cursor-pointer`}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-md"></span>
      ) : (
        <Image src="/images/heart.svg" alt="Favorite" width={20} height={20} />
      )}
    </button>
  );
};

export default FavoriteButton;
