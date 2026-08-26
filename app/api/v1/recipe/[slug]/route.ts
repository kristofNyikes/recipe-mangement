import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { RecipeSchema } from "../schema";
import z from "zod";
import { Prisma } from "@/generated/prisma";
import generateSLug from "@/app/helpers/slugify";

interface Params {
  params: Promise<{ slug: string }>;
}

export const GET = async (req: NextRequest, { params }: Params) => {
  try {
    const { slug } = await params;

    const recipe = await prisma.recipe.findUnique({
      where: { slug },
      include: {
        ingredients: {
          orderBy: { name: "asc" },
        },
        steps: {
          orderBy: { stepNumber: "asc" },
        },
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const normalizedRecipe = {
      ...recipe,
      ingredients: recipe.ingredients.map((ingredient) => ({
        ...ingredient,
        amount: ingredient.amount === null ? null : Number(ingredient.amount),
      })),
    };

    return NextResponse.json({ data: normalizedRecipe }, { status: 200 });
  } catch (error) {
    console.error("Error fetching recipe:", error);

    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 },
    );
  }
};

export const PUT = async (req: NextRequest, { params }: Params) => {
  try {
    const { slug } = await params;
    const body = await req.json();

    const result = RecipeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: z.treeifyError(result.error) },
        { status: 400 },
      );
    }

    const existingRecipe = await prisma.recipe.findUnique({
      where: { slug: slug },
      select: { title: true },
    });

    if (!existingRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
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

    const updatedSlug =
      existingRecipe.title !== title ? generateSLug(title) : slug;

    const updatedRecipe = await prisma.$transaction(async (tx) => {
      const recipe = await tx.recipe.update({
        where: {
          slug: slug,
        },
        data: {
          title,
          slug: updatedSlug,
          description,
          prepTime,
          cookTime,
          servings,

          ingredients: {
            deleteMany: {},
            create: ingredients.map((ingredient) => ({
              name: ingredient.name,
              amount: ingredient.amount,
              unit: ingredient.unit,
              note: ingredient.note,
              stepNumber: ingredient.stepNumber,
            })),
          },
          steps: {
            deleteMany: {},
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
      return recipe;
    });

    return NextResponse.json({ data: updatedRecipe }, { status: 200 });
  } catch (error) {
    console.error("Failed to update recipe: ", JSON.stringify(error));
    return NextResponse.json(
      { error: "Failed to update recipe" },
      { status: 500 },
    );
  }
};

export const DELETE = async (_: NextRequest, { params }: Params) => {
  const { slug } = await params;

  try {
    await prisma.recipe.delete({
      where: { slug: slug },
    });

    return NextResponse.json({ message: "Recipe deleted" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete recipe: ", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 500 },
    );
  }
};
