"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import RecipeCardExtended from "@/app/Components/RecipeComponents/RecipeCardExtended";

import { Recipe } from "@/app/types";

interface CollectionRecipeListProps {
  collectionSlug: string;
  recipes: Recipe[];
}

const CollectionRecipeList = ({
  collectionSlug,
  recipes,
}: CollectionRecipeListProps) => {
  const router = useRouter();
  const [removingSlug, setRemovingSlug] = useState<string | null>(null);

  const removeRecipe = async (recipeSlug: string) => {
    setRemovingSlug(recipeSlug);

    try {
      const response = await fetch(
        `/api/v1/collection/${collectionSlug}/recipe`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipeSlug,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to remove recipe from collection.");
      }

      router.refresh();
    } catch (error) {
      console.error("Failed to remove recipe from collection:", error);
    } finally {
      setRemovingSlug(null);
    }
  };

  if (recipes.length === 0) {
    return (
      <p className="text-base-content/70">
        This collection doesn't contain any recipes yet.
      </p>
    );
  }

  return (
    <div>
      {recipes.map((recipe) => (
        <div key={recipe.slug} className="relative">
          <RecipeCardExtended recipe={recipe} />

          <button
            type="button"
            className="btn btn-error btn-sm absolute bottom-8 left-8"
            disabled={removingSlug === recipe.slug}
            onClick={() => removeRecipe(recipe.slug)}
          >
            {removingSlug === recipe.slug ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              "Remove"
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default CollectionRecipeList;
