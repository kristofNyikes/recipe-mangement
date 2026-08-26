"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { Recipe, Ingredient, Step, units } from "@/app/types";

interface RecipeEditorProps {
  initialRecipe?: Recipe;
  slug?: string;
}

const emptyRecipe: Recipe = {
  title: "",
  description: "",
  prepTime: 1,
  cookTime: 1,
  servings: 1,
  ingredients: [],
  steps: [],
};

const RecipeEditor = ({ initialRecipe, slug }: RecipeEditorProps) => {
  const router = useRouter();

  const [recipe, setRecipe] = useState<Recipe>(initialRecipe ?? emptyRecipe);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(initialRecipe);

  const addIngredient = () => {
    setRecipe((current) => ({
      ...current,
      ingredients: [
        ...current.ingredients,
        {
          name: "",
          amount: undefined,
          unit: undefined,
          note: undefined,
        },
      ],
    }));
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string | number | undefined,
  ) => {
    setRecipe((current) => ({
      ...current,
      ingredients: current.ingredients.map((ingredient, i) =>
        i === index
          ? {
              ...ingredient,
              [field]: value,
            }
          : ingredient,
      ),
    }));
  };

  const removeIngredient = (index: number) => {
    setRecipe((current) => ({
      ...current,
      ingredients: current.ingredients.filter((_, i) => i !== index),
    }));
  };

  const addStep = () => {
    setRecipe((current) => ({
      ...current,
      steps: [
        ...current.steps,
        {
          text: "",
          stepNumber: current.steps.length + 1,
        },
      ],
    }));
  };

  const updateStep = (
    index: number,
    field: keyof Step,
    value: string | number,
  ) => {
    setRecipe((current) => ({
      ...current,
      steps: current.steps.map((step, i) =>
        i === index
          ? {
              ...step,
              [field]: value,
            }
          : step,
      ),
    }));
  };

  const removeStep = (index: number) => {
    setRecipe((current) => ({
      ...current,
      steps: current.steps
        .filter((_, i) => i !== index)
        .map((step, i) => ({
          ...step,
          stepNumber: i + 1,
        })),
    }));
  };

  const handleReset = () => {
    setRecipe(initialRecipe ?? emptyRecipe);
  };

  const handleDiscard = () => {
    if (isEditing && slug) {
      router.push(`/main/recipe/${slug}`);
    } else {
      router.push("/main");
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanedRecipe: Recipe = {
      title: recipe.title,
      description: recipe.description,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,

      ingredients: recipe.ingredients
        .filter((ingredient) => ingredient.name.trim() !== "")
        .map((ingredient) => ({
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          note: ingredient.note,
          stepNumber: ingredient.stepNumber,
        })),

      steps: recipe.steps
        .filter((step) => step.text.trim() !== "")
        .map((step) => ({
          stepNumber: step.stepNumber,
          text: step.text,
        })),
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(
        isEditing ? `/api/v1/recipe/${slug}` : "/api/v1/recipe",
        {
          method: isEditing ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(cleanedRecipe),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          `Failed to ${isEditing ? "update" : "create"} recipe:`,
          JSON.stringify(data, null, 2),
        );

        return;
      }

      console.log(`Recipe ${isEditing ? "updated" : "created"}:`, data);

      /*
       * After updating, return to the recipe page.
       *
       * After creating, return to the main page for now.
       */
      if (isEditing && slug) {
        router.push(`/main/recipe/${slug}`);
      } else {
        router.push("/main");
      }
    } catch (error) {
      console.error("Failed to contact server:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto my-3 max-w-4xl rounded-box bg-base-200 p-6"
    >
      <h1 className="text-3xl font-bold">
        {isEditing ? "Update Recipe" : "Create Recipe"}
      </h1>

      {/* Recipe information */}

      <section className="mt-6">
        <h2 className="text-xl font-semibold">Recipe information</h2>

        <div className="mt-4">
          <label className="label">Title</label>

          <input
            type="text"
            className="input w-full"
            placeholder="Recipe title"
            value={recipe.title}
            disabled={isSubmitting}
            onChange={(e) =>
              setRecipe((current) => ({
                ...current,
                title: e.target.value,
              }))
            }
          />
        </div>

        <div className="mt-4">
          <label className="label">Description</label>

          <textarea
            className="textarea w-full"
            placeholder="Describe your recipe..."
            value={recipe.description}
            disabled={isSubmitting}
            onChange={(e) =>
              setRecipe((current) => ({
                ...current,
                description: e.target.value,
              }))
            }
          />
        </div>

        <div className="flex flex-col">
          <label className="input mt-3">
            <span className="label">Preparation Time:</span>

            <input
              type="number"
              placeholder="20"
              value={recipe.prepTime}
              disabled={isSubmitting}
              onChange={(e) =>
                setRecipe((current) => ({
                  ...current,
                  prepTime: Number(e.target.value),
                }))
              }
            />

            <span className="label">minutes</span>
          </label>

          <label className="input mt-3">
            <span className="label">Cook Time:</span>

            <input
              type="number"
              placeholder="35"
              value={recipe.cookTime}
              disabled={isSubmitting}
              onChange={(e) =>
                setRecipe((current) => ({
                  ...current,
                  cookTime: Number(e.target.value),
                }))
              }
            />

            <span className="label">minutes</span>
          </label>

          <label className="input mt-3">
            <span className="label">Serving Size:</span>

            <input
              type="number"
              placeholder="4"
              value={recipe.servings}
              disabled={isSubmitting}
              onChange={(e) =>
                setRecipe((current) => ({
                  ...current,
                  servings: Number(e.target.value),
                }))
              }
            />
          </label>
        </div>
      </section>

      {/* Ingredients */}

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Ingredients</h2>

        {recipe.ingredients.map((ingredient, index) => (
          <div key={index} className="my-2">
            <div className="flex gap-3">
              <input
                type="text"
                className="input"
                placeholder="Name"
                value={ingredient.name}
                disabled={isSubmitting}
                onChange={(e) =>
                  updateIngredient(index, "name", e.target.value)
                }
              />

              <input
                type="number"
                className="input"
                placeholder="Amount"
                value={ingredient.amount ?? ""}
                disabled={isSubmitting}
                onChange={(e) =>
                  updateIngredient(
                    index,
                    "amount",
                    e.target.value === "" ? undefined : Number(e.target.value),
                  )
                }
              />

              <select
                value={ingredient.unit ?? ""}
                className="select"
                disabled={isSubmitting}
                onChange={(e) =>
                  updateIngredient(index, "unit", e.target.value)
                }
              >
                <option value="" disabled>
                  Unit
                </option>

                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit.toLowerCase()}
                  </option>
                ))}
              </select>

              <button
                onClick={() => removeIngredient(index)}
                className="btn btn-secondary"
                type="button"
                disabled={isSubmitting}
              >
                Remove
              </button>
            </div>

            <input
              type="text"
              className="input input-sm mt-2 w-full"
              placeholder="Note (optional)"
              value={ingredient.note ?? ""}
              disabled={isSubmitting}
              onChange={(e) => updateIngredient(index, "note", e.target.value)}
            />
          </div>
        ))}

        <button
          onClick={addIngredient}
          className="btn btn-primary btn-soft mt-4"
          type="button"
          disabled={isSubmitting}
        >
          + Add ingredient
        </button>
      </section>

      {/* Steps */}

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Instructions</h2>

        {recipe.steps.map((step, index) => (
          <div key={index} className="my-2 flex gap-3">
            <input
              type="text"
              className="input"
              placeholder="Instruction"
              value={step.text}
              disabled={isSubmitting}
              onChange={(e) => updateStep(index, "text", e.target.value)}
            />

            <div className="badge badge-success badge-sm m-2 whitespace-nowrap font-bold">
              Step {step.stepNumber}
            </div>

            <button
              onClick={() => removeStep(index)}
              className="btn btn-secondary"
              type="button"
              disabled={isSubmitting}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          className="btn btn-primary btn-soft mt-4"
          type="button"
          disabled={isSubmitting}
          onClick={addStep}
        >
          + Add step
        </button>
      </section>

      {/* Actions */}

      <div className="mt-8 flex justify-end gap-3">
        {isEditing && (
          <>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={isSubmitting}
              onClick={handleReset}
            >
              Reset changes
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              disabled={isSubmitting}
              onClick={handleDiscard}
            >
              Discard changes
            </button>
          </>
        )}

        <button
          className="btn btn-primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm" />
          ) : isEditing ? (
            "Update Recipe"
          ) : (
            "Save Recipe"
          )}
        </button>
      </div>
    </form>
  );
};

export default RecipeEditor;
