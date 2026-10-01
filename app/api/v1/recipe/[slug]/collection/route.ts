import { NextResponse } from "next/server";

import { getRecentCollectionsForRecipe } from "@/app/lib/requests";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export const GET = async (_req: Request, { params }: Props) => {
  try {
    const { slug } = await params;

    const collections = await getRecentCollectionsForRecipe(slug);

    return NextResponse.json(collections, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get recipe collections." },
      { status: 500 },
    );
  }
};
