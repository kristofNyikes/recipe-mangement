import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z.string().trim().min(1, "Collection name is required."),
});
