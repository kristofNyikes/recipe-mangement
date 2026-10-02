"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

const CreateCollectionButton = () => {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDialog = () => {
    setName("");
    setError(null);
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    if (!isCreating) {
      dialogRef.current?.close();
    }
  };

  const createCollection = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Collection name is required.");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/collection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create collection.");
      }

      dialogRef.current?.close();
      setName("");
      router.refresh();
    } catch (error) {
      console.error("Failed to create collection:", error);
      setError("Failed to create collection.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={openDialog}>
        + Create collection
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h2 className="text-xl font-bold">Create collection</h2>

          <div className="mt-4">
            <label className="label" htmlFor="collection-name">
              <span className="label-text">Name</span>
            </label>

            <input
              id="collection-name"
              type="text"
              className="input input-bordered w-full"
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void createCollection();
                }
              }}
              autoFocus
              disabled={isCreating}
            />
          </div>

          {error && <p className="mt-2 text-sm text-error">{error}</p>}

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeDialog}
              disabled={isCreating}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={createCollection}
              disabled={isCreating || !name.trim()}
            >
              {isCreating ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Create"
              )}
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default CreateCollectionButton;
