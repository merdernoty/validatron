import "reflect-metadata";
import {
  IsBoolean,
  IsArray,
  IsObject,
  IsDate,
  IsEmail,
  IsUrl,
  IsUUID,
  IsPhoneNumber,
  Length,
  Min,
  Max,
  ValidateIf,
  IsIn,
  IsNotEmpty,
  IsNotNull,
  IsUpperCase,
  IsLowerCase,
  validate,
  ValidationError,
  IsString,
  IsInt,
  IsPositive,
  IsNegative,
  IsEnum,
} from "../src";

describe("Дополнительные декораторы", () => {
  class ExtraDto {
    @IsBoolean()
    flag!: boolean;

    @IsArray()
    list!: unknown[];

    @IsObject()
    obj!: object;

    @IsDate()
    date!: Date;

    @IsEmail()
    email!: string;

    @IsUrl()
    url!: string;

    @IsUUID()
    uuid!: string;

    @IsPhoneNumber()
    phone!: string;

    @Length(2, 4)
    short!: string;

    @Min(10)
    minVal!: number;

    @Max(20)
    maxVal!: number;

    @IsIn(["a", "b", "c"])
    oneOf!: string;

    @IsNotEmpty()
    notEmpty!: string;

    @IsNotNull()
    notNull!: unknown;

    @IsUpperCase()
    upper!: string;

    @IsLowerCase()
    lower!: string;
  }

  let dto: ExtraDto;
  beforeEach(() => {
    dto = new ExtraDto();
  });

  it("пропускает все корректные значения", () => {
    Object.assign(dto, {
      flag: false,
      list: [1, 2],
      obj: { x: 1 },
      date: new Date(),
      email: "a@b.com",
      url: "https://example.com",
      uuid: "123e4567-e89b-12d3-a456-426614174000",
      phone: "+1234567890",
      short: "hey",
      minVal: 10,
      maxVal: 20,
      oneOf: "b",
      notEmpty: "x",
      notNull: 0,
      upper: "ABC",
      lower: "abc",
    });
    expect(() => validate(dto)).not.toThrow();
  });

  const badCases: [keyof ExtraDto, any][] = [
    ["flag", "true"],
    ["list", {}],
    ["obj", null],
    ["date", "2025-01-01"],
    ["email", "not@valid"],
    ["url", "notaurl"],
    ["uuid", "1234"],
    ["phone", "abc"],
    ["short", "toolong"],
    ["minVal", 5],
    ["maxVal", 25],
    ["oneOf", "d"],
    ["notEmpty", "   "],
    ["notNull", null],
    ["upper", "AbC"],
    ["lower", "aBc"],
  ];

  const defaultValid: Partial<ExtraDto> = {
    flag: true,
    list: [1],
    obj: {},
    date: new Date(),
    email: "a@b.com",
    url: "https://x.com",
    uuid: "123e4567-e89b-12d3-a456-426614174000",
    phone: "+1234567890",
    short: "ok",
    minVal: 10,
    maxVal: 20,
    oneOf: "a",
    notEmpty: "x",
    notNull: 0,
    upper: "OK",
    lower: "ok",
  };

  for (const [prop, badValue] of badCases) {
    it(`бросает ValidationError для некорректного ${String(prop)}`, () => {
      Object.assign(dto, defaultValid);
      // @ts-expect-error намеренно некорректный тип
      dto[prop] = badValue;
      expect(() => validate(dto)).toThrow(ValidationError);
      expect(() => validate(dto)).toThrow(new RegExp(`^${prop}:`));
    });
  }
});

describe("ValidateIf декоратор в изоляции", () => {
  class CondDto {
    @ValidateIf((v) => typeof v === "string" && v.startsWith("ok"))
    @IsString()
    conditional!: string;
  }

  let dto: CondDto;
  beforeEach(() => {
    dto = new CondDto();
  });

  it("бросает ValidationError, если условие не выполнено", () => {
    // @ts-expect-error
    dto.conditional = 123;
    expect(() => validate(dto)).toThrow(ValidationError);
    expect(() => validate(dto)).toThrow(/^conditional: ожидается строка/);
  });

  it("пропускает корректное строковое значение, удовлетворяющее условию", () => {
    dto.conditional = "okTest";
    expect(() => validate(dto)).not.toThrow();
  });

  it("бросает ValidationError, если строка не проходит основной валидатор", () => {
    dto.conditional = "nope";
    expect(() => validate(dto)).toThrow(ValidationError);
    expect(() => validate(dto)).toThrow(/^conditional: условие не выполнено/);
  });
});

describe('Числовые и enum-декораторы', () => {
  enum Role { ADMIN = 'admin', USER = 'user' }

  class NumEnumDto {
    @IsInt()      cnt!: number;
    @IsPositive() pos!: number;
    @IsNegative() neg!: number;
    @IsEnum(Role) role!: Role;
  }

  let dto: NumEnumDto;
  beforeEach(() => { dto = new NumEnumDto(); });

  it('пропускает корректные значения', () => {
    Object.assign(dto, { cnt: 0, pos: 5, neg: -3, role: Role.ADMIN });
    expect(() => validate(dto)).not.toThrow();
  });

  it('бросает для некорректного целого', () => {
    dto.cnt = 1.5 as any;
    expect(() => validate(dto)).toThrow(/^cnt: ожидается целое число/);
  });

  it('бросает для не положительного', () => {
    Object.assign(dto, { cnt: 1 });
    dto.pos = 0;
    expect(() => validate(dto)).toThrow(/^pos: ожидается положительное число/);
  });

  it('бросает для не отрицательного', () => {
    Object.assign(dto, { cnt: 1, pos: 1 });
    dto.neg = 1;
    expect(() => validate(dto)).toThrow(/^neg: ожидается отрицательное число/);
  });

  it('бросает для неверного enum', () => {
    Object.assign(dto, { cnt: 0, pos: 1, neg: -1 });
    (dto.role as any) = 'guest';
    expect(() => validate(dto)).toThrow(
      /^role: значение должно быть одним из: admin, user/
    );
  });
});
