import "reflect-metadata";
import { IsString, IsNumber, validate, ValidationError } from "../src";

describe("Декораторы валидации", () => {
  class TestDto {
    @IsString()
    name!: string;

    @IsNumber()
    age!: number;
  }
  it("должен пропускать конкретный объект", () => {
    const dto = new TestDto();
    dto.name = "Igor";
    dto.age = 42;
    expect(() => validate(dto)).not.toThrow();
  });
  it("бросает ValidationError при некорректном name", () => {
    const dto = new TestDto();
    //@ts-expect-error намеренно передаем число
    dto.name = 123;
    dto.age = 42;
    expect(() => validate(dto)).toThrow(ValidationError);
    expect(() => validate(dto)).toThrow(/name:/);
  });
  it("бросает ValidationError при некоректном age", () => {
    const dto = new TestDto();
    dto.name = "Igor";
    //@ts-expect-error намеренно передаем строку
    dto.age = "not a number";
    expect(() => validate(dto)).toThrow(ValidationError);
    expect(() => validate(dto)).toThrow(/age:/);
  });
  it("ловит первую ошибку и прекращает валидацию", ()=> {
    const dto = new TestDto()
    //@ts-expect-error намеренно передаем число
    dto.name = 42
    //@ts-expect-error намеренно передаем строку
    dto.age = "not a number"    

    try {
        validate(dto)
        throw new Error("Ожидалась ошибка валидации")
    } catch (error) {
        expect(error).toBeInstanceOf(ValidationError)
        expect((error as ValidationError).message).toMatch(/^name:/)
    }
  })
});
