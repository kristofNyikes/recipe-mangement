"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface DeleteRecipeButtonProps {
  slug: string;
}

const DeleteRecipeButton = ({ slug }: DeleteRecipeButtonProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this recipe?",
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/v1/recipe/${slug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }

      router.push("/main/recipe");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={handleDelete}
      disabled={isDeleting}
      aria-label="Delete recipe"
    >
      {isDeleting ? (
        <span className="loading loading-spinner loading-sm" />
      ) : (
        <Image
          src="/images/deleteIcon.svg"
          alt="Delete recipe"
          width={20}
          height={20}
        />
      )}
    </button>
  );
};

export default DeleteRecipeButton;
