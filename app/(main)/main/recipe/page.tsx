import Link from "next/link";

import RecipeFilters from "@/app/Components/Buttons/RecipeFilters";
import TagCheckbox from "@/app/Components/Checkbox/TagCheckbox";
import RecipeCardExtended from "@/app/Components/RecipeComponents/RecipeCardExtended";
import { parseTags } from "@/app/helpers/parseTags";
import { getAllRecipes } from "@/app/lib/requests";
import { Recipe, Tag } from "@/app/types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface AllRecipesProps {
  searchParams: Promise<{
    page?: string;
    sortBy?: string;
    sortOrder?: string;
    tags?: string;
  }>;
}

const AllRecipes = async ({ searchParams }: AllRecipesProps) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const params = await searchParams;

  const requestedPage = Number(params.page);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const sortBy =
    params.sortBy === "title" ||
    params.sortBy === "createdAt" ||
    params.sortBy === "updatedAt"
      ? params.sortBy
      : "createdAt";

  const sortOrder =
    params.sortOrder === "asc" || params.sortOrder === "desc"
      ? params.sortOrder
      : "desc";

  const selectedTags: Tag[] = parseTags(params.tags ?? "");

  const result = await getAllRecipes({
    page,
    limit: 10,
    sortBy,
    sortOrder,
    summary: false,
    tags: selectedTags,
    userId: session.user.id,
  });

  const recipes = result.data as Recipe[];
  const { totalPages } = result.pagination;

  const createPageHref = (targetPage: number) => {
    const query = new URLSearchParams();

    query.set("page", String(targetPage));
    query.set("sortBy", sortBy);
    query.set("sortOrder", sortOrder);

    if (params.tags) {
      query.set("tags", params.tags);
    }

    return `?${query.toString()}`;
  };

  return (
    <div>
      <div className="flex">
        <RecipeFilters />
        <TagCheckbox />
      </div>

      {recipes.map((recipe) => (
        <RecipeCardExtended recipe={recipe} key={recipe.slug} />
      ))}

      {totalPages > 1 && (
        <nav
          className="join flex justify-center my-6"
          aria-label="Recipe pagination"
        >
          {page > 1 ? (
            <Link href={createPageHref(page - 1)} className="join-item btn">
              Previous
            </Link>
          ) : (
            <span className="join-item btn btn-disabled">Previous</span>
          )}

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <Link
                key={pageNumber}
                href={createPageHref(pageNumber)}
                className={`join-item btn ${
                  pageNumber === page ? "btn-active" : ""
                }`}
                aria-current={pageNumber === page ? "page" : undefined}
              >
                {pageNumber}
              </Link>
            ),
          )}

          {page < totalPages ? (
            <Link href={createPageHref(page + 1)} className="join-item btn">
              Next
            </Link>
          ) : (
            <span className="join-item btn btn-disabled">Next</span>
          )}
        </nav>
      )}
    </div>
  );
};

export default AllRecipes;
