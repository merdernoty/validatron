import "reflect-metadata";
import { isNumber, isString, ValidatorFn } from "./validators";

const VALIDATORS_KEY = Symbol("validators");

interface ValidatorMeta {
  property: string;
  validator: ValidatorFn;
}

function addValidator(target: any, property: string, fn: ValidatorFn) {
  const existing: ValidatorMeta[] = Reflect.getMetadata(VALIDATORS_KEY, target) || [];
  existing.push({ property, validator: fn });
  Reflect.defineMetadata(VALIDATORS_KEY, existing, target);
}

export function createPropertyDecorator(validator: ValidatorFn) {
  return function (target: any, property: string) {
    addValidator(target, property, validator);
  };
}

export const IsString = () => createPropertyDecorator(isString)
export const IsNumber = () => createPropertyDecorator(isNumber)

export function validate(obj:any):void {
    const prototype = Object.getPrototypeOf(obj);
    const meta: ValidatorMeta[] = Reflect.getMetadata(VALIDATORS_KEY, prototype) || [];
    for(const { property , validator} of meta) {
        const value = obj[property]
        validator(value, property)
    }

}