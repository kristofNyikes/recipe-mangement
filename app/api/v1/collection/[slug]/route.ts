import { NextRequest, NextResponse } from "next/server";
import { UpdateCollectionSchema } from "./schema";
import { deleteCollection, updateCollection } from "@/app/lib/requests";
interface RouteParams {
  params: Promise<{ slug: string }>;
}

export const PUT = async (req: NextRequest, { params }: RouteParams) => {
  const { slug } = await params;

  try {
    const body = await req.json();

    const result = UpdateCollectionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid collection data" },
        { status: 400 },
      );
    }

    const collection = await updateCollection(slug, result.data.name);

    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update collection." },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest, { params }: RouteParams) => {
  const { slug } = await params;

  try {
    await deleteCollection(slug);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete collection." },
      { status: 500 },
    );
  }
};
