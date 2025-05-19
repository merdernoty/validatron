import { isNumber, isString, ValidationError } from "../src/validators"

describe("validators", () => {
    it("isString возвращает строку", () => {
        expect(isString("hello")).toBe("hello");
    })
    it("isString возвращает ValidationError", () => {
        expect(() => isString(123, "name")).toThrow(ValidationError)
    })
    it("isNumber возвращает число",() => {
        expect(isNumber(42)).toBe(42)
    })
    it("isNumber возвращает ValidationError", () => {
        expect(() => isNumber('foo', 'age')).toThrow(/age:/)
    })
})