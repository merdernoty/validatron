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
  maxValidator,
  minValidator,
  validateIfValidator,
  ValidatorFn,
} from "./validators";

const VALIDATORS_KEY = Symbol("validators");

interface ValidatorMeta {
  property: string;
  validator: ValidatorFn;
}

function addValidator(target: any, property: string, fn: ValidatorFn) {
  const existing: ValidatorMeta[] =
    Reflect.getMetadata(VALIDATORS_KEY, target) || [];
  existing.push({ property, validator: fn });
  Reflect.defineMetadata(VALIDATORS_KEY, existing, target);
}

export function createPropertyDecorator(validator: ValidatorFn) {
  return function (target: any, property: string) {
    addValidator(target, property, validator);
  };
}

// Decorators
export const IsString = () => createPropertyDecorator(isString);
export const IsNumber = () => createPropertyDecorator(isNumber);
export const IsBoolean = () => createPropertyDecorator(isBoolean);
export const IsArray = () => createPropertyDecorator(isArray);
export const IsObject = () => createPropertyDecorator(isObject);
export const IsDate = () => createPropertyDecorator(isDate);
export const IsEmail = () => createPropertyDecorator(isEmail);
export const IsUrl = () => createPropertyDecorator(isUrl);
export const IsUUID = () => createPropertyDecorator(isUUID);
export const IsPhoneNumber = () => createPropertyDecorator(isPhoneNumber);
export const Length = (min: number, max: number) =>
  createPropertyDecorator(lengthValidator(min, max));
export const Min = (min: number) => createPropertyDecorator(minValidator(min));
export const Max = (max: number) => createPropertyDecorator(maxValidator(max));
export const ValidateIf = (cond: (v: unknown) => boolean) =>
  createPropertyDecorator(validateIfValidator(cond));
export const IsIn = (values: unknown[]) =>
  createPropertyDecorator(isIn(values));
export const IsNotEmpty = () => createPropertyDecorator(isNotEmpty());
export const IsNotNull = () => createPropertyDecorator(isNotNull);
export const IsUpperCase = () => createPropertyDecorator(isUpperCase());
export const IsLowerCase = () => createPropertyDecorator(isLowerCase());
export const IsInt = () => createPropertyDecorator(isInt);
export const IsPositive = () => createPropertyDecorator(isPositive);
export const IsNegative = () => createPropertyDecorator(isNegative);
export const IsEnum = (enumObj: Record<string, unknown>) =>
  createPropertyDecorator(isEnum(enumObj));

export function validate(obj: any): void {
  const prototype = Object.getPrototypeOf(obj);
  const meta: ValidatorMeta[] =
    Reflect.getMetadata(VALIDATORS_KEY, prototype) || [];
  for (const { property, validator } of meta) {
    const value = obj[property];
    validator(value, property);
  }
}
