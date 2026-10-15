import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { RecipeSchema } from "../schema";
import z from "zod";
import { Prisma } from "@/generated/prisma";
import generateSLug from "@/app/helpers/slugify";
import { revalidatePath } from "next/cache";
import { unlink } from "node:fs/promises";
import {
  getRecipeImagePath,
  isRecipeImageFilename,
} from "@/app/lib/recipeImages";

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
      select: { id: true, title: true },
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
      tags,
    } = result.data;

    const updatedSlug =
      existingRecipe.title !== title ? generateSLug(title) : slug;

    const existingSteps = await prisma.step.findMany({
      where: { recipeId: existingRecipe.id },
      select: { id: true, imagePath: true },
    });

    const existingStepIds = new Set(existingSteps.map((step) => step.id));

    if (
      steps.some(
        (step) => step.id !== undefined && !existingStepIds.has(step.id),
      )
    ) {
      return NextResponse.json(
        { error: "One or more steps do not belong to this recipe" },
        { status: 400 },
      );
    }

    const submittedStepIds = steps.flatMap((step) =>
      step.id === undefined ? [] : [step.id],
    );

    const deletedStepImages = existingSteps
      .filter((step) => !submittedStepIds.includes(step.id))
      .map((step) => step.imagePath)
      .filter((imagePath): imagePath is string => imagePath !== null);

    const updatedRecipe = await prisma.$transaction(async (tx) => {
      await tx.recipe.update({
        where: { slug },
        data: {
          title,
          normalizedTitle: title.toLowerCase(),
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
          tags,
        },
      });

      await tx.step.deleteMany({
        where: {
          recipeId: existingRecipe.id,
          ...(submittedStepIds.length > 0
            ? { id: { notIn: submittedStepIds } }
            : {}),
        },
      });

      for (const step of steps) {
        if (step.id !== undefined) {
          await tx.step.update({
            where: {
              id: step.id,
              recipeId: existingRecipe.id,
            },
            data: {
              stepNumber: step.stepNumber,
              text: step.text,
            },
          });
        } else {
          await tx.step.create({
            data: {
              recipeId: existingRecipe.id,
              stepNumber: step.stepNumber,
              text: step.text,
            },
          });
        }
      }

      return tx.recipe.findUniqueOrThrow({
        where: { id: existingRecipe.id },
        include: {
          ingredients: true,
          steps: {
            orderBy: { stepNumber: "asc" },
          },
        },
      });
    });

    for (const imagePath of deletedStepImages) {
      if (!isRecipeImageFilename(imagePath)) {
        console.warn(
          "Skipping invalid deleted step image filename:",
          imagePath,
        );
        continue;
      }

      try {
        await unlink(getRecipeImagePath(imagePath));
        console.log("Deleted image for removed step:", imagePath);
      } catch (error) {
        if (
          error instanceof Error &&
          "code" in error &&
          error.code === "ENOENT"
        ) {
          continue;
        }

        console.error("Failed to delete image for removed step:", {
          imagePath,
          error,
        });
      }
    }

    revalidatePath("/main");

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
    const recipe = await prisma.recipe.findUnique({
      where: { slug },
      select: {
        imagePath: true,
        steps: {
          select: {
            imagePath: true,
          },
        },
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    await prisma.recipe.delete({
      where: { slug },
    });

    if (recipe.imagePath) {
      if (isRecipeImageFilename(recipe.imagePath)) {
        try {
          await unlink(getRecipeImagePath(recipe.imagePath));
        } catch (error) {
          if (
            !(error instanceof Error) ||
            !("code" in error) ||
            error.code !== "ENOENT"
          ) {
            console.error("Recipe deleted, but image cleanup failed:", error);
          }
        }
      } else {
        console.error(
          "Recipe deleted, but its image filename was invalid:",
          recipe.imagePath,
        );
      }
    }

    for (const step of recipe.steps) {
      const imagePath = step.imagePath;

      if (!imagePath) continue;

      if (!isRecipeImageFilename(imagePath)) {
        console.error(
          "Recipe deleted, but a step image filename was invalid:",
          imagePath,
        );
        continue;
      }

      try {
        await unlink(getRecipeImagePath(imagePath));
      } catch (error) {
        if (
          !(error instanceof Error) ||
          !("code" in error) ||
          error.code !== "ENOENT"
        ) {
          console.error("Recipe deleted, but step image cleanup failed:", {
            imagePath,
            error,
          });
        }
      }
    }

    revalidatePath("/main");

    return NextResponse.json({ message: "Recipe deleted" }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete recipe:", error);

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
