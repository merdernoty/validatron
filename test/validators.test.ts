// test/validators.test.ts
import "reflect-metadata";
import {
  isArray,
  isBoolean,
  isDate,
  isEmail,
  isEnum,
  isIn,
  isInt,
  isLowerCase,
  isNegative,
  isNotEmpty,
  isNotNull,
  isNumber,
  isObject,
  isPhoneNumber,
  isPositive,
  isString,
  isUpperCase,
  isUrl,
  isUUID,
  lengthValidator,
  matchesRegex,
  maxItems,
  maxValidator,
  minItems,
  minValidator,
  validateIfValidator,
  ValidationError,
} from "../src/validators";

describe("Примитивные валидаторы", () => {
  it("isString: положительный сценарий", () => {
    expect(isString("hello", "fld")).toBe("hello");
  });
  it("isString: негативный сценарий", () => {
    expect(() => isString(123, "fld")).toThrow(ValidationError);
    expect(() => isString(123, "fld")).toThrow(/fld:/);
  });

  it("isNumber: положительный сценарий", () => {
    expect(isNumber(0, "n")).toBe(0);
  });
  it("isNumber: негативный сценарий", () => {
    expect(() => isNumber(NaN, "n")).toThrow(/n:/);
  });

  it("isInt: положительный сценарий", () => {
    expect(isInt(5, "n")).toBe(5);
  });
  it("isInt: дробное число", () => {
    expect(() => isInt(3.2, "n")).toThrow(ValidationError);
    expect(() => isInt(3.2, "n")).toThrow(/n: ожидается целое число/);
  });

  it("isPositive: положительное число", () => {
    expect(isPositive(1, "p")).toBe(1);
  });
  it("isPositive: ноль или отрицательное", () => {
    expect(() => isPositive(0, "p")).toThrow(
      /p: ожидается положительное число/
    );
  });

  it("isNegative: отрицательное число", () => {
    expect(isNegative(-1, "m")).toBe(-1);
  });
  it("isNegative: ноль или положительное", () => {
    expect(() => isNegative(0, "m")).toThrow(
      /m: ожидается отрицательное число/
    );
  });

  it("isBoolean: положительный сценарий", () => {
    expect(isBoolean(true, "b")).toBe(true);
  });
  it("isBoolean: негативный сценарий", () => {
    expect(() => isBoolean("true", "b")).toThrow(/b:/);
  });

  it("isArray: положительный сценарий", () => {
    const arr = [1, 2, 3];
    expect(isArray<number>(arr, "a")).toBe(arr);
  });
  it("isArray: негативный сценарий", () => {
    expect(() => isArray("nope", "a")).toThrow(/a:/);
  });

  it("isObject: положительный сценарий", () => {
    const obj = { x: 1 };
    expect(isObject<typeof obj>(obj, "o")).toBe(obj);
  });
  it("isObject: негативный сценарий", () => {
    expect(() => isObject(null, "o")).toThrow(/o:/);
  });

  it("isNotNull: положительный сценарий", () => {
    expect(isNotNull(0, "v")).toBe(0);
  });
  it("isNotNull: негативный сценарий", () => {
    expect(() => isNotNull(null, "v")).toThrow(/v:/);
  });
});

describe("Специальные строковые и форматные валидаторы", () => {
  it("isEmail: положительный", () => {
    expect(isEmail("a@b.com", "e")).toBe("a@b.com");
  });
  it("isEmail: негативный формат", () => {
    expect(() => isEmail("not email", "e")).toThrow(/e:/);
  });

  it("isDate: положительный", () => {
    const d = new Date();
    expect(isDate(d, "d")).toBe(d);
  });
  it("isDate: негативный", () => {
    expect(() => isDate("2025-01-01", "d")).toThrow(/d:/);
  });

  it("isUrl: положительный", () => {
    expect(isUrl("https://example.com", "u")).toBe("https://example.com");
  });
  it("isUrl: негативный", () => {
    expect(() => isUrl("notaurl", "u")).toThrow(/u:/);
  });

  it("isUUID: положительный", () => {
    const uuid = "123e4567-e89b-12d3-a456-426614174000";
    expect(isUUID(uuid, "id")).toBe(uuid);
  });
  it("isUUID: негативный", () => {
    expect(() => isUUID("1234", "id")).toThrow(/id:/);
  });

  it("isPhoneNumber: положительный", () => {
    expect(isPhoneNumber("+1234567890", "p")).toBe("+1234567890");
  });
  it("isPhoneNumber: негативный", () => {
    expect(() => isPhoneNumber("123-abc", "p")).toThrow(/p:/);
  });
});

