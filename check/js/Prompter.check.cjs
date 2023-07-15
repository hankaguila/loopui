const fs = require("fs");
const { setTimeout } = require("timers/promises");
const { Prompter,  Caster, Validator } = require("../../build/index.cjs");

console.debug(setTimeout, Prompter, Caster, Validator, "\n");

const codePath = "check/Prompter.check.code";

const code = fs.readFileSync(codePath, "utf-8");

eval(code);
