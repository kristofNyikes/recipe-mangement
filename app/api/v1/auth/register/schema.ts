import { z } from "zod";

export const RegisterSchema = z.object({
  email: z
    .string()
    .trim()
    .max(254)
    .pipe(z.email())
    .transform((email) => email.toLowerCase()),
  password: z.string().min(7).max(128),
});
