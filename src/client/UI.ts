import { setTimeout } from "timers/promises";
import dedent from "dedent";
import { Fields, Input, Run, RunArgs } from "./types";
import { Caster, Prompter } from "../services";

export default class UI {
  public declare name: String;

  public declare shortDescription: String;

  public declare longDescription: String;

  public declare input: Record<string, Input>;

  public declare run: Run;

  private currentInput = "";

  public constructor(fields: Fields) {
    this.name = fields.name;
    this.shortDescription = fields.shortDescription;
    this.longDescription = fields.longDescription || "";
    this.input = fields.input;
    this.run = fields.run;
    this.validate();
  }

  public async start() {
    const action = await Prompter.select({
      name: "action",
      choices: ["Input", "Run", "Help", "Exit"],
      errorTimeoutMS: 0,
      before: () => this.showHead()
    });

    if (action === "Input") {
      await this.promptForInput();
      await this.start();
    } else if (action === "Run") {
      const args: RunArgs = {};
      Object.entries(this.input).forEach(([key, { value }]) => { args[key] = value; });
      if (Object.values(args).some((value) => value === undefined)) {
        await this.start();
      } else {
        this.run(args);
        console.log("\nFinished");
      }
    } else if (action === "Help") {
      await this.showHelp();
      await setTimeout(500);
      await this.start();
    } else if (action === "Exit") {
      console.log("\nExited");
    } else {
      await this.start();
    }
  }

  private validate() {
    if (!this.name.length) throw new Error("name required!");
    if (!this.shortDescription.length) throw new Error("shortDescription required!");
    if (!this.input) throw new Error("input required!");
    if (!this.run) throw new Error("run required!");
  }

  private showHead() {
    const inputLines = Object.entries(this.input)
      .map(([name, { value }]) => {
        const pre = this.currentInput === name ? "> " : "__";
        const post = value === undefined ? "<required>" : value;
        return `${pre}${name}: ${post}`;
      })
      .join("\n");

    const head = `${dedent`
      ${this.name} - ${this.shortDescription}

      INPUT
      ${dedent(inputLines)}
    `.replaceAll("__", "  ")}\n`;

    console.clear();
    console.log(head);
  }

  private async promptForInput() {
    for (const [name, { value, choices, cast, validate }] of Object.entries(this.input)) {
      this.currentInput = name;
      let newValue;
      const promptEnd = [
        Caster.toStringArray,
        Caster.toNumberArray,
        Caster.toBooleanArray
        // @ts-ignore
      ].includes(cast) ? ` separated by '${Caster.separator}'` : "";
      const prompt = `Enter ${name}${promptEnd}: `;
      if (choices === undefined) {
        newValue = await Prompter.ask({
          prompt,
          fallback: value,
          before: () => this.showHead(),
          cast,
          validate
        });
      } else {
        newValue = await Prompter.select({
          name,
          choices,
          fallback: value,
          before: () => this.showHead(),
        });
      }
      this.input[name].value = newValue;
    }
    this.currentInput = "";
  }

  private async showHelp() {
    const inputLines = Object.entries(this.input)
      .map(([name, { description }]) => `__${name}: ${description}`)
      .join("\n");

    const help = `${dedent`
      ${this.name} - ${this.shortDescription}
      ${this.longDescription ? `\n${this.longDescription}\n` : ""}
      INPUT
      ${dedent(inputLines)}
    `.replaceAll("__", "  ")}\n`;

    console.clear();
    console.log(help);

    await Prompter.continue("Press any key to return...");
  }
}
