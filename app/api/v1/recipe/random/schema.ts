import { z } from "zod";
import { tags } from "@/app/types";

export const RandomSchema = z.object({
  tags: z.array(z.enum(tags)).default([]),
});
