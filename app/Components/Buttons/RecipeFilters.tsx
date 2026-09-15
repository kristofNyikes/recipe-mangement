"use client";
import { useRouter, useSearchParams } from "next/navigation";
const RecipeFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSortBy = searchParams.get("sortBy") ?? "createdAt";
  const currentSortOrder = searchParams.get("sortOrder") ?? "desc";

  const setSort = (sortBy: string, sortOrder: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    router.push(`?${params.toString()}`);
  };

  const isActive = (sortBy: string, sortOrder: string) =>
    currentSortBy === sortBy && currentSortOrder === sortOrder;

  return (
    <div className="flex gap-2 m-7">
      <button
        className={`btn btn-sm ${isActive("createdAt", "desc") ? "btn-primary" : ""}`}
        onClick={() => setSort("createdAt", "desc")}
      >
        Newest
      </button>
      <button
        className={`btn btn-sm ${isActive("createdAt", "asc") ? "btn-primary" : ""}`}
        onClick={() => setSort("createdAt", "asc")}
      >
        Oldest
      </button>
      <button
        className={`btn btn-sm ${isActive("title", "asc") ? "btn-primary" : ""}`}
        onClick={() => setSort("title", "asc")}
      >
        A–Z
      </button>
      <button
        className={`btn btn-sm ${isActive("title", "desc") ? "btn-primary" : ""}`}
        onClick={() => setSort("title", "desc")}
      >
        Z–A
      </button>
    </div>
  );
};
export default RecipeFilters;
