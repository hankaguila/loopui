import { expect, it } from "vitest";
// import { Caster } from "../src";
import { Caster } from "../build";

it("toStringArray()", () => {
  expect(Caster.toStringArray("Hi")).to.eql(["Hi"]);
  expect(Caster.toStringArray("Ada,Bob,Chuck")).to.eql(["Ada", "Bob", "Chuck"]);
});

it("toNumberArray()", () => {
  expect(Caster.toNumberArray("Hi")).to.eql([NaN]);
  expect(Caster.toNumberArray("1")).to.eql([1]);
  expect(Caster.toNumberArray("1,2,3")).to.eql([1, 2, 3]);
});

it("toBooleanArray()", () => {
  expect(Caster.toBooleanArray("Hi")).to.eql([true]);
  expect(Caster.toBooleanArray("0,1,FALSE,TrUe")).to.eql([false, true, false, true]);
});
