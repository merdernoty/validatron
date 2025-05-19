export class ValidationError extends Error {
  constructor(
    public path: string,
    message: string
  ) {
    super(`${path}: ${message}`);
    this.name = "ValidationError";
  }
}

export type ValidatorFn = (value: unknown, path: string) => void;

export function isString(value: unknown, path = "value"): string {
  if (typeof value !== "string") {
    throw new ValidationError(path, "ожидается строка");
  }
  return value;
}

export function isNumber(value: unknown, path = "value"): number {
  if (typeof value != "number" || Number.isNaN(value)) {
    throw new ValidationError(path, "ожидается число");
  }
  return value;
}


