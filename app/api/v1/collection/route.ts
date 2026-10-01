import { NextRequest, NextResponse } from "next/server";
import { createCollection, getAllCollections } from "@/app/lib/requests";
import { createCollectionSchema } from "./schema";
import { CollectionSortBy } from "@/app/types";
import { Prisma } from "@/generated/prisma";

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

export const GET = async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;

  const requestedPage = Number(searchParams.get("page"));
  const requestedLimit = Number(searchParams.get("limit"));
  const requestedSortBy = searchParams.get("sortBy");

  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const limit =
    Number.isInteger(requestedLimit) &&
    requestedLimit > 0 &&
    requestedLimit <= 100
      ? requestedLimit
      : 10;

  const sortBy: CollectionSortBy =
    requestedSortBy === "name" ||
    requestedSortBy === "createdAt" ||
    requestedSortBy === "updatedAt"
      ? requestedSortBy
      : "updatedAt";

  const sortOrder: Prisma.SortOrder =
    searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

  try {
    const collections = await getAllCollections({
      page,
      limit,
      sortBy,
      sortOrder,
    });

    return NextResponse.json(collections, { status: 200 });
  } catch (error) {
    console.error("Failed to get collections:", error);

    return NextResponse.json(
      { error: "Failed to get collections." },
      { status: 500 },
    );
  }
};
