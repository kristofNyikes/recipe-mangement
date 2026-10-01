"use client";

import { useState } from "react";
import Image from "next/image";

interface Collection {
  name: string;
  slug: string;
  containsRecipe: boolean;
}

interface SaveToCollectionButtonProps {
  recipeSlug: string;
  collections: Collection[];
}

const SaveToCollectionButton = ({
  recipeSlug,
  collections: initialCollections,
}: SaveToCollectionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [collections, setCollections] = useState(initialCollections);
  const [updatingSlug, setUpdatingSlug] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);

  const toggleCollection = async (collectionSlug: string, checked: boolean) => {
    setUpdatingSlug(collectionSlug);

    try {
      const response = await fetch(
        `/api/v1/collection/${collectionSlug}/recipe`,
        {
          method: checked ? "POST" : "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipeSlug,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update collection.");
      }

      setCollections((current) =>
        current.map((collection) =>
          collection.slug === collectionSlug
            ? {
                ...collection,
                containsRecipe: checked,
              }
            : collection,
        ),
      );
    } catch (error) {
      console.error("Failed to update collection:", error);
    } finally {
      setUpdatingSlug(null);
    }
  };

  const createCollection = async () => {
    const name = newCollectionName.trim();

    if (!name) return;

    setIsCreating(true);
    setCreateError(null);

    try {
      const response = await fetch("/api/v1/collection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(result?.error ?? "Failed to create collection.");
      }

      const collection = await response.json();

      const recipeResponse = await fetch(
        `/api/v1/collection/${collection.slug}/recipe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipeSlug,
          }),
        },
      );

      if (!recipeResponse.ok) {
        throw new Error(
          "Collection was created, but recipe could not be added.",
        );
      }

      setCollections((current) => [
        {
          name: collection.name,
          slug: collection.slug,
          containsRecipe: true,
        },
        ...current,
      ]);

      setNewCollectionName("");
    } catch (error) {
      console.error("Failed to create collection:", error);

      setCreateError(
        error instanceof Error ? error.message : "Failed to create collection.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-success btn-sm"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src="/images/savedIcon.svg"
          alt={"save to collection button"}
          width={20}
          height={20}
        />
      </button>

      {isOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Save to collection</h3>

            <div className="mt-4 space-y-2">
              {collections.length === 0 ? (
                <p className="text-base-content/70">
                  You don't have any collections yet.
                </p>
              ) : (
                collections.map((collection) => (
                  <label
                    key={collection.slug}
                    className="flex cursor-pointer items-center gap-3 rounded-box p-3 hover:bg-base-200"
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={collection.containsRecipe}
                      disabled={updatingSlug === collection.slug}
                      onChange={(event) =>
                        toggleCollection(collection.slug, event.target.checked)
                      }
                    />

                    <span>{collection.name}</span>

                    {updatingSlug === collection.slug && (
                      <span className="loading loading-spinner loading-xs ml-auto" />
                    )}
                  </label>
                ))
              )}

              <div className="divider" />

              <div className="flex flex-col gap-3">
                <h4 className="font-semibold">Create new collection</h4>

                <div className="flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered flex-1"
                    placeholder="Collection name"
                    value={newCollectionName}
                    onChange={(event) =>
                      setNewCollectionName(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        createCollection();
                      }
                    }}
                    disabled={isCreating}
                  />

                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!newCollectionName.trim() || isCreating}
                    onClick={createCollection}
                  >
                    {isCreating ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      "Create"
                    )}
                  </button>
                </div>

                {createError && (
                  <p className="text-sm text-error">{createError}</p>
                )}
              </div>
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>

          <button
            type="button"
            className="modal-backdrop"
            aria-label="Close"
            onClick={() => setIsOpen(false)}
          />
        </dialog>
      )}
    </>
  );
};

export default SaveToCollectionButton;
