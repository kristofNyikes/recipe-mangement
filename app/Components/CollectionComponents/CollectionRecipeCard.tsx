import Link from "next/link";

import { RecipeSummary } from "@/app/types";

const CollectionRecipeCard = (recipe: RecipeSummary) => {
  return (
    <Link
      href={`/main/recipe/${recipe.slug}`}
      className="card border border-base-300 bg-base-100 transition-shadow hover:shadow-md"
    >
      <div className="card-body">
        <h3 className="card-title">{recipe.title}</h3>

        <div className="flex gap-4 text-sm text-base-content/60">
          <span>Prep: {recipe.prepTime} min</span>
          <span>Cook: {recipe.cookTime} min</span>
          <span>{recipe.servings} servings</span>
        </div>

        <span className="mt-1 text-sm text-primary">View recipe →</span>
      </div>
    </Link>
  );
};

export default CollectionRecipeCard;
