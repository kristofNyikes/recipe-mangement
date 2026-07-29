import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// GET /api/v1/recipe - Gets all recipes
export const GET = async (req: NextRequest) => {
  //TODO recipe belongs to a user
  try {
    const recipes = await prisma.recipe.findMany();
    return NextResponse.json({
      data: recipes,
      count: recipes.length,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({ error: "An error occured.", status: 500 });
  }
};
