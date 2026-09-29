import { NextRequest, NextResponse } from "next/server";
import { createCollection, getAllCollections } from "@/app/lib/requests";
import { createCollectionSchema } from "./schema";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const result = createCollectionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid collection data." },
        { status: 400 },
      );
    }

    const collection = await createCollection(result.data.name);

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create collection" },
      { status: 500 },
    );
  }
};

export const GET = async () => {
  try {
    const collection = await getAllCollections();

    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get collections" },
      { status: 500 },
    );
  }
};
