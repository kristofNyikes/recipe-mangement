import Link from "next/link";

import { Collection } from "@/app/types";

const CollectionCard = (collection: Collection) => {
  return (
    <Link
      href={`/main/collections/${collection.slug}`}
      className="card border border-base-300 bg-base-100 transition-shadow hover:shadow-md"
    >
      <div className="card-body">
        <h3 className="card-title text-base">{collection.name}</h3>

        <span className="text-sm text-primary">
          {collection.recipeCount}{" "}
          {collection.recipeCount === 1 ? "recipe" : "recipes"} →
        </span>
      </div>
    </Link>
  );
};

export default CollectionCard;
