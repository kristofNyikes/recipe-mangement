import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { RecipeSchema } from "./schema";
import z from "zod";

// GET /api/v1/recipe - Gets all recipes
export const GET = async (req: NextRequest) => {
  //TODO recipe belongs to a user
  try {
    const recipes = await prisma.recipe.findMany({
      include: { ingredients: true, steps: true },
    });
    return NextResponse.json(
      { data: recipes, count: recipes.length },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Filed to get recipes." },
      { status: 500 },
    );
  }
};

// POST /api/v1/recipe - Creates a recipe
export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const result = RecipeSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: z.treeifyError(result.error),
      },
      { status: 400 },
    );
  }

  const {
    title,
    description,
    prepTime,
    cookTime,
    servings,
    ingredients,
    steps,
  } = result.data;

  const slug = `${slugify(title, { lower: true, strict: true })}-${nanoid(6)}`;

  try {
    const recipe = await prisma.recipe.create({
      data: {
        title,
        slug,
        description,
        prepTime,
        cookTime,
        servings,

        ingredients: {
          create: ingredients.map((ingredient) => ({
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
            note: ingredient.note,
            stepNumber: ingredient.stepNumber,
          })),
        },

        steps: {
          create: steps.map((step) => ({
            stepNumber: step.stepNumber,
            text: step.text,
          })),
        },
      },

      include: {
        ingredients: true,
        steps: true,
      },
    });

    return NextResponse.json({ data: recipe }, { status: 201 });
  } catch (error) {
    console.error("Failed to create recipe:", error);

    return NextResponse.json(
      {
        error: "Failed to create recipe.",
      },
      { status: 500 },
    );
  }
};
