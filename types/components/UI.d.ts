import { Validate, Value } from "../common";

export interface Fields {
  name: string;
  shortDescription: string;
  longDescription?: string;
  input: Record<string, Input>;
  run: Run;
}

export interface Input {
  description: string;
  value?: Value;
  choices?: Value[];
  cast?: Function;
  validate?: Validate;
}

export type Run = (args: RunArgs) => any;

export type RunArgs = Record<string, Value>
