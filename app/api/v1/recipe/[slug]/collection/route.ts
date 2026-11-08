import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRecentCollectionsForRecipe } from "@/app/lib/requests";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export const GET = async (_req: Request, { params }: Props) => {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { slug } = await params;

    const collections = await getRecentCollectionsForRecipe(
      slug,
      session.user.id,
    );

    return NextResponse.json(collections, { status: 200 });
  } catch (error) {
    console.error("Failed to get recipe collections:", error);

    return NextResponse.json(
      { error: "Failed to get recipe collections." },
      { status: 500 },
    );
  }
};
