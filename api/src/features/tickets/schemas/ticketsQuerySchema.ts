import { z } from "zod";

export const ticketsQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .max(120)
    .optional()
    .default("")
    .refine(
      (value) => value.length === 0 || value.length >= 2,
      "Search must be at least 2 characters.",
    ),
});
