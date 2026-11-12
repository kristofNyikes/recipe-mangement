import Link from "next/link";

import { notFound, redirect } from "next/navigation";

import CollectionRecipeList from "@/app/Components/CollectionComponents/CollectionRecipeList";

import { getCollectionRecipes } from "@/app/lib/requests";
import CollectionActions from "@/app/Components/CollectionComponents/CollectionActions";

import { auth } from "@/auth";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

const CollectionPage = async ({
  params,
  searchParams,
}: CollectionPageProps) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  try {
    const { slug } = await params;
    const query = await searchParams;

    const requestedPage = Number(query.page);
    const page =
      Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

    const collection = await getCollectionRecipes(
      slug,
      session.user.id,
      page,
      10,
    );

    if (!collection) {
      notFound();
    }

    return (
      <main className="container mx-auto p-4">
        <div className="mb-6">
          <Link
            href="/main/collections"
            className="text-sm text-primary hover:underline"
          >
            ← Back to collections
          </Link>

          <h1 className="mt-3 text-3xl font-bold">{collection.name}</h1>

          <p className="mt-1 text-base-content/70">
            {collection.recipeCount}{" "}
            {collection.recipeCount === 1 ? "recipe" : "recipes"}
          </p>
        </div>

        <CollectionRecipeList
          collectionSlug={slug}
          recipes={collection.recipes}
          currentPage={collection.pagination.page}
          totalPages={collection.pagination.totalPages}
        />

        <CollectionActions slug={slug} name={collection.name} />
      </main>
    );
  } catch (error) {
    console.error("Failed to get collection:", error);
    throw error;
  }
};

export default CollectionPage;
