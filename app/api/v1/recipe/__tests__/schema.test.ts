import { describe, expect, it } from "vitest";
import { RecipeSchema } from "../schema";
import { Unit } from "@/generated/prisma";

const validRecipe = {
  title: "Chocolate Cake",
  description: "A delicious chocolate cake.",
  prepTime: 15,
  cookTime: 30,
  servings: 4,
  ingredients: [
    {
      name: "Flour",
      amount: 200,
      unit: Unit.G,
      note: null,
    },
  ],
  steps: [
    {
      stepNumber: 1,
      text: "Mix the ingredients.",
    },
  ],
  tags: [],
};

describe("RecipeSchema", () => {
  it("accepts valid recipe data", () => {
    expect(RecipeSchema.safeParse(validRecipe).success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = RecipeSchema.safeParse({
      ...validRecipe,
      title: "   ",
    });

    expect(result.success).toBe(false);
  });

  it("rejects negative or non-integer preparation times", () => {
    expect(
      RecipeSchema.safeParse({
        ...validRecipe,
        prepTime: -5,
      }).success,
    ).toBe(false);

    expect(
      RecipeSchema.safeParse({
        ...validRecipe,
        prepTime: 2.5,
      }).success,
    ).toBe(false);
  });

  it("rejects zero servings", () => {
    expect(
      RecipeSchema.safeParse({
        ...validRecipe,
        servings: 0,
      }).success,
    ).toBe(false);
  });

  it("requires at least one ingredient", () => {
    expect(
      RecipeSchema.safeParse({
        ...validRecipe,
        ingredients: [],
      }).success,
    ).toBe(false);
  });

  it("requires at least one step", () => {
    expect(
      RecipeSchema.safeParse({
        ...validRecipe,
        steps: [],
      }).success,
    ).toBe(false);
  });

  it("rejects an ingredient without a name", () => {
    expect(
      RecipeSchema.safeParse({
        ...validRecipe,
        ingredients: [{ ...validRecipe.ingredients[0], name: " " }],
      }).success,
    ).toBe(false);
  });

  it("rejects an invalid ingredient unit", () => {
    expect(
      RecipeSchema.safeParse({
        ...validRecipe,
        ingredients: [{ ...validRecipe.ingredients[0], unit: "INVALID" }],
      }).success,
    ).toBe(false);
  });

  it("rejects invalid tags", () => {
    expect(
      RecipeSchema.safeParse({
        ...validRecipe,
        tags: ["INVALID"],
      }).success,
    ).toBe(false);
  });

  it("defaults missing tags to an empty array", () => {
    const { tags, ...recipeWithoutTags } = validRecipe;

    const result = RecipeSchema.safeParse(recipeWithoutTags);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.tags).toEqual([]);
    }
  });

  it("trims title and ingredient names", () => {
    const result = RecipeSchema.safeParse({
      ...validRecipe,
      title: "  Chocolate Cake  ",
      ingredients: [
        {
          ...validRecipe.ingredients[0],
          name: "  Flour  ",
        },
      ],
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.title).toBe("Chocolate Cake");
      expect(result.data.ingredients[0].name).toBe("Flour");
    }
  });
});
