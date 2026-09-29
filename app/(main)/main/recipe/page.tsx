import RecipeFilters from "@/app/Components/Buttons/RecipeFilters";
import TagCheckbox from "@/app/Components/Checkbox/TagCheckbox";
import RecipeCardExtended from "@/app/Components/RecipeComponents/RecipeCardExtended";
import { parseTags } from "@/app/helpers/parseTags";
import { getAllRecipes } from "@/app/lib/requests";
import { Recipe, Tag, tags } from "@/app/types";

interface AllRecipesProps {
  searchParams: Promise<{
    sortBy?: string;
    sortOrder?: string;
    tags: string;
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

  const selectedTags: Tag[] = parseTags(params.tags);

  const result = await getAllRecipes({
    page: 1,
    limit: 10,
    sortBy,
    sortOrder,
    summary: false,
    tags: selectedTags,
  });

  const recipes = result.data as Recipe[];
  return (
    <div>
      <div className="flex">
        <RecipeFilters />
        <TagCheckbox />
      </div>
      {recipes.map((recipe) => (
        <RecipeCardExtended recipe={recipe} key={recipe.slug} />
      ))}
    </div>
  );
};

export default AllRecipes;
