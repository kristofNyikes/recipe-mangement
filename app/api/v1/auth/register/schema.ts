import { z } from "zod";

export const RegisterSchema = z.object({
  email: z
    .email()
    .trim()
    .max(254)
    .transform((email) => email.toLowerCase()),
  password: z.string().min(7).max(128),
});
