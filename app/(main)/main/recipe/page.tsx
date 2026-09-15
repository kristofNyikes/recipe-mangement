import RecipeFilters from "@/app/Components/Buttons/RecipeFilters";
import RecipeCardExtended from "@/app/Components/RecipeComponents/RecipeCardExtended";
import { getAllRecipes } from "@/app/lib/requests";
import { Recipe, RecipeSummary } from "@/app/types";

interface AllRecipesProps {
  searchParams: Promise<{
    sortBy?: string;
    sortOrder?: string;
  }>;
}

const AllRecipes = async ({ searchParams }: AllRecipesProps) => {
  const params = await searchParams;

  const sortBy =
    params.sortBy === "title" ||
    params.sortBy === "createdAt" ||
    params.sortBy === "updatedAt"
      ? params.sortBy
      : "createdAt";

  const sortOrder =
    params.sortOrder === "asc" || params.sortOrder === "desc"
      ? params.sortOrder
      : "desc";

  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/recipe?page=1&limit=10&sortBy=createdAt&sortOrder=desc&summary=true`,
  // );

  // if (!response.ok) {
  //   throw new Error("Failed to fetch recipes");
  // }

  // const { data } = await response.json();

  const result = await getAllRecipes({
    page: 1,
    limit: 10,
    sortBy,
    sortOrder,
    summary: false,
  });

  const recipes = result.data as Recipe[];
  return (
    <div>
      <RecipeFilters />
      {recipes.map((recipe) => (
        <RecipeCardExtended recipe={recipe} key={recipe.slug} />
      ))}
    </div>
  );
};

export default AllRecipes;
