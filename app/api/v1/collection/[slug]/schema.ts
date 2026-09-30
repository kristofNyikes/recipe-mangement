import z from "zod";

export const UpdateCollectionSchema = z.object({
  name: z.string().trim().min(1, "Collection name is required"),
});
