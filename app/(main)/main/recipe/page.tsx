import RecipeCardExtended from "@/app/Components/RecipeComponents/RecipeCardExtended";
import { Recipe } from "@/app/types";

const AllRecipes = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/recipe?page=1&limit=10&sort=desc&summary=false`,
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

export default AllRecipes;
