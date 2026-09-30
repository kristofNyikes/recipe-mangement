import { NextRequest, NextResponse } from "next/server";
import { collectionRecipeSchema } from "./schema";
import {
  addRecipeToCollection,
  deleteRecipeFromCollection,
  getCollectionRecipes,
} from "@/app/lib/requests";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export const GET = async (_req: NextRequest, { params }: RouteParams) => {
  try {
    const { slug } = await params;
    const recipes = await getCollectionRecipes(slug);

    if (recipes === null) {
      return NextResponse.json(
        { error: "Collection not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error("Failed to get collection recipes:", error);

    return NextResponse.json(
      { error: "Failed to get collection recipes." },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest, { params }: RouteParams) => {
  try {
    const { slug } = await params;
    const body = await req.json();

    const result = collectionRecipeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid recipe data." },
        { status: 400 },
      );
    }

    const collection = await addRecipeToCollection(
      slug,
      result.data.recipeSlug,
    );

    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add recipe to collection" },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest, { params }: RouteParams) => {
  try {
    const { slug } = await params;
    const body = await req.json();

    const result = collectionRecipeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid recipe data" },
        { status: 400 },
      );
    }

    const collection = await deleteRecipeFromCollection(
      slug,
      result.data.recipeSlug,
    );

    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove recipe from collection." },
      { status: 500 },
    );
  }
};
