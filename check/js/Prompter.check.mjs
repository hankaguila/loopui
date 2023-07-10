import { setTimeout } from "timers/promises";
import { Prompter,  Caster, Validator } from "../../dist/index.mjs";

console.debug(setTimeout, Prompter, Caster, Validator, "\n");

const codePath = "check/Prompter.check.code";

const code = fs.readFileSync(codePath, "utf-8");

eval(code);
