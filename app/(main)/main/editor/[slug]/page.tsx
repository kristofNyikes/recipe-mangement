import RecipeEditor from "@/app/Components/Forms/RecipeEditor";
import { Ingredient, Recipe, Step } from "@/app/types";
import { auth } from "@/auth";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

const EditRecipePage = async ({ params }: Props) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const { slug } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/recipe/${slug}`,
    {
      cache: "no-store",
      headers: {
        Cookie: cookieHeader,
      },
    },
  );

  if (response.status === 404) {
    notFound();
  }

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
        id: step.id,
        stepNumber: step.stepNumber,
        text: step.text,
        imagePath: step.imagePath,
      }),
    ),
    tags: data.tags,
    imagePath: data.imagePath,
  };

  return <RecipeEditor initialRecipe={recipe} slug={slug} />;
};

export default EditRecipePage;
