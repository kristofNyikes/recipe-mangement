import Link from "next/link";

import { notFound } from "next/navigation";

import CollectionRecipeList from "@/app/Components/CollectionComponents/CollectionRecipeList";

import { getCollectionRecipes } from "@/app/lib/requests";

interface CollectionPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const CollectionPage = async ({ params }: CollectionPageProps) => {
  try {
    const { slug } = await params;

    const collection = await getCollectionRecipes(slug);

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
        />
      </main>
    );
  } catch (error) {
    console.error("Failed to get collection:", error);
    throw error;
  }
};

export default CollectionPage;
