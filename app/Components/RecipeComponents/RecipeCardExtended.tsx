import Link from "next/link";
import { Recipe } from "@/app/types";
import Image from "next/image";

interface propType {
  recipe: Recipe;
}

const RecipeCardExtended = ({ recipe }: propType) => {
  const previewIngredients = recipe.ingredients?.slice(0, 3) ?? [];
  const remainingCount =
    (recipe.ingredients?.length ?? 0) - previewIngredients.length;

  return (
    <Link href={`/main/recipe/${recipe.slug}`} className="block">
      <div className="card bg-base-200 shadow-sm mx-6 my-4 transition hover:-translate-y-1 hover:shadow-lg">
        <div className="card-body">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <h2 className="card-title text-2xl">{recipe.title}</h2>
              {recipe.isFavorite && (
                <span
                  className="badge badge-success"
                  title="Favorite"
                  aria-label="Favorite"
                >
                  <Image
                    src={"/images/heart.svg"}
                    alt="favorite icon"
                    width={20}
                    height={20}
                  />
                </span>
              )}
            </div>

            {recipe.description && (
              <p className="text-base-content/70 line-clamp-2">
                {recipe.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <span className="badge badge-outline">
                Prep: {recipe.prepTime} min
              </span>
              <span className="badge badge-outline">
                Cook: {recipe.cookTime} min
              </span>
              <span className="badge badge-outline">
                {recipe.servings}
                {recipe.servings === 1 ? " serving" : " servings"}
              </span>
            </div>

            {previewIngredients.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {previewIngredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="badge badge-ghost badge-sm text-xs"
                  >
                    {ingredient.amount && `${ingredient.amount} `}
                    {ingredient.unit && `${ingredient.unit.toLowerCase()} `}
                    {ingredient.name}
                  </span>
                ))}
                {remainingCount > 0 && (
                  <span className="badge badge-ghost badge-sm text-xs">
                    +{remainingCount} more
                  </span>
                )}
              </div>
            )}

            <div className="card-actions justify-end mt-2">
              <span className="btn btn-primary btn-sm">View recipe →</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCardExtended;
