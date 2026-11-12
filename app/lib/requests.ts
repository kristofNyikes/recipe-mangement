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
  userId: string;
}

export const getAllRecipes = async ({
  page,
  limit,
  sortBy,
  sortOrder,
  summary,
  tags,
  userId,
}: GetRecipesOptions) => {
  const sortField = sortBy === "title" ? "normalizedTitle" : sortBy;
  const queryOptions = {
    skip: (page - 1) * limit,
    take: limit,

    orderBy: {
      [sortField]: sortOrder,
    },
  };

  const where: Prisma.RecipeWhereInput = {
    userId,
    ...(tags?.length ? { tags: { hasSome: tags } } : {}),
  };

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

export const getAllFavoriteRecipes = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
) => {
  const where = {
    isFavorite: true,
    userId,
  };

  const total = await prisma.recipe.count({ where });
  const totalPages = Math.ceil(total / limit);
  const currentPage = totalPages > 0 ? Math.min(page, totalPages) : 1;

  const recipes = await prisma.recipe.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * limit,
    take: limit,
    include: { ingredients: true, steps: true },
  });

  return {
    data: recipes,
    pagination: {
      page: currentPage,
      limit,
      total,
      totalPages,
    },
  };
};

export const createCollection = async (name: string, userId: string) => {
  const slug = generateSLug(name);

  return prisma.collection.create({
    data: {
      name,
      normalizedName: name.toLowerCase(),
      slug,
      userId,
    },
  });
};

export const getAllCollections = async ({
  page,
  limit,
  sortBy,
  sortOrder,
  userId,
}: {
  page: number;
  limit: number;
  sortBy: CollectionSortBy;
  sortOrder: Prisma.SortOrder;
  userId: string;
}) => {
  const skip = (page - 1) * limit;

  const orderByField = sortBy === "name" ? "normalizedName" : sortBy;

  const [collections, total] = await prisma.$transaction([
    prisma.collection.findMany({
      skip,
      take: limit,
      where: { userId },
      orderBy: {
        [orderByField]: sortOrder,
      },
      include: {
        _count: {
          select: {
            recipes: true,
          },
        },
        recipes: {
          take: 5,
          orderBy: {
            normalizedTitle: "asc",
          },
          select: {
            title: true,
            slug: true,
          },
        },
      },
    }),
    prisma.collection.count({ where: { userId } }),
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

export const updateCollection = async (
  slug: string,
  name: string,
  userId: string,
) => {
  const newSlug = generateSLug(name);
  return prisma.collection.update({
    where: {
      slug,
      userId,
    },
    data: {
      name,
      normalizedName: name.toLowerCase(),
      slug: newSlug,
    },
  });
};

export const deleteCollection = async (slug: string, userId: string) => {
  return prisma.collection.delete({
    where: {
      slug,
      userId,
    },
  });
};

export const getCollectionRecipes = async (
  slug: string,
  userId: string,
  page: number = 1,
  limit: number = 10,
) => {
  const collection = await prisma.collection.findUnique({
    where: { slug, userId },
    select: {
      name: true,
      recipes: { include: { ingredients: true, steps: true } },
      _count: { select: { recipes: true } },
    },
  });

  if (!collection) return null;

  const total = collection._count.recipes;
  const totalPages = Math.ceil(total / limit);
  const currentPage = totalPages > 0 ? Math.min(page, totalPages) : 1;

  const collectionWithRecipes = await prisma.collection.findUnique({
    where: { slug, userId },
    select: {
      recipes: {
        orderBy: { createdAt: "desc" },
        skip: (currentPage - 1) * limit,
        take: limit,
        include: {
          ingredients: true,
          steps: true,
        },
      },
    },
  });

  return {
    name: collection.name,
    recipes: (collectionWithRecipes?.recipes ?? []).map((recipe) => ({
      ...recipe,
      ingredients: recipe.ingredients.map((ingredient) => ({
        ...ingredient,
        amount: ingredient.amount?.toNumber() ?? null,
      })),
    })),
    recipeCount: total,
    pagination: {
      page: currentPage,
      limit,
      total,
      totalPages,
    },
  };
};
export const addRecipeToCollection = async (
  collectionSlug: string,
  recipeSlug: string,
  userId: string,
) => {
  return prisma.collection.update({
    where: { slug: collectionSlug, userId },
    data: {
      recipes: {
        connect: {
          slug: recipeSlug,
          userId,
        },
      },
      updatedAt: new Date(),
    },
  });
};

export const deleteRecipeFromCollection = async (
  collectionSlug: string,
  recipeSlug: string,
  userId: string,
) => {
  return prisma.collection.update({
    where: { slug: collectionSlug, userId },
    data: {
      recipes: {
        disconnect: {
          slug: recipeSlug,
          userId,
        },
      },
      updatedAt: new Date(),
    },
  });
};

export const getRecentCollectionsForRecipe = async (
  recipeSlug: string,
  userId: string,
) => {
  const collections = await prisma.collection.findMany({
    where: {
      userId,
    },
    take: 10,
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      name: true,
      slug: true,
      recipes: {
        where: {
          slug: recipeSlug,
          userId,
        },
        select: {
          id: true,
        },
      },
    },
  });

  return collections.map((collection) => ({
    name: collection.name,
    slug: collection.slug,
    containsRecipe: collection.recipes.length > 0,
  }));
};

export const getRandomRecipe = async ({
  tags = [],
  matchMode = "any",
  userId,
}: {
  tags?: Tag[];
  matchMode?: "any" | "all";
  userId: string;
}) => {
  const where = {
    userId,
    ...(tags.length === 0
      ? {}
      : {
          tags: matchMode === "all" ? { hasEvery: tags } : { hasSome: tags },
        }),
  };

  const matchingRecipes = await prisma.recipe.findMany({
    where,
    select: { id: true },
  });

  if (matchingRecipes.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * matchingRecipes.length);
  const selectedId = matchingRecipes[randomIndex].id;

  const recipe = await prisma.recipe.findUnique({
    where: { id: selectedId, userId },
    include: { ingredients: true, steps: true },
  });

  if (!recipe) return null;

  return {
    ...recipe,
    ingredients: recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      amount: ingredient.amount?.toNumber() ?? null,
    })),
  };
};
