export default class Validator {
  private constructor() {}

  public static isString(value: any) {
    return typeof value === "string";
  }

  public static isStringArray(value: any) {
    return value instanceof Array && value.every((item) => Validator.isString(item));
  }

  public static isNumber(value: any) {
    return typeof value === "number" && !Number.isNaN(value);
  }

  public static isNumberArray(value: any) {
    return value instanceof Array && value.every((item) => Validator.isNumber(item));
  }

  public static isBoolean(value: any) {
    return typeof value === "boolean";
  }

  public static isBooleanArray(value: any) {
    return value instanceof Array && value.every((item) => Validator.isBoolean(item));
  }
}
