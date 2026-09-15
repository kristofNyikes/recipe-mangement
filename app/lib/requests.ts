import prisma from "@/prisma/client";
import { Prisma } from "@/generated/prisma";

interface GetRecipesOptions {
  page: number;
  limit: number;
  sortBy: "title" | "createdAt" | "updatedAt";
  sortOrder: Prisma.SortOrder;
  summary: boolean;
}

export const getAllRecipes = async ({
  page,
  limit,
  sortBy,
  sortOrder,
  summary,
}: GetRecipesOptions) => {
  const sortField = sortBy === "title" ? "normalizedTitle" : sortBy;
  const queryOptions = {
    skip: (page - 1) * limit,
    take: limit,

    orderBy: {
      [sortField]: sortOrder,
    },
  };

  const recipes = summary
    ? await prisma.recipe.findMany({
        ...queryOptions,

        select: {
          title: true,
          slug: true,
          prepTime: true,
          cookTime: true,
          servings: true,
        },
      })
    : await prisma.recipe.findMany({
        ...queryOptions,

        include: {
          ingredients: true,
          steps: true,
        },
      });

  const count = await prisma.recipe.count();

  return {
    data: recipes,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};
