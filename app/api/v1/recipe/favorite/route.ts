import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export const GET = async (req: NextRequest) => {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: {
        createdAt: "asc",
      },
      where: { isFavorite: true },
    });

    return NextResponse.json(
      { data: recipes, count: recipes.length },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to get favorite recipes:", error);

    return NextResponse.json(
      { error: "Failed to get favorite recipes" },
      { status: 500 },
    );
  }
};
