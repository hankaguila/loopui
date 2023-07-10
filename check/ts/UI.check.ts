import { UI, Prompter, Caster, Validator } from "../src";

Prompter.errorTimeoutMS = 1500; // set to 0 to disable error messages for faster UX

const ui = new UI({
  name: "get-personal-info",
  shortDescription: "Print personal info",
  longDescription: "Optionally include more details...\n\nExample:\n...",
  input: {
    name: {
      description: "Your name (ex: Ada)",
      validate: (value) => /^[A-Za-z]+([ -'][A-Za-z]+)*$/.test(value) // validates birth names
    },
    age: {
      description: "Your age (ex: 25)",
      cast: Caster.toNumber,
      validate: (value) => Validator.isNumber(value) && value > 0 && value < 130
    },
    bloodType: {
      description: "Your blood type (ex: A+)",
      choices: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]
    },
    isVeteran: {
      description: "Are you a veteran? (ex: true)",
      value: false,
      choices: [false, true]
    },
    healthConditions: {
      description: "A list of your health conditions (ex: diabetes,gout)",
      value: [],
      cast: Caster.toStringArray,
      validate: Validator.isStringArray
    }
  },
  run: (args) => {
    console.log(`\n${JSON.stringify(args, null, 2)}`);
  }
});

await ui.start();
