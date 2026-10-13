"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import RecipeCardExtended from "@/app/Components/RecipeComponents/RecipeCardExtended";
import type { Recipe } from "@/app/types";

const RandomRecipeCard = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const surpriseMe = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/recipe/random");

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "You don't have any recipes yet."
            : "Failed to find a random recipe.",
        );
      }

      const result: Recipe = await response.json();
      setRecipe(result);
    } catch (error) {
      console.error("Failed to get a random recipe:", error);
      setRecipe(null);
      setError(
        error instanceof Error
          ? error.message
          : "Couldn't find a recipe. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void surpriseMe();
  }, [surpriseMe]);

  return (
    <section className="space-y-4 lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Feeling hungry?</h2>
          <p className="mt-1 text-sm text-base-content/60">
            Let fate decide what's cooking.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => void surpriseMe()}
          disabled={isLoading}
          {...({ autoComplete: "off" } as Record<string, string>)}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm" />
              Finding recipe...
            </>
          ) : (
            "🎲 Surprise me"
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center rounded-box bg-base-200">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : error ? (
        <div className="rounded-box bg-base-200 p-6 text-center">
          <p className="text-base-content/70">{error}</p>
          <button
            type="button"
            className="btn btn-outline btn-sm mt-4"
            onClick={() => void surpriseMe()}
          >
            Try again
          </button>
        </div>
      ) : recipe ? (
        <RecipeCardExtended recipe={recipe} />
      ) : null}

      <div className="text-right">
        <Link
          href="/main/recipe/random"
          className="link link-hover text-sm text-primary"
        >
          Want something specific? Filter your picks →
        </Link>
      </div>
    </section>
  );
};

export default RandomRecipeCard;
