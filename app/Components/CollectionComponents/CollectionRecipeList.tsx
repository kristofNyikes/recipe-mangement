"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import RecipeCardExtended from "@/app/Components/RecipeComponents/RecipeCardExtended";
import { Recipe } from "@/app/types";

interface CollectionRecipeListProps {
  collectionSlug: string;
  recipes: Recipe[];
  currentPage: number;
  totalPages: number;
}

const CollectionRecipeList = ({
  collectionSlug,
  recipes,
  currentPage,
  totalPages,
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

      {totalPages > 1 && (
        <nav
          className="join flex justify-center mt-6"
          aria-label="Collection recipes pagination"
        >
          {currentPage > 1 ? (
            <Link href={`?page=${currentPage - 1}`} className="join-item btn">
              Previous
            </Link>
          ) : (
            <span className="join-item btn btn-disabled">Previous</span>
          )}

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <Link
                key={pageNumber}
                href={`?page=${pageNumber}`}
                className={`join-item btn ${
                  pageNumber === currentPage ? "btn-active" : ""
                }`}
                aria-current={pageNumber === currentPage ? "page" : undefined}
              >
                {pageNumber}
              </Link>
            ),
          )}

          {currentPage < totalPages ? (
            <Link href={`?page=${currentPage + 1}`} className="join-item btn">
              Next
            </Link>
          ) : (
            <span className="join-item btn btn-disabled">Next</span>
          )}
        </nav>
      )}
    </div>
  );
};

export default CollectionRecipeList;
