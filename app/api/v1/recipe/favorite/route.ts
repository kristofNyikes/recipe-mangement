import { NextRequest, NextResponse } from "next/server";
import { getAllFavoriteRecipes } from "@/app/lib/requests";

export const GET = async (req: NextRequest) => {
  try {
    const recipes = await getAllFavoriteRecipes();

    return NextResponse.json(
      { data: recipes.data, count: recipes.data.length },
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
