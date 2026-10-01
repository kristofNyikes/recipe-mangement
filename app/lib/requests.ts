import prisma from "@/prisma/client";
import { Prisma } from "@/generated/prisma";
import { CollectionSortBy, Tag } from "../types";
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
      normalizedName: name.toLowerCase(),
      slug,
    },
  });
};

export const getAllCollections = async ({
  page,
  limit,
  sortBy,
  sortOrder,
}: {
  page: number;
  limit: number;
  sortBy: CollectionSortBy;
  sortOrder: Prisma.SortOrder;
}) => {
  const skip = (page - 1) * limit;

  const orderByField = sortBy === "name" ? "normalizedName" : sortBy;

  const [collections, total] = await prisma.$transaction([
    prisma.collection.findMany({
      skip,
      take: limit,
      orderBy: {
        [orderByField]: sortOrder,
      },
      include: {
        _count: {
          select: {
            recipes: true,
          },
        },
      },
    }),
    prisma.collection.count(),
  ]);

  return {
    collections: collections.map(({ _count, ...collection }) => ({
      ...collection,
      recipeCount: _count.recipes,
    })),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const updateCollection = async (slug: string, name: string) => {
  const newSlug = generateSLug(name);
  return prisma.collection.update({
    where: {
      slug,
    },
    data: {
      name,
      normalizedName: name.toLowerCase(),
      slug: newSlug,
    },
  });
};

export const deleteCollection = async (slug: string) => {
  return prisma.collection.delete({
    where: {
      slug,
    },
  });
};

export const getCollectionRecipes = async (slug: string) => {
  const collection = await prisma.collection.findUnique({
    where: {
      slug,
    },
    select: {
      recipes: true,
      _count: {
        select: {
          recipes: true,
        },
      },
    },
  });

  if (!collection) {
    return null;
  }

  return {
    recipes: collection.recipes,
    recipeCount: collection._count.recipes,
  };
};

export const addRecipeToCollection = async (
  collectionSlug: string,
  recipeSlug: string,
) => {
  return prisma.collection.update({
    where: {
      slug: collectionSlug,
    },
    data: {
      recipes: {
        connect: {
          slug: recipeSlug,
        },
      },
    },
  });
};

export const deleteRecipeFromCollection = async (
  collectionSlug: string,
  recipeSlug: string,
) => {
  return prisma.collection.update({
    where: {
      slug: collectionSlug,
    },
    data: {
      recipes: {
        disconnect: {
          slug: recipeSlug,
        },
      },
    },
  });
};
