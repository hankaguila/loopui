import { beforeAll, describe, expect, it } from "vitest";
import { Readable } from "stream";
// import { Prompter, Caster } from "../src";
import { Prompter, Caster } from "../build";

beforeAll(() => {
  Prompter["stdin"] = new Readable({ read() { } });
});

describe("ask()", () => {
  it("returns entered string by default", async () => {
    Prompter["stdin"].push("0\n");
    const result = await Prompter.ask({
      prompt: "Enter 0: ",
      before: console.clear
    });
    expect(result).toBe("0");
  });

  it("casts to string[]", async () => {
    Prompter["stdin"].push("one,two\n");
    const result = await Prompter.ask({
      prompt: "Enter one,two: ",
      before: console.clear,
      cast: Caster.toStringArray
    });
    expect(result).to.eql(["one", "two"]);
  });

  it("casts to number[]", async () => {
    Prompter["stdin"].push("1,2\n");
    const result = await Prompter.ask({
      prompt: "Enter 1,2: ",
      before: console.clear,
      cast: Caster.toNumberArray
    });
    expect(result).to.eql([1, 2]);
  });

  it("casts to boolean[]", async () => {
    Prompter["stdin"].push("0,1,false,true\n");
    const result = await Prompter.ask({
      prompt: "Enter 0,1,false,true: ",
      before: console.clear,
      cast: Caster.toBooleanArray
    });
    expect(result).to.eql([false, true, false, true]);
  });

  it("validates as expected", async () => {
    Prompter["stdin"].push("1.2,3.4\n");
    const result = await Prompter.ask({
      prompt: "1.2,3.4",
      before: console.clear,
      cast: Caster.toNumberArray,
      validate: (arr: number[]) => arr.reduce((prev, curr) => prev + curr) === 4.6
    });
    expect(result).to.eql([1.2, 3.4]);
  });
});

describe("select()", () => {
  it("returns fallback when no input is given", async () => {
    Prompter["stdin"].push("\n");
    const result = await Prompter.select({
      name: "color",
      fallback: "black",
      choices: ["red", "green", "blue"],
      before: console.clear
    });
    expect(result).toBe("black");
  });

  it("returns value of given index", async () => {
    Prompter["stdin"].push("3\n");
    const result = await Prompter.select({
      name: "color",
      fallback: "black",
      choices: ["red", "green", "blue"],
      before: console.clear
    });
    expect(result).toBe("blue");
  });
});
