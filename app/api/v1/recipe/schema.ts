import { z } from "zod";
import { Unit } from "@/generated/prisma";

export const CreateRecipeSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().optional(),

  prepTime: z.number().int().nonnegative(),
  cookTime: z.number().int().nonnegative(),
  servings: z.number().int().positive(),

  ingredients: z
    .array(
      z.object({
        name: z.string().trim().min(1),
        amount: z.number().positive(),
        unit: z.enum(Unit).optional(),
        note: z.string().trim().optional(),
        stepNumber: z.number().int().positive().optional(),
      }),
    )
    .min(1, "At least one ingredient is required"),

  steps: z
    .array(
      z.object({
        stepNumber: z.number().int().positive(),
        text: z.string().trim().min(1),
      }),
    )
    .min(1, "At least one step is required"),
});
