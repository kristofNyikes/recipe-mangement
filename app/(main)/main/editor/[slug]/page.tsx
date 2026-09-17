import RecipeEditor from "@/app/Components/Forms/RecipeEditor";
import { Ingredient, Recipe, Step } from "@/app/types";

type Props = {
  params: Promise<{ slug: string }>;
};

const EditRecipePage = async ({ params }: Props) => {
  const { slug } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/recipe/${slug}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch recipe");
  }

  const { data } = await response.json();

  const recipe: Recipe = {
    title: data.title,
    slug: data.slug,
    description: data.description ?? "",
    prepTime: data.prepTime,
    cookTime: data.cookTime,
    servings: data.servings,
    isFavorite: data.isFavorite,

    ingredients: data.ingredients.map(
      (ingredient: Ingredient): Ingredient => ({
        name: ingredient.name,
        amount: ingredient.amount ?? null,
        unit: ingredient.unit ?? null,
        note: ingredient.note ?? null,
        stepNumber: ingredient.stepNumber ?? undefined,
      }),
    ),

    steps: data.steps.map(
      (step: Step): Step => ({
        stepNumber: step.stepNumber,
        text: step.text,
      }),
    ),
    tags: data.tags,
  };

  return <RecipeEditor initialRecipe={recipe} slug={slug} />;
};

export default EditRecipePage;
