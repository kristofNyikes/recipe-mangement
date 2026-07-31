import { NextRequest, NextResponse } from "next/server";
import { recipes } from "@/data/recipe_seed";
import prisma from "@/prisma/client";
import generateSLug from "@/app/helpers/slugify";

export const POST = async () => {
  try {
    const createdRecipes = await prisma.$transaction(
      recipes.map((recipe) =>
        prisma.recipe.create({
          data: {
            title: recipe.title,
            slug: generateSLug(recipe.title),

            description: recipe.description,
            prepTime: recipe.prepTime,
            cookTime: recipe.cookTime,
            servings: recipe.servings,

            ingredients: {
              create: recipe.ingredients,
            },

            steps: {
              create: recipe.steps,
            },
          },
        }),
      ),
    );

    return NextResponse.json(
      {
        data: createdRecipes,
        count: createdRecipes.length,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to seed recipes",
      },
      { status: 500 },
    );
  }
};
