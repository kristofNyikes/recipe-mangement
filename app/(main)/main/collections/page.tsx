import CollectionListCard from "@/app/Components/CollectionComponents/CollectionListCard";
import CreateCollectionButton from "@/app/Components/Buttons/CreateCollection";

import { getAllCollections } from "@/app/lib/requests";

const CollectionsPage = async () => {
  const result = await getAllCollections({
    page: 1,
    limit: 10,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Collections</h1>
          <p className="mt-1 text-base-content/60">
            Browse your recipe collections.
          </p>
        </div>

        <CreateCollectionButton />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {result.collections.map((collection) => (
          <CollectionListCard key={collection.slug} {...collection} />
        ))}
      </div>
    </div>
  );
};

export default CollectionsPage;
