"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CloseButton from "../Buttons/CloseButton";

import { Recipe, Ingredient, Step, Tag, units, tags } from "@/app/types";
import { tagCapitalize } from "@/app/helpers/tagCapitalize";
import Image from "next/image";

interface RecipeEditorProps {
  initialRecipe?: Recipe;
  slug?: string;
}

const emptyRecipe: Recipe = {
  title: "",
  slug: "",
  description: null,
  prepTime: 1,
  cookTime: 1,
  servings: 1,
  isFavorite: false,
  ingredients: [],
  steps: [],
  tags: [],
};

const RecipeEditor = ({ initialRecipe, slug }: RecipeEditorProps) => {
  const router = useRouter();

  const [recipe, setRecipe] = useState<Recipe>(initialRecipe ?? emptyRecipe);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags = tags.filter((tag) => !recipe.tags.includes(tag));

  const [isTagMenuOpen, setIsTagMenuOpen] = useState(false);
  const tagMenuRef = useRef<HTMLDivElement>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [savedRecipeSlug, setSavedRecipeSlug] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [selectedStepImages, setSelectedStepImages] = useState<
    Record<string, File>
  >({});
  const [removeStepImages, setRemoveStepImages] = useState<Set<string>>(
    new Set(),
  );
  const [stepImageError, setStepImageError] = useState<string | null>(null);
  const [stepImagePreviews, setStepImagePreviews] = useState<
    Record<string, string>
  >({});

  const isEditing = Boolean(initialRecipe || savedRecipeSlug);
  const recipeSlug = slug ?? savedRecipeSlug ?? initialRecipe?.slug;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tagMenuRef.current &&
        !tagMenuRef.current.contains(event.target as Node)
      ) {
        setIsTagMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const previews: Record<string, string> = {};

    for (const [key, file] of Object.entries(selectedStepImages)) {
      previews[key] = URL.createObjectURL(file);
    }

    setStepImagePreviews(previews);

    return () => {
      Object.values(previews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedStepImages]);

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedImage]);

  const addIngredient = () => {
    setRecipe((current) => ({
      ...current,
      ingredients: [
        ...current.ingredients,
        {
          name: "",
          amount: null,
          unit: null,
          note: null,
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

  const getStepKey = (step: Step, index: number) =>
    step.id !== undefined ? `id-${step.id}` : `new-${step.clientKey ?? index}`;

  const selectStepImage = (key: string, file: File | null) => {
    setSelectedStepImages((current) => {
      const next = { ...current };

      if (file) next[key] = file;
      else delete next[key];

      return next;
    });

    setRemoveStepImages((current) => {
      const next = new Set(current);
      next.delete(key);
      return next;
    });

    setStepImageError(null);
  };

  const markStepImageForRemoval = (key: string) => {
    setSelectedStepImages((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });

    setRemoveStepImages((current) => new Set(current).add(key));
    setStepImageError(null);
  };

  const addStep = () => {
    setRecipe((current) => ({
      ...current,
      steps: [
        ...current.steps,
        {
          clientKey: crypto.randomUUID(),
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
    setSelectedImage(null);
    setRemoveExistingImage(false);
    setImageUploadError(null);
  };

  const handleDiscard = () => {
    if (isEditing && recipeSlug) {
      router.push(`/main/recipe/${recipeSlug}`);
    } else {
      router.push("/main");
    }
  };

  const handleAddTag = (tag: Tag) => {
    setRecipe((current) => ({
      ...current,
      tags: [...current.tags, tag],
    }));
  };

  const handleDeleteTag = (tag: Tag) => {
    setRecipe((current) => ({
      ...current,
      tags: current.tags.filter((currentTag) => currentTag !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanedRecipe: Recipe = {
      title: recipe.title,
      slug: recipe.slug || "",
      description: recipe.description,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      isFavorite: recipe.isFavorite || false,

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
          ...(step.id !== undefined ? { id: step.id } : {}),
          stepNumber: step.stepNumber,
          text: step.text,
        })),

      tags: recipe.tags,
    };

    setIsSubmitting(true);
    setImageUploadError(null);
    setStepImageError(null);

    try {
      const updating = Boolean(isEditing && recipeSlug);

      const response = await fetch(
        updating ? `/api/v1/recipe/${recipeSlug}` : "/api/v1/recipe",
        {
          method: updating ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(cleanedRecipe),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        console.error(
          `Failed to ${updating ? "update" : "create"} recipe:`,
          result,
        );
        return;
      }

      const savedRecipe = result.data as Recipe;

      if (!savedRecipe?.slug) {
        console.error("Recipe was saved, but the response had no slug.");
        return;
      }

      setSavedRecipeSlug(savedRecipe.slug);

      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        const imageResponse = await fetch(
          `/api/v1/recipe/${savedRecipe.slug}/image`,
          {
            method: "POST",
            body: formData,
          },
        );

        const imageResult = await imageResponse.json();

        if (!imageResponse.ok) {
          console.error("Recipe saved, but image upload failed:", imageResult);

          setImageUploadError(
            imageResult.error ??
              "Recipe saved, but the image upload failed. Please try saving again.",
          );

          return;
        }

        setSelectedImage(null);
      } else if (removeExistingImage && initialRecipe?.imagePath) {
        const imageResponse = await fetch(
          `/api/v1/recipe/${savedRecipe.slug}/image`,
          {
            method: "DELETE",
          },
        );

        const imageResult = await imageResponse.json();

        if (!imageResponse.ok) {
          console.error("Recipe saved, but image removal failed:", imageResult);

          setImageUploadError(
            imageResult.error ??
              "Recipe saved, but removing the image failed. Please try saving again.",
          );

          return;
        }

        setRemoveExistingImage(false);
      }

      console.log(`Recipe ${updating ? "updated" : "created"}:`, savedRecipe);

      setRecipe((current) => ({
        ...current,
        steps: current.steps.map((step) => {
          const savedStep = savedRecipe.steps?.find(
            (candidate) =>
              (step.id !== undefined && candidate.id === step.id) ||
              candidate.stepNumber === step.stepNumber,
          );

          return savedStep
            ? { ...step, id: savedStep.id, imagePath: savedStep.imagePath }
            : step;
        }),
      }));

      for (const step of recipe.steps) {
        const key = getStepKey(
          step,
          recipe.steps.findIndex((candidate) => candidate === step),
        );

        if (
          step.id === undefined ||
          !removeStepImages.has(key) ||
          !step.imagePath
        ) {
          continue;
        }

        const imageResponse = await fetch(
          `/api/v1/recipe/${savedRecipe.slug}/step/${step.id}/image`,
          { method: "DELETE" },
        );

        const imageResult = await imageResponse.json();

        if (!imageResponse.ok) {
          setStepImageError(
            imageResult.error ??
              `Failed to remove image for step ${step.stepNumber}.`,
          );
          return;
        }
      }

      for (const [key, file] of Object.entries(selectedStepImages)) {
        const originalIndex = recipe.steps.findIndex(
          (step, index) => getStepKey(step, index) === key,
        );

        if (originalIndex === -1) continue;

        const originalStep = recipe.steps[originalIndex];

        const savedStep = savedRecipe.steps?.find((candidate) =>
          originalStep.id !== undefined
            ? candidate.id === originalStep.id
            : candidate.stepNumber === originalStep.stepNumber,
        );

        if (!savedStep?.id) {
          setStepImageError(
            `Recipe saved, but the ID for step ${originalStep.stepNumber} was missing. Please try saving again.`,
          );
          return;
        }

        const formData = new FormData();
        formData.append("image", file);

        const imageResponse = await fetch(
          `/api/v1/recipe/${savedRecipe.slug}/step/${savedStep.id}/image`,
          { method: "POST", body: formData },
        );

        const imageResult = await imageResponse.json();

        if (!imageResponse.ok) {
          setStepImageError(
            imageResult.error ??
              `Recipe saved, but the image for step ${originalStep.stepNumber} failed to upload.`,
          );
          return;
        }
        setRecipe((current) => ({
          ...current,
          steps: current.steps.map((step) =>
            step.id === savedStep.id
              ? {
                  ...step,
                  imagePath: imageResult.data.imagePath,
                }
              : step,
          ),
        }));
      }

      setSelectedStepImages({});
      setRemoveStepImages(new Set());

      router.push(`/main/recipe/${savedRecipe.slug}`);
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
            value={recipe.description ?? ""}
            disabled={isSubmitting}
            onChange={(e) =>
              setRecipe((current) => ({
                ...current,
                description: e.target.value,
              }))
            }
          />
        </div>

        <div className="mt-4">
          <label htmlFor="recipe-image" className="label">
            Recipe image (optional)
          </label>

          <input
            id="recipe-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="file-input w-full"
            disabled={isSubmitting}
            onChange={(e) => {
              setSelectedImage(e.target.files?.[0] ?? null);
              setRemoveExistingImage(false);
              setImageUploadError(null);
            }}
          />

          {imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Selected recipe preview"
                className="max-h-64 rounded-box object-contain"
              />

              <button
                type="button"
                className="btn btn-ghost btn-sm mt-2"
                disabled={isSubmitting}
                onClick={() => setSelectedImage(null)}
              >
                Remove selected image
              </button>
            </div>
          )}
          {!imagePreview &&
            !removeExistingImage &&
            initialRecipe?.imagePath && (
              <div className="mt-3">
                <div className="flex max-h-64 justify-start overflow-hidden">
                  <Image
                    width={800}
                    height={600}
                    src={`/api/v1/recipe/image/${initialRecipe.imagePath}`}
                    alt={`${initialRecipe.title} recipe`}
                    className="h-auto max-h-64 w-auto max-w-full rounded-box object-contain"
                    unoptimized
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-error btn-outline btn-sm mt-2"
                  disabled={isSubmitting}
                  onClick={() => {
                    setRemoveExistingImage(true);
                    setImageUploadError(null);
                  }}
                >
                  Remove current image
                </button>
              </div>
            )}

          {imageUploadError && (
            <p role="alert" className="mt-2 text-error">
              {imageUploadError}
            </p>
          )}
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

      {/* Tags */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Tags</h2>

        {availableTags.length > 0 && (
          <div ref={tagMenuRef} className="relative mt-3 w-fit">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={isSubmitting}
              onClick={() => setIsTagMenuOpen((open) => !open)}
            >
              Add tag...
            </button>

            {isTagMenuOpen && (
              <ul className="menu absolute z-10 mt-1 max-h-96 w-52 flex-nowrap overflow-y-auto rounded-box bg-base-100 p-2 shadow-sm">
                {availableTags.map((tag) => (
                  <li key={tag}>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleAddTag(tag)}
                    >
                      {tagCapitalize(tag)}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="badge badge-success cursor-pointer p-3"
              onClick={() => handleDeleteTag(tag)}
            >
              {tagCapitalize(tag)}
              <CloseButton />
            </span>
          ))}
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

        {recipe.steps.map((step, index) => {
          const key = getStepKey(step, index);
          const preview = stepImagePreviews[key];
          const hasSavedImage = Boolean(step.imagePath);
          const imageMarkedForRemoval = removeStepImages.has(key);

          return (
            <div
              key={step.id ?? step.clientKey ?? index}
              className="my-4 rounded-box border border-base-300 p-4"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="badge badge-success badge-sm whitespace-nowrap font-bold">
                  Step {step.stepNumber}
                </span>

                <input
                  type="text"
                  className="input min-w-0 flex-1"
                  placeholder="Instruction"
                  value={step.text}
                  disabled={isSubmitting}
                  onChange={(e) => updateStep(index, "text", e.target.value)}
                />

                <button
                  onClick={() => removeStep(index)}
                  className="btn btn-secondary"
                  type="button"
                  disabled={isSubmitting}
                >
                  Remove step
                </button>
              </div>

              <div className="mt-3">
                <label className="label" htmlFor={`step-image-${key}`}>
                  Step image (optional)
                </label>

                <input
                  id={`step-image-${key}`}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="file-input w-full"
                  disabled={isSubmitting}
                  onChange={(e) => {
                    selectStepImage(key, e.target.files?.[0] ?? null);
                    e.currentTarget.value = "";
                  }}
                />

                {preview && (
                  <div className="mt-3">
                    <img
                      src={preview}
                      alt={`Preview for step ${step.stepNumber}`}
                      className="max-h-64 rounded-box object-contain"
                    />

                    <button
                      type="button"
                      className="btn btn-ghost btn-sm mt-2"
                      disabled={isSubmitting}
                      onClick={() => selectStepImage(key, null)}
                    >
                      Cancel selected image
                    </button>
                  </div>
                )}

                {!preview && hasSavedImage && !imageMarkedForRemoval && (
                  <div className="mt-3">
                    <Image
                      width={800}
                      height={600}
                      src={`/api/v1/recipe/step-image/${step.imagePath}`}
                      alt={`Step ${step.stepNumber}`}
                      className="h-auto max-h-64 w-auto max-w-full rounded-box object-contain"
                      unoptimized
                    />

                    <button
                      type="button"
                      className="btn btn-error btn-outline btn-sm mt-2"
                      disabled={isSubmitting}
                      onClick={() => markStepImageForRemoval(key)}
                    >
                      Remove current image
                    </button>
                  </div>
                )}

                {imageMarkedForRemoval && (
                  <p className="mt-2 text-sm text-warning">
                    Current image will be removed when you save.
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs ml-2"
                      disabled={isSubmitting}
                      onClick={() => {
                        setRemoveStepImages((current) => {
                          const next = new Set(current);
                          next.delete(key);
                          return next;
                        });
                      }}
                    >
                      Undo
                    </button>
                  </p>
                )}
              </div>
            </div>
          );
        })}

        <button
          className="btn btn-primary btn-soft mt-4"
          type="button"
          disabled={isSubmitting}
          onClick={addStep}
        >
          + Add step
        </button>
      </section>

      {stepImageError && (
        <p role="alert" className="mt-3 text-error">
          {stepImageError}
        </p>
      )}

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
