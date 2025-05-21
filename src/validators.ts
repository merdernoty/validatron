/**
 * Класс ошибки валидации, содержит путь до поля и сообщение об ошибке.
 */
export class ValidationError extends Error {
  constructor(
    public path: string,
    message: string
  ) {
    super(`${path}: ${message}`);
    this.name = "ValidationError";
  }
}
/**
 * Тип функции-валидатора: принимает значение и путь, выбрасывает ошибку при невалидности.
 */
export type ValidatorFn = (value: unknown, path: string) => void;

/**
 * Проверяет, что значение является строкой.
 * @throws ValidationError если значение не строка.
 */
export function isString(value: unknown, path = "value"): string {
  if (typeof value !== "string") {
    throw new ValidationError(path, "ожидается строка");
  }
  return value;
}

/**
 * Проверяет, что значение является числом (и не NaN).
 * @throws ValidationError если значение не число.
 */
export function isNumber(value: unknown, path = "value"): number {
  if (typeof value != "number" || Number.isNaN(value)) {
    throw new ValidationError(path, "ожидается число");
  }
  return value;
}

/**
 * Проверяет, что значение является булевым.
 * @throws ValidationError если значение не boolean.
 */
export function isBoolean(value: unknown, path = "value"): boolean {
  if (typeof value !== "boolean") {
    throw new ValidationError(path, "ожидается булево значение");
  }
  return value;
}

/**
 * Проверяет, что значение является массивом.
 * @throws ValidationError если значение не массив.
 */
export function isArray<T>(value: unknown, path = "value"): T[] {
  if (!Array.isArray(value)) {
    throw new ValidationError(path, "ожидается массив");
  }
  return value;
}

/**
 * Проверяет, что значение является объектом (и не null).
 * @throws ValidationError если значение не объект или null.
 */
export function isObject<T>(value: unknown, path = "value"): T {
  if (typeof value !== "object" || value === null) {
    throw new ValidationError(path, "ожидается объект");
  }
  return value as T;
}

/**
 * Проверяет, что значение не равно null.
 * @throws ValidationError если значение равно null.
 */
export function isNotNull<T>(value: unknown, path = "value"): T {
  if (value === null) {
    throw new ValidationError(path, "ожидается не null");
  }
  return value as T;
}

/**
 * Проверяет, что значение является строкой в формате email.
 * @throws ValidationError если значение не строка или не email.
 */
export function isEmail(value: unknown, path = "value"): string {
  if (typeof value !== "string") {
    throw new ValidationError(path, "ожидается строка");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    throw new ValidationError(path, "неверный формат email");
  }
  return value;
}

/**
 * Проверяет, что значение является объектом Date и дата валидна.
 * @throws ValidationError если значение не дата.
 */
export function isDate(value: unknown, path = "value"): Date {
  if (!(value instanceof Date) || isNaN(value.getTime())) {
    throw new ValidationError(path, "ожидается дата");
  }
  return value;
}

/**
 * Проверяет, что значение является строкой в формате URL.
 * @throws ValidationError если значение не строка или не URL.
 */
export function isUrl(value: unknown, path = "value"): string {
  if (typeof value !== "string") {
    throw new ValidationError(path, "ожидается строка");
  }
  try {
    new URL(value);
  } catch {
    throw new ValidationError(path, "неверный формат URL");
  }
  return value;
}

/**
 * Проверяет, что значение является строкой в формате UUID.
 * @throws ValidationError если значение не строка или не UUID.
 */
export function isUUID(value: unknown, path = "value"): string {
  if (typeof value !== "string") {
    throw new ValidationError(path, "ожидается строка");
  }
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(value)) {
    throw new ValidationError(path, "неверный формат UUID");
  }
  return value;
}

/**
 * Проверяет, что значение является строкой в формате международного номера телефона.
 * @throws ValidationError если значение не строка или не номер телефона.
 */
export function isPhoneNumber(value: unknown, path = "value"): string {
  if (typeof value !== "string") {
    throw new ValidationError(path, "ожидается строка");
  }
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phoneRegex.test(value)) {
    throw new ValidationError(path, "неверный формат номера телефона");
  }
  return value;
}

/**
 * Возвращает валидатор, который проверяет, что строка имеет длину от min до max.
 * @throws ValidationError если длина строки вне диапазона.
 */
export function lengthValidator(min: number, max: number) {
  return function (value: unknown, path = "value"): string {
    if (typeof value !== "string") {
      throw new ValidationError(path, "ожидается строка");
    }
    if (value.length < min || value.length > max) {
      throw new ValidationError(path, `длина должна быть от ${min} до ${max}`);
    }
    return value;
  };
}

