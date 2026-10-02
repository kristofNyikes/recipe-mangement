import Link from "next/link";

import CollectionActions from "./CollectionActions";

interface CollectionListCardProps {
  name: string;
  slug: string;
  recipeCount: number;
  recipes: {
    title: string;
    slug: string;
  }[];
}

const CollectionListCard = ({
  name,
  slug,
  recipeCount,
  recipes,
}: CollectionListCardProps) => {
  return (
    <div className="card border border-base-300 bg-base-100 transition-shadow hover:shadow-md">
      <Link href={`/main/collections/${slug}`} className="block">
        <div className="card-body">
          <div>
            <h2 className="card-title">{name}</h2>

            <p className="text-sm text-base-content/60">
              {recipeCount} {recipeCount === 1 ? "recipe" : "recipes"}
            </p>
          </div>

          {recipes.length > 0 && (
            <div className="mt-2 space-y-1">
              {recipes.map((recipe) => (
                <p key={recipe.slug} className="text-sm">
                  {recipe.title}
                </p>
              ))}
            </div>
          )}

          <span className="mt-2 text-sm text-primary">View collection →</span>
        </div>
      </Link>

      <div className="flex justify-end px-6 pb-6">
        <CollectionActions slug={slug} name={name} />
      </div>
    </div>
  );
};

export default CollectionListCard;
