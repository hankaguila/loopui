export default class Caster {
  public static separator = ",";

  private constructor() {}

  public static toStringArray(string: string) {
    return string.split(Caster.separator);
  }

  public static toNumber(string: string) {
    return Number(string);
  }

  public static toNumberArray(string: string) {
    return Caster.toStringArray(string).map((item) => Caster.toNumber(item));
  }

  public static toBoolean(string: string) {
    return !["false", "0"].includes(string.toLowerCase());
  }

  public static toBooleanArray(string: string) {
    return Caster.toStringArray(string).map((item) => Caster.toBoolean(item));
  }
}
