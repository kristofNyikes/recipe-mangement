import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";

export const GET = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const [user, favoriteCount] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          email: true,
          _count: {
            select: {
              recipes: true,
              collections: true,
            },
          },
        },
      }),

      prisma.recipe.count({
        where: {
          userId: session.user.id,
          isFavorite: true,
        },
      }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        email: user.email,
        stats: {
          recipes: user._count.recipes,
          collections: user._count.collections,
          favorites: favoriteCount,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to get profile:", error);

    return NextResponse.json(
      { error: "Failed to get profile." },
      { status: 500 },
    );
  }
};
