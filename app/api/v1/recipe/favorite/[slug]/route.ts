import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { auth } from "@/auth";

interface Params {
  params: Promise<{ slug: string }>;
}

export const POST = async (_req: NextRequest, { params }: Params) => {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { slug } = await params;

    const recipe = await prisma.recipe.update({
      where: { slug, userId: session.user.id },
      data: {
        isFavorite: true,
      },
    });

    return NextResponse.json({ data: recipe }, { status: 200 });
  } catch (error) {
    console.error("Error updating recipe", error);

    return NextResponse.json(
      { error: "Failed to update recipe" },
      { status: 500 },
    );
  }
};

export const DELETE = async (_req: NextRequest, { params }: Params) => {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { slug } = await params;

    const recipe = await prisma.recipe.update({
      where: { slug, userId: session.user.id },
      data: {
        isFavorite: false,
      },
    });

    return NextResponse.json({ data: recipe }, { status: 200 });
  } catch (error) {
    console.error("Error updating recipe", error);

    return NextResponse.json(
      { error: "Failed to update recipe" },
      { status: 500 },
    );
  }
};
