import prisma from "@/prisma/client";
import { Prisma } from "@/generated/prisma";
import { Tag } from "../types";
import generateSLug from "../helpers/slugify";

interface GetRecipesOptions {
  page: number;
  limit: number;
  sortBy: "title" | "createdAt" | "updatedAt";
  sortOrder: Prisma.SortOrder;
  summary: boolean;
  tags?: Tag[];
}

export const getAllRecipes = async ({
  page,
  limit,
  sortBy,
  sortOrder,
  summary,
  tags,
}: GetRecipesOptions) => {
  const sortField = sortBy === "title" ? "normalizedTitle" : sortBy;
  const queryOptions = {
    skip: (page - 1) * limit,
    take: limit,

    orderBy: {
      [sortField]: sortOrder,
    },
  };

  const where: Prisma.RecipeWhereInput = tags?.length
    ? { tags: { hasSome: tags } }
    : {};

  const recipes = summary
    ? await prisma.recipe.findMany({
        ...queryOptions,
        where,
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
        where,
        include: {
          ingredients: true,
          steps: true,
        },
      });

  const count = await prisma.recipe.count({ where });

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

export const getAllFavoriteRecipes = async () => {
  const recipes = await prisma.recipe.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: { isFavorite: true },
    include: {
      ingredients: true,
      steps: true,
    },
  });

  return { data: recipes };
};

export const createCollection = async (name: string) => {
  const slug = generateSLug(name);

  return prisma.collection.create({
    data: {
      name,
      slug,
    },
  });
};

export const getAllCollections = async () => {
  return prisma.collection.findMany({
    orderBy: {
      name: "asc",
    },
  });
};
