export type Validator<T> = (value: T) => string | undefined;

export function validateValue<T>(
  value: T,
  validators: Validator<T>[],
): string | undefined {
  for (const validator of validators) {
    const error = validator(value);

    if (error) {
      return error;
    }
  }

  return undefined;
}

export function composeValidators<T>(
  ...validators: Validator<T>[]
): Validator<T> {
  return (value) => validateValue(value, validators);
}

export function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function maxLength(max: number, message?: string): Validator<string> {
  return (value) => {
    if (value.length > max) {
      return message ?? `Must be ${max} characters or less.`;
    }

    return undefined;
  };
}

export function optionalMinLength(
  min: number,
  message?: string,
): Validator<string> {
  return (value) => {
    if (value.length === 0) {
      return undefined;
    }

    if (value.length < min) {
      return message ?? `Use at least ${min} characters.`;
    }

    return undefined;
  };
}
