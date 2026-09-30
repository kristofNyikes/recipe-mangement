import z from "zod";

export const collectionRecipeSchema = z.object({
  recipeSlug: z.string().min(1),
});
