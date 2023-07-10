import fs from "fs";
import { UI, Prompter, Caster, Validator } from "../../dist/index.mjs";

console.debug({UI, Prompter, Caster, Validator }, "\n");

const codePath = "check/UI.check.code";

const code = fs.readFileSync(codePath, "utf-8");

eval(code);
