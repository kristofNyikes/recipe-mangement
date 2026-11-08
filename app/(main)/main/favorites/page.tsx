import RecipeCardExtended from "@/app/Components/RecipeComponents/RecipeCardExtended";
import { getAllFavoriteRecipes } from "@/app/lib/requests";
import { Recipe } from "@/app/types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const FavoriteRecipes = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }
  const result = await getAllFavoriteRecipes(session.user.id);

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
