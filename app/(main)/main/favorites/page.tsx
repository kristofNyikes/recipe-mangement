import RecipeCardExtended from "@/app/Components/RecipeComponents/RecipeCardExtended";
import { Recipe } from "@/app/types";

const FavoriteRecipes = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/recipe/favorite`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recipes");
  }

  const { data } = await response.json();

  const recipes: Recipe[] = data;
  return (
    <div>
      {recipes.map((recipe) => (
        <RecipeCardExtended recipe={recipe} key={recipe.slug} />
      ))}
    </div>
  );
};

export default FavoriteRecipes;
