"use client";
import React, { useState } from "react";
import { Recipe, Ingredient, Step, units } from "@/app/types";

const RecipeEditor = () => {
  const [recipe, setRecipe] = useState<Recipe>({
    title: "",
    description: "",
    prepTime: 1,
    cookTime: 1,
    servings: 1,
    ingredients: [],
    steps: [],
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const addIngredient = () => {
    setRecipe((current) => ({
      ...current,
      ingredients: [
        ...current.ingredients,
        {
          name: "",
          amount: undefined,
          unit: undefined,
        },
      ],
    }));
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string | number,
  ) => {
    setRecipe((current) => ({
      ...current,
      ingredients: current.ingredients.map((ingredient, i) =>
        i === index ? { ...ingredient, [field]: value } : ingredient,
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
        i === index ? { ...step, [field]: value } : step,
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

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const cleanedRecipe = {
      ...recipe,
      ingredients: recipe.ingredients.filter(
        (ingredient) => ingredient.name.trim() !== "",
      ),
      steps: recipe.steps.filter((step) => step.text.trim() !== ""),
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedRecipe),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Failed to create recipe:", data);
        return;
      }

      console.log("Recipe created:", data);
    } catch (error) {
      console.error("Failed to contact server:", error);
      setRecipe(cleanedRecipe);
    } finally {
      setIsSubmitting(false);
    }

    console.log(cleanedRecipe);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-4xl p-6 bg-base-200 my-3 rounded-box"
    >
      <h1 className="text-3xl font-bold">Create Recipe</h1>

      <section className="mt-6">
        <h2 className="text-xl font-semibold">Recipe information</h2>

        <div className="mt-4">
          <label className="label">Title</label>
          <input
            type="text"
            className="input w-full"
            placeholder="Recipe title"
            value={recipe.title}
            onChange={(e) =>
              setRecipe({
                ...recipe,
                title: e.target.value,
              })
            }
          />
        </div>

        <div className="mt-4">
          <label className="label">Description</label>
          <textarea
            className="textarea w-full"
            placeholder="Describe your recipe..."
            value={recipe.description}
            onChange={(e) =>
              setRecipe({
                ...recipe,
                description: e.target.value,
              })
            }
          />
        </div>
        <div className="flex flex-col">
          <label className="input mt-3">
            <span className="label">Preperation Time:</span>
            <input
              type="number"
              placeholder="20"
              value={recipe.prepTime}
              onChange={(e) =>
                setRecipe({ ...recipe, prepTime: Number(e.target.value) })
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
              onChange={(e) =>
                setRecipe({ ...recipe, cookTime: Number(e.target.value) })
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
              onChange={(e) =>
                setRecipe({ ...recipe, servings: Number(e.target.value) })
              }
            />
          </label>
        </div>
      </section>

      {/* Ingredients */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Ingredients</h2>
        {recipe.ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-3 my-2">
            <div className="flex gap-3">
              <input
                type="text"
                className="input"
                placeholder="Name"
                value={ingredient.name}
                onChange={(e) =>
                  updateIngredient(index, "name", e.target.value)
                }
              />

              <input
                type="number"
                className="input"
                placeholder="Amount"
                value={ingredient.amount ?? ""}
                onChange={(e) =>
                  updateIngredient(index, "amount", Number(e.target.value))
                }
              />
              <select
                value={ingredient.unit ?? ""}
                className="select"
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
          <div key={index} className="flex gap-3 my-2">
            <input
              type="text"
              className="input"
              placeholder="Instruction"
              value={step.text}
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

      <div className="mt-8 flex justify-end">
        <button
          className="btn btn-primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm text-primary"></span>
            </>
          ) : (
            "Save Recipe"
          )}
        </button>
      </div>
    </form>
  );
};

export default RecipeEditor;
