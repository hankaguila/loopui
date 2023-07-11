import { Readable } from "stream";
import readline from "readline";
import { setTimeout } from "timers/promises";
import dedent from "dedent";
import { Value, AskArgs, SelectArgs } from "../../type";

export default class Prompter {
  public static errorTimeoutMS = 1500;

  private static declare stdin: Readable; // for tests

  private constructor() {}

  public static continue(prompt?: string): Promise<void> {
    const rl = readline.createInterface({
      input: Prompter.stdin || process.stdin,
      output: process.stdout,
      terminal: true
    });

    return new Promise<void>((resolve) => {
      process.stdin.on("keypress", (_, key) => {
        if (key) {
          rl.close();
          resolve();
        }
      });
      rl.question(prompt ? prompt : "Press any key to continue...", () => {});
    });
  }

  public static ask(args: AskArgs): Promise<Value> {
    const { prompt, fallback, errorTimeoutMS, before, cast, validate } = args;

    const rl = readline.createInterface({
      input: Prompter.stdin || process.stdin,
      output: process.stdout
    });

    return new Promise<Value>((resolve) => {
      function askUntilValid() {
        if (before) before();

        rl.question(prompt, async (answer: string) => {
          rl.pause();
          const noAnswer = answer.trim() === "";
          const noFallback = fallback === undefined;

          if (noAnswer && noFallback) {
            await Prompter.retry("Input required!", askUntilValid, errorTimeoutMS);
          } else if (noAnswer && !noFallback) {
            rl.close();
            resolve(fallback);
          } else {
            const output = cast ? cast(answer) : answer;
            if (validate !== undefined && !validate(output)) {
              await Prompter.retry("Input not valid!", askUntilValid, errorTimeoutMS);
            } else {
              rl.close();
              resolve(output);
            }
          }
        });

        rl.resume();
      }

      askUntilValid();
    });
  }

  public static select(args: SelectArgs): Promise<Value> {
    const { name, choices, fallback, errorTimeoutMS, before } = args;

    const rl = readline.createInterface({
      input: Prompter.stdin || process.stdin,
      output: process.stdout
    });

    const prompt = `${dedent`
      Select ${name}:
      ${choices.map((value, index) => `__${index + 1}. ${value}`).join("\n")}

      Choice:`.replaceAll("__", "  ")
    } `;

    return new Promise<Value>((resolve) => {
      function selectUntilValid() {
        if (before) before();

        rl.question(prompt, async (answer: string) => {
          rl.pause();
          const noAnswer = answer.trim() === "";
          const noFallback = fallback === undefined;
          const choiceIndex = Number(answer);
          const noValidIndex = Number.isNaN(choiceIndex)
            || choiceIndex < 1
            || choiceIndex > choices.length;

          if (noAnswer && noFallback) {
            await Prompter.retry("Choice index required!", selectUntilValid, errorTimeoutMS);
          } else if (noAnswer && !noFallback) {
            rl.close();
            resolve(fallback);
          } else if (noValidIndex) {
            await Prompter.retry("Invalid choice index!", selectUntilValid, errorTimeoutMS);
          } else {
            rl.close();
            resolve(choices[choiceIndex - 1]);
          }
        });

        rl.resume();
      }

      selectUntilValid();
    });
  }

  private static async retry(message: any, func: Function, errorTimeoutMS?: number) {
    process.stdout.write(`\n${message}`);
    await setTimeout(errorTimeoutMS !== undefined ? errorTimeoutMS : Prompter.errorTimeoutMS);
    await func();
  }
}
