import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

//DANGER NUKES THE WHOLE DATABASE DEVELOPMENT ONLY
export const DELETE = async () => {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.ingredient.deleteMany();
      await tx.step.deleteMany();
      await tx.recipe.deleteMany();
    });

    return NextResponse.json({ message: "Database cleared successfully" });
  } catch (error) {
    console.error("Failed to clear database: ", error);
    return NextResponse.json(
      {
        error: "Failed to clear database",
      },
      { status: 500 },
    );
  }
};
