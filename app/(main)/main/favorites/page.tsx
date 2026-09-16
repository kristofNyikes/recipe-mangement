import RecipeCardExtended from "@/app/Components/RecipeComponents/RecipeCardExtended";
import { getAllFavoriteRecipes } from "@/app/lib/requests";
import { Recipe } from "@/app/types";

export const dynamic = "force-dynamic";

const FavoriteRecipes = async () => {
  const result = await getAllFavoriteRecipes();

  const recipes = result.data as Recipe[];
  return (
    <div>
      {recipes.map((recipe) => (
        <RecipeCardExtended recipe={recipe} key={recipe.slug} />
      ))}
    </div>
  );
};

export default FavoriteRecipes;
