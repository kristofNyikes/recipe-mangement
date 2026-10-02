import CollectionCard from "@/app/Components/CollectionComponents/CollectionCard";
import { getAllCollections } from "@/app/lib/requests";
import Link from "next/link";

const Collections = async () => {
  const result = await getAllCollections({
    page: 1,
    limit: 3,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const collections = result.collections;

  return (
    <div className="card bg-base-200 shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Collections</h2>
        <Link href="/main/collections" className="underline">
          Vew All
        </Link>
        <div className="grid gap-3">
          {collections.map((collection) => (
            <CollectionCard key={collection.slug} {...collection} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
