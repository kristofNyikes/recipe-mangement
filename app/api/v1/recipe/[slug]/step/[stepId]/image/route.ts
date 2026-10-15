import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import prisma from "@/prisma/client";
import {
  detectRecipeImageType,
  getRecipeImagePath,
  isRecipeImageFilename,
  MAX_RECIPE_IMAGE_SIZE,
  RECIPE_IMAGE_DIR,
} from "@/app/lib/recipeImages";

interface Params {
  params: Promise<{ slug: string; stepId: string }>;
}

export const runtime = "nodejs";

export async function POST(request: NextRequest, { params }: Params) {
  let savedPath: string | undefined;
  let databaseUpdated = false;

  try {
    const { slug, stepId: rawStepId } = await params;
    const stepId = Number(rawStepId);

    if (!Number.isSafeInteger(stepId) || stepId <= 0) {
      return NextResponse.json({ error: "Invalid step ID" }, { status: 400 });
    }

    const step = await prisma.step.findFirst({
      where: {
        id: stepId,
        recipe: { slug },
      },
      select: {
        id: true,
        imagePath: true,
        recipe: { select: { slug: true } },
      },
    });

    if (!step) {
      return NextResponse.json(
        { error: "Recipe step not found" },
        { status: 404 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "Please upload an image using the 'image' field" },
        { status: 400 },
      );
    }

    if (file.size > MAX_RECIPE_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Image must be 5 MB or smaller" },
        { status: 413 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const imageType = detectRecipeImageType(buffer);

    if (!imageType || file.type !== imageType.mimeType) {
      return NextResponse.json(
        { error: "Only valid JPEG, PNG, and WebP images are supported" },
        { status: 400 },
      );
    }

    const filename = `${randomUUID()}.${imageType.extension}`;
    savedPath = getRecipeImagePath(filename);

    await mkdir(RECIPE_IMAGE_DIR, { recursive: true });
    await writeFile(savedPath, buffer, { flag: "wx" });

    await prisma.step.update({
      where: { id: step.id },
      data: { imagePath: filename },
    });

    databaseUpdated = true;

    if (step.imagePath) {
      const oldImagePath = getRecipeImagePath(step.imagePath);

      if (!isRecipeImageFilename(step.imagePath)) {
      } else {
        try {
          await unlink(oldImagePath);
        } catch (error) {
          console.error("[step image] Failed to delete old image:", {
            oldImagePath,
            error,
          });
        }
      }
    }

    revalidatePath("/main");

    return NextResponse.json(
      {
        data: {
          stepId: step.id,
          imagePath: filename,
          imageUrl: `/api/v1/recipe/step-image/${filename}`,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    if (savedPath && !databaseUpdated) {
      await unlink(savedPath).catch(() => {});
    }

    console.error("Failed to upload step image:", error);

    return NextResponse.json(
      { error: "Failed to upload step image" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { slug, stepId: rawStepId } = await params;
    const stepId = Number(rawStepId);

    if (!Number.isSafeInteger(stepId) || stepId <= 0) {
      return NextResponse.json({ error: "Invalid step ID" }, { status: 400 });
    }

    const step = await prisma.step.findFirst({
      where: {
        id: stepId,
        recipe: { slug },
      },
      select: { id: true, imagePath: true },
    });

    if (!step) {
      return NextResponse.json(
        { error: "Recipe step not found" },
        { status: 404 },
      );
    }

    if (!step.imagePath) {
      return NextResponse.json(
        { error: "Step has no image to delete" },
        { status: 404 },
      );
    }

    if (!isRecipeImageFilename(step.imagePath)) {
      console.error("Invalid step image filename:", step.imagePath);

      return NextResponse.json(
        { error: "Stored step image path is invalid" },
        { status: 500 },
      );
    }

    await prisma.step.update({
      where: { id: step.id },
      data: { imagePath: null },
    });

    try {
      await unlink(getRecipeImagePath(step.imagePath));
    } catch (error) {
      if (
        !(error instanceof Error && "code" in error && error.code === "ENOENT")
      ) {
        console.error("Could not remove step image file:", error);
        revalidatePath("/main");

        return NextResponse.json(
          { error: "Image reference removed, but file cleanup failed" },
          { status: 500 },
        );
      }
    }

    revalidatePath("/main");

    return NextResponse.json({
      data: { stepId: step.id, imagePath: null },
    });
  } catch (error) {
    console.error("Failed to delete step image:", error);

    return NextResponse.json(
      { error: "Failed to delete step image" },
      { status: 500 },
    );
  }
}
