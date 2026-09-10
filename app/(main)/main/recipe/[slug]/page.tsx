import Link from "next/link";
import { notFound } from "next/navigation";
import { Recipe } from "@/app/types";
import FavoriteButton from "@/app/Components/Buttons/FavoriteButton";

type Props = {
  params: Promise<{ slug: string }>;
};

const RecipePage = async ({ params }: Props) => {
  const { slug } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/recipe/${slug}`,
    {
      cache: "no-store",
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
    ingredients: data.ingredients.map((ingredient: any) => ({
      name: ingredient.name,
      amount:
        ingredient.amount === null ? undefined : Number(ingredient.amount),
      unit: ingredient.unit ?? undefined,
      note: ingredient.note ?? undefined,
      stepNumber: ingredient.stepNumber ?? undefined,
    })),
    steps: data.steps.map((step: any) => ({
      stepNumber: step.stepNumber,
      text: step.text,
    })),
  };

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      {/* Header */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <FavoriteButton slug={slug} initialFavorite={recipe.isFavorite} />
              <h1 className="text-3xl font-bold">{recipe.title}</h1>

              {recipe.description && (
                <p className="mt-2 text-base-content/70">
                  {recipe.description}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Link
                href={`/main/editor/${slug}`}
                className="btn btn-primary btn-sm"
              >
                Edit recipe
              </Link>

              <Link href="/main" className="btn btn-ghost btn-sm">
                Back
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="badge badge-lg badge-outline">
              Prep: {recipe.prepTime} min
            </div>

            <div className="badge badge-lg badge-outline">
              Cook: {recipe.cookTime} min
            </div>

            <div className="badge badge-lg badge-outline">
              Servings: {recipe.servings}
            </div>
          </div>
        </div>
      </div>

      {/* Recipe content */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Ingredients */}
        <section className="card bg-base-200 shadow-sm lg:col-span-1">
          <div className="card-body">
            <h2 className="card-title">Ingredients</h2>

            <div className="mt-2">
              {recipe.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="border-b border-base-300 py-3 last:border-b-0"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-medium">{ingredient.name}</span>

                    <span className="whitespace-nowrap text-sm text-base-content/70">
                      {ingredient.amount !== undefined && ingredient.amount}{" "}
                      {ingredient.unit?.toLowerCase()}
                    </span>
                  </div>

                  {ingredient.note && (
                    <p className="mt-1 text-sm italic text-base-content/60">
                      {ingredient.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Instructions */}
        <section className="card bg-base-200 shadow-sm lg:col-span-2">
          <div className="card-body">
            <h2 className="card-title">Instructions</h2>

            <div className="mt-2">
              {recipe.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="flex gap-4 border-b border-base-300 py-4 last:border-b-0"
                >
                  <div className="badge badge-primary badge-lg shrink-0 font-bold">
                    {step.stepNumber}
                  </div>

                  <p className="leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Bottom actions */}
      <div className="mt-6 flex justify-end gap-2">
        <Link href={`/main/editor/${slug}`} className="btn btn-primary">
          Edit recipe
        </Link>

        <Link href="/main" className="btn btn-ghost">
          Back to main
        </Link>
      </div>
    </div>
  );
};

export default RecipePage;
