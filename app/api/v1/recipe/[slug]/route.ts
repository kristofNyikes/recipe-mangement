import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

interface params {
  params: Promise<{ slug: string }>;
}

export const GET = async (req: NextRequest, { params }: params) => {
  try {
    const { slug } = await params;

    const recipe = await prisma.recipe.findUnique({
      where: { slug: slug },
      include: {
        ingredients: { orderBy: { name: "asc" } },
        steps: { orderBy: { stepNumber: "asc" } },
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json({ data: recipe }, { status: 200 });
  } catch (error) {
    console.error("Error fetchin recipe: ", error);
    return NextResponse.json(
      { error: " Failed to fetch recipe" },
      { status: 500 },
    );
  }
};