/**
 * Возвращает валидатор, который проверяет, что число не меньше min.
 * @throws ValidationError если число меньше min.
 */
export function minValidator(min: number) {
  return function (value: unknown, path = "value"): number {
    if (typeof value !== "number" || Number.isNaN(value)) {
      throw new ValidationError(path, "ожидается число");
    }
    if (value < min) {
      throw new ValidationError(path, `значение должно быть больше ${min}`);
    }
    return value;
  };
}

/**
 * Возвращает валидатор, который проверяет, что число не больше max.
 * @throws ValidationError если число больше max.
 */
export function maxValidator(max: number) {
  return function (value: unknown, path = "value"): number {
    if (typeof value !== "number" || Number.isNaN(value)) {
      throw new ValidationError(path, "ожидается число");
    }
    if (value > max) {
      throw new ValidationError(path, `значение должно быть меньше ${max}`);
    }
    return value;
  };
}

/**
 * Возвращает валидатор, который проверяет, что значение удовлетворяет условию.
 * @throws ValidationError если условие не выполнено.
 */
export function validateIfValidator(condition: (value: unknown) => boolean) {
  return function (value: unknown, path = "value"): unknown {
    if (!condition(value)) {
      throw new ValidationError(path, "условие не выполнено");
    }
    return value;
  };
}

/**
 * Возвращает валидатор, который проверяет, что значение входит в заданный массив.
 * @throws ValidationError если значение не входит в массив.
 */
export function isIn(values: unknown[]) {
  return function (value: unknown, path = "value"): unknown {
    if (!values.includes(value)) {
      throw new ValidationError(
        path,
        `значение должно быть одним из: ${values.join(", ")}`
      );
    }
    return value;
  };
}

/**
 * Возвращает валидатор, который проверяет, что строка не пустая (после trim).
 * @throws ValidationError если строка пустая.
 */
export function isNotEmpty() {
  return function (value: unknown, path = "value"): string {
    if (typeof value !== "string") {
      throw new ValidationError(path, "ожидается строка");
    }
    if (value.trim() === "") {
      throw new ValidationError(path, "значение не должно быть пустым");
    }
    return value;
  };
}

/**
 * Возвращает валидатор, который проверяет, что строка полностью в верхнем регистре.
 * @throws ValidationError если строка не в верхнем регистре.
 */
export function isUpperCase() {
  return function (value: unknown, path = "value"): string {
    if (typeof value !== "string") {
      throw new ValidationError(path, "ожидается строка");
    }
    if (value !== value.toUpperCase()) {
      throw new ValidationError(path, "строка должна быть в верхнем регистре");
    }
    return value;
  };
}

/**
 * Возвращает валидатор, который проверяет, что строка полностью в нижнем регистре.
 * @throws ValidationError если строка не в нижнем регистре.
 */
export function isLowerCase() {
  return function (value: unknown, path = "value"): string {
    if (typeof value !== "string") {
      throw new ValidationError(path, "ожидается строка");
    }
    if (value !== value.toLowerCase()) {
      throw new ValidationError(path, "строка должна быть в нижнем регистре");
    }
    return value;
  };
}

/**
 * Проверяет, что значение — целое число.
 * @throws ValidationError если число не целое.
 */
export function isInt(value: unknown, path = "value"): number {
  if (
    typeof value !== "number" ||
    Number.isNaN(value) ||
    !Number.isInteger(value)
  ) {
    throw new ValidationError(path, "ожидается целое число");
  }
  return value;
}

/**
 * Проверяет, что число > 0.
 * @throws ValidationError если число не положительное.
 */
export function isPositive(value: unknown, path = "value"): number {
  const num = isNumber(value, path);
  if (num <= 0) {
    throw new ValidationError(path, "ожидается положительное число");
  }
  return num;
}

/**
 * Проверяет, что число < 0.
 * @throws ValidationError если число не отрицательное.
 */
export function isNegative(value: unknown, path = "value"): number {
  const num = isNumber(value, path);
  if (num >= 0) {
    throw new ValidationError(path, "ожидается отрицательное число");
  }
  return num;
}

/**
 * Проверяет, что значение входит в переданный enum-объект.
 * @throws ValidationError если значение не входит в переданный enum-объект.
 */
export function isEnum(enumObj: Record<string, unknown>) {
  const values = Object.values(enumObj);
  return function (value: unknown, path = "value"): unknown {
    if (!values.includes(value)) {
      throw new ValidationError(
        path,
        `значение должно быть одним из: ${values.join(", ")}`
      );
    }
    return value;
  };
}
