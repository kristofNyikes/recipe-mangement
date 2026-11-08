import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import {
  getRecipeImagePath,
  isRecipeImageFilename,
} from "@/app/lib/recipeImages";

interface Params {
  params: Promise<{ filename: string }>;
}

export const runtime = "nodejs";

const contentTypes: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(_request: Request, { params }: Params) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { filename } = await params;

    if (!isRecipeImageFilename(filename)) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const step = await prisma.step.findFirst({
      where: {
        imagePath: filename,
        recipe: {
          is: { userId: session.user.id },
        },
      },
      select: { id: true },
    });

    if (!step) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const image = await readFile(getRecipeImagePath(filename));
    const extension = filename.split(".").pop()!;

    return new Response(new Uint8Array(image), {
      status: 200,
      headers: {
        "Content-Type": contentTypes[extension],
        "Content-Length": String(image.length),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Failed to serve step image:", error);

    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
