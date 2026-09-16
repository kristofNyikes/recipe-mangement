import Link from "next/link";
import RecipeCard from "./RecipeCard";
import { Recipe } from "@/app/types";
import { getAllRecipes } from "@/app/lib/requests";

const RecentRecipes = async () => {
  const result = await getAllRecipes({
    page: 1,
    limit: 3,
    sortBy: "createdAt",
    sortOrder: "desc",
    summary: true,
  });

  const recipes = result.data as Recipe[];

  return (
    <div className="card bg-base-200 shadow-sm">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="card-title">Recent recipes</h2>
            <p className="text-sm text-base-content/60">
              Your latest additions
            </p>
          </div>

          <Link href="/main/editor" className="btn btn-primary btn-sm">
            + Add recipe
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.slug}
              title={recipe.title}
              slug={recipe.slug}
              prepTime={0}
              cookTime={0}
              servings={0}
            />
          ))}
        </div>
        <Link href="/main/recipe" className="underline">
          Vew All
        </Link>
      </div>
    </div>
  );
};

export default RecentRecipes;
