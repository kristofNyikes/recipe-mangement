"use client";

import { useCallback, useEffect, useState } from "react";

import RecipeCardExtended from "@/app/Components/RecipeComponents/RecipeCardExtended";
import { tagCapitalize } from "@/app/helpers/tagCapitalize";
import { Recipe, Tag, tags } from "@/app/types";

type MatchMode = "any" | "all";

const RandomRecipePicker = () => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [matchMode, setMatchMode] = useState<MatchMode>("any");

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomRecipe = useCallback(
    async (filters: Tag[], mode: MatchMode) => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (filters.length > 0) {
          params.set("tags", filters.join(","));
          params.set("matchMode", mode);
        }

        const query = params.toString();
        const url = `/api/v1/recipe/random${query ? `?${query}` : ""}`;

        const response = await fetch(url);

        if (response.status === 404) {
          setRecipe(null);
          setError("No recipes match those filters. Try different tags.");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch a random recipe.");
        }

        const result: Recipe = await response.json();
        setRecipe(result);
      } catch (error) {
        console.error("Failed to fetch random recipe:", error);
        setRecipe(null);
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void fetchRandomRecipe([], "any");
  }, [fetchRandomRecipe]);

  const toggleTag = (tag: Tag) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setMatchMode("any");
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <section className="card h-fit bg-base-200 shadow-sm">
        <div className="card-body gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="card-title">Filter by tags</h2>
            {selectedTags.length > 0 && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={clearFilters}
              >
                Clear filters
              </button>
            )}
          </div>

          <p className="text-sm text-base-content/60">
            Leave all tags unselected to include every recipe.
          </p>

          <div className="grid max-h-64 grid-cols-2 gap-1.5 overflow-y-auto rounded-lg border border-base-300 p-2 sm:grid-cols-3">
            {tags.map((tag) => (
              <label
                key={tag}
                className="flex cursor-pointer items-center gap-2 rounded-md p-1.5 hover:bg-base-300"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                  checked={selectedTags.includes(tag)}
                  onChange={() => toggleTag(tag)}
                />
                <span className="text-sm">{tagCapitalize(tag)}</span>
              </label>
            ))}
          </div>

          <fieldset>
            <legend className="mb-2 font-medium">Tag matching</legend>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="radio"
                  name="matchMode"
                  className="radio radio-primary radio-sm mt-0.5"
                  checked={matchMode === "any"}
                  onChange={() => setMatchMode("any")}
                />
                <span>
                  <span className="block font-medium">Match any</span>
                  <span className="text-sm text-base-content/60">
                    At least one selected tag.
                  </span>
                </span>
              </label>

              <label className="flex cursor-pointer items-start gap-2">
                <input
                  type="radio"
                  name="matchMode"
                  className="radio radio-primary radio-sm mt-0.5"
                  checked={matchMode === "all"}
                  onChange={() => setMatchMode("all")}
                />
                <span>
                  <span className="block font-medium">Match all</span>
                  <span className="text-sm text-base-content/60">
                    Every selected tag must match.
                  </span>
                </span>
              </label>
            </div>
          </fieldset>

          <button
            type="button"
            className="btn btn-primary mt-1"
            onClick={() => void fetchRandomRecipe(selectedTags, matchMode)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Finding recipe...
              </>
            ) : (
              "🎲 Pick a random recipe"
            )}
          </button>
        </div>
      </section>

      <section className="min-w-0 space-y-3">
        <h2 className="text-xl font-bold">Your random pick</h2>

        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center rounded-box bg-base-200">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : error ? (
          <div className="rounded-box border border-base-300 p-6 text-center">
            <p className="text-base-content/70">{error}</p>
            <button
              type="button"
              className="btn btn-outline btn-sm mt-4"
              onClick={() => void fetchRandomRecipe(selectedTags, matchMode)}
            >
              Try again
            </button>
          </div>
        ) : recipe ? (
          <RecipeCardExtended recipe={recipe} />
        ) : null}
      </section>
    </div>
  );
};

export default RandomRecipePicker;