describe("Параметризованные валидаторы", () => {
  it("lengthValidator: в диапазоне", () => {
    const fn = lengthValidator(2, 4);
    expect(fn("hey", "s")).toBe("hey");
  });
  it("lengthValidator: вне диапазона", () => {
    const fn = lengthValidator(2, 4);
    expect(() => fn("toolong", "s")).toThrow(/s:/);
  });

  it("minValidator: >= min", () => {
    const fn = minValidator(5);
    expect(fn(5, "n")).toBe(5);
  });
  it("minValidator: < min", () => {
    const fn = minValidator(5);
    expect(() => fn(4, "n")).toThrow(/n:/);
  });

  it("maxValidator: <= max", () => {
    const fn = maxValidator(10);
    expect(fn(10, "n")).toBe(10);
  });
  it("maxValidator: > max", () => {
    const fn = maxValidator(10);
    expect(() => fn(11, "n")).toThrow(/n:/);
  });

  it("validateIfValidator: условие выполнено", () => {
    const fn = validateIfValidator(
      (v) => typeof v === "string" && v.startsWith("ok")
    );
    expect(fn("ok!", "c")).toBe("ok!");
  });
  it("validateIfValidator: условие не выполнено", () => {
    const fn = validateIfValidator((v) => v === 42);
    expect(() => fn(7, "c")).toThrow(/c:/);
  });

  it("isIn: входит в массив", () => {
    const fn = isIn([1, 2, 3]);
    expect(fn(2, "i")).toBe(2);
  });
  it("isIn: не входит в массив", () => {
    const fn = isIn([1, 2, 3]);
    expect(() => fn(4, "i")).toThrow(/i:/);
  });

  it("isNotEmpty: непустая строка", () => {
    const fn = isNotEmpty();
    expect(fn(" hi ", "s")).toBe(" hi ");
  });
  it("isNotEmpty: пустая строка", () => {
    const fn = isNotEmpty();
    expect(() => fn("   ", "s")).toThrow(/s:/);
  });

  it("isUpperCase: все в верхнем регистре", () => {
    const fn = isUpperCase();
    expect(fn("ABC", "u")).toBe("ABC");
  });
  it("isUpperCase: не все в верхнем", () => {
    const fn = isUpperCase();
    expect(() => fn("AbC", "u")).toThrow(/u:/);
  });

  it("isLowerCase: все в нижнем регистре", () => {
    const fn = isLowerCase();
    expect(fn("abc", "l")).toBe("abc");
  });
  it("isLowerCase: не все в нижнем", () => {
    const fn = isLowerCase();
    expect(() => fn("aBc", "l")).toThrow(/l:/);
  });

  it("matchesRegex: совпадающие", () => {
    const hex = matchesRegex(/^[0-9A-F]+$/i, "не hex");
    expect(hex("a1B2", "h")).toBe("a1B2");
  });
  it("matchesRegex: несовпадение", () => {
    const hex = matchesRegex(/^[0-9A-F]+$/i, "не hex");
    expect(() => hex("xyz", "h")).toThrow(/h: не hex/);
  });

  it("isEnum: корректное значение", () => {
    const Colors = { RED: "RED", GREEN: "GREEN", BLUE: "BLUE" } as const;
    const fn = isEnum(Colors);
    expect(fn("GREEN", "c")).toBe("GREEN");
  });
  it("isEnum: некорректное значение", () => {
    const Colors = { RED: "RED", GREEN: "GREEN", BLUE: "BLUE" } as const;
    const fn = isEnum(Colors);
    expect(() => fn("YELLOW", "c")).toThrow(ValidationError);
    expect(() => fn("YELLOW", "c")).toThrow(
      /c: значение должно быть одним из: RED, GREEN, BLUE/
    );
  });

  it("minItems: достаточно", () => {
    const min2 = minItems(2);
    expect(min2([1, 2], "a")).toEqual([1, 2]);
  });
  it("minItems: не достаточно", () => {
    const min2 = minItems(2);
    expect(() => min2([1], "a")).toThrow(/a: ожидается минимум 2 элементов/);
  });

  it("maxItems: достаточно", () => {
    const max3 = maxItems(3);
    expect(max3([1, 2, 3], "b")).toEqual([1, 2, 3]);
  });
  it("maxItems: не достаточно", () => {
    const max3 = maxItems(3);
    expect(() => max3([1, 2, 3, 4], "b")).toThrow(
      /b: ожидается не более 3 элементов/
    );
  });
});
