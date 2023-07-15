import { assert, it } from "vitest";
// import { Validator } from "../src";
import { Validator } from "../build";

it("isString()", () => {
  assert(!Validator.isString(1));
  assert(Validator.isString("Hi"));
});

it("isStringArray()", () => {
  assert(!Validator.isStringArray("Hi"));
  assert(!Validator.isStringArray([false, "one", 2]));
  assert(Validator.isStringArray(["Hi", "there!"]));
});

it("isNumber()", () => {
  assert(!Validator.isNumber("1"));
  assert(Validator.isNumber(1));
});

it("isNumberArray()", () => {
  assert(!Validator.isNumberArray(1));
  assert(!Validator.isNumberArray([false, "one", 2]));
  assert(Validator.isNumberArray([1, 2]));
});

it("isBoolean()", () => {
  assert(!Validator.isBoolean("1"));
  assert(!Validator.isBoolean("True"));
  assert(!Validator.isBoolean(1));
  assert(Validator.isBoolean(true));
});

it("isBooleanArray()", () => {
  assert(!Validator.isBooleanArray(true));
  assert(!Validator.isBooleanArray([false, "one", 2]));
  assert(Validator.isBooleanArray([true, false]));
});
