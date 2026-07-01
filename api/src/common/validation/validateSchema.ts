import type { z, ZodTypeAny } from "zod";

type ValidationSuccess<TSchema extends ZodTypeAny> = {
  success: true;
  data: z.infer<TSchema>;
};

type ValidationFailure = {
  success: false;
  message: string;
  issues: string[];
};

type ValidationResult<TSchema extends ZodTypeAny> =
  | ValidationSuccess<TSchema>
  | ValidationFailure;

// Shared schema validator that returns a typed success result or normalized issue list.
// Callers decide how to map failures to HTTP errors/messages.
export function validateSchema<TSchema extends ZodTypeAny>(
  schema: TSchema,
  payload: unknown,
): ValidationResult<TSchema> {
  const parsed = schema.safeParse(payload);

  if (parsed.success) {
    return {
      success: true,
      data: parsed.data,
    };
  }

  return {
    success: false,
    message: "Validation failed",
    issues: parsed.error.issues.map((issue) => {
      const path = issue.path.length > 0 ? `${issue.path.join(".")}: ` : "";

      return `${path}${issue.message}`;
    }),
  };
}
