import { NextRequest, NextResponse } from "next/server";
import { getAllFavoriteRecipes } from "@/app/lib/requests";
import { auth } from "@/auth";

export const GET = async (req: NextRequest) => {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recipes = await getAllFavoriteRecipes(session.user.id);

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
