import Link from "next/link";

import RecipeCardExtended from "@/app/Components/RecipeComponents/RecipeCardExtended";
import { getAllFavoriteRecipes } from "@/app/lib/requests";
import { Recipe } from "@/app/types";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface FavoriteRecipesProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const FavoriteRecipes = async ({ searchParams }: FavoriteRecipesProps) => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const params = await searchParams;
  const requestedPage = Number(params.page);

  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const result = await getAllFavoriteRecipes(session.user.id, page, 10);

  const recipes = result.data as Recipe[];
  const { page: currentPage, totalPages } = result.pagination;

  const createPageHref = (targetPage: number) => `?page=${targetPage}`;

  return (
    <div>
      {recipes.length === 0 && (
        <p className="text-base-content/70">
          You haven't added any favorite recipes yet.
        </p>
      )}

      {recipes.map((recipe) => (
        <RecipeCardExtended recipe={recipe} key={recipe.slug} />
      ))}

      {totalPages > 1 && (
        <nav
          className="join flex justify-center my-6"
          aria-label="Favorite recipes pagination"
        >
          {currentPage > 1 ? (
            <Link
              href={createPageHref(currentPage - 1)}
              className="join-item btn"
            >
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
                  pageNumber === currentPage ? "btn-active" : ""
                }`}
                aria-current={pageNumber === currentPage ? "page" : undefined}
              >
                {pageNumber}
              </Link>
            ),
          )}

          {currentPage < totalPages ? (
            <Link
              href={createPageHref(currentPage + 1)}
              className="join-item btn"
            >
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

export default FavoriteRecipes;
