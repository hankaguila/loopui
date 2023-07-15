const fs = require("fs");
const { UI, Prompter, Caster, Validator } = require("../../build/index.cjs");

console.debug({UI, Prompter, Caster, Validator }, "\n");

const codePath = "check/UI.check.code";

const code = fs.readFileSync(codePath, "utf-8");

eval(code);

