"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface CollectionActionsProps {
  slug: string;
  name: string;
}

const CollectionActions = ({
  slug,
  name: initialName,
}: CollectionActionsProps) => {
  const router = useRouter();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState(initialName);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const updateCollection = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Collection name is required.");
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/collection/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update collection.");
      }

      setIsEditOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to update collection:", error);
      setError("Failed to update collection.");
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteCollection = async () => {
    const confirmed = window.confirm(
      `Delete "${initialName}"?\n\nThis will remove the collection, but not any of the recipes inside it.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/collection/${slug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete collection.");
      }

      router.push("/main/collections");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete collection:", error);
      setError("Failed to delete collection.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => {
            setName(initialName);
            setError(null);
            setIsEditOpen(true);
          }}
          disabled={isDeleting}
        >
          Edit
        </button>

        <button
          type="button"
          className="btn btn-error btn-sm"
          onClick={deleteCollection}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <span className="loading loading-spinner loading-xs" />
          ) : (
            "Delete"
          )}
        </button>
      </div>

      {isEditOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <h2 className="text-xl font-bold">Edit collection</h2>

            <div className="mt-4">
              <label htmlFor={`collection-name-${slug}`} className="label">
                <span className="label-text">Name</span>
              </label>

              <input
                id={`collection-name-${slug}`}
                type="text"
                className="input input-bordered w-full"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void updateCollection();
                  }
                }}
                disabled={isUpdating}
                autoFocus
              />
            </div>

            {error && <p className="mt-2 text-sm text-error">{error}</p>}

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setIsEditOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={updateCollection}
                disabled={isUpdating || !name.trim()}
              >
                {isUpdating ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default CollectionActions;
