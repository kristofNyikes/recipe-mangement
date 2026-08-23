import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { RecipeSchema } from "./schema";
import z from "zod";
import generateSLug from "@/app/helpers/slugify";
import { Prisma } from "@/generated/prisma";

// GET /api/v1/recipe?page=1&limit=10&sort=desc&summary=true
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

  const sort: Prisma.SortOrder =
    searchParams.get("sort") === "asc" ? "asc" : "desc";

  const summary = searchParams.get("summary") === "true";

  try {
    const queryOptions = {
      skip: (page - 1) * limit,
      take: limit,

      orderBy: {
        createdAt: sort,
      },
    };

    const recipes = summary
      ? await prisma.recipe.findMany({
          ...queryOptions,

          select: {
            title: true,
            slug: true,
            prepTime: true,
            cookTime: true,
            servings: true,
          },
        })
      : await prisma.recipe.findMany({
          ...queryOptions,

          include: {
            ingredients: true,
            steps: true,
          },
        });

    const count = await prisma.recipe.count();

    return NextResponse.json(
      {
        data: recipes,

        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      },
      { status: 200 },
    );
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
  } = result.data;

  const slug = generateSLug(title);

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
