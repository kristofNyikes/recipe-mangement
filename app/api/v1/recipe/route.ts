import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { RecipeSchema } from "./schema";
import z from "zod";
import generateSLug from "@/app/helpers/slugify";
import { Prisma } from "@/generated/prisma";
import { getAllRecipes } from "@/app/lib/requests";
import { RecipeSortBy } from "@/app/types";
import { revalidatePath } from "next/cache";

// GET /api/v1/recipe?page=1&limit=10&sortBy=createdAt&sort=desc&summary=true
export const GET = async (req: NextRequest) => {
  // TODO: recipe belongs to a user

  const { searchParams } = req.nextUrl;

  const requestedPage = Number(searchParams.get("page"));
  const requestedLimit = Number(searchParams.get("limit"));

  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const limit =
    Number.isInteger(requestedLimit) &&
    requestedLimit > 0 &&
    requestedLimit <= 100
      ? requestedLimit
      : 10;

  const requestedSortBy = searchParams.get("sortBy");

  const sortBy: RecipeSortBy =
    requestedSortBy === "title" ||
    requestedSortBy === "createdAt" ||
    requestedSortBy === "updatedAt"
      ? requestedSortBy
      : "createdAt";

  const sortOrder: Prisma.SortOrder =
    searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

  const summary = searchParams.get("summary") === "true";

  try {
    const recipes = await getAllRecipes({
      page,
      limit,
      sortBy,
      sortOrder,
      summary,
    });

    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error("Failed to get recipes:", error);

    return NextResponse.json(
      { error: "Failed to get recipes." },
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
    tags,
  } = result.data;

  const slug = generateSLug(title);

  try {
    const recipe = await prisma.recipe.create({
      data: {
        title,
        //normalizedTitle is here because PostgreSQL case sensitive sorting annoyed me and this was easier
        normalizedTitle: title.toLowerCase(),
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
        tags,
      },

      include: {
        ingredients: true,
        steps: true,
      },
    });

    revalidatePath("/main");

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
