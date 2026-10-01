import Link from "next/link";

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
    <Link
      href={`/main/collections/${slug}`}
      className="card border border-base-300 bg-base-100 transition-shadow hover:shadow-md"
    >
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
  );
};

export default CollectionListCard;
