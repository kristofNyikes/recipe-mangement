import { NextRequest, NextResponse } from "next/server";

import { getRandomRecipe } from "@/app/lib/requests";
import { tags as validTags, Tag } from "@/app/types";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;

    const rawTags = searchParams.get("tags");
    const matchMode = searchParams.get("matchMode") ?? "any";

    if (matchMode !== "any" && matchMode !== "all") {
      return NextResponse.json(
        { error: 'matchMode must be "any" or "all".' },
        { status: 400 },
      );
    }

    const selectedTags = rawTags
      ? [
          ...new Set(
            rawTags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean),
          ),
        ]
      : [];

    const invalidTags = selectedTags.filter(
      (tag) => !validTags.includes(tag as Tag),
    );

    if (invalidTags.length > 0) {
      return NextResponse.json(
        {
          error: "Invalid tags provided.",
          invalidTags,
        },
        { status: 400 },
      );
    }

    const recipe = await getRandomRecipe({
      tags: selectedTags as Tag[],
      matchMode,
    });

    if (!recipe) {
      return NextResponse.json(
        { error: "No recipes found matching the selected filters." },
        { status: 404 },
      );
    }

    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.error("Failed to get random recipe:", error);

    return NextResponse.json(
      { error: "Failed to get random recipe." },
      { status: 500 },
    );
  }
};
